# Component Structure

## UI Components (`/components/ui`)

Reusable UI components that can be used throughout the application:

- `ActionButton` - Consistent action buttons with icons
- `Alert` - Notification banners for different message types
- `ButtonGroup` - Consistent button layouts
- `Card` - Generic card container with header and actions
- `EmptyState` - Consistent empty state displays
- `InsightCard` - Cards for displaying key metrics
- `LoadingSpinner` - Consistent loading indicators
- `StatCard` - Cards for displaying statistics with icons

## Layout Components (`/components/layouts`)

Higher-order components for page structure:

- `DashboardLayout` - Grid layout for dashboard pages with sidebar
- `PageContainer` - Consistent page container with title and actions

## Common Components (`/components/common`)

Domain-specific reusable components:

- `GoalCard` - Displays goal information with progress
- `ProgressBar` - Reusable progress bar component
- `RecommendationCard` - Displays recommendation information
- `SearchFilterBar` - Search and filter controls with export button
- `Section` - Section headers with actions

## Dashboard Components (`/components/dashboard`)

Components specific to the dashboard area:

- `DashboardNav` - Navigation for logged-in users

## Other Components

- `Header` - Application header with navigation
- `Footer` - Application footer
- `ActivityFeed` - Component for displaying user activities
- `ThemeToggle` - Dark/light theme toggle
- `ThemeProvider` - Theme context provider

## Utilities (`/utils`)

Helper functions:

- `timeUtils` - Time formatting functions

## Index Files

- `components/index.ts` - Barrel export file for easier imports
