import type { IRBlock, IRCell } from 'kordoc';

import { isGeneralSubject, isStandardSubject, tokenizeSubjects } from './subjectTokenizer';

/**
 * 이 로그는 생기부 원문 셀 내용을 그대로 찍는다 — 디버깅에는 꼭 필요하지만, 프로덕션에서
 * 그대로 두면 학생 개인정보가 서버 콘솔 로그에 남는다. 그래서 프로덕션 빌드에서는 아예
 * 호출을 건너뛴다.
 */
const isDebugEnabled = process.env.NODE_ENV !== 'production';
const kordocDebug = (...args: unknown[]): void => {
  // eslint-disable-next-line no-console
  if (isDebugEnabled) console.debug(...args);
};

/**
 * kordoc의 표 재구성 결과를 서버(MiddleSchoolRecordParser)가 원래 읽던 줄 형식으로 되돌린다.
 *
 * 새로운 파서를 만들지 않고, 이미 실제 생활기록부로 검증된 기존 파서를 그대로 재사용하는 것이
 * 목표다. 표가 아닌 블록(제목 등)에서 학년 표시를 복원하고, 표 블록의 각 행에서 원점수/성취도
 * 열(줄바꿈으로 분리됨)과 과목명 열(구분자 없이 붙어 있음)을 찾아 짝을 맞춘다. 어떤 열이
 * 무엇인지 표에 명시되어 있지 않으므로, 각 열의 텍스트 모양으로 역할을 추정한다.
 *
 * 짝을 맞추지 못한 행은 억지로 밀어 넣지 않고 건너뛰며, 그 과목명 원문을
 * unrecognizedSubjectBlobs로 돌려주어 사용자 검수를 요청한다. 표 모양을 추정하지 못한
 * 행(출결·봉사 등)은 셀을 그대로 이어붙여 지나가는 줄로 남겨둔다 — 기존 파서의 정규식은
 * 정확히 일치하는 줄만 소비하므로, 맞지 않는 줄이 섞여도 무시될 뿐 다른 결과를 해치지 않는다.
 */

// 블록 텍스트 전체가 학년 표시 그 자체일 때만 인정한다. 부분 일치를 허용하면 "2024학년도
// 생활기록부" 같은 제목이나 "학년별 출결현황" 같은 캡션에도 반응해 엉뚱한 [N학년] 줄을
// 끼워 넣고, 문서 전체의 학년 판정을 틀어지게 한다.
const GRADE_HEADING = /^\[?\s*([1-3])?\s*학년\s*]?$/;
// kordoc이 병합 셀(여러 과목 행)을 하나의 표 행으로 합칠 때, 학기 열도 과목 수만큼 같은
// 숫자를 이어붙여서 내보낸다(예: 3과목 병합 → "111", 8과목 병합 → "11111111"). 그래서
// 정확히 한 글자짜리 "1"/"2"만 인정하면 이런 병합 행의 학기를 전부 놓친다. 실제로는
// 한 행에 서로 다른 학기가 섞여 병합되는 경우도 있어(예: "11111111222") 순수 반복이
// 아닐 수 있다 — 이때도 놓치지 않도록 1/2로만 이루어진 문자열이면 다수결로 학기를 정한다.
const SEMESTER_DIGITS = /^[12]+$/;
// 원점수/과목평균 부분은 선택 사항이다. 예체능처럼 성취도만 있는 과목이 이 표에 섞여
// 나올 가능성을 배제할 수 없어, 점수 없이 성취도 글자만 있는 줄도 원점수/성취도 열로 인식한다.
const SCORE_LINE = /^(?:[\d.,\s]+\/[\d.,\s]+\s*(?:\([^)]*\))?\s+)?[A-EP]\s*(?:\(\s*\d+\s*\))?$/;
// kordoc이 표를 재구성하면 "원점수/과목평균"("91/77.8")과 "성취도(수강자수)"("A(168)")가
// 서로 다른 열로 분리되어 나온다. SCORE_LINE은 성취도 글자가 있는 열만 인정하므로 원점수
// 열은 걸러지지 않고 통째로 버려진다 — 실제로는 값이 있는데도 원점수/평균이 빠진 채
// "국어 A(168)"처럼 등급만 남아 정보 손실이 생긴다. 그래서 원점수 전용 열도 따로 찾아서
// 있으면 같이 합친다.
const RAW_SCORE_LINE = /^[\d.,\s]+\/[\d.,\s]+$/;
const HANGUL = /[가-힣]/g;

