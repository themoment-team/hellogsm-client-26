'use client';

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  usePatchAgreeDocStatus,
  usePatchArrivedStatus,
  usePatchCompetencyScore,
  usePatchInterviewScore,
  usePatchOneseoApproval,
} from '@repo/api/hooks';
import { useDebouncedCallback } from '@repo/hooks';
import { useModalStore } from '@repo/store';
import { EditabilityType, OneseoListType, OneseoType, ScreeningEnum } from '@repo/types';
import { CheckIcon } from '@repo/ui/icons';
import { Badge, Button, TableCell, TableRow, Toggle } from '@repo/ui/shadcn';
import { cn, formatScore } from '@repo/utils';

import { SideBarType } from '@/schemas';

import TextField from '../TextField';

const SCORE_FORMAT_DEBOUNCE_MS = 1000;

type ScoreFieldName = '역량검사점수' | '심층면접점수';

// 입력한 점수를 소수 둘째 자리 형식으로 맞추고, 숫자가 없으면 빈 칸으로 둠
const toScoreFieldValue = (score: string) => {
  const formattedScore = formatScore(score);
  return formattedScore !== 'NaN' ? formattedScore : '';
};

interface ApplicationTRProps extends OneseoType {
  editableData: EditabilityType | undefined;
  oneseoRefetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<OneseoListType, Error>>;
  editableRefetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<EditabilityType, Error>>;
  is역량검사처리기간: boolean;
  is심층면접처리기간: boolean;
  testResultTag: SideBarType;
}

