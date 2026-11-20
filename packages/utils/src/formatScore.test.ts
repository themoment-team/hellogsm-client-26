import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatScore } from './formatScore';

test('점수를 소수 둘째 자리 형식으로 맞춘다', () => {
  assert.equal(formatScore('85'), '85.00');
  assert.equal(formatScore('85.5'), '85.50');
  assert.equal(formatScore('85.'), '85.00');
  assert.equal(formatScore('.5'), '0.50');
});

test('앞뒤 공백은 무시한다', () => {
  assert.equal(formatScore(' 85 '), '85.00');
});

test('0과 maxScore는 범위 안으로 본다', () => {
  assert.equal(formatScore('0'), '0.00');
  assert.equal(formatScore('100'), '100.00');
  assert.equal(formatScore('50', 50), '50.00');
});

test('maxScore보다 큰 값은 maxScore로 바꾸지 않고 null을 반환한다', () => {
  assert.equal(formatScore('855'), null);
  assert.equal(formatScore('100.01'), null);
  assert.equal(formatScore('60', 50), null);
});

test('음수는 부호를 떼고 저장하지 않고 null을 반환한다', () => {
  assert.equal(formatScore('-5'), null);
  assert.equal(formatScore('-0'), null);
});

test('숫자 외의 문자가 섞이면 숫자만 뽑지 않고 null을 반환한다', () => {
  assert.equal(formatScore('85점'), null);
  assert.equal(formatScore('1e5'), null);
  assert.equal(formatScore('12.3.4'), null);
  assert.equal(formatScore('8 5'), null);
});

test('숫자가 없으면 null을 반환한다', () => {
  assert.equal(formatScore(''), null);
  assert.equal(formatScore('abc'), null);
  assert.equal(formatScore('.'), null);
});