/**
 * 개인정보가 담긴 섹션(인적사항·수상경력·자격증·진로희망·자유학기활동상황·독서활동상황·
 * 행동특성및종합의견). kordoc은 이 섹션도 다른 섹션과 똑같이 "표 하나"로 넘겨주기 때문에,
 * convertTable의 원점수/성취도 열 탐지가 실패하면 convertPassthroughRow가 셀 내용을
 * 그대로 이어붙여 내보낸다 — 그 표가 인적사항(이름·주민번호·주소)이면 그대로 새어나간다.
 * 이 섹션에 들어있는 동안은 표/문단 어느 것도 처리하지 않고 통째로 건너뛴다.
 */
const PII_SECTION_HEADING =
  /(?:\d+\.\s*)?(?:인적\s*[·ㆍ,]?\s*학적\s*사항|수상\s*경력|자격증\s*(?:및|,)?\s*인증\s*(?:취득)?\s*상황|진로\s*희망\s*사항|자유\s*학기\s*활동\s*상황|독서\s*활동\s*상황|행동\s*특성\s*(?:및|,)?\s*종합\s*의\s*견)/;
/** 원서에 실제로 쓰는 섹션. 이 헤딩을 만나면 그 이후로 다시 정상 처리한다 */
const SAFE_SECTION_HEADING =
  /(?:\d+\.\s*)?(?:출결\s*상황|창의적\s*체험\s*활동\s*상황|교과\s*학습\s*발달\s*상황)/;

export interface KordocConversionResult {
  rawText: string;
  unrecognizedSubjectBlobs: string[];
}

const textOrEmpty = (block: IRBlock | IRCell): string => block.text ?? '';

const nonEmptyLines = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const countHangul = (text: string): number => (text.match(HANGUL) ?? []).length;

/** 원점수/성취도 열: 줄마다 "91/77.8 A(168)" 또는 "A(168)"(성취도만) 형태를 갖는 셀이다 */
const findScoreCell = (cells: IRCell[]): IRCell | undefined =>
  cells.find((cell) => {
    const lines = nonEmptyLines(textOrEmpty(cell));
    return lines.length > 0 && lines.every((line) => SCORE_LINE.test(line));
  });

/** 원점수/과목평균 전용 열: 줄마다 "91/77.8" 형태(성취도 글자 없이 숫자만)를 갖는 셀이다 */
const findRawScoreCell = (cells: IRCell[], scoreCell: IRCell): IRCell | undefined =>
  cells.find((cell) => {
    if (cell === scoreCell) return false;
    const lines = nonEmptyLines(textOrEmpty(cell));
    return lines.length > 0 && lines.every((line) => RAW_SCORE_LINE.test(line));
  });

interface SubjectResolution {
  subjects: string[] | null;
  /** 실패했을 때 사용자 검수용으로 보여줄 원문(한글이 가장 많은 후보) */
  fallbackText: string | undefined;
}

/**
 * 과목명 열을 찾아 분해한다. 원점수 셀도, 학기 숫자 하나짜리 셀도 아닌 한글 포함 셀들이
 * 후보인데, "교과"(사회(역사포함)/도덕 같은 상위 분류) 열과 "과목"(국어·역사·수학처럼
 * 실제 과목) 열이 둘 다 후보에 들어올 수 있다. 교과 열은 분류명이 반복되며 한글 수가
 * 오히려 더 많은 경우가 흔해서, "한글이 가장 많은 셀 하나"만 믿으면 교과 열을 잘못
 * 골라 정작 필요한 과목 열을 놓친다.
 *
 * 특히 과목이 1개뿐인 행(예체능 성취도 표)에서 이 문제가 심하다 — 토큰 1개짜리는 사전과
 * 안 맞는 아무 문자열이나 "선택과목 하나"로 쳐서 거의 항상 분해에 "성공"해버리기 때문에,
 * "예술(음악/미술)"처럼 사전에도 없는 상위 분류 열이 실제 과목 열(예: "음악")보다 먼저
 * 성공해버려 "음악"이 "예술"로 잘못 뭉개진다. 그래서 한글 수 순서대로 첫 성공을 그냥
 * 쓰지 않고, 성공하는 후보를 전부 모아 사전에 실제로 있는 표준 과목으로 분해되는 후보를
 * 최우선으로 삼는다(선택과목으로 추측한 토큰이 적을수록 우선) — 확인된 값이 추측보다 낫다.
 * 그 다음에야 한글 수(교과보다 과목 열을 더 신뢰하는 기존 휴리스틱)로 승부를 가른다.
 */
