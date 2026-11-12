import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

import { handlePostMockScore, MOCK_SCORE_MAX_BODY_BYTES } from './handlePostMockScore';

const UPSTREAM_URL = 'https://mock-score.test/oneseo/v3/calculate-mock-score';
const API_KEY = 'test-api-key';

const REQUEST_BODY = JSON.stringify({ gedAvgScore: 95.5, graduationType: 'GED' });

const buildRequest = (body: string) =>
  new Request('http://localhost:3000/api/mock-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

const fetchReturning = (body: string, init: ResponseInit) =>
  mock.fn<typeof fetch>(async () => new Response(body, init));

const silenceConsoleError = () => mock.method(console, 'error', () => {});

test('요청 본문을 그대로 X-HG-API-KEY 헤더와 함께 업스트림에 전달하고, 상태 코드와 JSON 본문을 그대로 돌려준다', async () => {
  const upstreamBody = JSON.stringify({ totalScore: 250.5, generalSubjectsScore: 180 });
  const spy = fetchReturning(upstreamBody, {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'X-Upstream-Trace': 'trace-1' },
  });

  const response = await handlePostMockScore({
    request: buildRequest(REQUEST_BODY),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });

  assert.equal(spy.mock.callCount(), 1);
  const call = spy.mock.calls[0];
  assert.ok(call);
  const [url, init] = call.arguments;
  assert.equal(url.toString(), UPSTREAM_URL);
  assert.equal(init?.method, 'POST');
  assert.equal(init?.body, REQUEST_BODY);
  const headers = init?.headers as Record<string, string>;
  assert.equal(headers['X-HG-API-KEY'], API_KEY);
  assert.equal(headers['Content-Type'], 'application/json');

  assert.equal(response.status, 200);
  assert.equal(await response.text(), upstreamBody);
  assert.equal(response.headers.get('content-type'), 'application/json');
  // 업스트림의 다른 응답 헤더는 전달하지 않는다
  assert.equal(response.headers.get('x-upstream-trace'), null);
});

const missingEnvCases = [
  { name: 'MOCK_SCORE_URL', upstreamUrl: undefined, apiKey: API_KEY },
  { name: 'MOCK_SCORE_API_KEY', upstreamUrl: UPSTREAM_URL, apiKey: undefined },
];

for (const { name, upstreamUrl, apiKey } of missingEnvCases) {
  test(`${name} 환경변수가 없으면 업스트림을 호출하지 않고 500을 반환한다`, async () => {
    const spy = fetchReturning('{}', { status: 200 });
    const consoleError = silenceConsoleError();

    const response = await handlePostMockScore({
      request: buildRequest(REQUEST_BODY),
      upstreamUrl,
      apiKey,
      fetchImpl: spy as unknown as typeof fetch,
    });
    consoleError.mock.restore();

    assert.equal(spy.mock.callCount(), 0);
    assert.equal(response.status, 500);
    const body = await response.json();
    assert.equal(body.code, 500);
    assert.equal(typeof body.message, 'string');
  });
}

const invalidBodyCases = [
  { name: 'JSON 파싱에 실패하면', body: '{"gedAvgScore": 95.5,' },
  { name: '본문이 비어 있으면', body: '' },
  { name: '본문이 객체가 아니면(배열)', body: '[1, 2, 3]' },
  { name: '본문이 객체가 아니면(null)', body: 'null' },
];

for (const { name, body } of invalidBodyCases) {
  test(`${name} 업스트림을 호출하지 않고 400을 반환한다`, async () => {
    const spy = fetchReturning('{}', { status: 200 });

    const response = await handlePostMockScore({
      request: buildRequest(body),
      upstreamUrl: UPSTREAM_URL,
      apiKey: API_KEY,
      fetchImpl: spy as unknown as typeof fetch,
    });

    assert.equal(spy.mock.callCount(), 0);
    assert.equal(response.status, 400);
  });
}

test('본문이 크기 상한을 넘으면 업스트림을 호출하지 않고 413을 반환한다', async () => {
  const spy = fetchReturning('{}', { status: 200 });
  const oversized = JSON.stringify({ padding: 'a'.repeat(MOCK_SCORE_MAX_BODY_BYTES) });

  const response = await handlePostMockScore({
    request: buildRequest(oversized),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });

  assert.equal(spy.mock.callCount(), 0);
  assert.equal(response.status, 413);
});

