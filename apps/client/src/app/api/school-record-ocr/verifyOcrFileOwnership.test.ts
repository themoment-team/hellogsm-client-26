import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

import { verifyOcrFileOwnership } from './verifyOcrFileOwnership';

const BASE_URL = 'http://localhost:8080';
const PATH = `/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=${encodeURIComponent('ocr-uploads/1/file.pdf')}`;

const fetchSpy = (status: number) =>
  mock.fn<typeof fetch>(async () => new Response(null, { status }));

const assertRequestedOwnershipCheck = (
  spy: ReturnType<typeof fetchSpy>,
  session: string,
  path: string,
) => {
  assert.equal(spy.mock.callCount(), 1);
  const call = spy.mock.calls[0];
  assert.ok(call);
  const [url, init] = call.arguments;
  assert.equal(url.toString(), new URL(path, BASE_URL).toString());
  assert.equal(init?.method, 'POST');
  assert.equal((init?.headers as Record<string, string>).Cookie, `SESSION=${session}`);
};

test('SESSION 쿠키가 없으면 백엔드를 호출하지 않고 401을 반환한다', async () => {
  const spy = fetchSpy(200);

  const result = await verifyOcrFileOwnership({
    session: undefined,
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, { ok: false, status: 401, message: '로그인이 필요합니다.' });
  assert.equal(spy.mock.callCount(), 0);
});

test('본인 소유 objectKey면 encoded 경로로 POST·SESSION 쿠키를 담아 검증을 요청하고 통과시킨다', async () => {
  const spy = fetchSpy(200);

  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, { ok: true });
  assertRequestedOwnershipCheck(spy, 'valid-session', PATH);
});

test('다른 사용자 소유의 objectKey면 동일한 요청 계약으로 검증을 요청하고 403을 안전한 메시지로 거절한다', async () => {
  const spy = fetchSpy(403);

  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 403,
    message: '본인이 업로드한 파일만 처리할 수 있어요.',
  });
  assertRequestedOwnershipCheck(spy, 'valid-session', PATH);
});

test('존재하지 않거나 만료된 objectKey면 백엔드가 404를 반환하고 재업로드를 안내한다', async () => {
  const spy = fetchSpy(404);

  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 404,
    message: '업로드된 파일을 찾지 못했어요. 다시 업로드해주세요.',
  });
});

test('세션이 만료됐으면 백엔드가 401을 반환하고 재로그인을 안내한다', async () => {
  const spy = fetchSpy(401);

  const result = await verifyOcrFileOwnership({
    session: 'expired-session',
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, { ok: false, status: 401, message: '로그인이 필요합니다.' });
});

test('업로드 용량 제한을 초과한 objectKey면 백엔드가 413을 반환하고 용량 초과를 안내한다', async () => {
  const spy = fetchSpy(413);

  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 413,
    message: '파일 용량은 30MB 이하만 지원합니다.',
  });
});

test('백엔드 호출이 예외로 실패하면 502로 처리해 Lambda 호출을 막는다', async () => {
  const fetchImpl = (async () => {
    throw new Error('network error');
  }) as unknown as typeof fetch;

  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: PATH,
    fetchImpl,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 502,
    message: '생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.',
  });
});

test('백엔드가 예상 밖의 상태 코드를 반환하면 500 일반 오류로 처리한다', async () => {
  const spy = fetchSpy(500);

  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: PATH,
    fetchImpl: spy as unknown as typeof fetch,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 500,
    message: '생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.',
  });
});
