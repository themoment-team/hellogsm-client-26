import { Footer } from 'client/components';

import { cn } from 'shared/lib/utils';

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
