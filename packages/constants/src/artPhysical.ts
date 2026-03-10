export const artPhysicalGraduationArray = [
  '2학년 1학기',
  '2학년 2학기',
  '3학년 1학기',
  '3학년 2학기',
] as const;

export const artPhysicalCandidateFreeSemesterArray = [
  '1학년 1학기',
  '1학년 2학기',
  '2학년 1학기',
  '2학년 2학기',
  '3학년 1학기',
] as const;

export const artPhysicalCandidateFreeYearArray = [
  '2학년 1학기',
  '2학년 2학기',
  '3학년 1학기',
] as const;

export const artPhysicalGraduationIndexArray = [
  { subject: '체육', registerIndexList: [0, 3, 6, 9] },
  { subject: '음악', registerIndexList: [1, 4, 7, 10] },
  { subject: '미술', registerIndexList: [2, 5, 8, 11] },
] as const;

export const artPhysicalCandidateFreeSemesterIndexArray = [
  { subject: '체육', registerIndexList: [0, 3, 6, 9, 12] },
  { subject: '음악', registerIndexList: [1, 4, 7, 10, 13] },
  { subject: '미술', registerIndexList: [2, 5, 8, 11, 14] },
] as const;

export const artPhysicalCandidateFreeGradeIndexArray = [
  { subject: '체육', registerIndexList: [0, 3, 6] },
  { subject: '음악', registerIndexList: [1, 4, 7] },
  { subject: '미술', registerIndexList: [2, 5, 8] },
] as const;
