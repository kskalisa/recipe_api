// src/components/dashboard/RecipeCard.tsx
import { Edit2, Trash2 } from 'lucide-react';
import type { Recipe } from '../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeCard = ({ recipe, onEdit, onDelete }: RecipeCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
        
        {/* Action Buttons - Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-3 bg-white rounded-full hover:bg-orange-500 hover:text-white transition shadow-lg"
            title="Edit recipe"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transition shadow-lg"
            title="Delete recipe"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-2">
          {recipe.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {recipe.cuisine} • {recipe.difficulty}
        </p>

        {/* Rating and Time */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{recipe.rating}</span>
            <span className="text-gray-500">({recipe.reviewCount})</span>
          </div>
          <span className="text-gray-600">{recipe.cookTimeMinutes}m</span>
        </div>

        {/* Meal Types */}
        <div className="flex flex-wrap gap-1">
          {recipe.mealType?.slice(0, 2).map((type: string) => (
            <span key={type} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {type}
            </span>
          ))}
          {(recipe.mealType?.length || 0) > 2 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              +{(recipe.mealType?.length || 0) - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
