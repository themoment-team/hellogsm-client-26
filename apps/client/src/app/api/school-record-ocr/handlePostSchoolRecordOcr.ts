import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { NextResponse } from 'next/server';

import { verifyOcrFileOwnership } from './verifyOcrFileOwnership';

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

// axiosInstance의 응답 인터셉터가 백엔드(Java) 응답 형식({code, data, message, status})을
// 가정하고 response.data.data를 꺼내 쓴다. 이 라우트도 같은 형식으로 감싸야 클라이언트의
// 공용 post() 훅이 그대로 통한다.
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ code: status, message, status: `${status}` }, { status });

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

const invokeOcrLambda = async (objectKey: string): Promise<OcrLambdaResult> => {
  const functionName = process.env.OCR_LAMBDA_FUNCTION_NAME;
  if (!functionName) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] OCR_LAMBDA_FUNCTION_NAME 환경변수가 설정되지 않음');
    return {
      success: false,
      code: 500,
      message: 'OCR 서비스가 설정되지 않았어요. 잠시 후 다시 시도해주세요.',
    };
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
    return {
      success: false,
      code: 502,
      message: '생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.',
    };
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
    return {
      success: false,
      code: 500,
      message: '생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.',
    };
  }

  try {
    if (!invokeResponse.Payload) {
      throw new Error('empty Lambda payload');
    }
    return JSON.parse(Buffer.from(invokeResponse.Payload).toString('utf-8')) as OcrLambdaResult;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[school-record-ocr] Lambda 응답 파싱 실패', error);
    return {
      success: false,
      code: 500,
      message: '생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.',
    };
  }
};

interface HandlePostSchoolRecordOcrParams {
  objectKey: string | undefined;
  session: string | undefined;
  /**
   * objectKey로 백엔드 소유권 검증 요청 경로를 만드는 함수. route.ts가
   * oneseoUrl.postSchoolRecordOcrDownloadUrl을 그대로 넘긴다. 이 파일이 `@repo/api`를
   * 직접 import하지 않는 이유는 verifyOcrFileOwnership.ts와 동일하다 — 그 패키지가
   * CJS로 빌드되어 있어 tsx/node:test 환경에서 named export 정적 분석이 실패한다.
   */
  buildOwnershipPath: (objectKey: string) => string;
  verifyOwnership?: typeof verifyOcrFileOwnership;
  invokeLambda?: (objectKey: string) => Promise<OcrLambdaResult>;
}

/**
 * next/headers 런타임 컨텍스트(cookies()) 없이도 단위 테스트할 수 있도록 POST에서
 * 분리했다. 소유권 검증(verifyOwnership)이 실패하면 invokeLambda를 호출하지 않는 것,
 * 그리고 검증을 통과한 objectKey가 그대로 invokeLambda에 전달되는 것이 #501의 핵심
 * 회귀 방지 지점이다.
 */
export const handlePostSchoolRecordOcr = async ({
  objectKey,
  session,
  buildOwnershipPath,
  verifyOwnership = verifyOcrFileOwnership,
  invokeLambda = invokeOcrLambda,
}: HandlePostSchoolRecordOcrParams) => {
  if (!objectKey) {
    return errorResponse('objectKey가 없습니다.', 400);
  }

  const ownership = await verifyOwnership({ session, path: buildOwnershipPath(objectKey) });
  if (!ownership.ok) {
    return errorResponse(ownership.message, ownership.status);
  }

  const result = await invokeLambda(objectKey);

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
};
