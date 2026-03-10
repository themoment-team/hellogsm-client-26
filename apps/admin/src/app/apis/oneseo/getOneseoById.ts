import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { oneseoUrl } from '@repo/api/lib';
import { GetMyOneseoType } from '@repo/types';

export const getOneseoByMemberId = async (memberId: number): Promise<GetMyOneseoType> => {
  const session = cookies().get('SESSION')?.value;

  const response = await fetch(
    new URL(`${oneseoUrl.getOneseoByMemberId(memberId)}`, process.env.NEXT_PUBLIC_API_BASE_URL),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SESSION=${session}`,
      },
    },
  );

  const isNotFound = response.status === 404;

  const oneseo = await response.json();

  if (isNotFound || oneseo.data === undefined) {
    return redirect('/');
  }

  return oneseo.data;
};
