import type { NextRequest } from 'next/server';

import { handleGetOAuthLogin } from './handleGetOAuthLogin';

// 어드민 로그인도 클라이언트 origin의 /callback으로 돌아오므로, state 쿠키는 항상
// 클라이언트 origin인 이 핸들러에서 발급한다.
// next.config의 /api/:path* rewrite보다 파일 시스템 라우트가 먼저 매칭된다.
export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return handleGetOAuthLogin({
    provider: searchParams.get('provider'),
    isAdmin: searchParams.get('admin') === 'true',
    headers: request.headers,
  });
}
