/**
 * Typography System
 *
 * Centralized typography styles as Tailwind class strings.
 * Use these constants instead of writing text/font classes directly.
 *
 * Usage:
 *   <h1 className={typography.h1}>Title</h1>
 *   <p className={typography.p}>Body text</p>
 *
 * Composition with layout utilities:
 *   <h1 className={`${typography.h1} text-center mt-8`}>Centered</h1>
 *
 * With clsx/conditionals:
 *   <h1 className={clsx(typography.h1, isActive && 'opacity-50')}>Title</h1>
 */

export const typography = {
  // Semantic heading styles
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground transition-colors',
  h2: 'scroll-m-20 text-3xl font-bold tracking-tight text-foreground transition-colors',
  h3: 'scroll-m-20 text-2xl font-bold tracking-tight text-foreground transition-colors',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-foreground transition-colors',

  // Body text styles
  p: 'leading-7 text-foreground transition-colors',
  pBold: 'leading-7 font-bold text-foreground transition-colors',
  lead: 'text-xl text-muted-foreground transition-colors',
  large: 'text-lg font-semibold text-foreground transition-colors',
  small: 'text-sm font-medium leading-none text-foreground transition-colors',
  muted: 'text-sm text-muted-foreground transition-colors',
  mutedXs: 'text-[10px] text-muted-foreground transition-colors',
  xs: 'text-xs text-foreground transition-colors',

  // Special text styles
  blockquote: 'mt-6 border-l-2 border-primary pl-6 italic text-foreground transition-colors',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground',
  list: 'my-6 ml-6 list-disc [&>li]:mt-2 text-foreground',

  // Branded display styles
  displayXl: 'text-5xl font-black tracking-tighter italic text-foreground transition-colors',
  displayLg: 'text-3xl font-black tracking-tighter italic text-foreground transition-colors',
  displayLgResponsive:
    'text-2xl sm:text-3xl font-black tracking-tighter italic text-foreground transition-colors',
  displayMd: 'text-2xl font-black tracking-tighter italic text-foreground transition-colors',
  displayBase: 'text-base font-black tracking-tighter italic text-foreground transition-colors',
  displaySm: 'text-[10px] font-black tracking-[0.2em] uppercase opacity-50 transition-colors',

  // UI Labels
  labelXs: 'text-[10px] font-black tracking-[0.2em] uppercase text-foreground transition-colors',
  labelSm: 'text-sm tracking-widest uppercase text-foreground transition-colors',

  // Colorless variants (inherit parent text color) - for use on colored backgrounds
  h1Inherit: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2Inherit: 'scroll-m-20 text-3xl font-bold tracking-tight',
  h3Inherit: 'scroll-m-20 text-2xl font-bold tracking-tight',
  h4Inherit: 'scroll-m-20 text-xl font-semibold tracking-tight',
  pInherit: 'leading-7',
  leadInherit: 'text-xl',
  largeInherit: 'text-lg font-semibold',
  smallInherit: 'text-sm font-medium leading-none',
  displayMdInherit: 'text-2xl font-black tracking-tighter italic',
} as const;

/**
 * Type for all available typography variants
 */
export type TypographyVariant = keyof typeof typography;

/**
 * Helper to get typography class with additional classes
 * Useful for one-off compositions
 *
 * @example
 * getTypography('h1', 'text-center mt-8')
 */
export function getTypography(variant: TypographyVariant, additionalClasses?: string): string {
  if (!additionalClasses) return typography[variant];
  return `${ typography[variant] } ${ additionalClasses }`;
}

/**
 * Design tokens extracted from typography styles
 * Useful for future migration to React Native or other platforms
 */
export const typographyTokens = {
  h1: {
    fontSize: { base: '2.25rem', lg: '3rem' }, // 36px, 48px
    fontWeight: '800',
    letterSpacing: '-0.025em',
    lineHeight: '1.2',
  },
  h2: {
    fontSize: '1.875rem', // 30px
    fontWeight: '700',
    letterSpacing: '-0.025em',
    lineHeight: '1.2',
  },
  h3: {
    fontSize: '1.5rem', // 24px
    fontWeight: '700',
    letterSpacing: '-0.025em',
    lineHeight: '1.2',
  },
  h4: {
    fontSize: '1.25rem', // 20px
    fontWeight: '600',
    letterSpacing: '-0.025em',
    lineHeight: '1.2',
  },
  p: {
    fontSize: '1rem', // 16px
    lineHeight: '1.75',
  },
  lead: {
    fontSize: '1.25rem', // 20px
    lineHeight: '1.5',
  },
  large: {
    fontSize: '1.125rem', // 18px
    fontWeight: '600',
    lineHeight: '1.5',
  },
  small: {
    fontSize: '0.875rem', // 14px
    fontWeight: '500',
    lineHeight: '1',
  },
  muted: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.5',
  },
  xs: {
    fontSize: '0.75rem', // 12px
    lineHeight: '1.5',
  },
  blockquote: {
    fontSize: '1rem', // 16px
    fontStyle: 'italic',
    borderLeft: '2px solid',
    paddingLeft: '1.5rem',
  },
  code: {
    fontSize: '0.875rem', // 14px
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  list: {
    fontSize: '1rem', // 16px
    lineHeight: '1.75',
    listStyle: 'disc',
  },
  displayXl: {
    fontSize: '3rem', // 48px
    fontWeight: '900',
    letterSpacing: '-0.05em',
    fontStyle: 'italic',
  },
  displayLg: {
    fontSize: '1.875rem', // 30px
    fontWeight: '900',
    letterSpacing: '-0.05em',
    fontStyle: 'italic',
  },
  displayMd: {
    fontSize: '1.5rem', // 24px
    fontWeight: '900',
    letterSpacing: '-0.05em',
    fontStyle: 'italic',
  },
  displaySm: {
    fontSize: '0.625rem', // 10px
    fontWeight: '900',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    opacity: '0.5',
  },
} as const;
