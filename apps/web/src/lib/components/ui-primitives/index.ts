// UI Primitives - Barrel File
// Basic UI building blocks

// Buttons
export { default as Button, type ButtonProps } from './buttons/button';


// Cards
export { default as Card } from './card/card';
export { default as ImageCard } from './card/image-card';
export { default as DataCard } from './card/data-card';
export { default as SpotlightCard } from './card/spotlight-card';
export { default as ElectricBorder } from './card/electric-border';

// Forms
export { default as Input } from './form/input';
export { default as Label } from './form/label';
export { default as Select } from './form/select';
export { default as Checkbox } from './form/checkbox';
export { default as FormSection } from './form/form-section';
export { default as FormSuccessMessage } from './form/form-success-message';

// Alerts & Feedback
export { default as Alert } from './alert/alert';
export { default as Badge } from './badges/badge';
export { default as LoadingSpinner } from './loading/loading-spinner';
export { default as Skeleton } from './loading/skeleton';
export { default as ProgressBar } from './progress-bar/progress-bar';

// Layout & Structure
export { default as Spacer } from './spacer/spacer';
export { default as PageContainer } from './layout/page-container';
export { default as DashboardShell } from './layout/dashboard-shell';

export { default as Footer } from './footer/footer';

// Icons & Visual Elements
export { default as Aurora } from './backgrounds/aurora';
export { default as ShinyText } from './text/shiny-text';
export { default as CountUp } from './text/count-up';
export { default as LogoLoop } from './icons/logo-loop';
export { default as IconBox } from './icons/icon-box';
export * from './icons/service-logos';

// Interactive Elements
export { default as Switch } from './switch/switch';
export { default as Modal } from './modal/modal';

// Navigation & Headers
export * from './header';

// Multi-step Flows
export { default as Stepper, type StepperStep } from './stepper/stepper';

// Typography
export { default as PageHeader } from './typography/page-header';
export { default as SectionHeader } from './typography/section-header';
export { default as Typography, type TypographyProps } from './typography/typography';
