// src/components/dashboard/ModernDashboard.tsx
import { useState, useMemo } from 'react';
import { Search, Plus, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../features/recipes/recipeApi';
import toast from 'react-hot-toast';
import RecipeCard from './RecipeCard';
import RecipeForm from './RecipeForm';
import ConfirmDialog from '../common/ConfirmDialog';
import type { Recipe } from '../../types';

const ModernDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [deleteRecipe] = useDeleteRecipeMutation();

  const { data: recipesData, isLoading, refetch } = useGetRecipesQuery({ 
    limit: 50,
    search: searchTerm 
  });

  const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  // Filter recipes by meal type and search
  const filteredRecipes = useMemo(() => {
    if (!recipesData?.recipes) return [];
    
    return recipesData.recipes.filter((recipe: any) => {
      const matchesMealType = selectedMealType === 'All' || 
        recipe.mealType?.includes(selectedMealType);
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMealType && matchesSearch;
    });
  }, [recipesData, selectedMealType, searchTerm]);

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
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
      refetch();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    } finally {
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedRecipe(null);
    refetch();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-pink-50">
      {/* Left Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-screen w-24 bg-linear-to-b from-orange-500 to-orange-400 rounded-r-3xl shadow-lg flex flex-col items-center py-8 space-y-8 z-40">
        
        <nav className="flex flex-col space-y-6 flex-1">
          <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition">
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="p-3 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition"
            title="Create Recipe"
          >
            <Plus className="w-6 h-6" />
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="p-3 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-24">
        {/* Center Content */}
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Welcome, {user?.firstName || 'User'}!</h1>
              <p className="text-gray-600 mt-2">Manage your recipes here</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Recipe
            </button>
          </div>

          {/* Search and Categories */}
          <div className="mb-8">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-orange-500 outline-none transition"
              />
              <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
            </div>

            {/* Categories */}
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {mealTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition ${
                    selectedMealType === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Title Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {selectedMealType === 'All' ? 'All Recipes' : `${selectedMealType} Recipes`}
          </h2>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          )}

          {/* Recipe Grid */}
          {!isLoading && filteredRecipes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe: any) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    onEdit={() => handleEditRecipe(recipe)}
                    onDelete={() => handleDeleteClick(recipe)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recipes found. Try adjusting your search or create a new recipe.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Form Modal */}
      <RecipeForm
        recipe={selectedRecipe}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setIsFormOpen(false);
          setSelectedRecipe(null);
        }}
        isOpen={isFormOpen}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setRecipeToDelete(null);
        }}
        isLoading={false}
      />
    </div>
  );
};

export default ModernDashboard;
