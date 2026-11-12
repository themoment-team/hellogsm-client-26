import { expect, test } from './fixtures';

const ADMIN_URL = 'http://localhost:3001';
const CLIENT_URL = 'http://localhost:3000';

test.describe('admin 스모크', () => {
  test('비로그인으로 메인 접근 시 같은 origin의 /signin으로 리다이렉트된다', async ({ page }) => {
    // 회귀 이력(#419~#422): 로그인 리다이렉트가 엉뚱한 origin으로 나가던 버그
    await page.goto(`${ADMIN_URL}/`);

    await page.waitForURL(`${ADMIN_URL}/signin`);
    expect(new URL(page.url()).origin).toBe(ADMIN_URL);
  });

  test('signin 페이지의 로그인 링크가 client origin의 로그인 시작 경로를 가리킨다', async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(`${ADMIN_URL}/signin`);

    expect(response?.status()).toBe(200);

    const loginLink = page.locator('a[href*="/api/auth/oauth"]').first();
    await expect(loginLink).toBeVisible();

    // localhost의 admin은 client origin(localhost:3000)에서 로그인을 시작해야
    // state 쿠키가 client origin의 /callback에서 읽힌다
    const loginUrl = new URL((await loginLink.getAttribute('href')) ?? '');
    expect(loginUrl.origin).toBe(CLIENT_URL);
    expect(loginUrl.searchParams.get('provider')).toBe('google');
    expect(loginUrl.searchParams.get('admin')).toBe('true');

    expect(consoleErrors).toEqual([]);
  });

  test('로그인 시작 경로는 state를 담은 인가 URL로 302 응답한다', async ({ request }) => {
    const response = await request.get(`${CLIENT_URL}/api/auth/oauth?provider=google&admin=true`, {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(302);

    const location = new URL(response.headers()['location'] ?? '');
    expect(location.hostname).toBe('accounts.google.com');
    // client id 누락은 500으로 실패하므로, 302라면 값이 채워져 있어야 한다
    expect(location.searchParams.get('client_id')).toBeTruthy();
    expect(location.searchParams.get('redirect_uri')).toBe(`${CLIENT_URL}/callback`);

    const state = location.searchParams.get('state');
    expect(state).toBeTruthy();

    const setCookie = response.headers()['set-cookie'];
    expect(setCookie).toContain(`admin.${state}`);
    expect(setCookie).toContain('HttpOnly');
  });
});
