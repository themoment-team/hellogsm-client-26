import { redirect } from 'next/navigation';

import { StepEnum } from '@repo/types';
import { ComputerRecommendedPage, StepWrapper } from '@repo/ui/components';

import { getOneseoByMemberId } from '@/app/apis';

import { resolveInvalidStepRedirectPath } from './resolveInvalidStepRedirectPath';

interface EditProps {
  params: Promise<{ memberId: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Edit(props: EditProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { memberId } = params;

  const step = searchParams?.step;
  const id = Number(memberId);

  const redirectPath = resolveInvalidStepRedirectPath(id, step);
  if (redirectPath) redirect(redirectPath);

  const data = await getOneseoByMemberId(id);

  return (
    <>
      <ComputerRecommendedPage type="admin" />
      <StepWrapper data={data} type="admin" step={step as StepEnum} memberId={id} />
    </>
  );
}
