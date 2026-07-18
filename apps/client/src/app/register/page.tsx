import { redirect } from 'next/navigation';

import { getDate } from '@repo/api/apis';
import { StepEnum } from '@repo/types';
import { getKoreanDate, isTimeAfter, isTimeBefore } from '@repo/utils';

import { RegisterStepsPage } from '@/pageContainer';

import { getEditability, getMyMemberInfo, getMyOneseo } from '../apis';

interface RegisterProps {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function Register(props: RegisterProps) {
  const searchParams = await props.searchParams;
  const step = searchParams?.step;

  const [data, info, dateList, editability] = await Promise.all([
    getMyOneseo(),
    getMyMemberInfo('/'),
    getDate(),
    getEditability(),
  ]);

  const currentTime = getKoreanDate();
  const isOneseoWrite =
    !!dateList?.oneseoSubmissionStart &&
    !!dateList?.oneseoSubmissionEnd &&
    isTimeAfter({
      baseTime: new Date(dateList.oneseoSubmissionStart),
      compareTime: currentTime,
    }) &&
    isTimeBefore({ baseTime: new Date(dateList.oneseoSubmissionEnd), compareTime: currentTime });

  const isModifyApproved = editability?.oneseoEditStatus === 'APPROVED';

  if (!info || (data && !data.step && !isModifyApproved) || !isOneseoWrite) redirect('/');

  if (!step || !['1', '2', '3', '4'].includes(step)) redirect('/register?step=1');

  return (
    <RegisterStepsPage
      data={data}
      info={info}
      step={step as StepEnum}
      isModifyApproved={isModifyApproved}
    />
  );
}
