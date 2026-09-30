import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { oneseoUrl } from '@repo/api/lib';

import { handlePostSchoolRecordOcr } from './handlePostSchoolRecordOcr';

// OCR 자체(kordoc + onnxruntime-node/sharp/@napi-rs/canvas 네이티브 바이너리)는 Vercel
// 서버리스 함수의 250MB 크기 제한에 계속 부딪혀 별도 Lambda 컨테이너 이미지로 분리했다
// (apps/ocr-lambda 참고). 이 라우트는 인증·소유권 검증만 하고 objectKey를 그대로 Lambda에
// 동기 호출로 넘긴 뒤 결과를 그대로 중계한다.
export const runtime = 'nodejs';

// Lambda 실행 시간(최대 120초, apps/ocr-lambda/README 참고)보다 여유 있게 잡는다.
export const maxDuration = 150;

export async function POST(request: NextRequest) {
  const { objectKey } = (await request.json().catch(() => ({}))) as { objectKey?: string };
  const session = (await cookies()).get('SESSION')?.value;
  return handlePostSchoolRecordOcr({
    objectKey,
    session,
    buildOwnershipPath: oneseoUrl.postSchoolRecordOcrDownloadUrl,
  });
}
