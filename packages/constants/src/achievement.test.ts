import assert from 'node:assert/strict';
import test from 'node:test';

import { getUsedAchievementFields } from './achievement';

test('GED는 학기 입력 자체가 없으므로 전형/학년제와 무관하게 항상 빈 배열이다', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: '자유학년제',
      graduationType: 'GED',
      freeSemester: null,
    }),
    [],
  );
});

test('자유학년제 졸업예정자는 1학년 전체(1-1·1-2)와 아직 없는 3-2가 빠진다', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: '자유학년제',
      graduationType: 'CANDIDATE',
      freeSemester: null,
    }),
    ['achievement2_1', 'achievement2_2', 'achievement3_1'],
  );
});

test('자유학년제 졸업자는 1학년 전체(1-1·1-2)만 빠지고 3-2는 포함된다', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: '자유학년제',
      graduationType: 'GRADUATE',
      freeSemester: null,
    }),
    ['achievement2_1', 'achievement2_2', 'achievement3_1', 'achievement3_2'],
  );
});

test('자유학기제 졸업예정자는 지정한 자유학기 한 학기와 아직 없는 3-2가 빠진다', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: '자유학기제',
      graduationType: 'CANDIDATE',
      freeSemester: '2-1',
    }),
    ['achievement1_1', 'achievement1_2', 'achievement2_2', 'achievement3_1'],
  );
});

test('자유학기제 졸업자는 지정한 자유학기 한 학기만 빠진다', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: '자유학기제',
      graduationType: 'GRADUATE',
      freeSemester: '3-1',
    }),
    ['achievement1_1', 'achievement1_2', 'achievement2_1', 'achievement2_2', 'achievement3_2'],
  );
});

test('자유학기제인데 아직 자유학기를 고르지 않았다면(freeSemester=null) 어떤 학기도 빠지지 않는다', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: '자유학기제',
      graduationType: 'GRADUATE',
      freeSemester: null,
    }),
    [
      'achievement1_1',
      'achievement1_2',
      'achievement2_1',
      'achievement2_2',
      'achievement3_1',
      'achievement3_2',
    ],
  );
});

test('liberalSystem이 아직 정해지지 않은 null은 자유학기제로 취급한다 — freeSemester가 없으면 전부 포함', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: null,
      graduationType: 'GRADUATE',
      freeSemester: null,
    }),
    [
      'achievement1_1',
      'achievement1_2',
      'achievement2_1',
      'achievement2_2',
      'achievement3_1',
      'achievement3_2',
    ],
  );
});

test('liberalSystem이 null이어도 freeSemester가 이미 정해졌다면 그 학기는 빠진다(자유학기제 취급 회귀 테스트)', () => {
  assert.deepEqual(
    getUsedAchievementFields({
      liberalSystem: null,
      graduationType: 'GRADUATE',
      freeSemester: '1-2',
    }),
    ['achievement1_1', 'achievement2_1', 'achievement2_2', 'achievement3_1', 'achievement3_2'],
  );
});
