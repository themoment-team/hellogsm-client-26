import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  buildOAuthAuthorizeUrl,
  getOAuthProvider,
  getOAuthRedirectUri,
  getOAuthStateCookieName,
  isSecureOrigin,
  issueOAuthState,
  parseOAuthFlow,
  resolveClientOrigin,
  verifyOAuthState,
} from './oauthState';

test('provider와 어드민 여부로 flow를 결정하고, 어드민은 google만 허용한다', () => {
  assert.equal(parseOAuthFlow('google', false), 'google');
  assert.equal(parseOAuthFlow('kakao', false), 'kakao');
  assert.equal(parseOAuthFlow('google', true), 'admin');
  assert.equal(parseOAuthFlow('kakao', true), null);
  assert.equal(parseOAuthFlow('admin', false), null);
  assert.equal(parseOAuthFlow(null, false), null);
});

test('어드민 flow는 google 제공자로 인가를 요청한다', () => {
  assert.equal(getOAuthProvider('admin'), 'google');
  assert.equal(getOAuthProvider('google'), 'google');
  assert.equal(getOAuthProvider('kakao'), 'kakao');
});

test('발급한 state는 무작위 값이며 쿠키 값에 flow와 함께 묶인다', () => {
  const issued = issueOAuthState('kakao', () => 'fixed-state');
  assert.deepEqual(issued, { state: 'fixed-state', cookieValue: 'kakao.fixed-state' });

  const first = issueOAuthState('google');
  const second = issueOAuthState('google');
  assert.notEqual(first.state, second.state);
  assert.ok(first.state.length >= 32);
});

test('발급한 쿠키 값과 같은 state가 돌아오면 저장해 둔 flow를 돌려준다', () => {
  for (const flow of ['google', 'kakao', 'admin'] as const) {
    const { state, cookieValue } = issueOAuthState(flow);
    assert.equal(verifyOAuthState(cookieValue, state), flow);
  }
});

test('state가 다르거나 쿠키·state가 없으면 검증에 실패한다', () => {
  const { state, cookieValue } = issueOAuthState('google', () => 'expected-state');

  assert.equal(verifyOAuthState(cookieValue, 'other-state'), null);
  assert.equal(verifyOAuthState(undefined, state), null);
  assert.equal(verifyOAuthState('', state), null);
  assert.equal(verifyOAuthState(cookieValue, undefined), null);
  assert.equal(verifyOAuthState(cookieValue, ''), null);
  assert.equal(verifyOAuthState(cookieValue, [state, state]), null);
});

test('provider 이름만 담긴 state는 검증을 통과하지 못한다', () => {
  const { cookieValue } = issueOAuthState('google', () => 'expected-state');

  assert.equal(verifyOAuthState(cookieValue, 'google'), null);
  assert.equal(verifyOAuthState(cookieValue, 'kakao'), null);
  assert.equal(verifyOAuthState(cookieValue, 'admin'), null);
});

test('형식이 잘못된 쿠키 값은 검증에 실패한다', () => {
  assert.equal(verifyOAuthState('expected-state', 'expected-state'), null);
  assert.equal(verifyOAuthState('google.', ''), null);
  assert.equal(verifyOAuthState('google.', 'google'), null);
  assert.equal(verifyOAuthState('unknown.expected-state', 'expected-state'), null);
  assert.equal(verifyOAuthState('.expected-state', 'expected-state'), null);
});

test('HTTPS 요청에서만 __Host- 접두사 쿠키 이름을 쓴다', () => {
  assert.equal(getOAuthStateCookieName(true), '__Host-hellogsm-oauth-state');
  assert.equal(getOAuthStateCookieName(false), 'hellogsm-oauth-state');
});

test('허용 목록에 있는 host만 클라이언트 origin으로 인정한다', () => {
  const proxiedHeaders = new Headers({
    host: 'internal-host',
    'x-forwarded-host': 'www.hellogsm.kr',
  });
  assert.equal(resolveClientOrigin(proxiedHeaders), 'https://www.hellogsm.kr');

  const chainedHeaders = new Headers({
    'x-forwarded-host': 'www.stage.hellogsm.kr, proxy.internal',
  });
  assert.equal(resolveClientOrigin(chainedHeaders), 'https://www.stage.hellogsm.kr');

  assert.equal(
    resolveClientOrigin(new Headers({ host: 'localhost:3000' })),
    'http://localhost:3000',
  );
  assert.equal(
    resolveClientOrigin(new Headers({ host: 'WWW.HELLOGSM.KR' })),
    'https://www.hellogsm.kr',
  );

  assert.equal(resolveClientOrigin(new Headers({ 'x-forwarded-host': 'example.com' })), null);
  assert.equal(resolveClientOrigin(new Headers({ host: 'hellogsm-client.vercel.app' })), null);
  assert.equal(resolveClientOrigin(new Headers({ host: 'localhost:3001' })), null);
  assert.equal(resolveClientOrigin(new Headers()), null);
});

test('프로토콜은 프록시 헤더가 아니라 허용 목록의 origin으로 정한다', () => {
  const headers = new Headers({ host: 'www.hellogsm.kr', 'x-forwarded-proto': 'http' });
  const origin = resolveClientOrigin(headers);

  assert.equal(origin, 'https://www.hellogsm.kr');
  assert.equal(isSecureOrigin('https://www.hellogsm.kr'), true);
  assert.equal(isSecureOrigin('http://localhost:3000'), false);
  assert.equal(getOAuthRedirectUri('https://www.hellogsm.kr'), 'https://www.hellogsm.kr/callback');
});

test('Google 인가 URL에 redirect_uri·scope·state를 인코딩해 싣는다', () => {
  const url = new URL(
    buildOAuthAuthorizeUrl({
      provider: 'google',
      clientId: 'google-client-id',
      redirectUri: 'https://www.hellogsm.kr/callback',
      state: 'random-state',
    }),
  );

  assert.equal(url.origin + url.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
  assert.equal(url.searchParams.get('client_id'), 'google-client-id');
  assert.equal(url.searchParams.get('redirect_uri'), 'https://www.hellogsm.kr/callback');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.get('scope'), 'email profile');
  assert.equal(url.searchParams.get('state'), 'random-state');
});

test('Kakao 인가 URL에는 scope 없이 redirect_uri·state를 싣는다', () => {
  const url = new URL(
    buildOAuthAuthorizeUrl({
      provider: 'kakao',
      clientId: 'kakao-rest-api-key',
      redirectUri: 'http://localhost:3000/callback',
      state: 'random-state',
    }),
  );

  assert.equal(url.origin + url.pathname, 'https://kauth.kakao.com/oauth/authorize');
  assert.equal(url.searchParams.get('client_id'), 'kakao-rest-api-key');
  assert.equal(url.searchParams.get('redirect_uri'), 'http://localhost:3000/callback');
  assert.equal(url.searchParams.get('response_type'), 'code');
  assert.equal(url.searchParams.has('scope'), false);
  assert.equal(url.searchParams.get('state'), 'random-state');
});
