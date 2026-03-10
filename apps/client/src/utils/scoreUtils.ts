import { GetMyOneseoType } from 'types';

export const scoreToAlphabet = ['없음', 'E', 'D', 'C', 'B', 'A'] as const;
export const semesterArray = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'] as const;

export const getArtPhysicalScores = (oneseo: GetMyOneseoType) => {
  if (!oneseo || oneseo.privacyDetail.graduationType === 'GED') {
    return [null, null, null, null, null, null];
  }

  const achievements = oneseo.middleSchoolAchievement?.artsPhysicalAchievement || [];
  const graduationType = oneseo.privacyDetail.graduationType;
  const isGraduate = graduationType === 'GRADUATE';
  const isCandidate = graduationType === 'CANDIDATE';

  if (isGraduate) {
    return [
      null,
      null,
      achievements.slice(0, 3),
      achievements.slice(3, 6),
      achievements.slice(6, 9),
      achievements.slice(9, 12),
    ];
  } else if (isCandidate) {
    const { liberalSystem } = oneseo.middleSchoolAchievement;
    if (liberalSystem === '자유학년제') {
      return [
        null,
        null,
        achievements.slice(0, 3),
        achievements.slice(3, 6),
        achievements.slice(6, 9),
        null,
      ];
    }
    return [
      achievements.slice(0, 3),
      achievements.slice(3, 6),
      achievements.slice(6, 9),
      achievements.slice(9, 12),
      achievements.slice(12, 15),
      null,
    ];
  }

  return [null, null, null, null, null, null];
};
