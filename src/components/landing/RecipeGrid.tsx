// src/components/landing/RecipeGrid.tsx
import { Star, Clock, Flame, Users, ChefHat } from 'lucide-react';
import Card from '../common/Card';
import Loader from '../common/Loader';
import type { Recipe } from '../../types';

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  isError: boolean;
}

const RecipeGrid = ({ recipes, isLoading, isError }: RecipeGridProps) => {
  if (isLoading) {
    return (
      <div className="py-12">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <ChefHat className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load recipes</h3>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="py-12 text-center">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
          <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600">Try adjusting your search filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative h-48 overflow-hidden rounded-xl mb-4">
            <img
              src={recipe.image || `https://source.unsplash.com/random/400x300?food=${recipe.id}`}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium">
                {recipe.cuisine}
              </span>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-medium">
                {recipe.difficulty}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {recipe.name}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {recipe.ingredients.slice(0, 3).join(', ')}...
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-gray-700">
                <Star className="w-4 h-4 text-amber-500 mr-2" />
                <span className="font-medium">{recipe.rating}</span>
                <span className="text-gray-500 text-sm ml-1">({recipe.reviewCount})</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Flame className="w-4 h-4 text-red-500 mr-2" />
                <span>{recipe.caloriesPerServing} cal</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users className="w-4 h-4 text-green-500 mr-2" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {recipe.mealType.join(', ')}
              </span>
              <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors">
                View Recipe
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecipeGrid;