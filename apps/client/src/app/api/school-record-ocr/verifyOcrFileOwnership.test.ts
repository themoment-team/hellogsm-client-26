import assert from 'node:assert/strict';
import test from 'node:test';

import { verifyOcrFileOwnership } from './verifyOcrFileOwnership';

const BASE_URL = 'http://localhost:8080';

const fetchReturning = (status: number): typeof fetch =>
  (async () => new Response(null, { status })) as unknown as typeof fetch;

test('SESSION 쿠키가 없으면 백엔드를 호출하지 않고 401을 반환한다', async () => {
  let called = false;
  const fetchImpl = (async () => {
    called = true;
    return new Response(null, { status: 200 });
  }) as unknown as typeof fetch;

  const result = await verifyOcrFileOwnership({
    session: undefined,
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/file.pdf',
    fetchImpl,
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, { ok: false, status: 401, message: '로그인이 필요합니다.' });
  assert.equal(called, false);
});

test('본인 소유 objectKey면 백엔드가 200을 반환하고 검증을 통과시킨다', async () => {
  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/file.pdf',
    fetchImpl: fetchReturning(200),
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, { ok: true });
});

test('다른 사용자 소유의 objectKey면 백엔드가 403을 반환하고 안전한 메시지로 거절한다', async () => {
  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F2/file.pdf',
    fetchImpl: fetchReturning(403),
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 403,
    message: '본인이 업로드한 파일만 처리할 수 있어요.',
  });
});

test('존재하지 않거나 만료된 objectKey면 백엔드가 404를 반환하고 재업로드를 안내한다', async () => {
  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/missing.pdf',
    fetchImpl: fetchReturning(404),
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 404,
    message: '업로드된 파일을 찾지 못했어요. 다시 업로드해주세요.',
  });
});

test('세션이 만료됐으면 백엔드가 401을 반환하고 재로그인을 안내한다', async () => {
  const result = await verifyOcrFileOwnership({
    session: 'expired-session',
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/file.pdf',
    fetchImpl: fetchReturning(401),
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, { ok: false, status: 401, message: '로그인이 필요합니다.' });
});

test('업로드 용량 제한을 초과한 objectKey면 백엔드가 413을 반환하고 용량 초과를 안내한다', async () => {
  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/too-big.pdf',
    fetchImpl: fetchReturning(413),
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
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/file.pdf',
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
  const result = await verifyOcrFileOwnership({
    session: 'valid-session',
    path: '/oneseo/v3/extraction/middle-school-achievement/ocr-download-url?objectKey=ocr-uploads%2F1/file.pdf',
    fetchImpl: fetchReturning(500),
    baseUrl: BASE_URL,
  });

  assert.deepEqual(result, {
    ok: false,
    status: 500,
    message: '생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.',
  });
});
