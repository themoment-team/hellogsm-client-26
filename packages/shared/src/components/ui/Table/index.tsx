import * as React from 'react';

import { CheckIcon } from 'shared/assets';
import { Toggle } from 'shared/components';
import { Button, Badge } from 'shared/components';
import { cn } from 'shared/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn('relative', 'w-full', 'overflow-auto')}>
      <table ref={ref} className={cn(['w-full caption-bottom text-sm', className])} {...props} />
    </div>
  ),
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn(['[&_tr]:border-b', className])} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn(['[&_tr:last-child]:border-0', className])} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t', 'bg-muted/50', 'font-medium', '[&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn([
        'border-b',
        'transition-colors',
        'hover:bg-muted/50',
        'data-[state=selected]:bg-muted',
        className,
      ])}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12',
      'px-4',
      'text-left',
      'align-middle',
      'font-medium',
      'text-muted-foreground',
      '[&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(['p-4', 'align-middle', '[&:has([role=checkbox])]:pr-0', className])}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(['mt-4', 'text-sm', 'text-muted-foreground', className])}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

const TableExample = () => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell className={cn('w-[100px]', 'text-zinc-900')}>0189</TableCell>
        <TableCell className={cn('w-[130px]')}>
          <Toggle icon={<CheckIcon />}>제출 완료</Toggle>
        </TableCell>
        <TableCell className={cn('w-[154px]', 'font-semibold', 'text-zinc-900')}>
          진예원 <br />
          <span className={cn('font-normal', 'text-zinc-600')}>010 1234 5678</span>
        </TableCell>
        <TableCell className={cn('w-[154px]', 'text-zinc-600')}>대성여자중학교</TableCell>
        <TableCell className={cn('max-w-full', 'text-zinc-900')}>일반전형</TableCell>
        <TableCell className={cn('w-[96px]')}>
          <Badge variant="미정">미정</Badge>
        </TableCell>
        <TableCell className={cn('w-[180px]', 'text-zinc-400')}>진행 전</TableCell>
        <TableCell className={cn('w-[180px]', 'text-zinc-400')}>진행 전</TableCell>
        <TableCell className={cn('w-[96px]')}>
          <Badge variant="미정">미정</Badge>
        </TableCell>
        <TableCell className={cn('w-[149px]')}>
          <Button className={cn('ml-[45px]')} variant="outline">
            원서수정
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export {
  TableExample,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
