'use client';

import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from 'shared/lib/utils';

const buttonVariants = cva(
  cn(
    'inline-flex',
    'items-center',
    'justify-center',
    'whitespace-nowrap',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ),
  {
    variants: {
      variant: {
        default: cn('bg-slate-800', 'text-white', 'hover:bg-slate-200'),
        fill: cn('bg-blue-600', 'text-white', 'hover:bg-blue-800'),
        reverseFill: cn('text-blue-600', 'bg-white', 'border', 'border-blue-600'),
        blue: cn('bg-blue-600', 'text-white', 'hover:bg-blue-800'),
        destructive: cn('bg-red-500', 'text-destructive-foreground', 'hover:bg-red-600'),
        outline: cn(
          'border-slate-200',
          'border',
          'border-input',
          'text-slate-800',
          'hover:bg-accent',
          'hover:text-accent-foreground',
        ),
        subtitle: cn('bg-slate-100', 'text-secondary-foreground', 'hover:bg-slate-200'),
        ghost: cn('hover:bg-accent', 'hover:bg-slate-100'),
        link: cn('text-primary', 'underline-offset-4', 'hover:underline'),
        disabled: cn(
          'bg-slate-900',
          'text-white',
          'disabled:bg-slate-200',
          'disabled:text-slate-500',
        ),
        submit: cn(
          'disabled:bg-slate-100',
          'disabled:text-slate-400',
          'text-slate-400',
          'bg-slate-100',
          'disabled:opacity-100',
        ),
        download: cn('bg-slate-100', 'text-slate-800'),
        next: cn('bg-blue-50', 'text-blue-600'),
      },
      size: {
        default: cn('h-10', 'px-4', 'py-2'),
        sm: cn('rounded-md', 'px-3', 'py-2'),
        lg: cn('h-11', 'rounded-md', 'px-8'),
        icon: cn('h-10', 'w-10'),
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
