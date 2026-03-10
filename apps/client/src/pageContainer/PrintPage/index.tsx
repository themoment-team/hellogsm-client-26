'use client';

import { useGetMyOneseo } from '@repo/api/hooks';
import { GetMyOneseoType } from '@repo/types';

import { ApplicationForm, PrintButton, ScoreConfirmationForm } from '@/components';

interface PrintPageProps {
  initialData: GetMyOneseoType | undefined;
}

const ApplicationPage = ({ initialData }: PrintPageProps) => {
  const { data: oneseo } = useGetMyOneseo({ initialData: initialData });

  if (!oneseo) return <>원서 정보가 없습니다</>;

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            header,
            #sample,
            footer {
              display: none !important;
            }
          }
          @page {
            margin: 0;
          }
        }
      `}</style>

      <PrintButton />
      <ApplicationForm oneseo={oneseo} />
      {oneseo.privacyDetail.graduationType !== 'GED' && <ScoreConfirmationForm oneseo={oneseo} />}
    </>
  );
};

export default ApplicationPage;
