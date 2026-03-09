const plusAll = (numbers: number[] | number[][]): number => {
  const flattenedNumbers = Array.isArray(numbers[0])
    ? (numbers as number[][]).flat()
    : (numbers as number[]);
  return flattenedNumbers.reduce((a, b) => a + b, 0);
};

export default plusAll;
