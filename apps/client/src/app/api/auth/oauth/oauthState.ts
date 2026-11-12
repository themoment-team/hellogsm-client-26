// OAuth 로그인 state 발급·검증 순수 로직.
// 로그인 시작 Route Handler(./route.ts)와 콜백 페이지(app/callback/page.tsx)가 함께 쓴다.

export type OAuthProvider = 'google' | 'kakao';

// 'admin'은 어드민 로그인(google)이며, 콜백 성공 후 이동 경로만 다르다.
export type OAuthFlow = OAuthProvider | 'admin';

const OAUTH_FLOWS: readonly OAuthFlow[] = ['google', 'kakao', 'admin'];

export const OAUTH_STATE_MAX_AGE_SECONDS = 60 * 10;

const OAUTH_STATE_COOKIE_NAME = 'hellogsm-oauth-state';

const COOKIE_VALUE_SEPARATOR = '.';

interface HeaderReader {
  get(name: string): string | null;
}

const isOAuthFlow = (value: string): value is OAuthFlow =>
  (OAUTH_FLOWS as readonly string[]).includes(value);

const getFirstHeaderValue = (headers: HeaderReader, name: string) =>
  headers.get(name)?.split(',')[0]?.trim() || undefined;

// 로그인을 시작하고 콜백을 받을 수 있는 클라이언트 origin.
// Google/Kakao 콘솔에 등록된 redirect_uri의 origin과 같아야 한다. 프로토콜도 이 목록으로 정해
// 프록시 헤더(x-forwarded-proto)에 의존하지 않는다. 목록에 없는 host(프리뷰 배포 등)는 로그인을 거절한다.
const ALLOWED_CLIENT_ORIGINS = [
  'https://www.hellogsm.kr',
  'https://www.stage.hellogsm.kr',
  'http://localhost:3000',
] as const;

// Google/Kakao 콘솔에 등록된 콜백 경로. 바꾸면 인가 요청이 거절된다.
const OAUTH_CALLBACK_PATH = '/callback';

// 요청 host가 허용 목록에 있을 때만 그 origin을 돌려준다.
export const resolveClientOrigin = (headers: HeaderReader): string | null => {
  const host = (
    getFirstHeaderValue(headers, 'x-forwarded-host') ?? getFirstHeaderValue(headers, 'host')
  )?.toLowerCase();
  if (!host) return null;
  return ALLOWED_CLIENT_ORIGINS.find((origin) => new URL(origin).host === host) ?? null;
};

export const isSecureOrigin = (origin: string) => origin.startsWith('https://');

// 인가 요청과 백엔드 토큰 교환 요청이 같은 redirect_uri를 쓰도록 한 곳에서 만든다.
export const getOAuthRedirectUri = (origin: string) => `${origin}${OAUTH_CALLBACK_PATH}`;

// HTTPS에서는 __Host- 접두사로 Secure·Path=/·Domain 미지정 조건을 브라우저가 강제하게 한다.
// 로컬 http 개발 환경에서는 접두사 쿠키를 저장할 수 없어 일반 이름을 쓴다.
export const getOAuthStateCookieName = (isSecure: boolean) =>
  isSecure ? `__Host-${OAUTH_STATE_COOKIE_NAME}` : OAUTH_STATE_COOKIE_NAME;

// 발급과 삭제가 같은 속성을 써야 브라우저가 같은 쿠키로 취급한다.
// OAuth 제공자에서 돌아오는 top-level GET 이동에도 전송되도록 Lax를 쓴다.
export const getOAuthStateCookieOptions = (isSecure: boolean) => ({
  httpOnly: true,
  secure: isSecure,
  sameSite: 'lax' as const,
  path: '/',
});

// 어드민 로그인은 google만 지원한다.
export const parseOAuthFlow = (provider: string | null, isAdmin: boolean): OAuthFlow | null => {
  if (provider === 'google') return isAdmin ? 'admin' : 'google';
  if (provider === 'kakao' && !isAdmin) return 'kakao';
  return null;
};

export const getOAuthProvider = (flow: OAuthFlow): OAuthProvider =>
  flow === 'admin' ? 'google' : flow;

export const issueOAuthState = (
  flow: OAuthFlow,
  generateState: () => string = () => crypto.randomUUID(),
) => {
  const state = generateState();
  return { state, cookieValue: `${flow}${COOKIE_VALUE_SEPARATOR}${state}` };
};

// 저장된 state와 콜백으로 돌아온 state가 같을 때만 저장해 둔 flow를 돌려준다.
export const verifyOAuthState = (
  cookieValue: string | undefined,
  receivedState: string | string[] | undefined,
): OAuthFlow | null => {
  if (!cookieValue || typeof receivedState !== 'string' || !receivedState) return null;

  const separatorIndex = cookieValue.indexOf(COOKIE_VALUE_SEPARATOR);
  if (separatorIndex < 0) return null;

  const flow = cookieValue.slice(0, separatorIndex);
  const storedState = cookieValue.slice(separatorIndex + 1);
  if (!isOAuthFlow(flow) || !storedState || storedState !== receivedState) return null;

  return flow;
};

const AUTHORIZE_ENDPOINTS: Record<OAuthProvider, string> = {
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  kakao: 'https://kauth.kakao.com/oauth/authorize',
};

export const buildOAuthAuthorizeUrl = ({
  provider,
  clientId,
  redirectUri,
  state,
}: {
  provider: OAuthProvider;
  clientId: string;
  redirectUri: string;
  state: string;
}) => {
  const url = new URL(AUTHORIZE_ENDPOINTS[provider]);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  if (provider === 'google') url.searchParams.set('scope', 'email profile');
  url.searchParams.set('state', state);
  return url.toString();
};
