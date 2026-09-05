import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { memberUrl } from '@repo/api/lib';

// OCR 자체(kordoc + onnxruntime-node/sharp/@napi-rs/canvas 네이티브 바이너리)는 Vercel
// 서버리스 함수의 250MB 크기 제한에 계속 부딪혀 별도 Lambda 컨테이너 이미지로 분리했다
// (apps/ocr-lambda 참고). 이 라우트는 인증만 하고 objectKey를 그대로 Lambda에 동기
// 호출로 넘긴 뒤 결과를 그대로 중계한다.
export const runtime = 'nodejs';

// Lambda 실행 시간(최대 120초, apps/ocr-lambda/README 참고)보다 여유 있게 잡는다.
export const maxDuration = 150;

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

// axiosInstance의 응답 인터셉터가 백엔드(Java) 응답 형식({code, data, message, status})을
// 가정하고 response.data.data를 꺼내 쓴다. 이 라우트도 같은 형식으로 감싸야 클라이언트의
// 공용 post() 훅이 그대로 통한다.
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ code: status, message, status: `${status}` }, { status });

/**
 * 이 라우트는 인증·요청 제한 없이 그대로 두면 로그인 없이도 누구나 S3에서 파일을 내려받아
 * OCR을 돌릴 수 있어 리소스 남용에 노출된다(리뷰 지적). Lambda를 호출하기 전에 로그인
 * 페이지들이 쓰는 것과 같은 SESSION 쿠키를 백엔드 인증 확인 엔드포인트로 검증해 비로그인
 * 요청을 걷어낸다. 요청 빈도 제한(rate limit)은 이 라우트 코드가 아니라 인프라(Vercel/
 * 백엔드) 쪽에서 적용하기로 했다.
 */
const isAuthenticated = async (): Promise<boolean> => {
  const session = (await cookies()).get('SESSION')?.value;
  if (!session) return false;

  try {
    const response = await fetch(
      new URL(memberUrl.getMyAuthInfo(), process.env.NEXT_PUBLIC_API_BASE_URL),
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `SESSION=${session}`,
        },
      },
    );
    return response.ok;
  } catch {
    return false;
  }
};

interface OcrLambdaSuccess {
  success: true;
  rawText: string;
  unrecognizedSubjectBlobs: string[];
  hasTextLayer: boolean;
  source: 'OCR' | 'TEXT_LAYER';
  pageCount: number;
}

interface OcrLambdaFailure {
  success: false;
  code: number;
  message: string;
}

type OcrLambdaResult = OcrLambdaSuccess | OcrLambdaFailure;

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return errorResponse('로그인이 필요합니다.', 401);
  }

  const { objectKey } = (await request.json().catch(() => ({}))) as { objectKey?: string };

  if (!objectKey) {
    return errorResponse('objectKey가 없습니다.', 400);
  }

  const functionName = process.env.OCR_LAMBDA_FUNCTION_NAME;
  if (!functionName) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] OCR_LAMBDA_FUNCTION_NAME 환경변수가 설정되지 않음');
    return errorResponse('OCR 서비스가 설정되지 않았어요. 잠시 후 다시 시도해주세요.', 500);
  }

  let invokeResponse;
  try {
    invokeResponse = await lambdaClient.send(
      new InvokeCommand({
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        Payload: Buffer.from(JSON.stringify({ objectKey })),
      }),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] Lambda 호출 실패', error);
    return errorResponse('생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.', 502);
  }

  // Lambda 함수 자체가 처리되지 않은 예외로 죽으면(우리가 handler.ts에서 명시적으로 반환한
  // 실패 응답이 아니라 진짜 크래시) FunctionError가 채워지고 Payload는 우리가 기대하는
  // OcrLambdaResult 형식이 아니다.
  if (invokeResponse.FunctionError) {
    // eslint-disable-next-line no-console
    console.error(
      '[school-record-ocr] Lambda 함수 실행 중 예외 발생',
      invokeResponse.FunctionError,
      invokeResponse.Payload ? Buffer.from(invokeResponse.Payload).toString('utf-8') : undefined,
    );
    return errorResponse('생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.', 500);
  }

  let result: OcrLambdaResult;
  try {
    if (!invokeResponse.Payload) {
      throw new Error('empty Lambda payload');
    }
    result = JSON.parse(Buffer.from(invokeResponse.Payload).toString('utf-8')) as OcrLambdaResult;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] Lambda 응답 파싱 실패', error);
    return errorResponse('생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.', 500);
  }

  if (!result.success) {
    return errorResponse(result.message, result.code);
  }

  return NextResponse.json({
    code: 200,
    data: {
      rawText: result.rawText,
      unrecognizedSubjectBlobs: result.unrecognizedSubjectBlobs,
      hasTextLayer: result.hasTextLayer,
      source: result.source,
      pageCount: result.pageCount,
    },
    message: 'OK',
    status: '200 OK',
  });
}
