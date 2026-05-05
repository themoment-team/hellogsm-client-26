'use client';

import { useRouter } from 'next/navigation';

import { useGetMyOneseo, useGetMyOneseoPreview } from '@repo/api/hooks';
import { GetMyOneseoType, PreviewOneseoType } from '@repo/types';
import { ApplicationPrintPage } from '@repo/ui/components';

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

  return (
    <ApplicationPrintPage
      oneseo={oneseo}
      isPreview={isPreview}
      onPreviewBack={() => push('/register?step=4')}
    />
  );
};

export default ApplicationPage;
