"use client";

interface BlogFiltersProperties {
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
  includeAllButton?: boolean;
}

export default function BlogFilters({
  categories,
  onCategorySelect,
  selectedCategory,
  includeAllButton = false,
}: BlogFiltersProperties) {
  // Add "All" to categories if the flag is true
  const displayCategories = includeAllButton ? ['All', ...categories] : categories;

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {displayCategories.map((category, index) => (
        <button
          key={index}
          className={`btn ${selectedCategory === category ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
