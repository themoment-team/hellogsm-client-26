import {
  GraduationEnum,
  ScreeningEnum,
  MajorEnum,
  achievementGradeValues,
  OneseoStatusType,
} from 'types';

import { cn } from 'shared/lib/utils';

const tdStyle = 'border border-black';
const thStyle = 'border border-black bg-[#e9e9e9] p-[0.2vh] font-medium align-middle';

const OneseoStatus = ({ oneseo }: OneseoStatusType) => {
  const { graduationDate, graduationType, schoolName, schoolAddress, studentNumber } =
    oneseo.privacyDetail;
  const {
    attendanceScore,
    volunteerScore,
    totalScore,
    generalSubjectsScoreDetail,
    artsPhysicalSubjectsScore,
    totalSubjectsScore,
  } = oneseo.calculatedScore;

  const isGED = graduationType === 'GED';

  const [year, month] = graduationDate.split('-');

  const achievementScoreMap: Record<string, keyof typeof generalSubjectsScoreDetail> = {
    achievement1_1: 'score1_1',
    achievement1_2: 'score1_2',
    achievement2_1: 'score2_1',
    achievement2_2: 'score2_2',
    achievement3_1: 'score3_1',
    achievement3_2: 'score3_2',
  };

  return (
    <table
      className={cn(
        'mx-auto',
        'w-full',
        'border-collapse',
        'text-center',
        'text-[1.2vh]',
        'leading-[2.2vh]',
      )}
    >
      <colgroup>
        <col style={{ width: '3%' }} /> {/* 지원자현황 */}
        <col style={{ width: '6%' }} /> {/* 교과성적 */}
        <col style={{ width: '8%' }} /> {/* 1-1 */}
        <col style={{ width: '8%' }} /> {/* 1-2 */}
        <col style={{ width: '8%' }} /> {/* 2-1 */}
        <col style={{ width: '8%' }} /> {/* 2-2 */}
        <col style={{ width: '8%' }} /> {/* 3-1 */}
        <col style={{ width: '8%' }} /> {/* 3-2 */}
        <col style={{ width: '10%' }} /> {/* 예체능 */}
        <col style={{ width: '8%' }} /> {/* 소계1 */}
        <col style={{ width: '9%' }} /> {/* 소계2 */}
        <col style={{ width: '8%' }} /> {/* 합계1 */}
        <col style={{ width: '9%' }} /> {/* 합계2 */}
      </colgroup>
      <tbody>
        <tr>
          <td className={cn(thStyle, 'w-[3%]', 'border-l-0', 'border-t-0')} rowSpan={9}>
            지원자 현황
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle, 'border-t-0')} colSpan={2} rowSpan={2}>
            출신중학교
          </td>
          <td
            colSpan={3}
            className={cn(
              tdStyle,
              isGED && ['bg-slash', 'bg-contain', 'bg-no-repeat'],
              'border-t-0',
            )}
          >
            {!isGED && schoolName}
          </td>
          <td colSpan={5} className={cn(tdStyle, 'border-t-0')}>
            {year}년 {month}월 {GraduationEnum[graduationType]}
          </td>
          <td className={cn(thStyle, 'border-t-0')}>학번</td>
          <td
            className={cn(
              tdStyle,
              isGED && ['bg-slash', 'bg-contain', 'bg-no-repeat'],
              'border-t-0',
            )}
          >
            {!isGED && studentNumber}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)}>주소</td>
          <td
            colSpan={9}
            className={cn(tdStyle, isGED && ['bg-slash', 'bg-contain', 'bg-no-repeat'])}
          >
            {!isGED && schoolAddress}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} colSpan={12}>
            전 형 구 분
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={12}>
            {ScreeningEnum[oneseo.wantedScreening]}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} rowSpan={2}>
            교과 <br /> 성적
          </td>
          {['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '예체능'].map((label) => (
            <td key={label} className={cn(thStyle)}>
              {label}
            </td>
          ))}
          <td className={cn(thStyle)} colSpan={2}>
            소계
          </td>
          <td className={cn(thStyle, 'leading-tight')} colSpan={2} rowSpan={2}>
            합계
            <br />
            (환산 총점)
          </td>
        </tr>
        <tr>
          {isGED ? (
            <>
              <td className={cn(tdStyle)} colSpan={7}>
                {oneseo.middleSchoolAchievement.gedAvgScore}
              </td>
              <td className={cn(tdStyle)} colSpan={2}>
                {totalSubjectsScore}
              </td>
            </>
          ) : (
            <>
              {achievementGradeValues.map((gradeKey) =>
                !oneseo.middleSchoolAchievement[gradeKey]?.length ? (
                  <td
                    key={gradeKey}
                    className={cn(tdStyle, 'bg-slash', 'bg-contain', 'bg-no-repeat')}
                  />
                ) : (
                  <td key={gradeKey} className={cn(tdStyle)}>
                    {generalSubjectsScoreDetail[achievementScoreMap[gradeKey]]}
                  </td>
                ),
              )}
              <td className={cn(tdStyle)}>{artsPhysicalSubjectsScore}</td>
              <td className={cn(tdStyle)} colSpan={2}>
                {parseFloat(
                  (
                    (oneseo.calculatedScore.generalSubjectsScore ?? 0) +
                    (artsPhysicalSubjectsScore ?? 0)
                  ).toFixed(3),
                )}
              </td>
            </>
          )}
        </tr>
        <tr>
          <td className={cn(thStyle)} rowSpan={2}>
            비교과 <br /> 성적
          </td>
          <td className={cn(thStyle)} colSpan={4}>
            출석
          </td>
          <td className={cn(thStyle)} colSpan={3}>
            봉사활동
          </td>
          <td className={cn(thStyle)} colSpan={2}>
            소계
          </td>
          <td className={cn(tdStyle)} colSpan={2} rowSpan={2}>
            {totalScore}
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={4}>
            {attendanceScore}
          </td>
          <td className={cn(tdStyle)} colSpan={3}>
            {volunteerScore}
          </td>
          <td className={cn(tdStyle)} colSpan={2}>
            {attendanceScore + volunteerScore}
          </td>
        </tr>
        <tr>
          <td
            className={cn(thStyle, 'border-l-0')}
            rowSpan={4}
            colSpan={2}
            style={{ height: '7vh' }}
          >
            지원구분
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} colSpan={4}>
            1지망 학과
          </td>
          <td className={cn(thStyle)} colSpan={3}>
            2지망 학과
          </td>
          <td className={cn(thStyle)} colSpan={4}>
            3지망 학과
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={4}>
            {MajorEnum[oneseo.desiredMajors.firstDesiredMajor]}
          </td>
          <td className={cn(tdStyle)} colSpan={3}>
            {MajorEnum[oneseo.desiredMajors.secondDesiredMajor]}
          </td>
          <td className={cn(tdStyle)} colSpan={4}>
            {MajorEnum[oneseo.desiredMajors.thirdDesiredMajor]}
          </td>
        </tr>
        <tr>
          <td className={cn(tdStyle)} colSpan={11} style={{ textAlign: 'start' }}>
            1.(인공지능(AI)과/ 스마트IoT과/ 소프트웨어개발과) 중 지망 학과를 순서대로 기록. <br />
            2. 지원학과는 희망 순에 따라 3개 학과를 모두 기록해야 함.
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OneseoStatus;
