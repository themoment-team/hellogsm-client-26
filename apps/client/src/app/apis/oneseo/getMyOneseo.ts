import { cookies } from 'next/headers';

import { oneseoUrl } from '@repo/api/lib';
import { GetMyOneseoType, PreviewOneseoType } from '@repo/types';

const fetchOneseo = async <T>(preview: boolean): Promise<T | undefined> => {
  const session = cookies().get('SESSION')?.value;
  try {
    const response = await fetch(
      new URL(oneseoUrl.getMyOneseo(preview), process.env.NEXT_PUBLIC_API_BASE_URL),
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

export const getMyOneseo = async (): Promise<GetMyOneseoType | undefined> => {
  return fetchOneseo<GetMyOneseoType>(false);
};

export const getMyOneseoPreview = async (): Promise<PreviewOneseoType | undefined> => {
  return fetchOneseo<PreviewOneseoType>(true);
};

