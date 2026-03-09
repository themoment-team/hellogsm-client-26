import { formatScore } from 'shared/utils';

describe('formatScore', () => {
  test('"85점"과 같이 숫자+문자 조합을 입력하면 소수점 둘째 자리까지의 숫자 문자열로 변환되어야 한다.', () => {
    expect(formatScore('85점')).toBe('85.00');
  });

  test('100을 초과하는 값이 입력되면 "100.00"으로 변환되어야 한다.', () => {
    expect(formatScore('123.456%')).toBe('100.00');
  });

  test('소수점 이하가 100을 넘는 경우 "100.00"으로 변환되어야 한다.', () => {
    expect(formatScore('99.999')).toBe('100.00');
  });

  test('문자열 내에 100을 넘는 숫자가 포함되어 있으면 "100.00"으로 변환되어야 한다.', () => {
    expect(formatScore('abc100.999xyz')).toBe('100.00');
  });

  test('100 이하의 소수점 숫자는 반올림되어 소수점 둘째 자리까지 반환되어야 한다.', () => {
    expect(formatScore('80.999')).toBe('81.00');
  });
});