const ApplicantTR = ({
  oneseoRefetch,
  competencyEvaluationScore,
  firstTestPassYn,
  interviewScore,
  memberId,
  name,
  phoneNumber,
  realOneseoArrivedYn,
  schoolName,
  screening,
  secondTestPassYn,
  submitCode,
  entranceIntentionYn,
  editableData,
  editableRefetch,
  is역량검사처리기간,
  is심층면접처리기간,
  oneseoEditStatus,
  testResultTag,
}: ApplicationTRProps) => {
  const setDocumentSubmissionChangeModal = useModalStore(
    (state) => state.setDocumentSubmissionChangeModal,
  );
  const setAdmissionAgreementChangeModal = useModalStore(
    (state) => state.setAdmissionAgreementChangeModal,
  );
  const setApplicationModificationNotPossibleModal = useModalStore(
    (state) => state.setApplicationModificationNotPossibleModal,
  );

  const { push } = useRouter();

  const [isRealOneseoArrived, setIsRealOneseoArrived] = useState<boolean>(
    realOneseoArrivedYn === 'YES',
  );
  const [entranceIntention, setEntranceIntention] = useState<'YES' | 'NO'>(entranceIntentionYn);

  const { mutate: patchArrivedStatus } = usePatchArrivedStatus(memberId, {
    onSuccess: () => {
      oneseoRefetch();
      editableRefetch();
    },
    onError: () => {
      setIsRealOneseoArrived((prev) => !prev);
    },
  });

  const { mutate: patchAgreeDocStatus } = usePatchAgreeDocStatus(memberId, {
    onSuccess: () => {
      oneseoRefetch();
      editableRefetch();
    },
    onError: () => {
      setEntranceIntention(entranceIntention === 'YES' ? 'NO' : 'YES');
    },
  });

  const { mutate: patchCompetencyScore } = usePatchCompetencyScore(memberId, {
    onSuccess: () => {
      oneseoRefetch();
      editableRefetch();
    },
  });
  const { mutate: patchInterviewScore } = usePatchInterviewScore(memberId, {
    onSuccess: () => {
      oneseoRefetch();
      editableRefetch();
    },
  });

  const { mutate: patchOneseoApproval } = usePatchOneseoApproval(memberId, {
    onSuccess: () => {
      oneseoRefetch();
      editableRefetch();
      toast.success('원서 수정 승인이 완료되었습니다.');
    },
    onError: () => {
      toast.error('원서 수정 승인에 실패했습니다.');
    },
  });

  const firstTestResult =
    firstTestPassYn === 'YES' ? '합격' : firstTestPassYn === 'NO' ? '불합격' : '미정';
  const secondTestResult =
    secondTestPassYn === 'YES' ? '합격' : secondTestPassYn === 'NO' ? '불합격' : '미정';

  const formatted역량검사점수 = formatScore(String(competencyEvaluationScore ?? ''));
  const formatted심층면접점수 = formatScore(String(interviewScore ?? ''));

  const { control, setValue, getValues } = useForm({
    defaultValues: {
      역량검사점수: toScoreFieldValue(String(competencyEvaluationScore ?? '')),
      심층면접점수: toScoreFieldValue(String(interviewScore ?? '')),
    },
  });

  // 렌더 중 구독은 watch() 대신 useWatch 사용 (React Compiler 호환)
  const [입력중역량검사점수, 입력중심층면접점수] = useWatch({
    control,
    name: ['역량검사점수', '심층면접점수'],
  });

  // 입력이 1초 동안 멈추면 해당 칸의 점수를 형식에 맞게 정리 (칸마다 따로 대기)
  const 역량검사점수Format = useDebouncedCallback(
    (score: string) => setValue('역량검사점수', toScoreFieldValue(score)),
    SCORE_FORMAT_DEBOUNCE_MS,
  );
  const 심층면접점수Format = useDebouncedCallback(
    (score: string) => setValue('심층면접점수', toScoreFieldValue(score)),
    SCORE_FORMAT_DEBOUNCE_MS,
  );

  const handleScoreChange = (fieldName: ScoreFieldName, score: string) => {
    if (fieldName === '역량검사점수') 역량검사점수Format.run(score);
    else 심층면접점수Format.run(score);
  };

  const handleRealOneseoArrived = () => {
    setDocumentSubmissionChangeModal(false);
    patchArrivedStatus();
    setIsRealOneseoArrived((prev) => !prev);
  };

  const handleAgreeDocArrived = () => {
    const updatedIntention = entranceIntention === 'YES' ? 'NO' : 'YES';
    setEntranceIntention(updatedIntention);
    setAdmissionAgreementChangeModal(false);
    patchAgreeDocStatus({ entranceIntentionYn: updatedIntention });
  };

  const handleAptitudeScore = () => {
    // 이벤트 핸들러에서는 구독이 불필요 — getValues() 사용
    const 역량검사점수 = parseFloat(getValues('역량검사점수'));

    if (역량검사점수 < 0 || 역량검사점수 > 100 || isNaN(역량검사점수)) return;

    patchCompetencyScore({ competencyEvaluationScore: 역량검사점수 });
  };

  const handleInterviewScore = () => {
    const 심층면접점수 = parseFloat(getValues('심층면접점수'));

    if (심층면접점수 < 0 || 심층면접점수 > 100 || isNaN(심층면접점수)) return;

    patchInterviewScore({ interviewScore: 심층면접점수 });
  };

  const handleOneseoEdit = () => {
    if (editableData?.oneseoEditability === true) {
      push(`/edit/${memberId}?step=1`);
    } else {
      setApplicationModificationNotPossibleModal(true);
    }
  };

  const handleOneseoPrint = () => {
    push(`/print/${memberId}`);
  };

  return (
    <TableRow className={cn('h-16', 'border-0', 'hover:bg-transparent')}>
      <TableCell className={cn('h-16', 'w-[100px]', 'p-4', 'text-zinc-900')}>
        {submitCode}
      </TableCell>
      <TableCell className={cn('h-16', 'w-[130px]', 'p-4')}>
        <Toggle
          onClick={() => setDocumentSubmissionChangeModal(true, handleRealOneseoArrived)}
          pressed={isRealOneseoArrived}
          icon={<CheckIcon />}
        >
          제출 완료
        </Toggle>
      </TableCell>
      <TableCell className={cn('h-16', 'w-[154px]', 'p-4')}>
        <div className={cn('flex', 'flex-col')}>
          <span className={cn('text-sm', 'font-semibold', 'leading-5', 'text-zinc-900')}>
            {name}
          </span>
          <span className={cn('text-sm', 'font-normal', 'leading-5', 'text-zinc-600')}>
            {phoneNumber}
          </span>
        </div>
      </TableCell>
      <TableCell className={cn('h-16', 'w-[154px]', 'p-4', 'text-zinc-600')}>
        {schoolName}
      </TableCell>
      <TableCell className={cn('h-16', 'w-[152px]', 'p-4', 'font-medium', 'text-zinc-900')}>
        {ScreeningEnum[screening]}
      </TableCell>
      <TableCell className={cn('h-16', 'w-[96px]', 'p-4')}>
        <Badge variant={firstTestResult}>{firstTestResult}</Badge>
      </TableCell>
      <TableCell className={cn('h-16', 'w-[153px]', 'p-4', 'text-zinc-400')}>
        {firstTestPassYn === 'YES' && is역량검사처리기간 ? (
          <div className={cn('flex', 'gap-1.5')}>
            <Controller
              name="역량검사점수"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleScoreChange('역량검사점수', e.target.value);
                  }}
                  disabled={!!secondTestPassYn}
                />
              )}
            />
            <Button
              variant={
                입력중역량검사점수 && formatted역량검사점수 !== 입력중역량검사점수
                  ? 'default'
                  : 'subtitle'
              }
              onClick={handleAptitudeScore}
              disabled={!!secondTestPassYn}
            >
              저장
            </Button>
          </div>
        ) : (
          '진행 전'
        )}
      </TableCell>
      <TableCell className={cn('h-16', 'w-[153px]', 'p-4', 'text-zinc-400')}>
        {firstTestPassYn === 'YES' && is심층면접처리기간 ? (
          <div className={cn('flex', 'gap-1.5')}>
            <Controller
              name="심층면접점수"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleScoreChange('심층면접점수', e.target.value);
                  }}
                  disabled={!!secondTestPassYn}
                />
              )}
            />
            <Button
              variant={
                입력중심층면접점수 && formatted심층면접점수 !== 입력중심층면접점수
                  ? 'default'
                  : 'subtitle'
              }
              onClick={handleInterviewScore}
              disabled={!!secondTestPassYn}
            >
              저장
            </Button>
          </div>
        ) : (
          '진행 전'
        )}
      </TableCell>
      <TableCell className={cn('h-16', 'w-[96px]', 'p-4')}>
        <Badge variant={secondTestResult}>{secondTestResult}</Badge>
      </TableCell>
      <TableCell className={cn('h-16', 'w-[170px]', 'p-4', 'text-center')}>
        <Toggle
          onClick={() => setAdmissionAgreementChangeModal(true, handleAgreeDocArrived)}
          pressed={entranceIntention === 'YES'}
          icon={<CheckIcon />}
          disabled={secondTestPassYn !== 'YES'}
        >
          제출 완료
        </Toggle>
      </TableCell>
      <TableCell className={cn('h-16', 'w-[121px]', 'p-4', 'text-right')}>
        <Button onClick={handleOneseoPrint} variant="outline">
          원서 출력
        </Button>
      </TableCell>
      <TableCell className={cn('h-16', 'w-[121px]', 'p-4', 'text-right')}>
        {testResultTag === 'REQUEST' ? (
          <Button
            onClick={() => patchOneseoApproval()}
            variant={oneseoEditStatus === 'APPROVED' ? 'subtitle' : 'outline'}
            disabled={oneseoEditStatus === 'APPROVED'}
          >
            {oneseoEditStatus === 'REQUESTED' ? '원서 수정 승인' : '승인 완료'}
          </Button>
        ) : (
          <Button onClick={handleOneseoEdit} variant="outline">
            성적 수정
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ApplicantTR;
