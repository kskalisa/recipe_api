// src/components/dashboard/RecipeTable.tsx
import { useState } from 'react';
import { Edit2, Trash2, Eye, ChevronUp, ChevronDown, ChefHat } from 'lucide-react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useDeleteRecipeMutation } from '../../features/recipes/recipeApi';
import type { Recipe } from '../../types';
import toast from 'react-hot-toast';

interface RecipeTableProps {
  recipes: Recipe[];
  isLoading: boolean;
  onEdit: (recipe: Recipe) => void;
  onView: (recipe: Recipe) => void;
  onRefetch: () => void;
}

const RecipeTable = ({ recipes, isLoading, onEdit, onView, onRefetch }: RecipeTableProps) => {
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe(id).unwrap();
      toast.success('Recipe deleted successfully!');
      onRefetch();
      setDeleteConfirm(null);
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    const aValue = a[sortField as keyof Recipe];
    const bValue = b[sortField as keyof Recipe];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue > bValue ? 1 : -1)
      : (aValue < bValue ? 1 : -1);
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="p-8 text-center">
        <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
        <p className="text-gray-600">Create your first recipe to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {[
              { field: 'name', label: 'Name' },
              { field: 'cuisine', label: 'Cuisine' },
              { field: 'difficulty', label: 'Difficulty' },
              { field: 'rating', label: 'Rating' },
              { field: 'prepTimeMinutes', label: 'Prep Time' },
              { field: 'cookTimeMinutes', label: 'Cook Time' },
              { field: 'caloriesPerServing', label: 'Calories' },
              { field: 'actions', label: 'Actions' },
            ].map(({ field, label }) => (
              <th
                key={field}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => field !== 'actions' && handleSort(field)}
              >
                <div className="flex items-center">
                  {label}
                  {field !== 'actions' && sortField === field && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedRecipes.map((recipe) => (
            <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 shrink-0">
                    <img
                      src={recipe.image || `https://source.unsplash.com/random/40x40?food=${recipe.id}`}
                      alt={recipe.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{recipe.name}</div>
                    <div className="text-sm text-gray-500">
                      {recipe.mealType.join(', ')}
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {recipe.cuisine}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  recipe.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800'
                    : recipe.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {recipe.difficulty}
                </span>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900 font-medium mr-2">{recipe.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(recipe.rating) ? 'text-amber-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({recipe.reviewCount})</span>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {recipe.prepTimeMinutes} min
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {recipe.cookTimeMinutes} min
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {recipe.caloriesPerServing} cal
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(recipe)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(recipe)}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  
                  {deleteConfirm === recipe.id ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(null)}
                        className="text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(recipe.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Confirm
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirm(recipe.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeTable;
