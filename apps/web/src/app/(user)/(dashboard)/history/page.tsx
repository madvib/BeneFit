'use client';

import { PageContainer } from '@/components';
import { useHistoryController } from '@/controllers/history';
import { WorkoutList, SearchFilterBar } from '@/components/user/dashboard/history';

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
    return (
      <PageContainer title="Workout History" hideTitle={true}>
        <div className="w-full">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold">Recent Workouts</h2>
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Workout History" hideTitle={true}>
        <div className="w-full">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold">Recent Workouts</h2>
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
          <div className="bg-background p-8 rounded-xl border border-muted text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Workout History" hideTitle={true}>
      <div className="w-full">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">Recent Workouts</h2>
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
