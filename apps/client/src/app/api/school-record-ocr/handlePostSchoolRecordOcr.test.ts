import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

import { handlePostSchoolRecordOcr } from './handlePostSchoolRecordOcr';
import { OcrFileOwnershipResult } from './verifyOcrFileOwnership';

const buildOwnershipPath = (objectKey: string) => `/fake-ownership-check?objectKey=${objectKey}`;

const verifyOwnershipReturning = (result: OcrFileOwnershipResult) => mock.fn(async () => result);

test('소유권 검증에 실패하면(403) Lambda를 호출하지 않고 해당 오류를 그대로 응답한다', async () => {
  const verifyOwnership = verifyOwnershipReturning({
    ok: false,
    status: 403,
    message: '본인이 업로드한 파일만 처리할 수 있어요.',
  });
  const invokeLambda = mock.fn(async (objectKeyArg: string) => {
    void objectKeyArg;
    return {
      success: true as const,
      rawText: '이 값은 절대 쓰이면 안 된다',
      unrecognizedSubjectBlobs: [],
      hasTextLayer: true,
      source: 'TEXT_LAYER' as const,
      pageCount: 1,
    };
  });

  const response = await handlePostSchoolRecordOcr({
    objectKey: 'ocr-uploads/2/file.pdf',
    session: 'valid-session',
    buildOwnershipPath,
    verifyOwnership,
    invokeLambda,
  });

  assert.equal(invokeLambda.mock.callCount(), 0);
  assert.equal(response.status, 403);
  const body = await response.json();
  assert.equal(body.message, '본인이 업로드한 파일만 처리할 수 있어요.');
});

test('소유권 검증을 통과하면(200) 검증에 사용된 것과 동일한 objectKey로 Lambda를 정확히 한 번 호출한다', async () => {
  const objectKey = 'ocr-uploads/1/file.pdf';
  const verifyOwnership = verifyOwnershipReturning({ ok: true });
  const invokeLambda = mock.fn(async (objectKeyArg: string) => {
    void objectKeyArg;
    return {
      success: true as const,
      rawText: '추출된 텍스트',
      unrecognizedSubjectBlobs: [],
      hasTextLayer: true,
      source: 'TEXT_LAYER' as const,
      pageCount: 1,
    };
  });

  const response = await handlePostSchoolRecordOcr({
    objectKey,
    session: 'valid-session',
    buildOwnershipPath,
    verifyOwnership,
    invokeLambda,
  });

  assert.equal(invokeLambda.mock.callCount(), 1);
  const call = invokeLambda.mock.calls[0];
  assert.ok(call);
  assert.equal(call.arguments[0], objectKey);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.data.rawText, '추출된 텍스트');
});

test('objectKey가 없으면 소유권 검증과 Lambda 호출 모두 건너뛰고 400을 반환한다', async () => {
  const verifyOwnership = mock.fn(async () => ({ ok: true }) as OcrFileOwnershipResult);
  const invokeLambda = mock.fn(async (objectKeyArg: string) => {
    void objectKeyArg;
    throw new Error('호출되면 안 됨');
  });

  const response = await handlePostSchoolRecordOcr({
    objectKey: undefined,
    session: 'valid-session',
    buildOwnershipPath,
    verifyOwnership,
    invokeLambda,
  });

  assert.equal(verifyOwnership.mock.callCount(), 0);
  assert.equal(invokeLambda.mock.callCount(), 0);
  assert.equal(response.status, 400);
});

test('Lambda가 실패 결과를 반환하면 그 코드와 메시지를 그대로 응답한다', async () => {
  const objectKey = 'ocr-uploads/1/file.pdf';
  const verifyOwnership = verifyOwnershipReturning({ ok: true });
  const invokeLambda = mock.fn(async (objectKeyArg: string) => {
    void objectKeyArg;
    return {
      success: false as const,
      code: 422,
      message: '생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.',
    };
  });

  const response = await handlePostSchoolRecordOcr({
    objectKey,
    session: 'valid-session',
    buildOwnershipPath,
    verifyOwnership,
    invokeLambda,
  });

  assert.equal(invokeLambda.mock.callCount(), 1);
  assert.equal(response.status, 422);
  const body = await response.json();
  assert.equal(body.message, '생기부를 인식하지 못했어요. 다른 파일로 시도해주세요.');
});
