'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const switchVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      checked: {
        true: 'bg-primary',
        false: 'bg-muted',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

const thumbVariants = cva(
  'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
  {
    variants: {
      checked: {
        true: 'translate-x-5',
        false: 'translate-x-0',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export interface SwitchProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof switchVariants> {
  checked?: boolean;
  onCheckedChange?: (_checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        ref={ref}
        className={`${switchVariants({ checked })} ${className || ''}`}
        onClick={handleClick}
        {...props}
      >
        <span className={thumbVariants({ checked })} />
      </button>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
