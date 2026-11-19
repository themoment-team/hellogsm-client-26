import assert from 'node:assert/strict';
import { test } from 'node:test';

import isOneseoSubmissionPeriod from './isOneseoSubmissionPeriod';

const dateList = {
  oneseoSubmissionStart: '2026-10-20T09:00:00Z',
  oneseoSubmissionEnd: '2026-10-23T17:00:00Z',
};

test('접수 기간 중이면 true를 반환한다', () => {
  assert.equal(isOneseoSubmissionPeriod(dateList, new Date('2026-10-21T12:00:00Z')), true);
});

test('접수 시작 전이면 false를 반환한다', () => {
  assert.equal(isOneseoSubmissionPeriod(dateList, new Date('2026-10-20T08:59:59Z')), false);
});

test('접수 마감 후이면 false를 반환한다', () => {
  assert.equal(isOneseoSubmissionPeriod(dateList, new Date('2026-10-23T17:00:01Z')), false);
});

test('시작·마감 시각과 정확히 같으면 백엔드와 같이 접수 기간으로 보지 않는다', () => {
  assert.equal(isOneseoSubmissionPeriod(dateList, new Date('2026-10-20T09:00:00Z')), false);
  assert.equal(isOneseoSubmissionPeriod(dateList, new Date('2026-10-23T17:00:00Z')), false);
});

test('일정 응답이 없거나 비어 있으면 false를 반환한다', () => {
  const now = new Date('2026-10-21T12:00:00Z');

  assert.equal(isOneseoSubmissionPeriod(undefined, now), false);
  assert.equal(isOneseoSubmissionPeriod({ ...dateList, oneseoSubmissionStart: '' }, now), false);
  assert.equal(isOneseoSubmissionPeriod({ ...dateList, oneseoSubmissionEnd: '' }, now), false);
});
