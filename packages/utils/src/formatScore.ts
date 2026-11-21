// 숫자와 소수점 하나로만 이뤄진 점수를 소수 둘째 자리 형식으로 맞춥니다.
// 부호·단위·지수 표기 등 다른 문자가 섞였거나 0~maxScore 범위를 벗어나면 잘못된 입력으로 보고 null을 반환합니다.
// (다른 문자를 걸러내고 숫자만 뽑으면 '-5'가 5점, '1e5'가 15점처럼 다른 값으로 저장될 수 있음)

const SCORE_PATTERN = /^(\d+\.?\d*|\.\d+)$/;

export const formatScore = (score: string, maxScore: number = 100): string | null => {
  const trimmedScore = score.trim();

  if (!SCORE_PATTERN.test(trimmedScore)) return null;

  const numberScore = Number(trimmedScore);

  if (numberScore > maxScore) return null;

  return numberScore.toFixed(2);
};
