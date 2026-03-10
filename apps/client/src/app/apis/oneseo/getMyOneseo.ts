import { cookies } from 'next/headers';
import { GetMyOneseoType } from 'types';

import { oneseoUrl } from 'api/libs';

export const getMyOneseo = async (): Promise<GetMyOneseoType | undefined> => {
  const session = cookies().get('SESSION')?.value;
  try {
    const response = await fetch(
      new URL(oneseoUrl.getMyOneseo(), process.env.NEXT_PUBLIC_API_BASE_URL),
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

    const myOneseo = await response.json();

    return myOneseo.data;
  } catch {
    return undefined;
  }
};
