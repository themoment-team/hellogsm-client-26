'use client';

import { GetMyOneseoType } from '@repo/types';

import ApplicationForm from './ApplicationForm';
import PrintButton from './PrintButton';
import ScoreConfirmationForm from './ScoreConfirmationForm';

interface ApplicationPrintPageProps {
  oneseo: GetMyOneseoType | undefined;
}

const ApplicationPrintPage = ({ oneseo }: ApplicationPrintPageProps) => {
  if (!oneseo) return <>원서 정보가 없습니다</>;

  return (
    <>
      <style>{`
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

export default ApplicationPrintPage;
