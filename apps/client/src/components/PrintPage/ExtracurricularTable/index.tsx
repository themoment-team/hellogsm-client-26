import { OneseoStatusType } from 'types';

import { cn } from 'shared/lib/utils';

const ExtracurricularTable = ({ oneseo }: OneseoStatusType) => {
  return (
    <table className={cn('w-full', 'border-collapse', 'border', 'text-[1vh]')}>
      <thead>
        <tr>
          <td
            className={cn(
              'border',
              'border-black',
              'bg-gray-200',
              'p-[0.3vh]',
              'text-center',
              'w-[3%]',
              'leading-tight',
            )}
            rowSpan={2}
          >
            학년
          </td>
          <td
            className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}
            colSpan={6}
          >
            미인정 출결 현황
          </td>
          <td
            className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}
            colSpan={2}
          >
            봉사활동
          </td>
        </tr>
        <tr className={cn('text-center')}>
          <td className={cn('border', 'border-black')}>결석</td>
          <td className={cn('border', 'border-black')}>지각</td>
          <td className={cn('border', 'border-black')}>조퇴</td>
          <td className={cn('border', 'border-black')}>결과</td>
          <td className={cn('border', 'border-black')}>환산일수</td>
          <td className={cn('border', 'border-black')}>환산점</td>
          <td className={cn('border', 'border-black')}>시간</td>
          <td className={cn('border', 'border-black')}>환산점</td>
        </tr>
      </thead>
      <tbody className={cn('text-center')}>
        <tr>
          <td className={cn('border', 'border-black')}>1</td>
          {[
            oneseo.middleSchoolAchievement.absentDays[0],
            oneseo.middleSchoolAchievement.attendanceDays[0],
            oneseo.middleSchoolAchievement.attendanceDays[3],
            oneseo.middleSchoolAchievement.attendanceDays[6],
          ].map((day, index) => (
            <td className={cn('border', 'border-black')} key={day + ' ' + index}>
              {day}
            </td>
          ))}
          <td className={cn('border', 'border-black')} rowSpan={3}>
            {oneseo.middleSchoolAchievement.absentDaysCount}
          </td>
          <td className={cn('border', 'border-black')} rowSpan={3}>
            {oneseo.calculatedScore.attendanceScore}
          </td>
          <td className={cn('border', 'border-black')}>
            {oneseo.middleSchoolAchievement.volunteerTime[0]}
          </td>
          <td className={cn('border', 'border-black')} rowSpan={3}>
            {oneseo.calculatedScore.volunteerScore}
          </td>
        </tr>
        <tr>
          <td className={cn('border', 'border-black')}>2</td>
          {[
            oneseo.middleSchoolAchievement.absentDays[1],
            oneseo.middleSchoolAchievement.attendanceDays[1],
            oneseo.middleSchoolAchievement.attendanceDays[4],
            oneseo.middleSchoolAchievement.attendanceDays[7],
          ].map((day, index) => (
            <td className={cn('border', 'border-black')} key={day + ' ' + index}>
              {day}
            </td>
          ))}
          <td className={cn('border', 'border-black')}>
            {oneseo.middleSchoolAchievement.volunteerTime[1]}
          </td>
        </tr>
        <tr>
          <td className={cn('border', 'border-black')}>3</td>
          {[
            oneseo.middleSchoolAchievement.absentDays[2],
            oneseo.middleSchoolAchievement.attendanceDays[2],
            oneseo.middleSchoolAchievement.attendanceDays[5],
            oneseo.middleSchoolAchievement.attendanceDays[8],
          ].map((day, index) => (
            <td className={cn('border', 'border-black')} key={day + ' ' + index}>
              {day}
            </td>
          ))}
          <td className={cn('border', 'border-black')}>
            {oneseo.middleSchoolAchievement.volunteerTime[2]}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ExtracurricularTable;
