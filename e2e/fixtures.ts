import { test as base, expect } from '@playwright/test';

/**
 * 페이지의 JS 콘솔 에러를 수집하는 fixture.
 * 네트워크 리소스 로드 실패("Failed to load resource")는 백엔드 상태에 따라
 * 흔들리는 노이즈라 스모크에서는 제외하고, 순수 JS 에러만 잡는다.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('Failed to load resource')) {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });
    await use(errors);
  },
});

export { expect };
