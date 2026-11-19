// 입력받은 점수에서 숫자만 추출해 소수 둘째 자리 형식으로 맞춥니다.
// 숫자가 없거나 0~maxScore 범위를 벗어나면 잘못된 입력으로 보고 null을 반환합니다.

export const formatScore = (score: string, maxScore: number = 100): string | null => {
  // 점수에서 숫자와 소숫점만 추출
  const onlyNumberScore = parseFloat(
    score
      .split('')
      .filter((v) => !isNaN(parseInt(v)) || v === '.')
      .join(''),
  );

  if (isNaN(onlyNumberScore) || onlyNumberScore < 0 || onlyNumberScore > maxScore) return null;

  return onlyNumberScore.toFixed(2);
};
