import { cva, type VariantProps } from 'class-variance-authority';
import React, { HTMLAttributes, forwardRef } from 'react';

const typographyVariants = cva('text-foreground transition-colors', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 border-primary pl-6 italic',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      gradient:
        'bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)] bg-clip-text text-transparent font-bold inline-block',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'blockquote'
  | 'code'
  | 'span'
  | 'div'
  | 'article'
  | 'section';

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    // Map variant to default element if 'as' is not provided
    const Tag = (as ||
      (variant && ['h1', 'h2', 'h3', 'h4', 'p', 'blockquote', 'code'].includes(variant)
        ? (variant as TypographyElement)
        : 'p')) as TypographyElement;

    return React.createElement(Tag, {
      ...props,
      className: typographyVariants({ variant, className }),
      ref,
    });
  },
);

Typography.displayName = 'Typography';

export default Typography;
export { typographyVariants };
