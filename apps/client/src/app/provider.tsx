'use client';

import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ToastContainer } from 'react-toastify';

import { ChannelTalk } from 'client/components';

import 'react-toastify/dist/ReactToastify.css';
import { cn } from 'shared/lib/utils';

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
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
};

export default Provider;
