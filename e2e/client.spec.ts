import type { APIRequestContext, BrowserContext, Page } from '@playwright/test';

import { expect, test } from './fixtures';

const CLIENT_URL = 'http://localhost:3000';

// 로그인 시작 경로에서 state와 state 쿠키를 받아 브라우저 context에 심는다.
const startOAuthLogin = async (
  request: APIRequestContext,
  context: BrowserContext,
  query: string,
) => {
  const response = await request.get(`${CLIENT_URL}/api/auth/oauth?${query}`, {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(302);

  const state = new URL(response.headers()['location'] ?? '').searchParams.get('state') ?? '';
  expect(state).toBeTruthy();

  const [cookiePair = ''] = (response.headers()['set-cookie'] ?? '').split(';');
  const separatorIndex = cookiePair.indexOf('=');
  const cookieName = cookiePair.slice(0, separatorIndex);
  await context.addCookies([
    { name: cookieName, value: cookiePair.slice(separatorIndex + 1), url: CLIENT_URL },
  ]);

  return { state, cookieName };
};

// 백엔드로 보내지 않고 브라우저에서 응답해, 콜백이 보낸 로그인 요청만 기록한다.
const recordLoginRequests = async (page: Page) => {
  const loginRequests: { pathname: string; body: unknown }[] = [];
  await page.route('**/auth/v3/auth/**', async (route) => {
    loginRequests.push({
      pathname: new URL(route.request().url()).pathname,
      body: route.request().postDataJSON(),
    });
    await route.fulfill({ status: 400, json: { message: 'e2e' } });
  });
  return loginRequests;
};

const hasCookie = async (context: BrowserContext, name: string) =>
  (await context.cookies(CLIENT_URL)).some((cookie) => cookie.name === name);

test.describe('client 스모크', () => {
  test('메인 페이지가 렌더된다', async ({ page, consoleErrors }) => {
    const response = await page.goto(`${CLIENT_URL}/`);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/광주소프트웨어마이스터고등학교/);
    expect(consoleErrors).toEqual([]);
  });

  test('FAQ 페이지가 렌더된다', async ({ page, consoleErrors }) => {
    const response = await page.goto(`${CLIENT_URL}/faq`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('원서 조회 페이지가 렌더된다', async ({ page, consoleErrors }) => {
    const response = await page.goto(`${CLIENT_URL}/check-result`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('회원가입 페이지가 렌더된다', async ({ page, consoleErrors }) => {
    const response = await page.goto(`${CLIENT_URL}/signup`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('state 쿠키 없는 callback은 로그인 요청 없이 메인으로 이동한다', async ({ page }) => {
    const loginRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/auth/v3/auth/')) loginRequests.push(request.url());
    });

    await page.goto(`${CLIENT_URL}/callback?code=test-code&state=google`);

    await page.waitForURL(`${CLIENT_URL}/`);
    await expect(page.getByText('로그인에 실패했습니다.')).toBeVisible();
    expect(loginRequests).toEqual([]);
  });

  for (const { flow, query, loginPath } of [
    { flow: 'google', query: 'provider=google', loginPath: '/api/auth/v3/auth/google' },
    { flow: 'kakao', query: 'provider=kakao', loginPath: '/api/auth/v3/auth/kakao' },
    { flow: 'admin', query: 'provider=google&admin=true', loginPath: '/api/auth/v3/auth/google' },
  ]) {
    test(`발급한 state와 일치하는 callback은 로그인 요청을 1회 보내고 state 쿠키를 지운다 (${flow})`, async ({
      page,
      context,
      request,
    }) => {
      const { state, cookieName } = await startOAuthLogin(request, context, query);
      const loginRequests = await recordLoginRequests(page);
      const callbackUrl = `${CLIENT_URL}/callback?code=test-code&${new URLSearchParams({ state }).toString()}`;

      await page.goto(callbackUrl);

      await expect.poll(() => loginRequests.length).toBe(1);
      expect(loginRequests[0]).toEqual({
        pathname: loginPath,
        body: { code: 'test-code', redirectUri: `${CLIENT_URL}/callback` },
      });
      await page.waitForURL(`${CLIENT_URL}/`);
      expect(await hasCookie(context, cookieName)).toBe(false);

      // state 쿠키는 한 번만 쓰이므로 같은 callback으로 다시 와도 로그인 요청을 보내지 않는다
      await page.goto(callbackUrl);
      await page.waitForURL(`${CLIENT_URL}/`);
      expect(loginRequests).toHaveLength(1);
    });
  }

  test('state가 다른 callback은 로그인 요청 없이 실패하고 state 쿠키를 지운다', async ({
    page,
    context,
    request,
  }) => {
    const { cookieName } = await startOAuthLogin(request, context, 'provider=google');
    const loginRequests = await recordLoginRequests(page);

    await page.goto(`${CLIENT_URL}/callback?code=test-code&state=other-state`);

    await page.waitForURL(`${CLIENT_URL}/`);
    await expect(page.getByText('로그인에 실패했습니다.')).toBeVisible();
    expect(loginRequests).toEqual([]);
    expect(await hasCookie(context, cookieName)).toBe(false);
  });
});
