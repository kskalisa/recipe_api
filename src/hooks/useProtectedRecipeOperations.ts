// src/hooks/useProtectedRecipeOperations.ts
import toast from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';
import {
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} from '../features/recipes/recipeApi';
import type { Recipe } from '../types';

export const useProtectedRecipeOperations = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector(state => state.auth.user);

  const [createRecipe] = useCreateRecipeMutation();
  const [updateRecipe] = useUpdateRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();

  const handleCreateRecipe = async (recipeData: Partial<Recipe>) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to create a recipe');
      return null;
    }

    try {
      const result = await createRecipe(recipeData).unwrap();
      toast.success('Recipe created successfully!');
      return result;
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
      return null;
    }
  };

  const handleUpdateRecipe = async (id: string, recipeData: Partial<Recipe>) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to update a recipe');
      return null;
    }

    try {
      const result = await updateRecipe({ id, data: recipeData }).unwrap();
      toast.success('Recipe updated successfully!');
      return result;
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
      return null;
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to delete a recipe');
      return false;
    }

    try {
      await deleteRecipe(id).unwrap();
      toast.success('Recipe deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
      return false;
    }
  };

  return {
    isAuthenticated,
    user,
    handleCreateRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
  };
};
