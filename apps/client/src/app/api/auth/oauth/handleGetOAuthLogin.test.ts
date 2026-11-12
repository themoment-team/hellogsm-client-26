import assert from 'node:assert/strict';
import { test } from 'node:test';

import { handleGetOAuthLogin } from './handleGetOAuthLogin';
import { verifyOAuthState } from './oauthState';

const clientIds = { google: 'google-client-id', kakao: 'kakao-rest-api-key' };

const httpsHeaders = new Headers({ 'x-forwarded-host': 'www.hellogsm.kr' });

const localHeaders = new Headers({ host: 'localhost:3000' });

const parseSetCookie = (response: Response) => {
  const header = response.headers.get('set-cookie');
  assert.ok(header, 'Set-Cookie 헤더가 있어야 한다');
  const [pair = '', ...attributeParts] = header.split(';').map((part) => part.trim());
  const separatorIndex = pair.indexOf('=');
  const attributes = new Map(
    attributeParts.map((part) => {
      const [key = '', value = ''] = part.split('=');
      return [key, value] as const;
    }),
  );
  return {
    name: pair.slice(0, separatorIndex),
    value: decodeURIComponent(pair.slice(separatorIndex + 1)),
    attributes,
  };
};

test('HTTPS면 __Host- 쿠키와 같은 state로 Google 인가 URL에 302 리다이렉트한다', () => {
  const response = handleGetOAuthLogin({
    provider: 'google',
    isAdmin: false,
    headers: httpsHeaders,
    clientIds,
    generateState: () => 'random-state',
  });

  assert.equal(response.status, 302);
  assert.equal(response.headers.get('cache-control'), 'no-store');

  const location = new URL(response.headers.get('location') ?? '');
  assert.equal(location.origin + location.pathname, 'https://accounts.google.com/o/oauth2/v2/auth');
  assert.equal(location.searchParams.get('client_id'), 'google-client-id');
  assert.equal(location.searchParams.get('redirect_uri'), 'https://www.hellogsm.kr/callback');
  assert.equal(location.searchParams.get('state'), 'random-state');

  const cookie = parseSetCookie(response);
  assert.equal(cookie.name, '__Host-hellogsm-oauth-state');
  assert.equal(verifyOAuthState(cookie.value, 'random-state'), 'google');
  assert.equal(cookie.attributes.get('Path'), '/');
  assert.equal(cookie.attributes.get('Max-Age'), '600');
  assert.equal(cookie.attributes.get('SameSite')?.toLowerCase(), 'lax');
  assert.ok(cookie.attributes.has('HttpOnly'));
  assert.ok(cookie.attributes.has('Secure'));
  assert.equal(cookie.attributes.has('Domain'), false);
});

test('로컬 http면 Secure 없는 일반 이름 쿠키를 심고 요청 origin으로 redirect_uri를 만든다', () => {
  const response = handleGetOAuthLogin({
    provider: 'kakao',
    isAdmin: false,
    headers: localHeaders,
    clientIds,
    generateState: () => 'random-state',
  });

  assert.equal(response.status, 302);
  const location = new URL(response.headers.get('location') ?? '');
  assert.equal(location.origin + location.pathname, 'https://kauth.kakao.com/oauth/authorize');
  assert.equal(location.searchParams.get('client_id'), 'kakao-rest-api-key');
  assert.equal(location.searchParams.get('redirect_uri'), 'http://localhost:3000/callback');
  assert.equal(location.searchParams.get('state'), 'random-state');

  const cookie = parseSetCookie(response);
  assert.equal(cookie.name, 'hellogsm-oauth-state');
  assert.equal(verifyOAuthState(cookie.value, 'random-state'), 'kakao');
  assert.ok(cookie.attributes.has('HttpOnly'));
  assert.equal(cookie.attributes.has('Secure'), false);
});

test('어드민 로그인은 Google 인가 URL로 보내고 쿠키에 admin flow를 저장한다', () => {
  const response = handleGetOAuthLogin({
    provider: 'google',
    isAdmin: true,
    headers: localHeaders,
    clientIds,
    generateState: () => 'random-state',
  });

  assert.equal(response.status, 302);
  const location = new URL(response.headers.get('location') ?? '');
  assert.equal(location.hostname, 'accounts.google.com');
  assert.equal(location.searchParams.get('redirect_uri'), 'http://localhost:3000/callback');
  assert.equal(location.searchParams.get('state'), 'random-state');

  const cookie = parseSetCookie(response);
  assert.equal(verifyOAuthState(cookie.value, 'random-state'), 'admin');
});

test('지원하지 않는 provider나 조합이면 쿠키 없이 400을 응답한다', () => {
  for (const [provider, isAdmin] of [
    ['unknown', false],
    [null, false],
    ['kakao', true],
  ] as const) {
    const response = handleGetOAuthLogin({ provider, isAdmin, headers: httpsHeaders, clientIds });

    assert.equal(response.status, 400);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
  }
});

test('제공자 client id가 비어 있으면 리다이렉트·쿠키 없이 500을 응답하고 서버 로그를 남긴다', (t) => {
  const consoleError = t.mock.method(console, 'error', () => {});

  for (const [provider, isAdmin, expectedProvider] of [
    ['google', false, 'google'],
    ['google', true, 'google'],
    ['kakao', false, 'kakao'],
  ] as const) {
    const response = handleGetOAuthLogin({
      provider,
      isAdmin,
      headers: httpsHeaders,
      clientIds: { google: '', kakao: '' },
    });

    assert.equal(response.status, 500);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
    assert.deepEqual(consoleError.mock.calls.at(-1)?.arguments[1], {
      provider: expectedProvider,
    });
  }
  assert.equal(consoleError.mock.callCount(), 3);
});

test('요청 host를 알 수 없거나 허용 목록에 없으면 쿠키 없이 400을 응답한다', () => {
  for (const headers of [
    new Headers(),
    new Headers({ 'x-forwarded-host': 'example.com' }),
    new Headers({ host: 'hellogsm-client.vercel.app' }),
  ]) {
    const response = handleGetOAuthLogin({
      provider: 'google',
      isAdmin: false,
      headers,
      clientIds,
    });

    assert.equal(response.status, 400);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('set-cookie'), null);
  }
});
