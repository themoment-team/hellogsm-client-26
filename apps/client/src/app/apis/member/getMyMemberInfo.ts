import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { memberUrl } from '@repo/api/lib';
import { MyMemberInfoType } from '@repo/types';

/**
 * 나의 멤버 정보를 가져옵니다.
 *
 * @returns 나의 멤버 정보를 반환합니다. 없다면 -> TODO 서버 문서 업데이트 중입니다.
 */
export const getMyMemberInfo = async (
  redirectUrl: string,
): Promise<MyMemberInfoType | undefined> => {
  const session = (await cookies()).get('SESSION')?.value;

  // 세션 쿠키가 없으면 서버도 비로그인으로 응답하므로 요청을 보내지 않습니다.
  if (!session) return undefined;

  try {
    const response = await fetch(
      new URL(memberUrl.getMyMemberInfo(), process.env.NEXT_PUBLIC_API_BASE_URL),
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

    if (!response.ok) {
      return redirect(redirectUrl);
    }

    return memberInfo.data;
  } catch {
    return undefined;
  }
};
