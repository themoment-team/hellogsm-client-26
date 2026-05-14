import { cookies } from 'next/headers';

import { oneseoUrl } from '@repo/api/lib';
import { EditabilityType } from '@repo/types';

export const getEditability = async (): Promise<EditabilityType | undefined> => {
  const session = cookies().get('SESSION')?.value;
  try {
    const response = await fetch(
      new URL(oneseoUrl.getEditability(), process.env.NEXT_PUBLIC_API_BASE_URL),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SESSION=${session}`,
        },
      },
    );

    if (response.status === 404 || !response.ok) return undefined;

    const data = await response.json();

    return data.data;
  } catch {
    return undefined;
  }
};
