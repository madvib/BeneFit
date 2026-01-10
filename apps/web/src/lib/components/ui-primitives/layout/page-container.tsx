import { cva, type VariantProps } from 'class-variance-authority';

const pageContainerVariants = cva('w-full font-sans', {
  variants: {
    variant: {
      default: 'px-2 pt-16 md:px-6',
      noPadding: '',
      fullViewport: 'p-0 sm:px-6 flex flex-col',
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

export default function PageContainer({
  children,
  className = '',
  variant,
}: PageContainerProperties) {
  return (
    <div
      className={`${pageContainerVariants({ variant })} ${className}`}
      style={
        variant === 'fullViewport'
          ? {
              minHeight: 'calc(100vh - var(--header-height))',
              paddingTop: 'var(--header-height)',
            }
          : {}
      }
    >
      {children}
    </div>
  );
}
