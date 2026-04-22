import { getDate } from '@repo/api/apis';
import { getKoreanDate, isTimeAfter, isTimeBefore } from '@repo/utils';

import { GuidePage } from '@/pageContainer';

import { getEditability, getMyOneseo } from '../apis';

export default async function Guide() {
  const [data, dateList, editability] = await Promise.all([
    getMyOneseo(),
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

  return (
    <GuidePage initialData={data} isOneseoWrite={isOneseoWrite} initialEditability={editability} />
  );
}
