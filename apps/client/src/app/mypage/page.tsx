import { getDate } from '@repo/api/apis';
import { getKoreanDate, isTimeAfter, isTimeBefore } from '@repo/utils';

import { MyPage as MyPageComponent } from '@/pageContainer';

import { getMyOneseo } from '../apis';

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
