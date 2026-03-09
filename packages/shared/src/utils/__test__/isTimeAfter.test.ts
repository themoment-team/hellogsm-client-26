import { isTimeAfter } from 'shared/utils';

describe('isTimeAfter', () => {
  test('비교 시간이 기준 시간보다 늦으면 true가 반환되어야 한다.', () => {
    const baseTime = new Date('2025-01-01T00:00:00Z');
    const compareTime = new Date('2030-01-01T00:00:00Z');

    expect(isTimeAfter({ baseTime, compareTime })).toBe(true);
  });

  test('비교 시간이 기준 시간보다 빠르면 false가 반환되어야 한다.', () => {
    const baseTime = new Date('2025-01-01T00:00:00Z');
    const compareTime = new Date('2020-01-01T00:00:00Z');

    expect(isTimeAfter({ baseTime, compareTime })).toBe(false);
  });

  test('두 시간이 같으면 false가 반환되어야 한다.', () => {
    const baseTime = new Date('2025-01-01T00:00:00Z');
    const compareTime = new Date('2025-01-01T00:00:00Z');

    expect(isTimeAfter({ baseTime, compareTime })).toBe(false);
  });
});
