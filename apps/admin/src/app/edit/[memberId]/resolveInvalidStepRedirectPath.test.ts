import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveInvalidStepRedirectPath } from './resolveInvalidStepRedirectPath';

test('step이 없으면 동일한 edit 경로의 step=1로 리다이렉트한다', () => {
  assert.equal(resolveInvalidStepRedirectPath(1, undefined), '/edit/1?step=1');
});

test('step이 1~4 범위를 벗어나면 동일한 edit 경로의 step=1로 리다이렉트한다', () => {
  assert.equal(resolveInvalidStepRedirectPath(1, '0'), '/edit/1?step=1');
  assert.equal(resolveInvalidStepRedirectPath(1, '5'), '/edit/1?step=1');
});

test('step이 1~4 범위 안이면 리다이렉트하지 않는다', () => {
  assert.equal(resolveInvalidStepRedirectPath(1, '1'), null);
  assert.equal(resolveInvalidStepRedirectPath(1, '2'), null);
  assert.equal(resolveInvalidStepRedirectPath(1, '3'), null);
  assert.equal(resolveInvalidStepRedirectPath(1, '4'), null);
});