const resolveSubjects = (
  cells: IRCell[],
  scoreCell: IRCell,
  expectedCount: number,
): SubjectResolution => {
  const candidates = cells
    .filter((cell) => cell !== scoreCell && !SEMESTER_DIGITS.test(textOrEmpty(cell).trim()))
    .filter((cell) => countHangul(textOrEmpty(cell)) > 0)
    .sort((a, b) => countHangul(textOrEmpty(b)) - countHangul(textOrEmpty(a)));

  let best: { subjects: string[]; fallbackText: string; guessedCount: number } | undefined;

  for (const candidate of candidates) {
    const text = textOrEmpty(candidate);
    const subjects = tokenizeSubjects(text, expectedCount);
    if (!subjects) continue;

    const guessedCount = subjects.filter((subject) => !isStandardSubject(subject)).length;
    if (!best || guessedCount < best.guessedCount) {
      best = { subjects, fallbackText: text, guessedCount };
      if (guessedCount === 0) break;
    }
  }

  if (best) return { subjects: best.subjects, fallbackText: best.fallbackText };
  return { subjects: null, fallbackText: candidates[0] ? textOrEmpty(candidates[0]) : undefined };
};

/** "1"/"2"로만 이루어진 문자열에서 더 많이 나온 숫자를 고른다(병합 행에 서로 다른 학기가 섞인 경우 대비) */
const majoritySemesterDigit = (digits: string): string => {
  const oneCount = (digits.match(/1/g) ?? []).length;
  const twoCount = digits.length - oneCount;
  return oneCount >= twoCount ? '1' : '2';
};

/** 학기 칸의 원문(다수결 적용 전)을 그대로 돌려준다 — 길이가 과목 수와 안 맞을 때 잘라 쓰기 위함 */
const findSemesterDigitString = (cells: IRCell[]): string | undefined => {
  for (const cell of cells) {
    const text = textOrEmpty(cell).trim();
    if (SEMESTER_DIGITS.test(text)) return text;
  }
  return undefined;
};

/** 원점수/성취도 열을 찾지 못한 행(봉사 등으로 추정)은 셀을 이어붙여 지나가는 줄로 남긴다 */
const convertPassthroughRow = (cells: IRCell[], lines: string[]): void => {
  const joined = cells
    .map((cell) => textOrEmpty(cell))
    .filter((text) => text.trim().length > 0)
    .join(' ');
  if (joined.trim()) lines.push(joined);
};

const cellTextAt = (cells: IRCell[], index: number): string => {
  const cell = cells[index];
  return cell ? textOrEmpty(cell) : '';
};

/** 출결상황 표의 열 헤딩. 이 행을 만나면 이후 데이터 행을 출결 전용 형식으로 처리한다 */
const isAttendanceHeaderRow = (cells: IRCell[]): boolean =>
  cellTextAt(cells, 0).trim() === '학년' && cellTextAt(cells, 1).trim() === '수업일수';

/**
 * 출결 데이터 한 칸을 숫자로 바꾼다. 빈 칸이거나 스캔 잡음("."·"•" 같은 표기)이면 결석·지각
 * 등이 없다는 뜻이므로 0으로 취급한다 — 서버 파서도 실패 시 기본값을 0으로 채우는 것과
 * 같은 원칙이다("성적은 못 읽으면 null이 되어 빈칸으로 보이는데 출결·봉사만 0으로 채워지고
 * 있었다"는 서버 쪽 주석 참고).
 */
const toAttendanceCount = (text: string): number => {
  const trimmed = text.trim();
  return /^\d+$/.test(trimmed) ? Number(trimmed) : 0;
};

/**
 * 출결상황 표는 열이 15개다: 학년, 수업일수, 결석(질병/미인정/기타), 지각(3), 조퇴(3),
 * 결과(3), 특기사항. 서버 파서는 정확히 "학년 수업일수 [숫자 12개]" 또는 "학년 수업일수
 * 개근" 형태의 줄만 인식한다(ATTENDANCE_ROW/ATTENDANCE_PERFECT_ROW 정규식). 그런데 이걸
 * 일반 지나가는 줄 처리(convertPassthroughRow)에 맡기면 빈 칸을 건너뛰고 값이 있는 칸만
 * 이어붙이기 때문에 숫자 12개가 안 맞고, 스캔 잡음("."·"•")까지 섞여 정규식이 절대
 * 매칭되지 않는다 — 그러면 그 학년의 결석·지각·조퇴·결과가 전부 빈칸으로 남는다. 그래서
 * 이 표만은 열 위치를 그대로 지켜서 정해진 형식으로 만든다.
 */
