'use client';

import { useRouter } from 'next/navigation';

import { useGetMyOneseo, useGetMyOneseoPreview } from '@repo/api/hooks';
import { GetMyOneseoType, PreviewOneseoType } from '@repo/types';
import { Button } from '@repo/ui/shadcn';
import { cn } from '@repo/utils';

import { ApplicationForm, PrintButton, ScoreConfirmationForm } from '@/components';

interface PrintPageProps {
  initialData: GetMyOneseoType | PreviewOneseoType | undefined;
  isPreview: boolean;
}

const ApplicationPage = ({ initialData, isPreview }: PrintPageProps) => {
  const { push } = useRouter();

  const { data: oneseoPreview } = useGetMyOneseoPreview({
    enabled: isPreview,
    initialData: isPreview ? (initialData as PreviewOneseoType | undefined) : undefined,
    staleTime: 0,
  });
  const { data: oneseoNormal } = useGetMyOneseo({
    enabled: !isPreview,
    initialData: !isPreview ? (initialData as GetMyOneseoType | undefined) : undefined,
  });

  const oneseo = isPreview
    ? oneseoPreview && {
        ...oneseoPreview,
        middleSchoolAchievement: {
          ...oneseoPreview.middleSchoolAchievement,
          achievement1_1: oneseoPreview.middleSchoolAchievement.achievement1_1 ?? ([] as number[]),
          achievement1_2: oneseoPreview.middleSchoolAchievement.achievement1_2 ?? ([] as number[]),
          achievement2_1: oneseoPreview.middleSchoolAchievement.achievement2_1 ?? ([] as number[]),
          achievement2_2: oneseoPreview.middleSchoolAchievement.achievement2_2 ?? ([] as number[]),
          achievement3_1: oneseoPreview.middleSchoolAchievement.achievement3_1 ?? ([] as number[]),
          achievement3_2: oneseoPreview.middleSchoolAchievement.achievement3_2 ?? ([] as number[]),
        },
      }
    : oneseoNormal;

  if (!oneseo) return <>원서 정보가 없습니다</>;

  const forms = (
    <>
      {!isPreview && <PrintButton isPreview={isPreview} />}
      <ApplicationForm oneseo={oneseo} isPreview={isPreview} />
      {oneseo.privacyDetail.graduationType !== 'GED' && (
        <ScoreConfirmationForm oneseo={oneseo} isPreview={isPreview} />
      )}
    </>
  );

  return (
    <>
      <style jsx global>{`
        @media print {
          header,
          ${isPreview ? '' : '#sample,'}
          footer {
            display: none !important;
          }
          @page {
            margin: 0;
          }
        }
      `}</style>

      {isPreview ? (
        <div
          className={cn(
            'w-full',
            'min-h-screen',
            'bg-slate-50',
            'pt-[3.56rem]',
            'pb-20',
            'flex',
            'justify-center',
            'print:block',
            'print:bg-white',
            'print:p-0',
          )}
        >
          <div
            className={cn(
              'w-[66.5rem]',
              'flex',
              'flex-col',
              'bg-white',
              'rounded-[1.25rem]',
              'print:w-auto',
              'print:rounded-none',
            )}
          >
            <div
              className={cn(
                'flex',
                'h-[4.25rem]',
                'items-center',
                'justify-end',
                'gap-2',
                'rounded-t-[1.125rem]',
                'border-b',
                'border-gray-100',
                'px-[1.75rem]',
                'py-[1.125rem]',
                'print:hidden',
              )}
            >
              <Button variant="ghost" onClick={() => push('/register?step=4')}>
                이전
              </Button>
              <Button variant="next" onClick={() => window.print()}>
                원서 출력하기
              </Button>
            </div>

            <div
              className={cn(
                'flex',
                'w-full',
                'items-center',
                'justify-center',
                'bg-white',
                'print:hidden',
              )}
            >
              <div className={cn('w-[63vh]', 'py-6', '-ml-4')}>
                <h1 className={cn('text-[1.25rem]', 'font-[600]', 'text-gray-900', 'mb-2')}>
                  출력 문서를 확인해 주세요.
                </h1>
                <p className={cn('text-[0.875rem]', 'text-gray-600', 'leading-[1.25rem]')}>
                  출력 문서를 더 자세히 보고 싶다면 문서를 출력해주세요. 출력된 문서는 입학 과정에서
                  사용될 수 없는 견본 문서입니다.
                  <br />
                  정식 입학에 쓰이는 최종 제출 문서는 원서 최종 제출 후 마이페이지에서 다운로드해주세요
                </p>
              </div>
            </div>

            {forms}
          </div>
        </div>
      ) : (
        forms
      )}
    </>
  );
};

export default ApplicationPage;
