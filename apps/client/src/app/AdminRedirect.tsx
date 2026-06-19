'use client';

import { useEffect } from 'react';

import { cn } from '@repo/utils';

const getAdminUrl = (origin: string): string => {
  if (origin.includes('localhost')) return 'http://localhost:3001';
  if (origin.includes('stage')) return 'https://admin.stage.hellogsm.kr';
  return 'https://admin.hellogsm.kr';
};

const AdminRedirect = () => {
  useEffect(() => {
    window.location.replace(getAdminUrl(window.location.origin));
  }, []);

  return (
    <div className={cn('flex', 'h-[calc(100vh-4.625rem)]', 'items-center', 'justify-center')}>
      <div className={cn('text-lg', 'font-medium')}>이동 중...</div>
    </div>
  );
};

export default AdminRedirect;
