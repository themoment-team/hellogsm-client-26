export type OcrFileOwnershipResult = { ok: true } | { ok: false; status: number; message: string };

interface VerifyOcrFileOwnershipParams {
  session: string | undefined;
  /** oneseoUrl.postSchoolRecordOcrDownloadUrl(objectKey)로 만든 백엔드 검증 요청 경로 */
  path: string;
  fetchImpl?: typeof fetch;
  baseUrl?: string;
}

/**
 * objectKey는 백엔드가 발급할 때 `ocr-uploads/{memberId}/{uuid}.ext` 형태로 소유자
 * memberId를 prefix에 새겨 넣는다(hellogsm-server-26 IssueOcrUploadUrlService 참고).
 * 이 라우트가 objectKey를 그대로 믿고 Lambda에 넘기면 로그인한 어떤 사용자든 다른
 * 사람의 objectKey를 대신 제출해 파일을 읽어낼 수 있다. 백엔드의 다운로드 URL 발급
 * API가 이미 prefix 기반 소유권 검증(불일치 시 403, 파일 없음/만료 시 404, 30MB 초과
 * 시 413)을 하므로, Lambda를 호출하기 전에 그 API를 먼저 호출해 검증 결과만 확인한다.
 */
export const verifyOcrFileOwnership = async ({
  session,
  path,
  fetchImpl = fetch,
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
}: VerifyOcrFileOwnershipParams): Promise<OcrFileOwnershipResult> => {
  if (!session) {
    return { ok: false, status: 401, message: '로그인이 필요합니다.' };
  }

  let response: Response;
  try {
    response = await fetchImpl(new URL(path, baseUrl), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SESSION=${session}`,
      },
    });
  } catch {
    return {
      ok: false,
      status: 502,
      message: '생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.',
    };
  }

  if (response.ok) {
    return { ok: true };
  }

  switch (response.status) {
    case 401:
      return { ok: false, status: 401, message: '로그인이 필요합니다.' };
    case 403:
      return { ok: false, status: 403, message: '본인이 업로드한 파일만 처리할 수 있어요.' };
    case 404:
      return {
        ok: false,
        status: 404,
        message: '업로드된 파일을 찾지 못했어요. 다시 업로드해주세요.',
      };
    case 413:
      return { ok: false, status: 413, message: '파일 용량은 30MB 이하만 지원합니다.' };
    default:
      return {
        ok: false,
        status: 500,
        message: '생기부를 인식하지 못했어요. 잠시 후 다시 시도해주세요.',
      };
  }
};
