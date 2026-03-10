import { cookies } from 'next/headers';
import { MySecondTestResultType } from 'types';

import { memberUrl } from 'api/libs';

export const getMySecondTestResult = async (): Promise<MySecondTestResultType | undefined> => {
  const session = cookies().get('SESSION')?.value;

  try {
    const response = await fetch(
      new URL(memberUrl.getMySecondTestResult(), process.env.NEXT_PUBLIC_API_BASE_URL),
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
