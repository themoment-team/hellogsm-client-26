import { cva } from 'class-variance-authority';

import { cn } from 'shared/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant: '합격' | '불합격' | '미정';
}

const badgeVariants = cva(cn('py-0.5', 'px-1.5', 'rounded', 'w-fit'), {
  variants: {
    variant: {
      합격: cn('bg-blue-50', 'text-blue-500'),
      불합격: cn('bg-rose-50', 'text-rose-500'),
      미정: cn('bg-gray-100', 'text-gray-500'),
    },
  },
  defaultVariants: {
    variant: '미정',
  },
});

const Badge: React.FC<BadgeProps> = ({ variant, children }) => (
  <div className={cn(badgeVariants({ variant }))}>{children}</div>
);

export { Badge };
