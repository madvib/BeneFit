import { cva, type VariantProps } from 'class-variance-authority';

const pageContainerVariants = cva(
  'w-full font-sans',
  {
    variants: {
      variant: {
        default: 'px-2 pt-16 md:px-6',
        noPadding: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

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
    <div className={`${pageContainerVariants({ variant })} ${className}`}>{children}</div>
  );
}
