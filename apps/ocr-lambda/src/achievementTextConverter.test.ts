import assert from 'node:assert/strict';
import test from 'node:test';

import type { IRBlock, IRCell } from 'kordoc';

import { convertKordocBlocks } from './achievementTextConverter';

const makeCell = (text: string): IRCell => ({ text, colSpan: 1, rowSpan: 1 });

const makeTableBlock = (rows: string[][]): IRBlock => ({
  type: 'table',
  table: {
    rows: rows.length,
    cols: rows[0]?.length ?? 0,
    hasHeader: false,
    cells: rows.map((row) => row.map(makeCell)),
  },
});

const makeTextBlock = (text: string): IRBlock => ({ type: 'paragraph', text });

/** achievementTextConverter는 "3.교과학습발달상황" 같은 안전 섹션 헤딩을 만나기 전까지는
 * 아무 것도 처리하지 않으므로, 모든 테스트 입력 앞에 이 헤딩을 붙여준다. */
const SAFE_SECTION = makeTextBlock('3.교과학습발달상황');

/** 원점수/성취도 한 줄. 값 자체는 각 테스트에서 중요하지 않으므로 index로 구분만 되게 만든다 */
const scoreLine = (index: number): string => `9${index}/8${index} A(1${index}0)`;

test('단일 학기로 병합된 일반교과 행은 기존과 동일하게 변환된다(회귀 테스트)', () => {
  const table = makeTableBlock([['11', '국어역사', `${scoreLine(1)}\n${scoreLine(2)}`]]);

  const result = convertKordocBlocks([SAFE_SECTION, makeTextBlock('[1학년]'), table]);

  assert.equal(
    result.rawText,
    ['[1학년]', '1', `국어 ${scoreLine(1)}`, `역사 ${scoreLine(2)}`].join('\n'),
  );
  assert.deepEqual(result.unrecognizedSubjectBlobs, []);
});

test('한 행에 서로 다른 학기가 섞이면 과목별 위치에 맞춰 학기를 나눠 찍는다', () => {
  // "1122": kordoc이 4과목을 병합하면서 앞의 2과목은 1학기, 뒤의 2과목은 2학기인 채로
  // 이어붙인 경우. 예전 다수결 로직이면 동률("11" vs "22")일 때 무조건 1학기로 밀어붙여
  // 사회/도덕(실제 2학기)이 1학기로 잘못 찍혔다.
  const table = makeTableBlock([
    [
      '1122',
      '국어사회도덕역사',
      [scoreLine(1), scoreLine(2), scoreLine(3), scoreLine(4)].join('\n'),
    ],
  ]);

  const result = convertKordocBlocks([SAFE_SECTION, makeTextBlock('[2학년]'), table]);

  assert.equal(
    result.rawText,
    [
      '[2학년]',
      '1',
      `국어 ${scoreLine(1)}`,
      `사회 ${scoreLine(2)}`,
      '2',
      `도덕 ${scoreLine(3)}`,
      `역사 ${scoreLine(4)}`,
    ].join('\n'),
  );
});

test('학기 칸이 다음 행 몫까지 이어붙어도(이월) 각 행은 자기 몫만큼만 위치대로 해석한다', () => {
  // 실제 관찰된 패턴: 6과목 행의 학기 칸에 다음 8과목 행의 학기 값까지 합쳐서 14자로 나온다.
  // 여기서는 그 14자 자체도 앞 6자/뒤 8자가 서로 다른 학기로 섞인 경우를 검증한다.
  const rowASubjects = '국어사회도덕역사수학과학'; // 6과목: 앞 3과목 1학기, 뒤 3과목 2학기
  const rowAScores = [1, 2, 3, 4, 5, 6].map(scoreLine).join('\n');
  const rowBSubjects = '기술가정정보영어체육음악미술국어기술가정'; // 8과목(마지막 둘은 재사용), 전부 2학기
  const rowBScores = [7, 8, 9, 10, 11, 12, 13, 14].map(scoreLine).join('\n');
  const mergedDigits = '111222' + '22222222'; // row A 몫(6자) + row B 몫(8자)

  const table = makeTableBlock([
    [mergedDigits, rowASubjects, rowAScores],
    ['', rowBSubjects, rowBScores],
  ]);

  const result = convertKordocBlocks([SAFE_SECTION, makeTextBlock('[3학년]'), table]);

  assert.equal(
    result.rawText,
    [
      '[3학년]',
      '1',
      `국어 ${scoreLine(1)}`,
      `사회 ${scoreLine(2)}`,
      `도덕 ${scoreLine(3)}`,
      '2',
      `역사 ${scoreLine(4)}`,
      `수학 ${scoreLine(5)}`,
      `과학 ${scoreLine(6)}`,
      '2',
      `기술가정 ${scoreLine(7)}`,
      `정보 ${scoreLine(8)}`,
      `영어 ${scoreLine(9)}`,
      `체육 ${scoreLine(10)}`,
      `음악 ${scoreLine(11)}`,
      `미술 ${scoreLine(12)}`,
      `국어 ${scoreLine(13)}`,
      `기술가정 ${scoreLine(14)}`,
    ].join('\n'),
  );
});

test('학기 칸 길이가 과목 수보다 짧아 과목별 귀속을 확정할 수 없으면 자동 기입 대신 검수 대상으로 남긴다', () => {
  // "12"는 2글자인데 과목은 4개다 — 어느 과목이 몇 학기인지 위치로 알 수 없는 상태이므로,
  // 예전처럼 다수결(동률이라 1학기)로 밀어 넣지 않고 이 행 자체를 건너뛰며, 검수할 수
  // 있도록 unrecognizedSubjectBlobs에 과목/점수 원문을 남긴다.
  const table = makeTableBlock([
    ['12', '국어사회도덕역사', [1, 2, 3, 4].map(scoreLine).join('\n')],
  ]);

  const result = convertKordocBlocks([SAFE_SECTION, makeTextBlock('[1학년]'), table]);

  assert.equal(result.rawText, '');
  assert.deepEqual(result.unrecognizedSubjectBlobs, [
    [
      `국어 ${scoreLine(1)}`,
      `사회 ${scoreLine(2)}`,
      `도덕 ${scoreLine(3)}`,
      `역사 ${scoreLine(4)}`,
    ].join(' / '),
  ]);
});

test('같은 표 안에서 학기 칸이 비어도 이미 확정된 반대 학기로 안전하게 추론한다(기존 동작 회귀 테스트)', () => {
  const table = makeTableBlock([
    ['11', '국어사회', [1, 2].map(scoreLine).join('\n')],
    ['', '국어사회', [3, 4].map(scoreLine).join('\n')],
  ]);

  const result = convertKordocBlocks([SAFE_SECTION, makeTextBlock('[1학년]'), table]);

  assert.equal(
    result.rawText,
    [
      '[1학년]',
      '1',
      `국어 ${scoreLine(1)}`,
      `사회 ${scoreLine(2)}`,
      '2',
      `국어 ${scoreLine(3)}`,
      `사회 ${scoreLine(4)}`,
    ].join('\n'),
  );
});
