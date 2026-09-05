import {
  artPhysicalCandidateFreeGradeIndexArray,
  artPhysicalCandidateFreeSemesterArray,
  artPhysicalCandidateFreeSemesterIndexArray,
  artPhysicalCandidateFreeYearArray,
  artPhysicalGraduateFreeSemesterArray,
  artPhysicalGraduateFreeSemesterIndexArray,
  artPhysicalGraduationArray,
  artPhysicalGraduationIndexArray,
} from './artPhysical';

type GraduationType = 'CANDIDATE' | 'GRADUATE' | 'GED';

interface GetArtPhysicalArraysParams {
  graduationType: GraduationType;
  isFreeSemester: boolean;
  isFreeGrade: boolean;
}

export function getArtPhysicalArray({
  graduationType,
  isFreeSemester,
  isFreeGrade,
}: GetArtPhysicalArraysParams) {
  if (graduationType === 'CANDIDATE') {
    if (isFreeSemester) return artPhysicalCandidateFreeSemesterArray;
    if (isFreeGrade) return artPhysicalCandidateFreeYearArray;
  }
  if (isFreeSemester) return artPhysicalGraduateFreeSemesterArray;
  return artPhysicalGraduationArray;
}

export function getArtPhysicalIndexArray({
  graduationType,
  isFreeSemester,
  isFreeGrade,
}: GetArtPhysicalArraysParams) {
  if (graduationType === 'CANDIDATE') {
    if (isFreeSemester) return artPhysicalCandidateFreeSemesterIndexArray;
    if (isFreeGrade) return artPhysicalCandidateFreeGradeIndexArray;
  }
  if (isFreeSemester) return artPhysicalGraduateFreeSemesterIndexArray;
  return artPhysicalGraduationIndexArray;
}
