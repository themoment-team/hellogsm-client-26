import assert from 'node:assert/strict';
import test from 'node:test';

import {
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  SchoolRecordExtractionAchievementType,
  Step4FormType,
} from '@repo/types';

import { normalizeAchievements } from '../../StepWrapper/normalizeAchievements';

import { mapOcrAchievementFields } from './mapOcrAchievementFields';

const ocrAchievement = (
  overrides: Partial<SchoolRecordExtractionAchievementType>,
): SchoolRecordExtractionAchievementType => ({
  achievement1_1: null,
  achievement1_2: null,
  achievement2_1: null,
  achievement2_2: null,
  achievement3_1: null,
  achievement3_2: null,
  generalSubjects: [],
  newSubjects: [],
  artsPhysicalSubjects: [],
  artsPhysicalAchievement: null,
  absentDays: null,
  attendanceDays: null,
  volunteerTime: null,
  liberalSystem: null,
  freeSemester: null,
  ...overrides,
});

test('자유학년제 졸업자는 OCR이 1-1·1-2를 채워 내려줘도 setValue할 값 자체를 null로 거른다', () => {
  const achievement = ocrAchievement({
    liberalSystem: LiberalSystemValueEnum.FREE_GRADE,
    achievement1_1: [0, 0, 0],
    achievement1_2: [0, 0, 0],
    achievement2_1: [90, 85],
  });

  const result = mapOcrAchievementFields(achievement, {
    liberalSystem: achievement.liberalSystem,
    graduationType: GraduationTypeValueEnum.GRADUATE,
    freeSemester: achievement.freeSemester,
  });

  assert.equal(result.achievement1_1, null);
  assert.equal(result.achievement1_2, null);
  assert.deepEqual(result.achievement2_1, [90, 85]);
});

test('OCR이 인식하지 못해 null로 내려온 칸은 사용 중인 학기여도 null 그대로 둔다', () => {
  const achievement = ocrAchievement({
    liberalSystem: LiberalSystemValueEnum.FREE_SEMESTER,
    achievement2_1: null,
  });

  const result = mapOcrAchievementFields(achievement, {
    liberalSystem: achievement.liberalSystem,
    graduationType: GraduationTypeValueEnum.GRADUATE,
    freeSemester: achievement.freeSemester,
  });

  assert.equal(result.achievement2_1, null);
});

test(
  '자유학년제 졸업자 생기부를 OCR 적용 → 제출 페이로드까지 그대로 흘려보내면 1-1·1-2가 null로 정리된다' +
    '(#497 회귀: handleApplyOcrAchievement의 setValue 반영과 StepWrapper.getOneseo의 제출 정규화 경계를 함께 검증)',
  () => {
    // 실제 버그: 자유학년제 1학년 성취도는 P(이수)인데 OCR이 0('없음')으로 채워 내려와,
    // 반영된 값이 제출 시점까지 그대로 남아 성적 계산이 틀어졌다.
    const achievement = ocrAchievement({
      liberalSystem: LiberalSystemValueEnum.FREE_GRADE,
      achievement1_1: [0, 0, 0],
      achievement1_2: [0, 0, 0],
      achievement2_1: [90, 85],
    });

    // 1단계: handleApplyOcrAchievement가 setValue하기 직전 계산하는 값 (실제 프로덕션 함수)
    const mappedFields = mapOcrAchievementFields(achievement, {
      liberalSystem: achievement.liberalSystem,
      graduationType: GraduationTypeValueEnum.GRADUATE,
      freeSemester: achievement.freeSemester,
    });

    // 2단계: 위 반영 결과가 그대로 담긴 폼 상태를 제출 페이로드 정규화 함수에 전달
    // (실제 프로덕션 함수인 StepWrapper.getOneseo가 호출하는 것과 동일한 함수)
    const formValues = {
      liberalSystem: achievement.liberalSystem,
      freeSemester: achievement.freeSemester,
      ...mappedFields,
    } as Step4FormType;

    const result = normalizeAchievements(formValues, GraduationTypeValueEnum.GRADUATE);

    assert.equal(result.achievement1_1, null);
    assert.equal(result.achievement1_2, null);
    assert.deepEqual(result.achievement2_1, [90, 85]);
  },
);
