import { cookies } from 'next/headers';

/**
 * 요청자의 SESSION 쿠키를 붙여 백엔드에 GET 요청을 보냅니다.
 *
 * 세션 쿠키가 없으면 요청을 보내지 않고 `undefined`를 반환합니다.
 * 쿠키 없이 보내도 백엔드는 비로그인으로 실패 응답을 주고, 호출부는 실패 시 `undefined`를 반환하므로 결과가 같습니다.
 * 네트워크 오류도 `undefined`를 반환합니다.
 *
 * `cookies()`는 동적 렌더링 전환을 위해 Next가 던지는 신호를 삼키지 않도록 try 밖에서 읽습니다.
 */
export const fetchWithSession = async (path: string): Promise<Response | undefined> => {
  const session = (await cookies()).get('SESSION')?.value;

  if (!session) return undefined;

  try {
    return await fetch(new URL(path, process.env.NEXT_PUBLIC_API_BASE_URL), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SESSION=${session}`,
      },
    });
  } catch {
    return undefined;
  }
};