test('content-length 없이 스트림으로 들어온 본문도 상한을 넘는 순간 읽기를 멈추고 413을 반환한다', async () => {
  const spy = fetchReturning('{}', { status: 200 });
  const chunk = new Uint8Array(1024).fill(0x61);
  let pullCount = 0;
  let cancelled = false;
  // 끝나지 않는 본문. 상한에서 읽기를 멈추지 않으면 이 테스트는 끝나지 않는다.
  const endlessBody = new ReadableStream<Uint8Array>({
    pull(controller) {
      pullCount += 1;
      controller.enqueue(chunk);
    },
    cancel() {
      cancelled = true;
    },
  });
  const request = new Request('http://localhost:3000/api/mock-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: endlessBody,
    duplex: 'half',
  } as RequestInit);
  assert.equal(request.headers.get('content-length'), null);

  const response = await handlePostMockScore({
    request,
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });

  assert.equal(spy.mock.callCount(), 0);
  assert.equal(response.status, 413);
  assert.ok(cancelled, '상한을 넘으면 본문 스트림을 취소한다');
  // 상한(32KiB)을 넘는 첫 청크까지만 읽는다. 스트림 내부 버퍼링 몫으로 약간의 여유를 둔다.
  assert.ok(
    pullCount <= MOCK_SCORE_MAX_BODY_BYTES / chunk.byteLength + 3,
    `pullCount=${pullCount}`,
  );
});

test('본문이 정확히 크기 상한이면 거르지 않고 업스트림에 전달한다', async () => {
  const spy = fetchReturning('{}', { status: 200 });
  const base = JSON.stringify({ gedAvgScore: 95.5, graduationType: 'GED', padding: '' });
  const exact = base.replace(
    '"padding":""',
    `"padding":"${'a'.repeat(MOCK_SCORE_MAX_BODY_BYTES - base.length)}"`,
  );
  assert.equal(new TextEncoder().encode(exact).byteLength, MOCK_SCORE_MAX_BODY_BYTES);

  const response = await handlePostMockScore({
    request: buildRequest(exact),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });

  assert.equal(spy.mock.callCount(), 1);
  assert.equal(response.status, 200);
});

test('여러 바이트 문자가 청크 경계에서 나뉘어도 본문을 깨뜨리지 않고 전달한다', async () => {
  const spy = fetchReturning('{}', { status: 200 });
  const text = JSON.stringify({ graduationType: 'GED', gedAvgScore: 95.5, note: '자유학기제' });
  const bytes = new TextEncoder().encode(text);
  // 한 바이트씩 흘려보내 한글(3바이트)이 반드시 청크 경계에서 나뉘게 한다.
  const byteStream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
      controller.close();
    },
  });

  await handlePostMockScore({
    request: new Request('http://localhost:3000/api/mock-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: byteStream,
      duplex: 'half',
    } as RequestInit),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });

  assert.equal(spy.mock.callCount(), 1);
  assert.equal(spy.mock.calls[0]?.arguments[1]?.body, text);
});

test('업스트림이 오류 상태와 JSON 본문을 돌려주면 그 상태 코드와 본문을 그대로 전달한다', async () => {
  const upstreamBody = JSON.stringify({
    code: 400,
    message: '성적 입력값이 올바르지 않습니다.',
    status: 'BAD_REQUEST',
  });
  const spy = fetchReturning(upstreamBody, { status: 400 });

  const response = await handlePostMockScore({
    request: buildRequest(REQUEST_BODY),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });

  assert.equal(spy.mock.callCount(), 1);
  assert.equal(response.status, 400);
  assert.equal(await response.text(), upstreamBody);
});

test('업스트림이 JSON이 아닌 오류 본문을 돌려주면 상태 코드는 유지하고 공통 오류 형식으로 응답한다', async () => {
  const spy = fetchReturning('<html>Service Unavailable</html>', { status: 503 });
  const consoleError = silenceConsoleError();

  const response = await handlePostMockScore({
    request: buildRequest(REQUEST_BODY),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });
  consoleError.mock.restore();

  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, 503);
});

test('업스트림 호출이 네트워크 오류로 실패하면 502를 반환한다', async () => {
  const spy = mock.fn<typeof fetch>(async () => {
    throw new TypeError('fetch failed');
  });
  const consoleError = silenceConsoleError();

  const response = await handlePostMockScore({
    request: buildRequest(REQUEST_BODY),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
  });
  consoleError.mock.restore();

  assert.equal(spy.mock.callCount(), 1);
  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, 502);
});

test('업스트림이 대기 상한 안에 응답하지 않으면 요청을 중단하고 502를 반환한다', async () => {
  let aborted = false;
  // 응답하지 않는 업스트림. abort 신호를 받을 때만 실패한다.
  const spy = mock.fn<typeof fetch>(
    (_input, init) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          aborted = true;
          reject(init.signal?.reason);
        });
      }),
  );
  const consoleError = silenceConsoleError();

  const response = await handlePostMockScore({
    request: buildRequest(REQUEST_BODY),
    upstreamUrl: UPSTREAM_URL,
    apiKey: API_KEY,
    fetchImpl: spy as unknown as typeof fetch,
    timeoutMs: 20,
  });
  consoleError.mock.restore();

  assert.equal(spy.mock.callCount(), 1);
  assert.ok(aborted, '대기 상한이 지나면 업스트림 요청을 abort한다');
  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, 502);
});
