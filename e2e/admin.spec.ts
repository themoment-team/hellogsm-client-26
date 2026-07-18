import { expect, test } from './fixtures';

const ADMIN_URL = 'http://localhost:3001';

test.describe('admin 스모크', () => {
  test('비로그인으로 메인 접근 시 같은 origin의 /signin으로 리다이렉트된다', async ({ page }) => {
    // 회귀 이력(#419~#422): 로그인 리다이렉트가 엉뚱한 origin으로 나가던 버그
    await page.goto(`${ADMIN_URL}/`);

    await page.waitForURL(`${ADMIN_URL}/signin`);
    expect(new URL(page.url()).origin).toBe(ADMIN_URL);
  });

  test('signin 페이지의 OAuth redirect_uri가 현재 origin 기반으로 생성된다', async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(`${ADMIN_URL}/signin`);

    expect(response?.status()).toBe(200);

    const loginLink = page
      .locator('a[href*="accounts.google.com"], a[href*="kauth.kakao.com"]')
      .first();
    await expect(loginLink).toBeVisible();

    // localhost의 admin은 client origin(localhost:3000)의 /callback으로 보내야 한다
    const href = await loginLink.getAttribute('href');
    expect(href).toContain('redirect_uri=http://localhost:3000/callback');

    expect(consoleErrors).toEqual([]);
  });
});
