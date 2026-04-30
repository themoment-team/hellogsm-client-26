'use client';

import { useGetMyOneseo } from '@repo/api/hooks';
import { GetMyOneseoType } from '@repo/types';
import { ApplicationPrintPage } from '@repo/ui/components';

interface PrintPageProps {
  initialData: GetMyOneseoType | undefined;
}

const ApplicationPage = ({ initialData }: PrintPageProps) => {
  const { data: oneseo } = useGetMyOneseo({ initialData: initialData });

  return <ApplicationPrintPage oneseo={oneseo} />;
};

export default ApplicationPage;
