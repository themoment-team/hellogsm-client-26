import { cookies } from 'next/headers';

import { memberUrl } from '@repo/api/lib';
import { MySecondTestResultType } from '@repo/types';

export const getMySecondTestResult = async (): Promise<MySecondTestResultType | undefined> => {
  const session = (await cookies()).get('SESSION')?.value;

  // 세션 쿠키가 없으면 서버도 비로그인으로 응답하므로 요청을 보내지 않습니다.
  if (!session) return undefined;

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
