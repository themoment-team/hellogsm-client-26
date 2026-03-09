interface Birth {
  year: string;
  month: string;
  day: string;
}

/**
 * 생년월일 형식 변환
 * @param birth 생년월일 객체
 * @returns YYYY-MM-DD 형식 변환된 생년월일 문자열
 */
const formattedBirthDate = (birth: Birth): string => {
  return `${birth.year}-${birth.month.padStart(2, '0')}-${birth.day.padStart(2, '0')}`;
};

export default formattedBirthDate;
