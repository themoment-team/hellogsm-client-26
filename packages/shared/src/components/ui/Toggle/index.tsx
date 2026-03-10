'use client';

import * as React from 'react';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'shared/lib/utils';

const toggleVariants = cva(
  'gap-x-1.5 rounded-3xl border-slate-200 border text-slate-400 inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:border-emerald-500 hover:bg-muted hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-emerald-500 data-[state=on]:border-emerald-500',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'px-2.5 py-1',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> & { icon?: React.ReactNode }
>(({ className, variant, size, icon, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className, 'toggle-icon-hover', {
      'toggle-icon-active': !!icon,
    })}
    {...props}
  >
    {icon && <span className={cn('toggle-icon')}>{icon}</span>}
    {props.children}
  </TogglePrimitive.Root>
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
