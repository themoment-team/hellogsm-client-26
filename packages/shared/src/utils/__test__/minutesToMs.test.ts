import { minutesToMs } from 'shared/utils';

describe('minutesToMs', () => {
  test('1을 입력하면 60000이 반환되어야 한다.', () => {
    expect(minutesToMs(1)).toBe(60000);
  });

  test('5를 입력하면 300000이 반환되어야 한다.', () => {
    expect(minutesToMs(5)).toBe(300000);
  });

  test('0을 입력하면 0이 반환되어야 한다.', () => {
    expect(minutesToMs(0)).toBe(0);
  });
});