const convertAttendanceRow = (cells: IRCell[], lines: string[]): boolean => {
  const grade = cellTextAt(cells, 0).trim();
  if (!/^[123]$/.test(grade)) return false;

  const schoolDays = cellTextAt(cells, 1).trim();
  if (!/^\d+$/.test(schoolDays)) return false;

  const countCells = Array.from({ length: 12 }, (_, index) => cellTextAt(cells, 2 + index));
  const remark = cellTextAt(cells, 14).trim();
  const allCountsBlank = countCells.every((text) => text.trim().length === 0);

  if (remark === '개근' && allCountsBlank) {
    lines.push(`${grade} ${schoolDays} 개근`);
    return true;
  }

  const counts = countCells.map(toAttendanceCount);
  lines.push(`${grade} ${schoolDays} ${counts.join(' ')}`);
  return true;
};

interface ConversionState {
  lines: string[];
  unrecognizedSubjectBlobs: string[];
  /** 가장 최근에 본 "[N학년]" 텍스트 블록의 학년 — 하지만 이 값 자체가 잘못된 위치에서
   * 나올 수 있다(아래 currentGradeForRow 설명 참고), 그래서 단독으로 신뢰하지 않는다. */
  headingGrade: number | undefined;
  /** 일반교과(9과목) 행이 마지막으로 성공한 시점의 학년. 예체능·선택과목 행의 학년
   * 판정에 이 값을 우선 쓴다 — 자세한 이유는 currentGradeForRow 설명 참고. */
  lastGeneralSubjectsGrade: number | undefined;
  /** 마지막으로 실제 출력에 써넣은 "[N학년]" 줄의 학년(중복 emit 방지용) */
  lastEmittedGrade: number | undefined;
}

/**
 * 이전에는 행 자체에 학기 숫자가 없으면 직전에 읽은 값을 이어받게 했었다. 하지만 실제
 * 데이터로 검증해 보니 위험했다: 같은 표 안에서 완전히 빈 학기 칸을 가진 행이 나오면
 * (예: 1학기 행 바로 뒤에 실제로는 2학기인데 학기 칸이 통째로 비어버린 행), 이어받기가
 * 직전 행의 학기를 그대로 물려줘서 서로 다른 학기의 점수가 같은 학기로 잘못 찍히고,
 * 심하면 올바른 점수 위에 다른 학기 점수가 겹쳐 써진다 — 데이터가 비는 것보다 훨씬
 * 나쁘다. 그래서 행 자체(병합되어 숫자가 반복/혼합됐더라도)에서 학기를 못 찾으면
 * 기본적으로는 이어받지 않고 건너뛴다.
 *
 * 다만 같은 과목이 같은 표 블록 안에 학기 없이 또 나오는 경우(예: 1학기 국어가 이미
 * "1"로 확정된 뒤, 뒤 행에 학기 칸이 빈 채로 국어·역사·수학이 다른 점수로 또 나오는
 * 경우)는 안전하게 추론할 수 있다 — 중학교 교과는 학기가 1/2 둘뿐이고 같은 학기 점수가
 * 중복으로 다시 나올 이유가 없으므로, 그 행의 모든 과목이 이미 정확히 한 학기로만
 * 확정되어 있고 전부 같은 학기라면 "나머지 학기"로 확정해도 된다. 과목 중 하나라도
 * 처음 보거나 이미 두 학기 다 나온 상태면(=애매하면) 추론하지 않는다.
 */
const inferMissingSemesterDigit = (
  subjects: string[],
  usedSemestersBySubject: Map<string, Set<string>>,
): string | undefined => {
  const remainingDigits = subjects.map((subject) => {
    const seen = usedSemestersBySubject.get(subject);
    if (!seen || seen.size !== 1) return undefined;
    return seen.has('1') ? '2' : '1';
  });

  const first = remainingDigits[0];
  if (!first) return undefined;
  return remainingDigits.every((digit) => digit === first) ? first : undefined;
};

