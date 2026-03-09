'use client';

import { useRouter } from 'next/navigation';

import { InspectionIcon } from 'shared/assets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'shared/components';
import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

const SUBJECT: string[] = ['교과', '일반교과'] as const;
const TOTAL = '총합';

const SharedModals = () => {
  const {
    systemInspectionModal,
    applicationSubmitModal,
    setApplicationSubmitModal,
    imageUploadSizeLimitModal,
    setImageUploadSizeLimitModal,
    scoreCalculationCompleteModal,
    setScoreCalculationCompleteModal,
  } = useModalStore();

  const { push } = useRouter();

  const scoreArray =
    scoreCalculationCompleteModal.data?.totalSubjectsScore === undefined
      ? [
          {
            title: '일반교과',
            score: scoreCalculationCompleteModal.data?.generalSubjectsScore,
          },
          {
            title: '예체능',
            score: scoreCalculationCompleteModal.data?.artsPhysicalSubjectsScore,
          },
          { title: '출석', score: scoreCalculationCompleteModal.data?.attendanceScore },
          { title: '봉사', score: scoreCalculationCompleteModal.data?.volunteerScore },
          { title: '총합', score: scoreCalculationCompleteModal.data?.totalScore },
        ]
      : [
          {
            title: '교과',
            score: scoreCalculationCompleteModal.data?.totalSubjectsScore,
          },
          { title: '출석', score: scoreCalculationCompleteModal.data?.attendanceScore },
          { title: '봉사', score: scoreCalculationCompleteModal.data?.volunteerScore },
          { title: '총합', score: scoreCalculationCompleteModal.data?.totalScore },
        ];

  return (
    <>
      <AlertDialog open={systemInspectionModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]', 'rounded-[1.125rem]', 'gap-6')}>
          <div className={cn('flex', 'justify-center', 'items-center')}>
            <InspectionIcon />
          </div>
          <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
            <p className={cn('text-gray-900', 'text-[1.5rem]/[2rem]', 'font-semibold')}>
              서비스 점검 중
            </p>
            <p
              className={cn(
                'text-gray-500',
                'text-[1.25rem]/[1.75rem]',
                'font-normal',
                'text-center',
              )}
            >
              현재 문자인증 오류로 잠시 시스템 점검 중입니다.
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={applicationSubmitModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {applicationSubmitModal.type === 'client' ? (
                <>
                  원서가 제출되었습니다.
                  <br />
                  문제가 있는 경우에는
                  <br />
                  062-949-6842(교무실)로 연락주세요.
                </>
              ) : (
                <>원서가 수정되었습니다.</>
              )}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                push(applicationSubmitModal.type === 'client' ? '/mypage' : '/');
                setApplicationSubmitModal(false);
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={imageUploadSizeLimitModal.isOpen}>
        <AlertDialogContent className={cn('w-[400px]')}>
          <AlertDialogHeader>
            <AlertDialogTitle>이미지는 5MB 이하만 가능합니다.</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setImageUploadSizeLimitModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={scoreCalculationCompleteModal.isOpen}>
        <AlertDialogContent className={cn('w-[32.5rem]', 'max-w-[32.5rem]', 'bg-white')}>
          <AlertDialogHeader>
            <AlertDialogTitle>성적 계산이 완료되었습니다!</AlertDialogTitle>
            <AlertDialogDescription>
              {scoreCalculationCompleteModal.type === 'score'
                ? '입력하신 모든 정보가 맞다면 성적 확인 후 최종 제출해주세요.'
                : '모의 성적을 확인하셨다면 원서를 작성해 주세요.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className={cn('flex', 'w-[29.5rem]')}>
            {scoreArray.map(({ title, score }) => (
              <div
                key={title}
                className={cn(
                  'flex',
                  'flex-col',
                  'border-zinc-200',
                  'border-y-[0.0625rem]',
                  scoreArray.length === 5 ? 'w-[5.9rem]' : 'w-[7.375rem]',
                  SUBJECT.includes(title) && ['border-l-[0.0625rem]', 'rounded-l-md'],
                  title === TOTAL && ['border-r-[0.0625rem]', 'rounded-r-md'],
                )}
              >
                <h1
                  className={cn(
                    'w-full',
                    'h-[3rem]',
                    'flex',
                    'justify-center',
                    'items-center',
                    'border-b-[0.0625rem]',
                    'border-zinc-200',
                    'text-zinc-500',
                    'text-[0.875rem]/[1.5rem]',
                    'font-semibold',
                    'bg-zinc-50',
                    SUBJECT.includes(title) && 'rounded-tl-md',
                    title === TOTAL && 'rounded-tr-md',
                  )}
                >
                  {title}
                </h1>
                <p
                  className={cn(
                    'w-full',
                    'h-[3.5rem]',
                    'flex',
                    'justify-center',
                    'items-center',
                    'text-[0.875rem]/[1.25rem]',
                    SUBJECT.includes(title) ? ['rounded-tr-md'] : ['font-normal', 'text-slate-700'],
                    title === TOTAL && ['rounded-tl-md', 'text-blue-600', 'font-semibold'],
                  )}
                >
                  {score}
                </p>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setScoreCalculationCompleteModal(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SharedModals;
