import { NextResponse } from 'next/server';

import {
  buildOAuthAuthorizeUrl,
  getOAuthProvider,
  getOAuthRedirectUri,
  getOAuthStateCookieName,
  getOAuthStateCookieOptions,
  isSecureOrigin,
  issueOAuthState,
  OAUTH_STATE_MAX_AGE_SECONDS,
  type OAuthProvider,
  parseOAuthFlow,
  resolveClientOrigin,
} from './oauthState';

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
  const origin = resolveClientOrigin(headers);
  if (!flow || !origin) {
    return new NextResponse('잘못된 로그인 요청입니다.', { status: 400 });
  }

  const { state, cookieValue } = issueOAuthState(flow, generateState);
  const oauthProvider = getOAuthProvider(flow);
  const authorizeUrl = buildOAuthAuthorizeUrl({
    provider: oauthProvider,
    clientId: clientIds[oauthProvider],
    redirectUri: getOAuthRedirectUri(origin),
    state,
  });

  const isSecure = isSecureOrigin(origin);
  const response = NextResponse.redirect(authorizeUrl, 302);
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(getOAuthStateCookieName(isSecure), cookieValue, {
    ...getOAuthStateCookieOptions(isSecure),
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
  });
  return response;
};
