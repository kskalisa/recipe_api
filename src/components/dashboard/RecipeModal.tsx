import { X, Clock, Flame, Users, ChefHat, ShoppingCart } from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToOrder?: () => void;
  isOpen?: boolean;
}

const RecipeModal = ({ recipe, onClose, onAddToOrder, isOpen }: RecipeModalProps) => {
  if (!isOpen && isOpen !== undefined) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{recipe.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Prep Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.prepTimeMinutes}m</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Flame className="w-5 h-5" />
                <span className="text-sm font-medium">Cook Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.cookTimeMinutes}m</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-medium">Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.rating}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Servings</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.servings}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{recipe.ingredients.length > 0 ? `A delicious ${recipe.cuisine} recipe with ${recipe.ingredients.length} ingredients` : 'A delicious recipe'}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cuisine:</span>
                  <span className="font-medium text-gray-900">{recipe.cuisine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-gray-900">
                    {recipe.difficulty || 'Medium'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-medium text-gray-900">
                    {recipe.caloriesPerServing} kcal
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="font-medium text-gray-900">
                    {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipe ID:</span>
                  <span className="font-medium text-gray-900 text-xs">{recipe.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-blue-600" />
              Ingredients ({recipe.ingredients.length})
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {recipe.ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No ingredients listed</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions ({recipe.instructions.length})</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {recipe.instructions.length > 0 ? (
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span className="shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-500">No instructions provided</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags && recipe.tags.length > 0 ? (
                recipe.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No tags</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-linear-to-r from-orange-50 to-pink-50 border-t border-gray-200 p-6 flex gap-3">
          {onAddToOrder && (
            <button
              onClick={onAddToOrder}
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Order
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
