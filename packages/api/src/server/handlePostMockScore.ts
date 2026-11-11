/**
 * 모의 성적 계산 API(`/oneseo/calculate`, 원서 작성·수정 4단계의 "내 성적 계산하기")를 서버에서
 * 대신 호출하는 Route Handler 공통 로직. API 키를 서버 전용 환경변수(MOCK_SCORE_API_KEY)로
 * 옮기면서 브라우저는 같은 origin의 `/api/mock-score`로만 요청한다. client·admin 앱의
 * `app/api/mock-score/route.ts`가 환경변수를 읽어 이 함수에 넘긴다.
 *
 * 서버 전용 모듈이라 `@repo/api/server`로만 노출하고 hooks·apis·lib 진입점에서는 re-export하지
 * 않는다. 'use client' 파일에서는 import하지 않는다.
 *
 * `next/server`에 의존하지 않고 표준 Request/Response만 쓴다. 그래서 Next 런타임 없이
 * tsx/node:test로 바로 단위 테스트할 수 있다.
 */

/** 모의 성적 계산 요청은 성적 배열 몇 개라 수 KB를 넘지 않는다. 넉넉하게 잡은 상한. */
export const MOCK_SCORE_MAX_BODY_BYTES = 32 * 1024;

/** 업스트림 응답 대기 상한. 넘기면 네트워크 오류와 같이 502로 응답한다. */
export const MOCK_SCORE_UPSTREAM_TIMEOUT_MS = 10_000;

const UPSTREAM_FAILURE_MESSAGE = '성적을 계산하지 못했어요. 잠시 후 다시 시도해주세요.';

// 백엔드(Java) 오류 응답과 같은 {code, message, status} 형식(school-record-ocr 라우트와 동일).
const errorResponse = (message: string, status: number) =>
  Response.json({ code: status, message, status: `${status}` }, { status });

const isJson = (text: string) => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

const isJsonObject = (text: string) => {
  try {
    const value: unknown = JSON.parse(text);
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  } catch {
    return false;
  }
};

export interface HandlePostMockScoreParams {
  request: Request;
  /** 서버 전용 환경변수 MOCK_SCORE_URL */
  upstreamUrl: string | undefined;
  /** 서버 전용 환경변수 MOCK_SCORE_API_KEY. X-HG-API-KEY 헤더로 실어 보낸다. */
  apiKey: string | undefined;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

/**
 * 요청 본문을 검증한 뒤 그대로 업스트림에 전달하고, 업스트림의 상태 코드와 JSON 본문을 그대로
 * 돌려준다. 업스트림의 다른 응답 헤더는 전달하지 않고 Content-Type만 새로 붙인다.
 */
export const handlePostMockScore = async ({
  request,
  upstreamUrl,
  apiKey,
  fetchImpl = fetch,
  timeoutMs = MOCK_SCORE_UPSTREAM_TIMEOUT_MS,
}: HandlePostMockScoreParams): Promise<Response> => {
  if (!upstreamUrl || !apiKey) {
    // eslint-disable-next-line no-console
    console.error('[mock-score] MOCK_SCORE_URL 또는 MOCK_SCORE_API_KEY 환경변수가 설정되지 않음');
    return errorResponse('모의 성적 계산 서비스가 설정되지 않았어요.', 500);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MOCK_SCORE_MAX_BODY_BYTES) {
    return errorResponse('요청 본문이 너무 커요.', 413);
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return errorResponse('요청 본문을 읽지 못했어요.', 400);
  }

  if (new TextEncoder().encode(body).byteLength > MOCK_SCORE_MAX_BODY_BYTES) {
    return errorResponse('요청 본문이 너무 커요.', 413);
  }

  if (!isJsonObject(body)) {
    return errorResponse('요청 본문이 올바른 JSON 형식이 아니에요.', 400);
  }

  let upstream: Response;
  let upstreamBody: string;
  try {
    upstream = await fetchImpl(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-HG-API-KEY': apiKey,
      },
      body,
      signal: AbortSignal.timeout(timeoutMs),
    });
    upstreamBody = await upstream.text();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[mock-score] 모의 성적 계산 API 호출 실패', error);
    return errorResponse(UPSTREAM_FAILURE_MESSAGE, 502);
  }

  if (!isJson(upstreamBody)) {
    // eslint-disable-next-line no-console
    console.error('[mock-score] 모의 성적 계산 API 응답이 JSON이 아님', upstream.status);
    return errorResponse(UPSTREAM_FAILURE_MESSAGE, upstream.status >= 400 ? upstream.status : 502);
  }

  return new Response(upstreamBody, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
