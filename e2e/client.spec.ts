import { expect, test } from './fixtures';

const CLIENT_URL = 'http://localhost:3000';

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
});
