'use client';

import { useRouter } from 'next/navigation';

import { authUrl, get } from '../../libs';

export const useLogout = (type: 'client' | 'admin') => {
  const { push } = useRouter();

  const handleLogout = async () => {
    try {
      await get(authUrl.getLogout());
    } catch {
      // do nothing
    }

    return type === 'client' ? push('/') : push('/signin');
  };

  return handleLogout;
};
