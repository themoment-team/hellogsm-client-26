'use client';

import { useRouter } from 'next/navigation';

import { authUrl, get } from 'api/libs';

export const useLogout = (type: 'client' | 'admin') => {
  const { push } = useRouter();

  const handleLogout = async () => {
    try {
      await get(authUrl.getLogout());
    } catch (error) {}

    return type === 'client' ? push('/') : push('/signin');
  };

  return handleLogout;
};
