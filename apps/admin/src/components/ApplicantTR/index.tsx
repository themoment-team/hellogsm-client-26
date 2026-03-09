'use client';

import { useEffect, useState } from 'react';

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { EditabilityType, OneseoListType, OneseoType, ScreeningEnum } from 'types';

import { TextField } from 'admin/components';

import { CheckIcon } from 'shared/assets';
import { Table, TableBody, TableCell, Toggle, TableRow, Badge, Button } from 'shared/components';
import { useDebounce } from 'shared/hooks';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';
import { formatScore } from 'shared/utils';

import {
  usePatchArrivedStatus,
  usePatchCompetencyScore,
  usePatchInterviewScore,
  usePatchAgreeDocStatus,
} from 'api/hooks';

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
}

const ApplicantTR = ({
  oneseoRefetch,
  competencyEvaluationScore,
  firstTestPassYn,
  interviewScore,
  memberId,
  name,
  realOneseoArrivedYn,
  schoolName,
  screening,
  secondTestPassYn,
  examinationNumber,
  submitCode,
  entranceIntentionYn,
  editableData,
  editableRefetch,
  is역량검사처리기간,
  is심층면접처리기간,
}: ApplicationTRProps) => {
  const {
    setDocumentSubmissionChangeModal,
    setAdmissionAgreementChangeModal,
    setApplicationModificationNotPossibleModal,
  } = useModalStore();

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

  const firstTestResult =
    firstTestPassYn === 'YES' ? '합격' : firstTestPassYn === 'NO' ? '불합격' : '미정';
  const secondTestResult =
    secondTestPassYn === 'YES' ? '합격' : secondTestPassYn === 'NO' ? '불합격' : '미정';

  const formatted역량검사점수 = formatScore(String(competencyEvaluationScore ?? ''));
  const formatted심층면접점수 = formatScore(String(interviewScore ?? ''));

  const { control, watch, setValue } = useForm({
    defaultValues: {
      역량검사점수: formatted역량검사점수,
      심층면접점수: formatted심층면접점수,
    },
  });

  const debounced역량검사점수 = useDebounce(watch('역량검사점수'), 1000);
  const debounced심층면접점수 = useDebounce(watch('심층면접점수'), 1000);

  useEffect(() => {
    const formatAndSetScore = (score: string, fieldName: '역량검사점수' | '심층면접점수') => {
      const formattedScore = formatScore(score);
      setValue(fieldName, formattedScore !== 'NaN' ? formattedScore : '');
    };

    formatAndSetScore(debounced역량검사점수, '역량검사점수');
    formatAndSetScore(debounced심층면접점수, '심층면접점수');
  }, [debounced역량검사점수, debounced심층면접점수, setValue]);

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
    const 역량검사점수 = parseFloat(watch('역량검사점수'));

    if (역량검사점수 < 0 || 역량검사점수 > 100 || isNaN(역량검사점수)) return;

    patchCompetencyScore({ competencyEvaluationScore: 역량검사점수 });
  };

  const handleInterviewScore = () => {
    const 심층면접점수 = parseFloat(watch('심층면접점수'));

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

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className={cn('w-[6.5rem]', 'text-zinc-900')}>{submitCode}</TableCell>
          <TableCell className={cn('w-[7.25rem]', 'p-0')}>
            <Toggle
              onClick={() => setDocumentSubmissionChangeModal(true, handleRealOneseoArrived)}
              pressed={isRealOneseoArrived}
              icon={<CheckIcon />}
            >
              제출 완료
            </Toggle>
          </TableCell>
          <TableCell className={cn('w-[7.5rem]', 'font-semibold', 'text-zinc-900')}>
            {name}
          </TableCell>
          <TableCell className={cn('w-[8rem]', 'text-zinc-900')}>
            {examinationNumber === null ? <Badge variant={'미정'}>미정</Badge> : examinationNumber}
          </TableCell>
          <TableCell className={cn('w-[9rem]', 'text-zinc-600')}>{schoolName}</TableCell>
          <TableCell className={cn('w-[7.25rem]', 'text-zinc-900')}>
            {ScreeningEnum[screening]}
          </TableCell>
          <TableCell className={cn('w-[7rem]')}>
            <Badge variant={firstTestResult}>{firstTestResult}</Badge>
          </TableCell>
          <TableCell className={cn('w-[10.75rem]', 'text-zinc-400')}>
            {firstTestPassYn === 'YES' && is역량검사처리기간 ? (
              <div className={cn('flex', 'gap-1.5')}>
                <Controller
                  name="역량검사점수"
                  control={control}
                  render={({ field }) => <TextField {...field} disabled={!!secondTestPassYn} />}
                />
                <Button
                  variant={
                    watch('역량검사점수') && formatted역량검사점수 !== watch('역량검사점수')
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
          <TableCell className={cn('w-[10.75rem]', 'text-zinc-400')}>
            {firstTestPassYn === 'YES' && is심층면접처리기간 ? (
              <div className={cn('flex', 'gap-1.5')}>
                <Controller
                  name="심층면접점수"
                  control={control}
                  render={({ field }) => <TextField {...field} disabled={!!secondTestPassYn} />}
                />
                <Button
                  variant={
                    watch('심층면접점수') && formatted심층면접점수 !== watch('심층면접점수')
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
          <TableCell className={cn('w-[6rem]')}>
            <Badge variant={secondTestResult}>{secondTestResult}</Badge>
          </TableCell>
          <TableCell className={cn('w-[8.125rem]')}>
            <Toggle
              onClick={() => setAdmissionAgreementChangeModal(true, handleAgreeDocArrived)}
              pressed={entranceIntention === 'YES'}
              icon={<CheckIcon />}
              disabled={secondTestPassYn !== 'YES'}
            >
              제출 완료
            </Toggle>
          </TableCell>
          <TableCell className={cn('w-[5rem]')}>
            <Button onClick={handleOneseoEdit} variant="outline">
              원서수정
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ApplicantTR;
