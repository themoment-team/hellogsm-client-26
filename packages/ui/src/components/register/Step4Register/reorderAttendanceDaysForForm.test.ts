import assert from 'node:assert/strict';
import test from 'node:test';

import { reorderAttendanceDaysForForm } from './reorderAttendanceDaysForForm';

test('null 입력은 그대로 null로 통과시킨다', () => {
  assert.equal(reorderAttendanceDaysForForm(null), null);
});

test('서버의 학년 단위 배열을 폼이 기대하는 항목 단위 배열로 재배열한다(회귀 테스트)', () => {
  // 서버 순서: (학년-1)*3 + [지각,조퇴,결과] → 학년1[지각,조퇴,결과], 학년2[...], 학년3[...]
  // 폼 순서: 항목*3 + (학년-1) → 지각[학년1,학년2,학년3], 조퇴[...], 결과[...]
  const late1 = 1;
  const early1 = 2;
  const absent1 = 3;
  const late2 = 4;
  const early2 = 5;
  const absent2 = 6;
  const late3 = 7;
  const early3 = 8;
  const absent3 = 9;

  const serverAttendanceDays = [
    late1,
    early1,
    absent1,
    late2,
    early2,
    absent2,
    late3,
    early3,
    absent3,
  ];

  const result = reorderAttendanceDaysForForm(serverAttendanceDays);

  assert.deepEqual(result, [
    late1,
    late2,
    late3,
    early1,
    early2,
    early3,
    absent1,
    absent2,
    absent3,
  ]);
});

test('학년별 값 중 일부가 비어(null) 있어도 해당 자리만 null로 남기고 나머지는 재배열한다', () => {
  const serverAttendanceDays = [1, null, 3, null, 5, null, 7, null, 9];

  const result = reorderAttendanceDaysForForm(serverAttendanceDays);

  assert.deepEqual(result, [1, null, 7, null, 5, null, 3, null, 9]);
});
