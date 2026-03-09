import { getValuesByEnum } from 'shared/utils';

enum Status {
  A = 'A',
  B = 'B',
  C = 'C',
}

describe('getValuesByEnum', () => {
  test('enum 객체를 전달하면 해당 enum의 값들만 배열로 반환되어야 한다.', () => {
    const result = getValuesByEnum(Status);
    expect(result).toEqual(['A', 'B', 'C']);
  });
});
