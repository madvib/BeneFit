'use client';

import { LoadingSpinner, PageContainer, ErrorPage } from '@/components';
import { useHistoryController } from '@/controllers/history';
import { WorkoutList, SearchFilterBar } from '@/components/user/dashboard/history';
import { Calendar } from 'lucide-react';

export default function HistoryPage() {
  const {
    filteredWorkouts,
    loading,
    error,
    searchTerm,
    timeFilter,
    filterOptions,
    setSearchTerm,
    setTimeFilter,
    onExport,
    handleEdit,
    handleDelete,
  } = useHistoryController();

  if (loading) {
    return <LoadingSpinner variant="screen" text="Loading workout history..." />;
  }

  // --- Error State ---
  if (error) {
    return (
      <ErrorPage
        title="History Loading Error"
        message="Unable to load your workout history."
        error={error}
        backHref="/"
      />
    );
  }

  return (
    <PageContainer>
      <div className="bg-background border-muted flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
        {/* Header with SearchBar */}
        <div className="border-muted bg-accent/20 flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">History Log</h3>
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterOptions={filterOptions}
            selectedFilter={timeFilter}
            onFilterChange={setTimeFilter}
            onExport={onExport}
            placeholder="Search workouts..."
            showExportButton={true}
          />
        </div>

        <WorkoutList
          workouts={filteredWorkouts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No workouts found matching your criteria"
        />
      </div>
    </PageContainer>
  );
}
