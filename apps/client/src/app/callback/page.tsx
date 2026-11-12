import { cookies, headers } from 'next/headers';

import {
  getOAuthStateCookieName,
  isSecureOrigin,
  resolveClientOrigin,
  verifyOAuthState,
} from '@/app/api/auth/oauth/oauthState';
import { CallbackPage } from '@/pageContainer';

export default async function Callback(props: {
  searchParams: Promise<{ code: string; state?: string | string[] }>;
}) {
  const [searchParams, cookieStore, headerStore] = await Promise.all([
    props.searchParams,
    cookies(),
    headers(),
  ]);

  // 서버 컴포넌트에서는 쿠키를 지울 수 없어, state 쿠키는 짧은 Max-Age로 만료시킨다.
  // 허용 목록에 없는 host에서는 state 쿠키를 발급하지 않으므로 검증도 실패로 본다.
  const origin = resolveClientOrigin(headerStore);
  const storedState = origin
    ? cookieStore.get(getOAuthStateCookieName(isSecureOrigin(origin)))?.value
    : undefined;
  // 검증에 실패하면 provider가 null이 되어 CallbackPage가 로그인 요청 없이 실패 처리한다.
  const provider = verifyOAuthState(storedState, searchParams.state);

  return <CallbackPage code={searchParams.code} provider={provider} />;
}
