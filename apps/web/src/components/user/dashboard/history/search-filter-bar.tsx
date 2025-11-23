import { Search, X, ChevronDown, Download } from 'lucide-react';
import { Button, Select } from '@/components';

interface SearchFilterBarProperties {
  searchTerm: string;
  onSearchChange: (_value: string) => void;
  filterOptions: { value: string; label: string }[];
  selectedFilter: string;
  onFilterChange: (_value: string) => void;
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
  placeholder = 'Search...',
  showExportButton = true,
}: SearchFilterBarProperties) {
  return (
    <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
      {/* Search Input */}
      <div className="relative grow sm:grow-0">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder={placeholder}
          className="border-muted bg-background focus:ring-primary/20 w-full rounded-lg border py-2 pr-8 pl-9 text-sm transition-all focus:ring-2 focus:outline-none sm:w-64"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchTerm && (
          <button
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="relative">
        <Select
          value={selectedFilter}
          onChange={(event) => onFilterChange(event.target.value)}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2" />
      </div>

      {/* Export Button */}
      {showExportButton && onExport && (
        <Button onClick={onExport} className="ml-auto sm:ml-0">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      )}
    </div>
  );
}