/**
 * 이 행의 진짜 학년을 정한다. "[N학년]" 텍스트가 실제 표보다 blocks 배열에서 먼저 나와
 * 버리는 kordoc 순서 오류가 실제로 관찰됐다 — 페이지 위치정보(pageNumber/bbox)로
 * 바로잡으려 했지만, 스캔 OCR 문서는 이 정보 자체가 아예 없어서 그 방법은 쓸 수 없다.
 *
 * 대신 문서 구조 자체를 이용한다: "5.교과학습발달상황" 절 안에서 한 학년의 흐름은 항상
 * [학년 헤딩] → 일반교과 9과목 표(들) → 세부능력특기사항 → 예체능(체육·음악·미술) 표
 * → 세특 → 교양교과(진로와직업 등 선택) 표 → [다음 학년 헤딩] 순서다. 실제로 틀렸던
 * 사례는 전부 "예체능/교양교과 표" 앞에 다음 학년 헤딩이 너무 일찍 끼어든 경우였고,
 * 일반교과 표 자체의 학년 배정은 지금까지 한 번도 틀린 적이 없었다. 그래서 일반교과
 * 행은 헤딩을 그대로 신뢰하고, 예체능·선택과목 행은 "마지막으로 성공한 일반교과 행의
 * 학년"을 우선 쓴다 — 헤딩이 아직 안 왔거나(lastGeneralSubjectsGrade가 없으면) 헤딩값을
 * 그대로 쓴다.
 */
const resolveGradeForRow = (state: ConversionState, subjects: string[]): number | undefined => {
  const isGeneralSubjectsRow = subjects.some((subject) => isGeneralSubject(subject));
  if (isGeneralSubjectsRow) return state.headingGrade;
  return state.lastGeneralSubjectsGrade ?? state.headingGrade;
};

