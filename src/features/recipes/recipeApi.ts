// src/features/recipes/recipesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Recipe, RecipesResponse, QueryParams } from '../../types';

// Helper to manage local recipes storage
const LOCAL_RECIPES_KEY = 'recipes_local_storage';

const getLocalRecipes = (): Recipe[] => {
  try {
    const stored = localStorage.getItem(LOCAL_RECIPES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalRecipes = (recipes: Recipe[]): void => {
  localStorage.setItem(LOCAL_RECIPES_KEY, JSON.stringify(recipes));
};

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://dummyjson.com/recipes',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as unknown as { auth: { token: string } }).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Recipe'],
  endpoints: (builder) => ({
    getRecipes: builder.query<RecipesResponse, QueryParams>({
      queryFn: async ({ page = 1, limit = 12, search = '', sortBy = 'name', order = 'asc' }) => {
        try {
          // Get deleted recipe IDs
          const deletedRecipesKey = 'deleted_recipe_ids';
          const deletedIds = JSON.parse(localStorage.getItem(deletedRecipesKey) || '[]');
          
          // Fetch from DummyJSON without pagination parameters first to get all recipes
          // Then we'll handle pagination, search, and sorting locally
          let url = `?limit=1000`; // Fetch all available recipes
          if (search) url += `&q=${search}`;
          
          const response = await fetch(`https://dummyjson.com/recipes${url}`);
          if (!response.ok) throw new Error('Failed to fetch recipes');
          
          const data = await response.json();
          
          // Merge with local recipes and filter out deleted ones
          const localRecipes = getLocalRecipes();
          // Prefix DummyJSON recipe IDs with 'api_' to avoid collisions with local recipes
          const dummyJsonRecipes = (data.recipes || [])
            .filter((r: Recipe) => !deletedIds.includes(String(r.id)))
            .map((r: Recipe) => ({ ...r, id: `api_${r.id}` }));
          let allRecipes = [...localRecipes, ...dummyJsonRecipes];
          
          // Filter by search (if it wasn't done by DummyJSON)
          if (search) {
            allRecipes = allRecipes.filter(r => 
              r.name.toLowerCase().includes(search.toLowerCase()) ||
              r.cuisine.toLowerCase().includes(search.toLowerCase())
            );
          }
          
          // Sort the filtered results
          allRecipes.sort((a: any, b: any) => {
            let aVal = a[sortBy as keyof Recipe];
            let bVal = b[sortBy as keyof Recipe];
            
            // Handle different data types
            if (typeof aVal === 'string') {
              aVal = (aVal as string).toLowerCase();
              bVal = (bVal as string).toLowerCase();
              return order === 'asc' 
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            } else if (typeof aVal === 'number') {
              return order === 'asc' 
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
            }
            return 0;
          });
          
          // Apply pagination on sorted results
          const start = (page - 1) * limit;
          const paginatedRecipes = allRecipes.slice(start, start + limit);
          
          console.log('Recipes fetched:', {
            total: allRecipes.length,
            page,
            limit,
            returned: paginatedRecipes.length,
            search,
            sortBy,
            order
          });
          
          return {
            data: {
              recipes: paginatedRecipes,
              total: allRecipes.length,
              skip: start,
              limit
            }
          };
        } catch (error) {
          console.error('Error fetching recipes:', error);
          // Fallback to local recipes only
          const deletedRecipesKey = 'deleted_recipe_ids';
          const deletedIds = JSON.parse(localStorage.getItem(deletedRecipesKey) || '[]');
          let localRecipes = getLocalRecipes().filter(r => !deletedIds.includes(String(r.id)));
          
          // Apply search filter
          if (search) {
            localRecipes = localRecipes.filter(r =>
              r.name.toLowerCase().includes(search.toLowerCase()) ||
              r.cuisine.toLowerCase().includes(search.toLowerCase())
            );
          }
          
          // Apply sorting
          localRecipes.sort((a: any, b: any) => {
            let aVal = a[sortBy as keyof Recipe];
            let bVal = b[sortBy as keyof Recipe];
            
            if (typeof aVal === 'string') {
              aVal = (aVal as string).toLowerCase();
              bVal = (bVal as string).toLowerCase();
              return order === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
            } else if (typeof aVal === 'number') {
              return order === 'asc'
                ? (aVal as number) - (bVal as number)
                : (bVal as number) - (aVal as number);
            }
            return 0;
          });
          
          const start = (page - 1) * limit;
          return {
            data: {
              recipes: localRecipes.slice(start, start + limit),
              total: localRecipes.length,
              skip: start,
              limit
            }
          };
        }
      },
      providesTags: ['Recipe'],
    }),
    
    getRecipeById: builder.query<Recipe, string>({
      queryFn: async (id: string) => {
        try {
          // Check if it's a DummyJSON recipe (prefixed with 'api_')
          if (id.startsWith('api_')) {
            const actualId = id.replace('api_', '');
            const response = await fetch(`https://dummyjson.com/recipes/${actualId}`);
            if (!response.ok) throw new Error('Not found');
            const data = await response.json();
            // Keep the api_ prefix for consistency
            return { data: { ...data, id: `api_${data.id}` } };
          }
          
          // Check local storage
          const localRecipes = getLocalRecipes();
          const localRecipe = localRecipes.find(r => String(r.id) === id);
          if (localRecipe) {
            return { data: localRecipe };
          }
          
          return { error: { status: 404, data: 'Recipe not found' } };
        } catch (error) {
          return { error: { status: 404, data: 'Recipe not found' } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Recipe', id }],
    }),
    
    createRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      queryFn: async (newRecipe: Partial<Recipe>) => {
        try {
          const localRecipes = getLocalRecipes();
          const newId = Math.max(...localRecipes.map(r => typeof r.id === 'string' ? parseInt(r.id) : r.id), 0) + 1;
          
          const recipeToCreate: Recipe = {
            id: newId.toString(),
            name: newRecipe.name || 'Untitled Recipe',
            cuisine: newRecipe.cuisine || 'Unknown',
            difficulty: newRecipe.difficulty || 'Medium',
            prepTimeMinutes: newRecipe.prepTimeMinutes || 30,
            cookTimeMinutes: newRecipe.cookTimeMinutes || 30,
            servings: newRecipe.servings || 4,
            caloriesPerServing: newRecipe.caloriesPerServing || 300,
            rating: newRecipe.rating || 4.5,
            reviewCount: newRecipe.reviewCount || 0,
            ingredients: newRecipe.ingredients || [],
            instructions: newRecipe.instructions || [],
            tags: newRecipe.tags || [],
            mealType: newRecipe.mealType || [],
            image: newRecipe.image || 'https://via.placeholder.com/400x300?text=Recipe',
          } as Recipe;
          
          localRecipes.unshift(recipeToCreate);
          saveLocalRecipes(localRecipes);
          
          return { data: recipeToCreate };
        } catch (error) {
          return { error: { status: 400, data: 'Failed to create recipe' } };
        }
      },
      async onQueryStarted(_newRecipe, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update cache
          dispatch(
            recipesApi.util.updateQueryData('getRecipes', { limit: 50, search: '', page: 1, sortBy: 'name', order: 'asc' }, (draft: any) => {
              draft.recipes.unshift(data);
              draft.total = (draft.total || 0) + 1;
            })
          );
        } catch (error) {
          console.error('Failed to create recipe:', error);
        }
      },
      invalidatesTags: ['Recipe'],
    }),
    
    updateRecipe: builder.mutation<Recipe, { id: string; data: Partial<Recipe> }>({
      queryFn: async ({ id, data }: { id: string; data: Partial<Recipe> }) => {
        try {
          console.log('=== UPDATE RECIPE START ===');
          console.log('ID:', id);
          console.log('Data:', data);
          
          let localRecipes = getLocalRecipes();
          console.log('Local recipes count:', localRecipes.length);
          console.log('Looking for recipe with id:', String(id));
          console.log('Available local IDs:', localRecipes.map(r => String(r.id)));
          
          // Handle api_ prefixed IDs (DummyJSON recipes)
          let searchId = id;
          if (id.startsWith('api_')) {
            searchId = id; // Keep the api_ prefix for local storage
          }
          
          let index = localRecipes.findIndex(r => String(r.id) === String(searchId));
          console.log('Found at index:', index);
          
          // If not found in local storage, create it as a new local recipe first
          if (index === -1) {
            console.log('Recipe not found in local storage, creating as new local recipe');
            // Create a new entry based on the data being submitted
            const newRecipe: Recipe = {
              id: String(searchId),
              name: data.name || 'Untitled Recipe',
              cuisine: data.cuisine || 'Unknown',
              difficulty: data.difficulty || 'Medium',
              prepTimeMinutes: data.prepTimeMinutes || 30,
              cookTimeMinutes: data.cookTimeMinutes || 30,
              servings: data.servings || 4,
              caloriesPerServing: data.caloriesPerServing || 300,
              rating: data.rating || 4.5,
              reviewCount: data.reviewCount || 0,
              ingredients: data.ingredients || [],
              instructions: data.instructions || [],
              tags: data.tags || [],
              mealType: data.mealType || [],
              image: data.image || 'https://via.placeholder.com/400x300?text=Recipe',
              userId: data.userId || 1,
            };
            localRecipes.unshift(newRecipe);
            index = 0;
            console.log('New recipe created locally');
          }
          
          const oldRecipe = localRecipes[index];
          console.log('Old recipe:', oldRecipe);
          
          // Preserve existing fields and merge with new data
          const updatedRecipe: Recipe = {
            ...oldRecipe,
            ...data,
            id: String(searchId),
            userId: data.userId || oldRecipe.userId || 1,
          };
          
          console.log('Updated recipe:', updatedRecipe);
          
          localRecipes[index] = updatedRecipe;
          saveLocalRecipes(localRecipes);
          console.log('Saved to localStorage');
          console.log('=== UPDATE RECIPE END ===');
          
          return { data: updatedRecipe };
        } catch (error) {
          console.error('=== UPDATE RECIPE ERROR ===');
          console.error('Error caught:', error);
          console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
          return { error: { status: 400, data: String(error instanceof Error ? error.message : 'Failed to update recipe') } };
        }
      },
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        console.log('onQueryStarted - Updating cache for recipe:', id);
        const patchResult = dispatch(
          recipesApi.util.updateQueryData('getRecipes', { limit: 50, search: '', page: 1, sortBy: 'name', order: 'asc' }, (draft: any) => {
            const recipeIndex = draft.recipes.findIndex((r: any) => String(r.id) === String(id));
            console.log('Cache recipe index:', recipeIndex);
            if (recipeIndex !== -1) {
              draft.recipes[recipeIndex] = { ...draft.recipes[recipeIndex], ...data };
              console.log('Cache updated for recipe:', recipeIndex);
            }
          })
        );
        try {
          const result = await queryFulfilled;
          console.log('Query fulfilled successfully:', result);
        } catch (error) {
          console.error('Query fulfilled error:', error);
          patchResult.undo();
          console.error('Failed to update recipe - cache undone');
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Recipe', id }],
    }),
    
    deleteRecipe: builder.mutation<void, string>({
      queryFn: async (id: string) => {
        try {
          console.log('=== DELETE RECIPE START ===');
          console.log('ID to delete:', id);
          
          let localRecipes = getLocalRecipes();
          console.log('Local recipes count before delete:', localRecipes.length);
          console.log('Available local IDs:', localRecipes.map(r => String(r.id)));
          
          // Handle api_ prefixed IDs (DummyJSON recipes)
          let searchId = id;
          if (id.startsWith('api_')) {
            // For DummyJSON recipes, extract the numeric ID for the deleted list
            const numericId = id.replace('api_', '');
            console.log('DummyJSON recipe detected, numeric ID:', numericId);
            
            const deletedRecipesKey = 'deleted_recipe_ids';
            const deletedIds = JSON.parse(localStorage.getItem(deletedRecipesKey) || '[]');
            if (!deletedIds.includes(numericId)) {
              deletedIds.push(numericId);
              localStorage.setItem(deletedRecipesKey, JSON.stringify(deletedIds));
              console.log('Added to deleted recipes list');
            }
            
            // Also try to remove from local storage if a local copy exists
            const index = localRecipes.findIndex(r => String(r.id) === String(searchId));
            if (index !== -1) {
              localRecipes = localRecipes.filter((_: any, i: number) => i !== index);
              saveLocalRecipes(localRecipes);
              console.log('Removed local copy of DummyJSON recipe');
            }
          } else {
            // Local recipe - delete directly
            const index = localRecipes.findIndex(r => String(r.id) === String(searchId));
            console.log('Found at index:', index);
            
            if (index !== -1) {
              const filtered = localRecipes.filter((_: any, i: number) => i !== index);
              saveLocalRecipes(filtered);
              console.log('Recipe deleted from localStorage');
            } else {
              console.log('Recipe not found in localStorage');
            }
          }
          
          console.log('=== DELETE RECIPE END ===');
          return { data: undefined };
        } catch (error) {
          console.error('=== DELETE RECIPE ERROR ===');
          console.error('Error:', error);
          return { error: { status: 400, data: 'Failed to delete recipe' } };
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        console.log('onQueryStarted - Removing from cache for recipe:', id);
        const patchResult = dispatch(
          recipesApi.util.updateQueryData('getRecipes', { limit: 50, search: '', page: 1, sortBy: 'name', order: 'asc' }, (draft: any) => {
            const beforeCount = draft.recipes.length;
            draft.recipes = draft.recipes.filter((r: any) => String(r.id) !== String(id));
            draft.total = (draft.total || 0) - 1;
            console.log('Cache updated: removed from', beforeCount, 'to', draft.recipes.length);
          })
        );
        try {
          await queryFulfilled;
          console.log('Delete query fulfilled successfully');
        } catch (error) {
          console.error('Delete query fulfilled error:', error);
          patchResult.undo();
          console.error('Failed to delete recipe - cache undone');
        }
      },
      invalidatesTags: ['Recipe'],
    }),
  }),
});

export const { 
  useGetRecipesQuery, 
  useGetRecipeByIdQuery, 
  useCreateRecipeMutation, 
  useUpdateRecipeMutation, 
  useDeleteRecipeMutation 
} = recipesApi;