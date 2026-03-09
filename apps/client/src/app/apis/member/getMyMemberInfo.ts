import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { memberUrl } from 'api/libs';

import type { MyMemberInfoType } from 'types';

/**
 * 나의 멤버 정보를 가져옵니다.
 *
 * @returns 나의 멤버 정보를 반환합니다. 없다면 -> TODO 서버 문서 업데이트 중입니다.
 */
export const getMyMemberInfo = async (
  redirectUrl: string,
): Promise<MyMemberInfoType | undefined> => {
  const session = cookies().get('SESSION')?.value;

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
