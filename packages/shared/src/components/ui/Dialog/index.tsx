'use client';

import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { Button, Input, Label } from 'shared/components';
import { cn } from 'shared/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn([
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=open]:animate-in',
      'data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0',
      'data-[state=open]:fade-in-0',
      className,
    ])}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseIcon?: boolean;
    onClose?: () => void;
  }
>(({ className, children, showCloseIcon = true, onClose, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn([
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
        className,
      ])}
      {...props}
    >
      {children}
      {showCloseIcon && (
        <DialogPrimitive.Close
          className={cn(
            'absolute',
            'right-4',
            'top-4',
            'z-10',
            'cursor-pointer',
            'rounded-sm',
            'opacity-70',
            'ring-offset-background',
            'transition-opacity',
            'hover:opacity-100',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-ring',
            'focus:ring-offset-2',
            'disabled:pointer-events-none',
            'data-[state=open]:bg-accent',
            'data-[state=open]:text-muted-foreground',
          )}
          onClick={onClose}
        >
          <X className={cn('h-7', 'w-7')} />
          <span className={cn('sr-only')}>Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(['flex', 'flex-col', 'space-y-1.5', 'text-center', 'sm:text-left', className])}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex',
      'flex-col-reverse',
      'sm:flex-row',
      'sm:justify-end',
      'sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(['text-lg font-semibold leading-none tracking-tight', className])}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(['text-sm', 'text-muted-foreground', className])}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogExample = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Share</Button>
    </DialogTrigger>
    <DialogContent className={cn('sm:max-w-md')}>
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
      </DialogHeader>
      <div className={cn('flex', 'items-center', 'space-x-2')}>
        <div className={cn('grid', 'flex-1', 'gap-2')}>
          <Label htmlFor="link" className={cn('sr-only')}>
            Link
          </Label>
          <Input id="link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
        </div>
        <Button type="submit" size="sm" className={cn('px-3')}>
          <span className={cn('sr-only')}>Copy</span>
          {/* <Copy className={cn("w-4 h-4")} /> */}
        </Button>
      </div>
      <DialogFooter className={cn('sm:justify-start')}>
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export {
  DialogExample,
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
