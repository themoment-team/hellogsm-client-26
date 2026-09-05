'use client';

import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import {
  usePostSchoolRecordExtraction,
  usePostSchoolRecordOcr,
  usePostSchoolRecordOcrUploadUrl,
} from '@repo/api/hooks';
import {
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  SchoolRecordExtractionAchievementType,
  SchoolRecordExtractionMetaType,
} from '@repo/types';
import { cn } from '@repo/utils';

import { CloseIcon, InfoIcon } from '../../icons';
import { Button } from '../../shadcn';

const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MIN_RAW_TEXT_LENGTH = 200;
/** 순수 스캔본(OCR 경로)인데 인식률이 이 미만이면 부분 성공이 아니라 인식 실패로 안내한다 */
const OCR_FAILURE_CONFIDENCE_THRESHOLD = 0.3;

type UploadStatus = 'idle' | 'processing' | 'submitting' | 'done' | 'error';

/** 인식 실패처럼 원인이 명확하고 사용자가 취할 수 있는 대안이 있는 경우, 고정 안내 대신 전용 문구를 노출하기 위한 에러 */
class SchoolRecordRecognitionError extends Error {}

interface SchoolRecordUploaderProps {
  graduationType: GraduationTypeValueEnum.CANDIDATE | GraduationTypeValueEnum.GRADUATE;
  liberalSystem: LiberalSystemValueEnum | null;
  onApplyAchievement: (achievement: SchoolRecordExtractionAchievementType) => void;
}

const STATUS_TEXT: Partial<Record<UploadStatus, string>> = {
  processing: '생기부를 인식하는 중이에요...',
  submitting: '입력 내용을 채우는 중이에요...',
};

const toastOption = {
  icon: InfoIcon,
  closeButton: (
    <button className={cn('cursor')} onClick={() => toast.dismiss()}>
      <CloseIcon />
    </button>
  ),
};

