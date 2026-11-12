import type { Page } from '@playwright/test';

import { expect, test } from './fixtures';

const CLIENT_URL = 'http://localhost:3000';

/** step이 null이면 최종 제출된 원서로 보고 마이페이지에 관련서류 다운로드 영역이 노출된다. */
const submittedOneseo = {
  oneseoId: 1,
  submitCode: 'A-1',
  wantedScreening: 'GENERAL',
  desiredMajors: { firstDesiredMajor: 'SW', secondDesiredMajor: 'AI', thirdDesiredMajor: 'IOT' },
  step: null,
};

/** 건강검진 결핵검사 안내 팝업의 "오늘 하루 그만보기" 저장 키 */
const TUBERCULOSIS_NOTICE_HIDE_KEY = 'hideTuberculosisTestNoticeDialog';

const TUBERCULOSIS_NOTICE_TITLE = '건강검진 결핵검사 안내';

test.describe('마이페이지 건강검진 결핵검사 안내 팝업', () => {
  const mockSecondTestResult = async (page: Page, secondTestPassYn: 'YES' | 'NO') => {
    await page.route('**/api/member/v3/second-test-result/me', (route) =>
      route.fulfill({ json: { data: { secondTestPassYn, decidedMajor: 'SW' } } }),
    );
  };

  test('최종 합격자에게 팝업이 뜨고 확인을 누르면 닫힌다', async ({ page }) => {
    await mockSecondTestResult(page, 'YES');
    await page.goto(`${CLIENT_URL}/mypage`);

    const dialog = page.getByRole('dialog', { name: TUBERCULOSIS_NOTICE_TITLE });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: '확인', exact: true }).click();
    await expect(dialog).toBeHidden();
  });

  test('"오늘 하루 그만보기"를 누르면 다시 들어와도 당일에는 뜨지 않는다', async ({ page }) => {
    await mockSecondTestResult(page, 'YES');
    await page.goto(`${CLIENT_URL}/mypage`);

    const dialog = page.getByRole('dialog', { name: TUBERCULOSIS_NOTICE_TITLE });
    await dialog.getByRole('button', { name: '오늘 하루 그만보기', exact: true }).click();
    await expect(dialog).toBeHidden();

    const hiddenDate = await page.evaluate(
      (key) => localStorage.getItem(key),
      TUBERCULOSIS_NOTICE_HIDE_KEY,
    );
    expect(hiddenDate).toBe(await page.evaluate(() => new Date().toDateString()));

    // 결과 응답이 도착한 뒤에도 팝업이 열리지 않아야 한다.
    const resultResponse = page.waitForResponse('**/api/member/v3/second-test-result/me');
    await page.reload();
    await resultResponse;
    await expect(dialog).toBeHidden();
  });

  test('최종 합격자가 아니면 팝업이 뜨지 않는다', async ({ page }) => {
    await mockSecondTestResult(page, 'NO');
    const resultResponse = page.waitForResponse('**/api/member/v3/second-test-result/me');
    await page.goto(`${CLIENT_URL}/mypage`);
    await resultResponse;

    await expect(page.getByRole('dialog', { name: TUBERCULOSIS_NOTICE_TITLE })).toBeHidden();
  });
});

test.describe('마이페이지 관련서류 다운로드', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.route('**/api/oneseo/v3/oneseo/me', (route) =>
      route.fulfill({ json: { data: submittedOneseo } }),
    );
    // 새 탭에서 열리는 요청까지 잡기 위해 context 단위로 CDN 파일 응답을 고정한다.
    await context.route('**/*.hwp', (route) =>
      route.fulfill({ contentType: 'application/x-hwp', body: 'hwp' }),
    );
  });

  test('같은 파일을 반복해서 클릭해도 매번 다운로드를 요청한다', async ({
    page,
    context,
    consoleErrors,
  }) => {
    const fileRequests: string[] = [];
    context.on('request', (request) => {
      if (request.url().endsWith('.hwp')) fileRequests.push(request.url());
    });

    await page.goto(`${CLIENT_URL}/mypage`);

    const downloadButtons = page.getByRole('button', { name: '다운로드', exact: true });
    await expect(downloadButtons).toHaveCount(3);

    // 1번(유형별 제출서류 안내 파일) 두 번, 3번(제출서류 양식) 한 번
    for (const index of [0, 0, 2]) {
      const before = fileRequests.length;
      await downloadButtons.nth(index).click();
      await expect.poll(() => fileRequests.length).toBe(before + 1);
    }

    // 안내 파일과 제출서류 양식은 서로 다른 파일을 받아야 한다.
    expect(fileRequests[0]).toBe(fileRequests[1]);
    expect(fileRequests[2]).not.toBe(fileRequests[0]);

    await expect(page).toHaveURL(`${CLIENT_URL}/mypage`);
    expect(consoleErrors).toEqual([]);
  });

  test('입학원서 버튼은 출력 페이지로 이동한다', async ({ page }) => {
    await page.goto(`${CLIENT_URL}/mypage`);

    await page.getByRole('button', { name: '다운로드', exact: true }).nth(1).click();

    await expect(page).toHaveURL(`${CLIENT_URL}/print`);
  });
});
