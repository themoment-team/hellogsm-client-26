import { OneseoStatusType } from 'types';

import { scoreToAlphabet } from 'client/utils/scoreUtils';

import { GENERAL_SUBJECTS } from 'shared/constants';
import { cn } from 'shared/lib/utils';

type SemesterKey = '1_1' | '1_2' | '2_1' | '2_2' | '3_1' | '3_2';

const semesterLabels: Record<SemesterKey, string> = {
  '1_1': '1학년 1학기',
  '1_2': '1학년 2학기',
  '2_1': '2학년 1학기',
  '2_2': '2학년 2학기',
  '3_1': '3학년 1학기',
  '3_2': '3학년 2학기',
};

const GeneralSubjectsTable = ({ oneseo }: OneseoStatusType) => {
  const { graduationType } = oneseo.privacyDetail;
  const { generalSubjectsScoreDetail } = oneseo.calculatedScore;
  const subjects = [...GENERAL_SUBJECTS, ...(oneseo.middleSchoolAchievement.newSubjects ?? [])];

  const semesters: SemesterKey[] =
    graduationType === 'CANDIDATE'
      ? ['1_1', '1_2', '2_1', '2_2', '3_1']
      : ['2_1', '2_2', '3_1', '3_2'];

  return (
    <table className={cn('w-full', 'border', 'border-black', 'text-center')}>
      <thead>
        <tr>
          <td rowSpan={2} className={cn('w-20', 'border', 'border-black', 'bg-backslash', 'p-1')}>
            <div className={cn('h-[1.2vh]', 'text-right')}>학년</div>
            <div className={cn('h-[1.2vh]', 'text-left')}>과목</div>
          </td>
          {semesters.map((key) => (
            <td
              key={key}
              className={cn('h-[2.2vh]', 'border', 'border-black', 'bg-gray-200', 'p-[0.2vh]')}
            >
              {semesterLabels[key]}
            </td>
          ))}
        </tr>
        <tr>
          {semesters.map((key) => (
            <td
              key={`${key}-성취도`}
              className={cn('h-[2.2vh]', 'border', 'border-black', 'bg-gray-200', 'p-[0.2vh]')}
            >
              성취도
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        {subjects.map((subject, rowIdx) => (
          <tr key={subject}>
            <td className={cn('border', 'border-black')}>{subject}</td>
            {semesters.map((key) => {
              const detailKey = `score${key}` as keyof typeof generalSubjectsScoreDetail;
              const scoreDetail = generalSubjectsScoreDetail[detailKey];
              const scores = oneseo.middleSchoolAchievement[
                `achievement${key}` as keyof typeof oneseo.middleSchoolAchievement
              ] as (number | null)[] | undefined;

              if (!scoreDetail) {
                if (rowIdx === 0) {
                  return (
                    <td
                      key={`${key}-empty`}
                      rowSpan={subjects.length}
                      className={cn(
                        'border',
                        'border-black',
                        'bg-slash',
                        'bg-contain',
                        'bg-no-repeat',
                      )}
                    />
                  );
                }
                return null;
              }

              return (
                <td key={`${key}-${rowIdx}`} className={cn('border', 'border-black')}>
                  {scoreToAlphabet[scores?.[rowIdx] ?? -1] ?? ''}
                </td>
              );
            })}
          </tr>
        ))}

        <tr>
          <td className={cn('border', 'border-black')}>환산점</td>
          {semesters.map((key) => {
            const detailKey = `score${key}` as keyof typeof generalSubjectsScoreDetail;
            return (
              <td key={`${key}-total`} className={cn('border', 'border-black')}>
                {generalSubjectsScoreDetail[detailKey] ?? ''}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default GeneralSubjectsTable;
