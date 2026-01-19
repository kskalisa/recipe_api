import { ArrowUpDown } from 'lucide-react';

interface SortFilterProps {
  sortBy: string;
  order: 'asc' | 'desc';
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
}

const SortFilter = ({ sortBy, order, onSortChange }: SortFilterProps) => {
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'prepTimeMinutes', label: 'Prep Time' },
    { value: 'cookTimeMinutes', label: 'Cook Time' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'servings', label: 'Servings' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-5 h-5 text-orange-500" />
        <span className="text-gray-700 font-semibold">Sort by:</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value, order)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortBy === option.value
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500 hover:text-orange-500'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => onSortChange(sortBy, 'asc')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            order === 'asc'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          Ascending
        </button>
        <button
          onClick={() => onSortChange(sortBy, 'desc')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            order === 'desc'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          Descending
        </button>
      </div>
    </div>
  );
};

export default SortFilter;
