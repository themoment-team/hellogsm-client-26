import { OneseoStatusType } from 'types';

import { getArtPhysicalScores, scoreToAlphabet, semesterArray } from 'client/utils';

import { ARTS_PHYSICAL_SUBJECTS } from 'shared/constants';
import { cn } from 'shared/lib/utils';

const ArtsPhysicalTable = ({ oneseo }: OneseoStatusType) => {
  const artPhysicalScores = getArtPhysicalScores(oneseo);
  const totalArtsPhysicalConvertedScore = oneseo.calculatedScore?.artsPhysicalSubjectsScore || 0;

  const availableSemesters = semesterArray.filter((semester) => {
    if (oneseo.privacyDetail.graduationType === 'GRADUATE') {
      return ['2-1', '2-2', '3-1', '3-2'].includes(semester);
    } else if (oneseo.privacyDetail.graduationType === 'CANDIDATE') {
      return semester !== '3-2';
    }
    return false;
  });

  const semesterLabelMap: Record<string, string> = {
    '1-1': '1학년 1학기',
    '1-2': '1학년 2학기',
    '2-1': '2학년 1학기',
    '2-2': '2학년 2학기',
    '3-1': '3학년 1학기',
    '3-2': '3학년 2학기',
  };

  return (
    <table className={cn('w-full', 'border', 'border-black', 'text-center')}>
      <thead>
        <tr>
          <th
            rowSpan={2}
            className={cn('relative', 'w-20', 'border', 'border-black', 'bg-backslash', 'p-1')}
          >
            <div className={cn('h-[1.2vh]', 'text-right', 'font-normal')}>학년</div>
            <div className={cn('h-[1.2vh]', 'text-left', 'font-normal')}>과목</div>
          </th>
          {availableSemesters.map((semester) => (
            <td
              key={semester}
              className={cn('h-[2.2vh]', 'border', 'border-black', 'bg-gray-200', 'p-[0.2vh]')}
            >
              {semesterLabelMap[semester] ?? semester}
            </td>
          ))}
        </tr>
        <tr>
          {availableSemesters.map((semester, idx) => (
            <td
              key={`achievement-${semester}-${idx}`}
              className={cn(
                'h-[2.2vh]',
                'border',
                'border-black',
                'bg-gray-200',
                'p-[0.2vh]',
                'text-center',
              )}
            >
              성취도
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        {ARTS_PHYSICAL_SUBJECTS.map((subject, rowIdx) => (
          <tr key={subject}>
            <td className={cn('border', 'border-black')}>{subject}</td>
            {availableSemesters.map((semester, colIdx) => {
              const actualColIdx = semesterArray.indexOf(semester);
              const scoresInSemester = artPhysicalScores[actualColIdx];
              const isSemesterScoreEmpty = Array.isArray(scoresInSemester)
                ? scoresInSemester.every((s) => s === null || s === undefined)
                : true;

              if (isSemesterScoreEmpty) {
                if (rowIdx === 0) {
                  return (
                    <td
                      key={`merged-${colIdx}`}
                      rowSpan={ARTS_PHYSICAL_SUBJECTS.length}
                      className={cn(
                        'relative',
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

              const score = artPhysicalScores[actualColIdx]?.[rowIdx];
              return (
                <td key={`score-${colIdx}-${rowIdx}`} className={cn('border', 'border-black')}>
                  {scoreToAlphabet[score ?? -1] || ''}
                </td>
              );
            })}
          </tr>
        ))}

        <tr>
          <td className={cn('border', 'border-black')}>환산점</td>
          <td className={cn('border', 'border-black')} colSpan={availableSemesters.length}>
            {totalArtsPhysicalConvertedScore}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ArtsPhysicalTable;
