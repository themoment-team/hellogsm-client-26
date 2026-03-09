import { cn } from 'shared/lib/utils';

interface SexToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected: boolean;
}

const SexToggle = ({ children, isSelected, ...props }: SexToggleProps) => {
  const textColor = isSelected ? 'text-blue-600' : 'text-gray-400';
  const borderColor = isSelected ? 'border-blue-600' : 'border-gray-300';

  return (
    <div
      className={cn([
        borderColor,
        'cursor-pointer',
        'w-full',
        'py-2',
        'rounded-lg',
        'border',
        'border-solid',
        'flex',
        'justify-center',
      ])}
      {...props}
    >
      <span className={cn([textColor, 'font-normal', 'text-sm'])}>{children}</span>
    </div>
  );
};

export default SexToggle;
