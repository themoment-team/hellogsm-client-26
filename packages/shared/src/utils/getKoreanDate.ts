/**
 * 한국 시간을 반환 합니다.
 *
 * @returns 한국 시간으로 설정된 Date 객체
 */

const getKoreanDate = () => {
  const [date, time] = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Seoul' }).split(', ');
  const [day, month, year] = date.split('/');

  return new Date(`${year}-${month}-${day}T${time}Z`);
};

export default getKoreanDate;
