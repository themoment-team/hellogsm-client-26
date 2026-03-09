'use client';

import { cn } from 'shared/lib/utils';

const textStyle = ['text-slate-900', 'text-body2', 'font-medium'];

interface RadioButtonProps<T> {
  title: string;
  required?: boolean;
  disabled?: boolean;
  disabledOption?: string;
  handleOptionClick?: (option: T) => void;
  selectedValue: string;
  list: { name: string; value: T }[];
  error?: boolean;
}

const RadioButton = <T,>({
  title,
  required,
  disabled,
  disabledOption,
  selectedValue,
  handleOptionClick,
  list,
  error,
}: RadioButtonProps<T>) => {
  return (
    <div className={cn('w-full', 'flex', 'flex-col', 'items-start', 'gap-[0.75rem]')}>
      <div className={cn([...textStyle])}>
        {title} {required && <span className={cn('text-red-600')}>*</span>}
      </div>
      <div className={cn('flex', 'items-start', 'gap-[1.25rem]')}>
        {list.map(({ name, value }, index) => (
          <div
            key={index}
            className={cn([
              'flex',
              'items-center',
              'gap-[0.5rem]',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            ])}
            onClick={() => {
              if (handleOptionClick) handleOptionClick(value);
            }}
          >
            <input
              readOnly
              type="radio"
              checked={selectedValue === value}
              disabled={disabled || name === disabledOption}
              className={cn([
                'appearance-none',
                'w-4',
                'h-4',
                'border-[1px]',
                'border-slate-200',
                'rounded-full',
                'relative',
                'after:content-[""]',
                'after:absolute',
                'after:top-1/2',
                'after:left-1/2',
                'after:w-2',
                'after:h-2',
                'after:rounded-full',
                'after:transform',
                'after:-translate-x-1/2',
                'after:-translate-y-1/2',
                'checked:after:scale-100',
                'after:scale-0',
                'transition-transform',
                disabled
                  ? ['cursor-not-allowed', 'after:bg-slate-400']
                  : ['cursor-pointer', 'after:bg-black'],
                error && !selectedValue && '!border-red-600',
              ])}
            />
            <p className={cn([...textStyle])}>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;
