'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { cn } from '@repo/utils';

import { ChannelTalk } from '@/components';

const Provider = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn('min-h-screen', 'flex', 'flex-col')}>
        {children}
        <ChannelTalk />
        <div className="print:hidden">
          <ToastContainer />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Provider;