const convertTable = (block: IRBlock, state: ConversionState): void => {
  const rows = block.table?.cells ?? [];
  // 표 블록 하나 범위로만 기록한다 — 다른 표(다른 학년/다른 표 종류)로 새어 나가면 안 된다.
  const usedSemestersBySubject = new Map<string, Set<string>>();
  let inAttendanceTable = false;
  // 학기 칸 원문이 이 행의 과목 수보다 길면, 실제로는 다음 행의 학기 값이 이 행의 셀에
  // 잘못 붙어 나온 것이다(실제로 관찰됨: 6과목 행의 학기 칸이 "111111"+다음 행 8과목
  // 몫인 "22222222"까지 합쳐 14자로 나옴). 초과분을 잘라 다음 행에 넘겨준다 — 길이가
  // 정확히 그 행의 과목 수와 맞을 때만 사용해서, 근거 없이 다른 행까지 오염시키지 않는다.
  let pendingSemesterCarry: string | undefined;

  rows.forEach((cells, rowIndex) => {
    if (isAttendanceHeaderRow(cells)) {
      inAttendanceTable = true;
    }

    if (inAttendanceTable) {
      const rawCells = cells.map(textOrEmpty);
      if (convertAttendanceRow(cells, state.lines)) {
        kordocDebug(
          `[KORDOC-DEBUG] row ${rowIndex}: 출결 행 처리. cells=${JSON.stringify(rawCells)}`,
        );
        return;
      }
      // 헤딩 행이거나 열 구조를 못 맞춘 행은 그대로 지나가는 줄로 남긴다.
      convertPassthroughRow(cells, state.lines);
      return;
    }

    const rawSemesterDigits = findSemesterDigitString(cells);

    const rawCells = cells.map(textOrEmpty);
    const scoreCell = findScoreCell(cells);
    if (!scoreCell) {
      kordocDebug(
        `[KORDOC-DEBUG] row ${rowIndex}: 원점수/성취도 열 못 찾음 → passthrough. cells=${JSON.stringify(rawCells)}`,
      );
      convertPassthroughRow(cells, state.lines);
      return;
    }

    const achievementLines = nonEmptyLines(textOrEmpty(scoreCell));
    const rawScoreCell = findRawScoreCell(cells, scoreCell);
    const rawScoreLines = rawScoreCell ? nonEmptyLines(textOrEmpty(rawScoreCell)) : [];
    // 원점수 열이 있어도 줄 수가 성취도 열과 안 맞으면(병합 방식이 서로 다르면) 잘못 짝지어
    // 합치느니 성취도만 쓰는 게 안전하다.
    const hasMatchingRawScore = rawScoreLines.length === achievementLines.length;
    const scoreLines = hasMatchingRawScore
      ? achievementLines.map((achievement, index) => `${rawScoreLines[index]} ${achievement}`)
      : achievementLines;
    const expectedCount = achievementLines.length;

    let ownSemesterDigit: string | undefined;
    let usedCarry = false;
    if (rawSemesterDigits && rawSemesterDigits.length > expectedCount) {
      ownSemesterDigit = majoritySemesterDigit(rawSemesterDigits.slice(0, expectedCount));
      pendingSemesterCarry = rawSemesterDigits.slice(expectedCount);
    } else if (rawSemesterDigits) {
      ownSemesterDigit = majoritySemesterDigit(rawSemesterDigits);
      pendingSemesterCarry = undefined;
    } else if (pendingSemesterCarry && pendingSemesterCarry.length === expectedCount) {
      ownSemesterDigit = majoritySemesterDigit(pendingSemesterCarry);
      usedCarry = true;
      pendingSemesterCarry = undefined;
    } else {
      pendingSemesterCarry = undefined;
    }

    const { subjects, fallbackText } = resolveSubjects(cells, scoreCell, expectedCount);

    if (!subjects) {
      kordocDebug(
        `[KORDOC-DEBUG] row ${rowIndex}: 과목명 분해 실패. fallbackText=${JSON.stringify(fallbackText)} expectedCount=${scoreLines.length} cells=${JSON.stringify(rawCells)}`,
      );
      if (fallbackText) state.unrecognizedSubjectBlobs.push(fallbackText);
      return;
    }

    const semesterDigit =
      ownSemesterDigit ?? inferMissingSemesterDigit(subjects, usedSemestersBySubject);
    const gradeForRow = resolveGradeForRow(state, subjects);
    kordocDebug(
      `[KORDOC-DEBUG] row ${rowIndex}: 성공. grade=${gradeForRow ?? '(없음)'}(heading=${state.headingGrade ?? '-'},lastGeneral=${state.lastGeneralSubjectsGrade ?? '-'}) semester=${semesterDigit ?? '(없음)'}${usedCarry ? '(이월)' : ownSemesterDigit ? '' : semesterDigit ? '(추론)' : ''} subjects=${JSON.stringify(subjects)} cells=${JSON.stringify(rawCells)}`,
    );
    if (!semesterDigit) return;
    // 학년을 하나도 확정 못 한 행(첫 [N학년] 헤딩보다 앞서 나온 행 등)을 그대로 출력하면,
    // 이전에 이미 써넣은 "[N학년]" 줄이 아직 유효한 상태라 서버 파서가 이 학기·과목 줄을
    // 직전 학년 것으로 잘못 붙여버릴 수 있다(리뷰 지적). 학년이 없으면 이 행 자체를 건너뛴다.
    if (gradeForRow === undefined) return;

    subjects.forEach((subject) => {
      const seen = usedSemestersBySubject.get(subject) ?? new Set<string>();
      seen.add(semesterDigit);
      usedSemestersBySubject.set(subject, seen);
    });

    if (subjects.some((subject) => isGeneralSubject(subject))) {
      state.lastGeneralSubjectsGrade = gradeForRow;
    }

    if (gradeForRow !== state.lastEmittedGrade) {
      state.lines.push(`[${gradeForRow}학년]`);
      state.lastEmittedGrade = gradeForRow;
    }

    state.lines.push(semesterDigit);

    subjects.forEach((subject, index) => {
      state.lines.push(`${subject} ${scoreLines[index]}`);
    });
  });
};

/**
 * 표가 아닌 블록의 전체 텍스트가 학년 표시(예: "1학년", "[1학년]")뿐일 때만 학년 상태를
 * 갱신한다. 예전에는 이 자리에서 바로 "[N학년]" 줄을 출력했는데, 이 텍스트 블록 자체가
 * kordoc 순서상 실제보다 일찍 나올 수 있어(resolveGradeForRow 설명 참고) 그대로 쓰면
 * 안 된다 — 실제 출력은 각 행을 처리할 때 resolveGradeForRow가 정한 학년으로 한다.
 */
const convertHeadingOrText = (block: IRBlock, state: ConversionState): void => {
  const text = textOrEmpty(block).trim();
  const match = GRADE_HEADING.exec(text);
  if (!match || !match[1]) return;

  state.headingGrade = Number(match[1]);
};

