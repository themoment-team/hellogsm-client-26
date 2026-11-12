import { handlePostMockScore } from '@repo/api/server';

// 원서 수정 화면(/edit/[memberId]) 4단계의 "내 성적 계산하기"가 쓰는 모의 성적 계산 요청을
// 서버 전용 환경변수로 대신 전달한다. 공통 로직은 packages/api/src/server/handlePostMockScore.ts
// 참고(client 앱의 같은 경로 라우트와 공유).
export const runtime = 'nodejs';

// 업스트림 대기 상한(MOCK_SCORE_UPSTREAM_TIMEOUT_MS, 10초)보다 여유 있게 잡아, 업스트림이 느려도
// 플랫폼이 함수를 끊기 전에 handler가 만든 502 JSON이 먼저 나가게 한다.
export const maxDuration = 15;

export async function POST(request: Request) {
  return handlePostMockScore({
    request,
    upstreamUrl: process.env.MOCK_SCORE_URL,
    apiKey: process.env.MOCK_SCORE_API_KEY,
  });
}