const SchoolRecordUploader = ({
  graduationType,
  liberalSystem,
  onApplyAchievement,
}: SchoolRecordUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [meta, setMeta] = useState<SchoolRecordExtractionMetaType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognitionFailed, setRecognitionFailed] = useState(false);

  const { mutateAsync: extractSchoolRecord } = usePostSchoolRecordExtraction();
  const { mutateAsync: extractSchoolRecordOcr } = usePostSchoolRecordOcr();
  const { mutateAsync: getSchoolRecordOcrUploadUrl } = usePostSchoolRecordOcrUploadUrl();

  const isProcessing = status === 'processing' || status === 'submitting';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('PDF 파일만 업로드할 수 있어요.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('파일 용량은 30MB 이하만 업로드할 수 있어요.');
      return;
    }

    setErrorMessage(null);
    setMeta(null);
    setRecognitionFailed(false);
    setStatus('processing');

    try {
      // 4.5MB Vercel Function 요청 본문 제한을 피하기 위해 파일은 Vercel을 거치지 않고
      // 브라우저에서 S3로 직접 PUT 업로드한다. Route에는 objectKey만 전달한다.
      const { uploadUrl, objectKey } = await getSchoolRecordOcrUploadUrl('pdf');

      const putResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });

      if (!putResponse.ok) {
        throw new Error('S3 업로드 실패');
      }

      const extraction = await extractSchoolRecordOcr({ objectKey });

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug(
          `[OCR-DEBUG] rawText length=${extraction.rawText.length} pageCount=${extraction.pageCount} source=${extraction.source} hasTextLayer=${extraction.hasTextLayer} unrecognizedSubjectBlobs=${extraction.unrecognizedSubjectBlobs.length}`,
        );
      }

      if (extraction.rawText.replace(/\s+/g, '').length < MIN_RAW_TEXT_LENGTH) {
        throw new SchoolRecordRecognitionError(
          '생기부에서 성적·출결·봉사 내용을 충분히 인식하지 못했어요. 스캔 화질을 확인하거나 직접 입력해 주세요.',
        );
      }

      setStatus('submitting');
      const response = await extractSchoolRecord({
        rawText: extraction.rawText,
        pageCount: extraction.pageCount,
        hasTextLayer: extraction.hasTextLayer,
        source: extraction.source,
        graduationType,
        liberalSystem: liberalSystem ?? undefined,
      });

      onApplyAchievement(response.achievement);
      setMeta(response.meta);
      setStatus('done');

      const failed =
        response.meta.source === 'OCR' &&
        response.meta.confidence < OCR_FAILURE_CONFIDENCE_THRESHOLD;
      setRecognitionFailed(failed);

      if (failed) {
        toast.error(
          '스캔 이미지라 자동 인식이 어려웠어요. 성적·출결·봉사 항목을 직접 입력해 주세요.',
          toastOption,
        );
      } else if (response.meta.warnings.length > 0) {
        toast.warn(
          `생기부 내용을 초안으로 채웠어요. ${response.meta.warnings.length}개 항목은 직접 확인이 필요해요.`,
          toastOption,
        );
      } else {
        toast.success(
          '생기부 내용을 자동으로 입력했어요. 값을 다시 한 번 확인해 주세요.',
          toastOption,
        );
      }
    } catch (error) {
      setStatus('error');
      // eslint-disable-next-line no-console
      console.error('[SchoolRecordUploader] 업로드/OCR 실패:', error);
      // 인식 실패처럼 원인이 명확하고 사용자가 취할 수 있는 대안이 있는 경우에는 전용 안내를,
      // 그 외(S3 업로드, 백엔드 API 등 원시 에러 메시지가 그대로 노출될 수 있는 경우)에는
      // 고정된 한국어 안내만 사용한다.
      const message =
        error instanceof SchoolRecordRecognitionError
          ? error.message
          : '생기부를 인식하는 중 문제가 발생했어요. 다시 시도해 주세요.';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div
      className={cn(
        'w-full',
        'flex',
        'flex-col',
        'gap-3',
        'rounded-lg',
        'border',
        'border-slate-200',
        'bg-slate-50',
        'p-4',
        'mb-8',
      )}
    >
      <div className={cn('flex', 'items-start', 'justify-between', 'gap-4')}>
        <div className={cn('flex', 'items-center', 'gap-3')}>
          <div className={cn('flex', 'flex-col', 'gap-1')}>
            <p className={cn('text-sm', 'font-semibold', 'text-slate-900')}>
              생활기록부 PDF로 자동 입력해 보세요
            </p>
            <p className={cn('text-xs', 'font-normal', 'text-slate-600', 'leading-5')}>
              정부24에서 발급한 생기부 PDF를 올리면 성적·출결·봉사 항목을 초안으로 채워드려요.
              <br />
              인식하지 못한 항목은 직접 입력해야 해요.
            </p>
          </div>
        </div>
        <div className={cn('flex', 'flex-col', 'items-end', 'gap-1')}>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className={cn('hidden')}
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <Button
            type="button"
            variant="next"
            size="sm"
            disabled={isProcessing}
            onClick={() => inputRef.current?.click()}
          >
            {isProcessing ? '처리 중...' : 'PDF 업로드'}
          </Button>
        </div>
      </div>

      {isProcessing && <p className={cn('text-xs', 'text-blue-700')}>{STATUS_TEXT[status]}</p>}

      {status === 'error' && errorMessage && (
        <p className={cn('text-xs', 'text-red-600')}>{errorMessage}</p>
      )}

      {status === 'done' && meta && recognitionFailed && (
        <div
          className={cn(
            'flex',
            'flex-col',
            'gap-1',
            'rounded-md',
            'border',
            'border-red-200',
            'bg-white',
            'p-3',
          )}
        >
          <p className={cn('text-xs', 'font-semibold', 'text-red-700')}>자동 인식에 실패했어요</p>
          <p className={cn('text-xs', 'text-slate-600')}>
            스캔 이미지 형태의 PDF라 글자를 알아보기 어려웠어요. 성적·출결·봉사 항목을 직접 입력해
            주세요.
          </p>
        </div>
      )}

      {status === 'done' && meta && !recognitionFailed && (
        <div className={cn('flex', 'flex-col', 'gap-1', 'rounded-md', 'bg-white', 'p-3')}>
          <p className={cn('text-xs', 'font-semibold', 'text-slate-900')}>
            생기부 내용을 초안으로 채웠어요
          </p>
          <p className={cn('text-xs', 'text-amber-700')}>
            자동으로 채운 값이 정확하지 않을 수 있으니, 제출 전에 반드시 실제 생활기록부와 한 번씩
            대조해서 확인해 주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default SchoolRecordUploader;
