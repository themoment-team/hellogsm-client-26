import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@repo/utils';

const inputVariants = cva(cn(''), {
  variants: {
    variant: {
      default: cn('focus-visible:border-slate-900'),
      blueOutline: cn('focus-visible:border-blue-500'),
      error: cn('!border-red-600', 'disabled:!opacity-100'),
    },
    width: {
      full: cn('w-full'),
      large: cn('w-[400px]'),
      medium: cn('w-[200px]'),
      small: cn('w-[100px]'),
    },
  },
  defaultVariants: {
    variant: 'default',
    width: 'large',
  },
});

interface InputProps extends React.ComponentProps<'input'>, VariantProps<typeof inputVariants> {
  width?: 'full' | 'large' | 'medium' | 'small';
  icon?: React.ReactNode;
  onIconClick?: () => void;
  errorMessage?: string;
  successMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      errorMessage,
      successMessage,
      className,
      type,
      width = 'full',
      icon,
      onIconClick,
      variant,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('flex', 'flex-col', 'gap-1', inputVariants({ width }))}>
        <div className={cn(['relative', 'flex', 'items-center', className])}>
          <input
            type={type}
            className={cn(
              inputVariants({ variant }),
              'm-0',
              'w-full',
              'pt-2',
              'pb-2',
              'pl-3',
              icon ? 'pr-10' : 'pr-4',
              'text-sm',
              'rounded-lg',
              'border',
              'bg-white',
              'border-slate-300',
              'self-stretch',
              'ring-offset-background',
              'focus-visible:outline-none',
              'disabled:cursor-not-allowed',
              'disabled:opacity-50',
              'file:border-0',
              'file:bg-transparent',
              'file:text-sm',
              'file:font-medium',
              'placeholder:text-slate-400',
              'disabled:placeholder:text-gray-300',
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div
              onClick={onIconClick}
              className={cn('pointer-events-none', 'absolute', 'right-3', 'flex', 'items-center')}
            >
              {icon}
            </div>
          )}
        </div>

      {(errorMessage || successMessage) && (
        <span
          className={cn([
            'text-xs',
            'font-normal',
            errorMessage ? 'text-red-600' : 'text-green-600',
          ])}
        >
          {errorMessage ?? successMessage}
        </span>
      )}
    </div>
  );
  },
);
Input.displayName = 'Input';

export { Input };
