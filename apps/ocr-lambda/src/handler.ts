import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { parse } from 'kordoc';

import { convertKordocBlocks } from './achievementTextConverter';

const MAX_FILE_SIZE = 30 * 1024 * 1024;

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export interface OcrLambdaEvent {
  objectKey?: string;
}

export interface OcrLambdaSuccess {
  success: true;
  rawText: string;
  unrecognizedSubjectBlobs: string[];
  hasTextLayer: boolean;
  source: 'OCR' | 'TEXT_LAYER';
  pageCount: number;
}

export interface OcrLambdaFailure {
  success: false;
  code: number;
  message: string;
}

export type OcrLambdaResult = OcrLambdaSuccess | OcrLambdaFailure;

const failure = (code: number, message: string): OcrLambdaFailure => ({
  success: false,
  code,
  message,
});

/**
 * apps/client/api/school-record-ocr가 하던 일 중 "S3에서 파일을 받아 kordoc으로 OCR을
 * 돌리는" 부분을 그대로 옮겨왔다. kordoc의 실제 OCR 경로(onnxruntime-node, sharp,
 * @napi-rs/canvas)가 요구하는 네이티브 바이너리를 Vercel 서버리스 함수의 250MB 크기
 * 제한 안에 맞추는 시도(outputFileTracingIncludes 등)가 계속 다른 방식으로 실패해
 * Lambda 컨테이너 이미지(최대 10GB)로 분리했다. 인증·요청 검증은 여전히 Vercel
 * 라우트에서 하고, 이 함수는 objectKey만 받아 순수하게 OCR 결과만 돌려준다.
 */
export const handler = async (event: OcrLambdaEvent): Promise<OcrLambdaResult> => {
  const objectKey = event.objectKey;
  if (!objectKey) {
    return failure(400, 'objectKey가 없습니다.');
  }

  let buffer: Buffer;
  try {
    const object = await s3Client.send(
      new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: objectKey }),
    );
    const byteArray = await object.Body?.transformToByteArray();
    if (!byteArray) {
      throw new Error('empty S3 object body');
    }
    buffer = Buffer.from(byteArray);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ocr-lambda] S3에서 파일을 내려받지 못함', error);
    return failure(404, '업로드된 파일을 찾지 못했어요. 다시 업로드해주세요.');
  }

  if (buffer.byteLength > MAX_FILE_SIZE) {
    return failure(400, '파일 용량은 30MB 이하만 지원합니다.');
  }

  // 손상되거나 암호화된 PDF는 kordoc이 ParseFailure로 감싸 돌려주지 않고 그냥 throw할 수
  // 있다 — 감싸지 않으면 이 호출이 처리되지 않은 예외로 Lambda 실행 자체가 실패한다.
  let result;
  try {
    result = await parse(buffer, { ocr: true, tables: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ocr-lambda] kordoc 파싱 중 예외 발생', error);
    return failure(422, '생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.');
  }

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('[ocr-lambda] kordoc 파싱 실패', result.error, result.code);
    return failure(422, '생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.');
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug(
      '[KORDOC-DEBUG] qualitySummary',
      JSON.stringify(result.qualitySummary),
      'warnings',
      JSON.stringify(result.warnings),
    );
  }

  const { rawText, unrecognizedSubjectBlobs } = convertKordocBlocks(result.blocks);

  const totalPages = result.qualitySummary?.totalPages ?? result.pageCount ?? 0;
  const lowTextPageCount = result.qualitySummary?.lowTextPageCount ?? 0;
  const usedOcr = lowTextPageCount > 0;
  const hasTextLayer = lowTextPageCount < totalPages;

  return {
    success: true,
    rawText,
    unrecognizedSubjectBlobs,
    hasTextLayer,
    source: usedOcr ? 'OCR' : 'TEXT_LAYER',
    pageCount: result.pageCount ?? totalPages,
  };
};
