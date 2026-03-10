import { GraduationTypeValueEnum } from 'types';

import {
  artPhysicalCandidateFreeGradeIndexArray,
  artPhysicalCandidateFreeSemesterArray,
  artPhysicalCandidateFreeSemesterIndexArray,
  artPhysicalCandidateFreeYearArray,
  artPhysicalGraduationArray,
  artPhysicalGraduationIndexArray,
} from 'shared/constants/artPhysical';

interface GetArtPhysicalArraysParams {
  graduationType: GraduationTypeValueEnum;
  isFreeSemester: boolean;
  isFreeGrade: boolean;
}

export function getArtPhysicalArray({
  graduationType,
  isFreeSemester,
  isFreeGrade,
}: GetArtPhysicalArraysParams) {
  if (graduationType === GraduationTypeValueEnum.CANDIDATE) {
    if (isFreeSemester) return artPhysicalCandidateFreeSemesterArray;
    if (isFreeGrade) return artPhysicalCandidateFreeYearArray;
  }
  return artPhysicalGraduationArray;
}

export function getArtPhysicalIndexArray({
  graduationType,
  isFreeSemester,
  isFreeGrade,
}: GetArtPhysicalArraysParams) {
  if (graduationType === GraduationTypeValueEnum.CANDIDATE) {
    if (isFreeSemester) return artPhysicalCandidateFreeSemesterIndexArray;
    if (isFreeGrade) return artPhysicalCandidateFreeGradeIndexArray;
  }
  return artPhysicalGraduationIndexArray;
}
