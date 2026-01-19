// src/components/dashboard/RecipeForm.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { useCreateRecipeMutation, useUpdateRecipeMutation } from '../../features/recipes/recipeApi';
import type { Recipe } from '../../types';
import toast from 'react-hot-toast';

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const RecipeForm = ({ recipe, onSuccess, onCancel, isOpen }: RecipeFormProps) => {
  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    cuisine: recipe?.cuisine || '',
    difficulty: recipe?.difficulty || 'Easy',
    prepTimeMinutes: recipe?.prepTimeMinutes || 30,
    cookTimeMinutes: recipe?.cookTimeMinutes || 30,
    servings: recipe?.servings || 4,
    caloriesPerServing: recipe?.caloriesPerServing || 300,
    rating: recipe?.rating || 4.5,
    reviewCount: recipe?.reviewCount || 100,
    ingredients: recipe?.ingredients || [''],
    instructions: recipe?.instructions || [''],
    tags: recipe?.tags?.join(', ') || '',
    mealType: recipe?.mealType?.join(', ') || '',
    image: recipe?.image || '',
  });

  const [ingredient, setIngredient] = useState('');
  const [instruction, setInstruction] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation rules for each field
  const fieldValidations: Record<string, (value: any) => string | undefined> = {
    name: (value) => {
      if (!value.trim()) return 'Recipe name is required';
      if (value.length < 3) return 'Recipe name must be at least 3 characters';
      if (value.length > 100) return 'Recipe name must be less than 100 characters';
      return undefined;
    },
    cuisine: (value) => {
      if (!value.trim()) return 'Cuisine is required';
      if (value.length < 2) return 'Cuisine must be at least 2 characters';
      return undefined;
    },
    prepTimeMinutes: (value) => {
      const num = parseInt(value, 10);
      if (!value || isNaN(num)) return 'Prep time is required';
      if (num < 1) return 'Prep time must be at least 1 minute';
      if (num > 1440) return 'Prep time cannot exceed 24 hours';
      return undefined;
    },
    cookTimeMinutes: (value) => {
      const num = parseInt(value, 10);
      if (!value || isNaN(num)) return 'Cook time is required';
      if (num < 1) return 'Cook time must be at least 1 minute';
      if (num > 1440) return 'Cook time cannot exceed 24 hours';
      return undefined;
    },
    servings: (value) => {
      const num = parseInt(value, 10);
      if (!value || isNaN(num)) return 'Servings is required';
      if (num < 1) return 'Servings must be at least 1';
      if (num > 100) return 'Servings cannot exceed 100';
      return undefined;
    },
    caloriesPerServing: (value) => {
      const num = parseInt(value, 10);
      if (!value || isNaN(num)) return 'Calories is required';
      if (num < 1) return 'Calories must be at least 1';
      if (num > 10000) return 'Calories cannot exceed 10000';
      return undefined;
    },
  };

  // Validate all fields and return errors
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(fieldValidations).forEach(([field, validate]) => {
      const error = validate(formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form data when recipe prop changes
  useEffect(() => {
    if (recipe && isOpen) {
      setFormData({
        name: recipe.name || '',
        cuisine: recipe.cuisine || '',
        difficulty: recipe.difficulty || 'Easy',
        prepTimeMinutes: recipe.prepTimeMinutes || 30,
        cookTimeMinutes: recipe.cookTimeMinutes || 30,
        servings: recipe.servings || 4,
        caloriesPerServing: recipe.caloriesPerServing || 300,
        rating: recipe.rating || 4.5,
        reviewCount: recipe.reviewCount || 100,
        ingredients: recipe.ingredients || [''],
        instructions: recipe.instructions || [''],
        tags: recipe.tags?.join(', ') || '',
        mealType: recipe.mealType?.join(', ') || '',
        image: recipe.image || '',
      });
      setIngredient('');
      setInstruction('');
    } else if (!recipe && isOpen) {
      // Reset form for new recipe
      setFormData({
        name: '',
        cuisine: '',
        difficulty: 'Easy',
        prepTimeMinutes: 30,
        cookTimeMinutes: 30,
        servings: 4,
        caloriesPerServing: 300,
        rating: 4.5,
        reviewCount: 100,
        ingredients: [''],
        instructions: [''],
        tags: '',
        mealType: '',
        image: '',
      });
      setIngredient('');
      setInstruction('');
    }
  }, [recipe, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }
    
    try {
      const recipeData = {
        ...formData,
        tags: formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        mealType: formData.mealType.split(',').map((type: string) => type.trim()).filter(Boolean),
        ingredients: formData.ingredients.filter(Boolean),
        instructions: formData.instructions.filter(Boolean),
      };

      if (recipe) {
        console.log('=== FORM SUBMIT: UPDATE ===');
        console.log('Recipe ID:', recipe.id);
        console.log('Recipe ID type:', typeof recipe.id);
        console.log('Form data:', recipeData);
        
        await updateRecipe({ id: String(recipe.id), data: recipeData }).unwrap();
        console.log('Update successful');
        toast.success('Recipe updated successfully!');
      } else {
        console.log('=== FORM SUBMIT: CREATE ===');
        console.log('Form data:', recipeData);
        
        await createRecipe(recipeData).unwrap();
        console.log('Create successful');
        toast.success('Recipe created successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Full error object:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast.error(recipe ? 'Failed to update recipe' : 'Failed to create recipe');
    }
  };

  const addIngredient = () => {
    if (ingredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient.trim()]
      }));
      setIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_: string, i: number) => i !== index)
    }));
  };

  const addInstruction = () => {
    if (instruction.trim()) {
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, instruction.trim()]
      }));
      setInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_: string, i: number) => i !== index)
    }));
  };

  const isLoading = isCreating || isUpdating;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Recipe Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          error={errors.name}
          validate={(value) => {
            if (!value.trim()) return 'Recipe name is required';
            if (value.length < 3) return 'Recipe name must be at least 3 characters';
            if (value.length > 100) return 'Recipe name must be less than 100 characters';
            return undefined;
          }}
          placeholder="Enter recipe name"
        />

        <Input
          label="Cuisine"
          value={formData.cuisine}
          onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
          error={errors.cuisine}
          validate={(value) => {
            if (!value.trim()) return 'Cuisine is required';
            if (value.length < 2) return 'Cuisine must be at least 2 characters';
            return undefined;
          }}
          placeholder="e.g., Italian, Mexican"
        />

        <Select
          label="Difficulty"
          value={formData.difficulty}
          onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' }))}
          options={[
            { value: 'Easy', label: 'Easy' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Hard', label: 'Hard' },
          ]}
        />

        <Input
          label="Image URL"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />

        <Input
          label="Prep Time (minutes)"
          type="number"
          value={formData.prepTimeMinutes}
          onChange={(e) => setFormData(prev => ({ ...prev, prepTimeMinutes: parseInt(e.target.value, 10) }))}
          error={errors.prepTimeMinutes}
          min="1"
          validate={(value) => {
            const num = parseInt(value as any, 10);
            if (!value || isNaN(num)) return 'Prep time is required';
            if (num < 1) return 'Prep time must be at least 1 minute';
            if (num > 1440) return 'Prep time cannot exceed 24 hours';
            return undefined;
          }}
        />

        <Input
          label="Cook Time (minutes)"
          type="number"
          value={formData.cookTimeMinutes}
          onChange={(e) => setFormData(prev => ({ ...prev, cookTimeMinutes: parseInt(e.target.value, 10) }))}
          error={errors.cookTimeMinutes}
          min="1"
          validate={(value) => {
            const num = parseInt(value as any, 10);
            if (!value || isNaN(num)) return 'Cook time is required';
            if (num < 1) return 'Cook time must be at least 1 minute';
            if (num > 1440) return 'Cook time cannot exceed 24 hours';
            return undefined;
          }}
        />

        <Input
          label="Servings"
          type="number"
          value={formData.servings}
          onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value, 10) }))}
          error={errors.servings}
          min="1"
          validate={(value) => {
            const num = parseInt(value as any, 10);
            if (!value || isNaN(num)) return 'Servings is required';
            if (num < 1) return 'Servings must be at least 1';
            if (num > 100) return 'Servings cannot exceed 100';
            return undefined;
          }}
        />

        <Input
          label="Calories per Serving"
          type="number"
          value={formData.caloriesPerServing}
          onChange={(e) => setFormData(prev => ({ ...prev, caloriesPerServing: parseInt(e.target.value, 10) }))}
          error={errors.caloriesPerServing}
          min="1"
          validate={(value) => {
            const num = parseInt(value as any, 10);
            if (!value || isNaN(num)) return 'Calories is required';
            if (num < 1) return 'Calories must be at least 1';
            if (num > 10000) return 'Calories cannot exceed 10000';
            return undefined;
          }}
        />

        <Input
          label="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="healthy, vegetarian, quick"
        />

        <Input
          label="Meal Type (comma separated)"
          value={formData.mealType}
          onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value }))}
          placeholder="breakfast, lunch, dinner"
        />
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Ingredients</label>
        <div className="space-y-2">
          {formData.ingredients.map((ing: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <Input
                value={ing}
                onChange={(e) => {
                  const newIngredients = [...formData.ingredients];
                  newIngredients[index] = e.target.value;
                  setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                }}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Add new ingredient"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addIngredient}
            variant="outline"
            className="whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <div className="space-y-2">
          {formData.instructions.map((inst: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm mt-2">
                {index + 1}
              </span>
              <textarea
                value={inst}
                onChange={(e) => {
                  const newInstructions = [...formData.instructions];
                  newInstructions[index] = e.target.value;
                  setFormData(prev => ({ ...prev, instructions: newInstructions }));
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={2}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Add new instruction step"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={2}
          />
          <Button
            type="button"
            onClick={addInstruction}
            variant="outline"
            className="whitespace-nowrap self-start"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Step
          </Button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
        >
          {isLoading ? 'Saving...' : recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
