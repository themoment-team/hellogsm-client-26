import { getDate } from 'api';
import { getKoreanDate, isTimeAfter, isTimeBefore } from 'shared';

import { getMyOneseo } from 'client/app/apis';
import { GuidePage } from 'client/pageContainer';

export default async function Guide() {
  const [data, dateList] = await Promise.all([getMyOneseo(), getDate()]);

  const currentTime = getKoreanDate();

  const isOneseoWrite =
    !!dateList?.oneseoSubmissionStart &&
    !!dateList?.oneseoSubmissionEnd &&
    isTimeAfter({
      baseTime: new Date(dateList.oneseoSubmissionStart),
      compareTime: currentTime,
    }) &&
    isTimeBefore({ baseTime: new Date(dateList.oneseoSubmissionEnd), compareTime: currentTime });

  return <GuidePage initialData={data} isOneseoWrite={isOneseoWrite} />;
}
