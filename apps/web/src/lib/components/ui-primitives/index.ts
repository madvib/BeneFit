// UI Primitives - Barrel File
// Basic UI building blocks

// Buttons
export { Button, type ButtonProps } from './buttons/button';


// Cards
export { Card } from './card/card';
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
export { FormSuccessMessage } from './form/form-success-message';

// Alerts & Feedback
export { default as Alert } from './alert/alert';
export { Badge } from './badges/badge';
export { LoadingSpinner } from './loading/loading-spinner';
export { Skeleton } from './loading/skeleton';
export { default as ProgressBar } from './progress-bar/progress-bar';

// Layout & Structure
export { default as Spacer } from './spacer/spacer';
export { default as PageContainer } from './layout/page-container';

export { default as Footer } from './footer/footer';

// Icons & Visual Elements
export { default as Aurora } from './backgrounds/aurora';
export { ShinyText } from './text/shiny-text';
export { default as CountUp } from './text/count-up';
export { default as LogoLoop } from './icons/logo-loop';
export { IconBox } from './icons/icon-box';
export * from './icons/service-logos';

// Interactive Elements
export { Switch } from './switch/switch';
export { Modal } from './modal/modal';

// Navigation & Headers
export * from './header';

// Multi-step Flows
export * from './stepper/stepper';

// Typography
export * from './typography/page-header';
export * from './typography/section-header';
