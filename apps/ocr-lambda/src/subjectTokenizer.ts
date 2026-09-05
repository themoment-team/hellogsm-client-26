import { ARTS_PHYSICAL_SUBJECTS, GENERAL_SUBJECTS } from '@repo/constants';

/**
 * kordoc이 표를 재구성할 때 과목명 열이 구분자 없이 붙어서 나오는 문제를 해결한다. 예:
 * "국어역사수학과학기술가정정보영어" → ["국어", "역사", "수학", "과학", "기술가정", "정보", "영어"]
 *
 * 표준 과목 사전으로 매칭되는 부분은 그대로 잘라내고, 사전에 없는 구간(한문·생활중국어 같은
 * 선택과목)은 다음 표준 과목이 시작되는 지점까지를 통째로 선택과목 하나로 묶는다. 예전 버전은
 * 문자열 전체가 표준 9과목만으로 빈틈없이 나뉘어야만 성공으로 쳐서, 선택과목이 하나라도 섞이면
 * 그 행 전체(표준 과목 값까지 포함해서)를 통째로 버렸다 — 정부24 생기부는 선택과목이 없는 학기가
 * 거의 없어서 이게 정확도 저하의 주된 원인이었다.
 *
 * 일반교과 9과목뿐 아니라 예체능 3과목(체육·음악·미술)도 사전에 포함한다 — 예체능 표는 한 행에
 * "체육음악미술"처럼 여러 과목이 붙어 나올 수 있는데, 사전에 없으면 이것도 구분 못 하고 통째로
 * 선택과목 하나로 뭉쳐버려 개수가 안 맞아 실패한다.
 */

const DICTIONARY_BY_LENGTH_DESC = [...GENERAL_SUBJECTS, ...ARTS_PHYSICAL_SUBJECTS].sort(
  (a, b) => b.length - a.length,
);
const STANDARD_SUBJECT_SET = new Set<string>(DICTIONARY_BY_LENGTH_DESC);
const GENERAL_SUBJECT_SET = new Set<string>(GENERAL_SUBJECTS);

/** 분해된 토큰이 사전에 실제로 있는 표준 과목인지(추측이 아니라 확인된 값인지) 확인한다 */
export const isStandardSubject = (token: string): boolean => STANDARD_SUBJECT_SET.has(token);

/** 일반교과 9과목(국어·사회·도덕·역사·수학·과학·기술가정·정보·영어)인지 확인한다(예체능·선택과 구분용) */
export const isGeneralSubject = (token: string): boolean => GENERAL_SUBJECT_SET.has(token);

/**
 * 선택과목 이름 한 개로 인정할 최대 길이. "생활중국어"/"생활일본어"(5자)처럼 실제 선택과목
 * 이름은 짧다 — 이 상한이 없으면 "교과" 열(같은 분류명이 과목 수만큼 반복되는 열)처럼 전혀
 * 다른 열도 남는 글자를 통째로 선택과목 하나로 욱여넣어 개수만 맞춰버려 성공한 것처럼
 * 오판된다.
 */
const MAX_ELECTIVE_SUBJECT_LENGTH = 8;

/** 공백·중점 등 표기 장식과 "사회(역사포함)"처럼 과목명에 덧붙는 괄호 설명을 제거한다 */
const stripDecorations = (raw: string): string =>
  raw
    .replace(/\([^)]*\)/g, '')
    .replace(/[\s·・ㆍ/,~-]/g, '')
    .trim();

/** position에서 시작하는 표준 과목이 있으면 그 과목명을, 없으면 null을 반환한다 */
const matchStandardSubjectAt = (text: string, position: number): string | null =>
  DICTIONARY_BY_LENGTH_DESC.find((subject) => text.startsWith(subject, position)) ?? null;

/** position부터 시작하는, 표준 과목이 매칭되는 모든 지점(오름차순)을 찾는다 */
const findStandardSubjectStarts = (text: string, from: number): number[] => {
  const starts: number[] = [];
  for (let position = from; position < text.length; position += 1) {
    if (matchStandardSubjectAt(text, position)) starts.push(position);
  }
  return starts;
};

/**
 * text[start..]를 표준 과목/선택과목 토큰 remainingCount개로 나눈다. 표준 과목이 매칭되면
 * 우선 사용하고, 매칭되지 않는 구간은 다음 표준 과목이 시작될 수 있는 지점까지를 선택과목
 * 하나로 묶는다.
 *
 * "다음 표준 과목이 시작되는 지점"이 여러 개일 수 있다는 게 까다롭다 — 예를 들어
 * "생활중국어"는 사전에 없는 선택과목이지만, 그 끝 두 글자 "국어"가 우연히 표준 과목과
 * 일치한다. 제일 먼저 나오는 지점만 보고 거기서 잘라버리면 "생활중"+"국어"로 잘못
 * 쪼개진다. 그래서 가능한 절단 지점을 전부 후보로 놓고, 선택과목을 가장 길게(=가장
 * 적게 쪼개는 쪽으로) 잡는 후보부터 시도해서 목표 개수(remainingCount)에 맞는 조합을
 * 찾을 때까지 역추적한다.
 */
const segment = (text: string, start: number, remainingCount: number): string[] | null => {
  if (remainingCount <= 0) return null;
  if (start === text.length) return null;

  const standardSubject = matchStandardSubjectAt(text, start);
  if (standardSubject) {
    if (start + standardSubject.length === text.length && remainingCount === 1) {
      return [standardSubject];
    }
    const rest = segment(text, start + standardSubject.length, remainingCount - 1);
    if (rest) return [standardSubject, ...rest];

    // start 위치 자체가 표준 과목과 일치하는데도(예: "과학기술가정정보"의 "과학") 그
    // 경로로 목표 개수를 못 맞췄다면, 이 위치를 선택과목의 시작으로 억지로 늘려 잡지
    // 않는다. 그렇게 허용하면 "국어사회도덕수학과학기술가정정보"처럼 실제로는 표준
    // 과목 여러 개가 이어진 열(예: 다른 열의 오탐)도 남는 글자를 몰아넣어 개수만
    // 맞춰버려, 전혀 다른 열이 과목 열인 것처럼 잘못 통과된다.
    return null;
  }

  const boundaries = findStandardSubjectStarts(text, start + 1);
  boundaries.push(text.length);
  const uniqueDescBoundaries = Array.from(new Set(boundaries)).sort((a, b) => b - a);

  for (const boundary of uniqueDescBoundaries) {
    const elective = text.slice(start, boundary);
    if (!elective || elective.length > MAX_ELECTIVE_SUBJECT_LENGTH) continue;

    if (boundary === text.length) {
      if (remainingCount === 1) return [elective];
      continue;
    }

    const rest = segment(text, boundary, remainingCount - 1);
    if (rest) return [elective, ...rest];
  }

  return null;
};

/**
 * @param subjectBlob 구분자 없이 붙어 있는 과목명 문자열
 * @param expectedCount 같은 행의 원점수/성취도 셀을 줄바꿈으로 나눈 개수. 실제 과목 수의 근거다.
 * @returns 분해된 과목명 목록. 개수가 안 맞으면(예: 선택과목 두 개가 구분자 없이 연달아 붙어
 *          어디서 나눠야 할지 알 수 없는 경우) null이다.
 */
export const tokenizeSubjects = (subjectBlob: string, expectedCount: number): string[] | null => {
  const normalized = stripDecorations(subjectBlob);
  if (!normalized || expectedCount <= 0) return null;

  return segment(normalized, 0, expectedCount);
};
