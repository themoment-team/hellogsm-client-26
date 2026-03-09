// 입력받은 점수에서 숫자만 추출합니다. 점수가 maxScore보다 클 경우, 뒷 자리를 제거합니다.

const formatScore = (score: string, maxScore: number = 100): string => {
  // 점수에서 숫자와 소숫점만 추출
  const onlyNumberScore = parseFloat(
    score
      .split('')
      .filter((v) => !isNaN(parseInt(v)) || v === '.')
      .join(''),
  );

  // 소숫점 2자리로 자르고 maxScore와 비교
  const scoreResult = Math.min(onlyNumberScore, maxScore).toFixed(2);

  return scoreResult;
};

export default formatScore;
