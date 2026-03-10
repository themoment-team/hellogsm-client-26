'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { cn } from '@repo/utils';

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

const ActiveLink = ({
  children,
  className,
  activeClassName,
  ...props
}: PropsWithChildren<ActiveLinkProps>) => {
  const pathname = usePathname();
  const isActive = props.href === pathname;

  return (
    <Link className={cn([className, isActive && activeClassName])} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
