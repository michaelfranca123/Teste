import React from 'react';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  "Todos",
  "Tradicionais",
  "Frutas",
  "Premium",
  "Personalizado"
];

const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 sm:space-x-8 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`text-[#011206] whitespace-nowrap px-3 py-2 rounded-full transition-colors text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-[#110121] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;