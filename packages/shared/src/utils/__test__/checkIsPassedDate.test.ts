import { checkIsPassedDate } from 'shared/utils';

describe('checkIsPassedDate', () => {
  test('targetDate가 현재보다 과거라면 true가 반환되어야 한다.', () => {
    const targetDate = new Date('2025-01-01');
    expect(checkIsPassedDate(targetDate)).toBe(true);
  });

  test('targetDate가 현재와 같으면 true가 반환되어야 한다.', () => {
    const targetDate = new Date();
    expect(checkIsPassedDate(targetDate)).toBe(true);
  });

  test('targetDate가 현재보다 미래라면 false가 반환되어야 한다.', () => {
    const targetDate = new Date('2030-01-01');
    expect(checkIsPassedDate(targetDate)).toBe(false);
  });
});
