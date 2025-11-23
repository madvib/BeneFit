export * from './common';
// Layout Components
export { default as DashboardLayout } from './user/dashboard/dashboard-layout';
export { default as PageContainer } from './common/ui-primitives/page-container';

// Header Components
export { default as Header } from './common/header/unified-header';

// Account Components
export { default as AccountDropdown } from './common/header/navigation/account-dropdown/account-dropdown';
export { default as InsightCard } from './user/shared/insight-card/insight-card';
export { default as StatCard } from './user/shared/stat-card/stat-card';

// Navigation Components

// Common Components
export { default as TopTabNavigation } from './user/dashboard/top-tab-navigation';

// Theme Components
export { ThemeProvider } from './theme/theme-provider';

// Other Main Components
export { default as Footer } from './common/ui-primitives/footer/footer';
export { default as ActivityFeed } from './user/dashboard/feed/activity-feed';
