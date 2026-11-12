import { handlePostMockScore } from '@repo/api/server';

// 모의 성적 계산 요청(/oneseo/calculate, 원서 작성 4단계)을 서버 전용 환경변수(MOCK_SCORE_*)로 대신 전달한다.
// 로그인 없이 쓰는 기능이라 인증을 요구하지 않는다. 공통 로직은
// packages/api/src/server/handlePostMockScore.ts 참고(admin 앱의 같은 경로 라우트와 공유).
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return handlePostMockScore({
    request,
    upstreamUrl: process.env.MOCK_SCORE_URL,
    apiKey: process.env.MOCK_SCORE_API_KEY,
  });
}
