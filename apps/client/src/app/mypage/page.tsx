// import { redirect } from 'next/navigation';

import { getDate } from 'api';
import { getKoreanDate, isTimeAfter, isTimeBefore } from 'shared';

import { getMyOneseo } from 'client/app/apis';
import { MyPage as MyPageComponent } from 'client/pageContainer';

export default async function MyPage() {
  const [data, dateList] = await Promise.all([getMyOneseo(), getDate()]);

  const currentTime = getKoreanDate();

  const isOneseoWrite =
    !!dateList?.oneseoSubmissionStart &&
    !!dateList?.oneseoSubmissionEnd &&
    isTimeAfter({
      baseTime: new Date(dateList.oneseoSubmissionStart),
      compareTime: currentTime,
    }) &&
    isTimeBefore({ baseTime: currentTime, compareTime: new Date(dateList.oneseoSubmissionEnd) });

  return <MyPageComponent isOneseoWrite={isOneseoWrite} initialData={data} />;
}
