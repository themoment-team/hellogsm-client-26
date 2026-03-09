import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { memberUrl } from 'api/libs';

import type { MyAuthInfoType } from 'types';

interface GetMyAuthInfoParams {
  redirectUrl: string;
}

/**
 * 나의 인증 정보를 가져옵니다.
 *
 * @returns 나의 인증 정보를 반환합니다. 없다면 -> TODO 서버 문서 업데이트 중입니다.
 */
export const getMyAuthInfo = async ({
  redirectUrl,
}: GetMyAuthInfoParams): Promise<MyAuthInfoType | undefined> => {
  const session = cookies().get('SESSION')?.value;

  const response = await fetch(
    new URL(`${memberUrl.getMyAuthInfo()}`, process.env.NEXT_PUBLIC_API_BASE_URL),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SESSION=${session}`,
      },
    },
  );

  if (!response.ok) {
    return redirect(redirectUrl);
  }

  const authInfo = await response.json();

  return authInfo.data;
};
