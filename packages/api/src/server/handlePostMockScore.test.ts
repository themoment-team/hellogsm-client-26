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
