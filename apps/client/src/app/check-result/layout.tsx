import { cn } from '@repo/utils';

import { Footer } from '@/components';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className={cn('h-[calc(100vh-4.625rem)]', 'flex', 'justify-center', 'bg-gray-100')}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
