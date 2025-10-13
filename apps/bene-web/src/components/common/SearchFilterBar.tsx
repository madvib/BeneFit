'use client';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterOptions: { value: string; label: string }[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onExport?: () => void;
  placeholder?: string;
  showExportButton?: boolean;
}

export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  filterOptions,
  selectedFilter,
  onFilterChange,
  onExport,
  placeholder = "Search...",
  showExportButton = true
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto">
      <div className="relative flex-grow md:flex-grow-0">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full md:w-64 px-4 py-2 rounded-lg border border-muted bg-background"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            onClick={() => onSearchChange('')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <select 
        className="bg-background border border-muted rounded-lg p-2"
        value={selectedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        {filterOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {showExportButton && onExport && (
        <button 
          className="btn btn-primary flex items-center"
          onClick={onExport}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export
        </button>
      )}
    </div>
  );
}