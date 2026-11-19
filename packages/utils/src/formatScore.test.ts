import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatScore } from './formatScore';

test('점수를 소수 둘째 자리 형식으로 맞춘다', () => {
  assert.equal(formatScore('85'), '85.00');
  assert.equal(formatScore('85.5'), '85.50');
});

test('0과 maxScore는 범위 안으로 본다', () => {
  assert.equal(formatScore('0'), '0.00');
  assert.equal(formatScore('100'), '100.00');
  assert.equal(formatScore('50', 50), '50.00');
});

test('숫자가 아닌 문자는 제거하고 숫자만 사용한다', () => {
  assert.equal(formatScore('85점'), '85.00');
});

test('maxScore보다 큰 값은 maxScore로 바꾸지 않고 null을 반환한다', () => {
  assert.equal(formatScore('855'), null);
  assert.equal(formatScore('100.01'), null);
  assert.equal(formatScore('60', 50), null);
});

test('숫자가 없으면 null을 반환한다', () => {
  assert.equal(formatScore(''), null);
  assert.equal(formatScore('abc'), null);
});
