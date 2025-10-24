"use client";

interface BlogFiltersProperties {
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export default function BlogFilters({
  categories,
  onCategorySelect,
  selectedCategory,
}: BlogFiltersProperties) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`btn ${selectedCategory === category ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </button>
      ))}
      <button
        className={`btn ${selectedCategory === "All" ? "btn-primary" : "btn-ghost"}`}
        onClick={() => onCategorySelect("All")}
      >
        All
      </button>
    </div>
  );
}
