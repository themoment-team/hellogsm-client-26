export const ACHIEVEMENT_FIELD_LIST = [
  'achievement1_1',
  'achievement1_2',
  'achievement2_1',
  'achievement2_2',
  'achievement3_1',
  'achievement3_2',
] as const;

export type AchievementFieldType = (typeof ACHIEVEMENT_FIELD_LIST)[number];

// @repo/constants는 @repo/types에 의존하지 않으므로(artPhysicalUtils.ts와 같은 방식),
// enum 대신 같은 값을 갖는 문자열 리터럴 타입으로 받는다. 문자열 enum 멤버는 해당
// 리터럴 타입에 그대로 대입되므로 호출부는 enum을 넘기면 된다.
type LiberalSystemType = '자유학년제' | '자유학기제';
type FreeSemesterType = '1-1' | '1-2' | '2-1' | '2-2' | '3-1' | '3-2';
type GraduationType = 'CANDIDATE' | 'GRADUATE' | 'GED';

const FREE_SEMESTER_TO_ACHIEVEMENT_FIELD: Record<FreeSemesterType, AchievementFieldType> = {
  '1-1': 'achievement1_1',
  '1-2': 'achievement1_2',
  '2-1': 'achievement2_1',
  '2-2': 'achievement2_2',
  '3-1': 'achievement3_1',
  '3-2': 'achievement3_2',
};

interface GetUsedAchievementFieldsParams {
  liberalSystem: LiberalSystemType | null;
  graduationType: GraduationType;
  freeSemester: FreeSemesterType | null;
}

/**
 * 이번 전형에서 실제로 성적을 입력받는 학기 목록. 입력 폼(FreeGradeForm/FreeSemesterForm)이
 * 화면에 그리는 학기와 같은 기준이며, 여기 없는 학기는 서버로 null이 가야 한다.
 *
 * - 자유학년제: 1학년 전체가 자유학년이라 성적이 없다 → 2학년 1학기부터
 * - 자유학기제: 지정한 자유학기 한 학기만 빠진다
 * - 졸업예정자: 3학년 2학기가 아직 없다
 *
 * liberalSystem이 아직 정해지지 않은 상태(null)는 자유학기제로 본다 — 확실하지 않을 때
 * 학기를 빼는 쪽으로 기울면 멀쩡히 입력된 성적을 지워버릴 수 있기 때문이다.
 */
export const getUsedAchievementFields = ({
  liberalSystem,
  graduationType,
  freeSemester,
}: GetUsedAchievementFieldsParams): AchievementFieldType[] => {
  if (graduationType === 'GED') return [];

  return ACHIEVEMENT_FIELD_LIST.filter((field) => {
    if (graduationType === 'CANDIDATE' && field === 'achievement3_2') return false;

    if (liberalSystem === '자유학년제') {
      return field !== 'achievement1_1' && field !== 'achievement1_2';
    }

    return !(freeSemester && field === FREE_SEMESTER_TO_ACHIEVEMENT_FIELD[freeSemester]);
  });
};
