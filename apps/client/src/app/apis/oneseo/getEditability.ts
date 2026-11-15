import { cookies } from 'next/headers';

import { oneseoUrl } from '@repo/api/lib';
import { EditabilityType } from '@repo/types';

export const getEditability = async (): Promise<EditabilityType | undefined> => {
  const session = (await cookies()).get('SESSION')?.value;

  // 세션 쿠키가 없으면 서버도 비로그인으로 응답하므로 요청을 보내지 않습니다.
  if (!session) return undefined;

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
