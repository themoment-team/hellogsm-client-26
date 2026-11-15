import { headers } from 'next/headers';

import { LoginPage } from '@/pageContainer';

// 어드민 로그인도 클라이언트 origin의 /callback으로 돌아오므로, state 쿠키가 같은 origin에 남도록
// 클라이언트 앱의 로그인 시작 Route Handler(apps/client/src/app/api/auth/oauth/route.ts)에서 시작한다.
const getClientOrigin = (host: string) => {
  if (host.includes('localhost')) return 'http://localhost:3000';
  if (host.includes('stage')) return 'https://www.stage.hellogsm.kr';
  return 'https://www.hellogsm.kr';
};

export default async function Login() {
  // 서버에서 요청 host로 정해 로그인 링크를 SSR 마크업부터 렌더한다.
  const host = (await headers()).get('host') ?? '';
  const loginParams = new URLSearchParams({ provider: 'google', admin: 'true' });
  const loginHref = `${getClientOrigin(host)}/api/auth/oauth?${loginParams.toString()}`;

  return <LoginPage loginHref={loginHref} />;
}
