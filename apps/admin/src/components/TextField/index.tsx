import * as React from 'react';

import { cn } from 'shared/lib/utils';

const TextField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    // useDebounce, formatScore

    return (
      <input
        type="text"
        placeholder="점수 입력"
        className={cn(
          'w-[84px]',
          'px-4',
          'rounded-md',
          'focus: outline-slate-700',
          'text-zinc-900',
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground border px-3 py-1.5 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
TextField.displayName = 'TextField';

export default TextField;
