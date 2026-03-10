'use client';

import * as React from 'react';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { ButtonProps, buttonVariants } from 'shared/components/ui/Button';
import { cn } from 'shared/lib/utils';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn(['mx-auto', 'flex w-full', 'justify-center', className])}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(['flex', 'flex-row', 'items-center', 'gap-1', className])}
      {...props}
    />
  ),
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn([className, 'cursor-pointer'])} {...props} />
  ),
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <div className={cn('flex')}>
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'gap-1 pl-2.5',
        className,
      )}
      {...props}
    >
      <ChevronLeft className={cn('h-4', 'w-4')} />
    </PaginationLink>
    <div className={cn('w-[48px]')} />
  </div>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <div className={cn('flex')}>
    <div className={cn('w-[48px]')} />
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(buttonVariants({ variant: 'ghost' }), 'gap-1 pr-2.5', className)}
      {...props}
    >
      <ChevronRight className={cn('h-4', 'w-4')} />
    </PaginationLink>
  </div>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(['flex', 'h-9', 'w-9', 'items-center', 'justify-center', className])}
    {...props}
  >
    <MoreHorizontal className={cn('w-4', 'h-4')} />
    <span className={cn('sr-only')}>More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

const PaginationExample = () => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive href="#">
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export {
  PaginationExample,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
