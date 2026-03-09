import { formattedBirthDate } from 'shared/utils';

describe('formattedBirthDate', () => {
  test('년, 월, 일 정보가 담긴 객체를 전달하면 YYYY-MM-DD 형식으로 반환되어야 한다.', () => {
    const birth = { year: '2008', month: '8', day: '2' };

    expect(formattedBirthDate(birth)).toBe('2008-08-02');
  });
});
