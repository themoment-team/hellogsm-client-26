import { plusAll } from 'shared/utils';

describe('plusAll', () => {
  test('1차원 배열을 입력하면 모든 요소의 합이 반환되어야 한다.', () => {
    expect(plusAll([1, 2, 3])).toBe(6);
  });

  test('2차원 배열을 입력하면 모든 요소의 합이 반환되어야 한다.', () => {
    expect(
      plusAll([
        [1, 2],
        [3, 4],
      ]),
    ).toBe(10);
  });

  test('빈 배열 또는 빈 배열이 포함된 배열을 입력하면 0이 반환되어야 한다.', () => {
    expect(plusAll([])).toBe(0);
    expect(plusAll([[]])).toBe(0);
  });
});
