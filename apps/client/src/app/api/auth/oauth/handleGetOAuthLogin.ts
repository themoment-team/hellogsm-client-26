import { NextResponse } from 'next/server';

import {
  buildOAuthAuthorizeUrl,
  getOAuthProvider,
  getOAuthStateCookieName,
  getRequestOrigin,
  isSecureRequest,
  issueOAuthState,
  OAUTH_STATE_MAX_AGE_SECONDS,
  type OAuthProvider,
  parseOAuthFlow,
} from './oauthState';

// Google/Kakao 콘솔에 등록된 콜백 경로. 바꾸면 인가 요청이 거절된다.
const CALLBACK_PATH = '/callback';

// 두 값 모두 브라우저에 공개되어도 되는 값이다.
const DEFAULT_CLIENT_IDS: Record<OAuthProvider, string> = {
  google: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  kakao: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? '',
};

interface HandleGetOAuthLoginParams {
  provider: string | null;
  isAdmin: boolean;
  headers: { get(name: string): string | null };
  clientIds?: Record<OAuthProvider, string>;
  generateState?: () => string;
}

export const handleGetOAuthLogin = ({
  provider,
  isAdmin,
  headers,
  clientIds = DEFAULT_CLIENT_IDS,
  generateState,
}: HandleGetOAuthLoginParams) => {
  const flow = parseOAuthFlow(provider, isAdmin);
  const origin = getRequestOrigin(headers);
  if (!flow || !origin) {
    return new NextResponse('잘못된 로그인 요청입니다.', { status: 400 });
  }

  const { state, cookieValue } = issueOAuthState(flow, generateState);
  const oauthProvider = getOAuthProvider(flow);
  const authorizeUrl = buildOAuthAuthorizeUrl({
    provider: oauthProvider,
    clientId: clientIds[oauthProvider],
    redirectUri: `${origin}${CALLBACK_PATH}`,
    state,
  });

  const isSecure = isSecureRequest(headers);
  const response = NextResponse.redirect(authorizeUrl, 302);
  response.headers.set('Cache-Control', 'no-store');
  // OAuth 제공자에서 돌아오는 top-level GET 이동에도 전송되도록 Lax를 쓴다.
  response.cookies.set(getOAuthStateCookieName(isSecure), cookieValue, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
  });
  return response;
};
