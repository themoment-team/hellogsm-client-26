import { cookies } from 'next/headers';

import { memberUrl } from '@repo/api/lib';
import { MyFirstTestResultType } from '@repo/types';

export const getMyFirstTestResult = async (): Promise<MyFirstTestResultType | undefined> => {
  const session = (await cookies()).get('SESSION')?.value;

  try {
    const response = await fetch(
      new URL(memberUrl.getMyFirstTestResult(), process.env.NEXT_PUBLIC_API_BASE_URL),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SESSION=${session}`,
        },
      },
    );

    const memberInfo = await response.json();

    return memberInfo.data;
  } catch {
    return undefined;
  }
};
