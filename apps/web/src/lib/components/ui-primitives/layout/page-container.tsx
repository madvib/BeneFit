import { cva, type VariantProps } from 'class-variance-authority';

const pageContainerVariants = cva('w-full font-sans', {
  variants: {
    variant: {
      default: 'px-2 pt-[var(--header-height)] md:px-6',
      noPadding: 'bg-background text-foreground pt-[var(--header-height)]',
      fullViewport:
        'p-0 pt-[var(--header-height)] sm:px-6 flex flex-col min-h-[calc(100vh-var(--header-height))]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface PageContainerProperties extends VariantProps<typeof pageContainerVariants> {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '', variant }: PageContainerProperties) {
  return <div className={`${pageContainerVariants({ variant })} ${className}`}>{children}</div>;
}