/**
 * kordoc이 반환하는 blocks 배열의 순서가 실제 PDF의 시각적 읽기 순서(위→아래, 페이지
 * 순서)와 항상 같지는 않다 — 실제로 확인된 사례: 어떤 PDF에서는 한 페이지 하단의
 * "[3학년]" 학년 표시 텍스트가, 같은 페이지 상단에 있는(그러니까 아직 2학년 소속인)
 * 예체능 표보다 blocks 배열에서 먼저 나왔다. 학년/학기 판정은 배열 순서로 "지금까지
 * 본 마지막 학년 표시"를 추적하는 방식이라, 이 순서가 뒤집히면 2학년 데이터가 통째로
 * 3학년 것으로 잘못 찍힌다. bbox(페이지+좌표)가 모든 블록에 있으면 그걸로 다시 정렬해
 * 진짜 읽기 순서를 복원한다 — 일부 블록만 있으면 어설프게 재배치하다 더 망가질 수
 * 있으니, 전부 있을 때만 정렬하고 아니면 원래 순서를 그대로 믿는다.
 */
const sortBlocksByReadingOrder = (blocks: IRBlock[]): IRBlock[] => {
  const allHavePosition = blocks.every(
    (block) => block.pageNumber !== undefined && block.bbox !== undefined,
  );
  if (!allHavePosition) return blocks;

  return [...blocks].sort((a, b) => {
    const pageDiff = (a.pageNumber ?? 0) - (b.pageNumber ?? 0);
    if (pageDiff !== 0) return pageDiff;
    return (a.bbox?.y ?? 0) - (b.bbox?.y ?? 0);
  });
};

export const convertKordocBlocks = (rawBlocks: IRBlock[]): KordocConversionResult => {
  const state: ConversionState = {
    lines: [],
    unrecognizedSubjectBlobs: [],
    headingGrade: undefined,
    lastGeneralSubjectsGrade: undefined,
    lastEmittedGrade: undefined,
  };

  // 문서 맨 앞(표지·인적사항 등)은 원서에 쓰는 첫 섹션이 나오기 전까지 기본적으로
  // 건너뛴다 — 어떤 섹션인지 특정하지 못해도 무조건 안전한 쪽으로 취급한다.
  let seenFirstSafeSection = false;
  let inSensitiveSection = false;
  let tableBlockCount = 0;

  const hasPositionInfo = rawBlocks.every(
    (block) => block.pageNumber !== undefined && block.bbox !== undefined,
  );
  const blocks = sortBlocksByReadingOrder(rawBlocks);

  kordocDebug(
    `[KORDOC-DEBUG] blocks 총 ${blocks.length}개. 위치정보=${hasPositionInfo ? '있음(정렬함)' : '없음(원래 순서 사용)'} 타입별: ${JSON.stringify(
      blocks.reduce<Record<string, number>>((acc, b) => {
        acc[b.type] = (acc[b.type] ?? 0) + 1;
        return acc;
      }, {}),
    )}`,
  );

  for (const block of blocks) {
    const blockText = textOrEmpty(block);
    if (SAFE_SECTION_HEADING.test(blockText)) {
      seenFirstSafeSection = true;
      inSensitiveSection = false;
      kordocDebug(`[KORDOC-DEBUG] 안전 섹션 진입: ${JSON.stringify(blockText)}`);
    } else if (PII_SECTION_HEADING.test(blockText)) {
      inSensitiveSection = true;
      kordocDebug(`[KORDOC-DEBUG] 민감 섹션 진입(건너뜀): ${JSON.stringify(blockText)}`);
    }

    if (!seenFirstSafeSection || inSensitiveSection) continue;

    if (block.type === 'table') {
      tableBlockCount += 1;
      kordocDebug(
        `[KORDOC-DEBUG] table 블록 #${tableBlockCount} 처리 시작. rows=${block.table?.cells.length ?? 0}`,
      );
      convertTable(block, state);
    } else {
      convertHeadingOrText(block, state);
    }
  }

  kordocDebug(
    `[KORDOC-DEBUG] 최종 rawText (${state.lines.length}줄):\n${state.lines.join('\n')}\n[KORDOC-DEBUG] unrecognizedSubjectBlobs: ${JSON.stringify(state.unrecognizedSubjectBlobs)}`,
  );

  return {
    rawText: state.lines.join('\n'),
    unrecognizedSubjectBlobs: state.unrecognizedSubjectBlobs,
  };
};
