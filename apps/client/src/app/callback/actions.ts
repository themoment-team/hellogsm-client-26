'use server';

import { cookies, headers } from 'next/headers';

import {
  getOAuthRedirectUri,
  getOAuthStateCookieName,
  getOAuthStateCookieOptions,
  isSecureOrigin,
  type OAuthFlow,
  resolveClientOrigin,
  verifyOAuthState,
} from '@/app/api/auth/oauth/oauthState';

export interface ConsumedOAuthState {
  flow: OAuthFlow;
  // 인가 요청(로그인 시작 Route Handler)과 같은 함수로 만든 redirect_uri
  redirectUri: string;
}

// 콜백으로 돌아온 state를 검증하고 state 쿠키를 지운다.
// 서버 컴포넌트에서는 쿠키를 지울 수 없어 Server Action에서 처리하며, 쿠키는 검증 결과와 관계없이 한 번만 쓰인다.
export async function consumeOAuthState(
  receivedState: string | undefined,
): Promise<ConsumedOAuthState | null> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  // 허용 목록에 없는 host에서는 state 쿠키를 발급하지 않으므로 검증도 실패로 본다.
  const origin = resolveClientOrigin(headerStore);
  if (!origin) return null;

  const isSecure = isSecureOrigin(origin);
  const cookieName = getOAuthStateCookieName(isSecure);
  const storedState = cookieStore.get(cookieName)?.value;
  if (storedState === undefined) return null;

  // __Host- 쿠키는 발급할 때와 같은 Secure·Path 속성으로 덮어써야 지워진다.
  cookieStore.set(cookieName, '', { ...getOAuthStateCookieOptions(isSecure), maxAge: 0 });

  // Server Action 인자는 클라이언트가 보낸 값이므로 문자열인지 다시 확인한다.
  const flow = verifyOAuthState(
    storedState,
    typeof receivedState === 'string' ? receivedState : undefined,
  );
  return flow ? { flow, redirectUri: getOAuthRedirectUri(origin) } : null;
}
