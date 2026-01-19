import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeForm from './RecipeForm';
import RecipeModal from './RecipeModal';
import ConfirmDialog from '../common/ConfirmDialog';
import Button from '../common/Button';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../features/recipes/recipeApi';
import type { Recipe } from '../../types';
import toast from 'react-hot-toast';

const RecipesManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | undefined>(undefined);

  const { data, isLoading, refetch } = useGetRecipesQuery({
    page,
    limit,
    search,
    sortBy,
    order,
  });

  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;
    
    try {
      await deleteRecipe(recipeToDelete.id).unwrap();
      toast.success('Recipe deleted successfully!');
      setDeleteDialogOpen(false);
      setRecipeToDelete(undefined);
      refetch();
    } catch {
      toast.error('Failed to delete recipe');
    }
  };

  const handleView = (recipe: Recipe) => {
    setViewingRecipe(recipe);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  const handleSuccess = () => {
    handleCloseForm();
    setPage(1);
    refetch();
  };

  const recipes = data?.recipes || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Recipes</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your delicious recipes</p>
        </div>
        <Button
          onClick={() => {
            setEditingRecipe(undefined);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Recipe
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 outline-none text-gray-700"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="prepTimeMinutes">Prep Time</option>
              <option value="cookTimeMinutes">Cook Time</option>
              <option value="caloriesPerServing">Calories</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as 'asc' | 'desc');
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-90">Total Recipes</p>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>
        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-90">Page</p>
          <p className="text-3xl font-bold mt-2">
            {page} of {totalPages}
          </p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-90">Showing</p>
          <p className="text-3xl font-bold mt-2">{recipes.length}</p>
        </div>
      </div>

      {/* Recipes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No recipes found. Create your first recipe!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Recipe Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cuisine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Prep Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{recipe.name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{recipe.cuisine}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        ⭐ {recipe.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{recipe.prepTimeMinutes} min</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(recipe)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(recipe)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(recipe)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center">
          <div className="inline-flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
            {/* Previous Button */}
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 border-l border-r border-gray-200 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-md font-medium text-sm transition-all duration-200 ${
                      page === num
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:disabled:bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Page Info */}
          <div className="ml-4 text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {isFormOpen && (
        <RecipeForm
          recipe={editingRecipe}
          onCancel={handleCloseForm}
          onSuccess={handleSuccess}
          isOpen={isFormOpen}
        />
      )}

      {viewingRecipe && (
        <RecipeModal recipe={viewingRecipe} onClose={() => setViewingRecipe(undefined)} isOpen={true} />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Recipe"
        message={`Are you sure you want to permanently delete "${recipeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setRecipeToDelete(undefined);
        }}
      />
    </div>
  );
};

export default RecipesManager;
