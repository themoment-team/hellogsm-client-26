// 마지막 호출 뒤 delay 동안 다시 호출되지 않으면 callback을 실행합니다.
// 호출 시점의 callback과 인자를 그대로 사용하고, 언마운트되면 대기 중인 실행을 취소합니다.

import { useEffect, useRef } from 'react';

export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const run = (...args: Args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };

  const cancel = () => {
    clearTimeout(timerRef.current);
  };

  return { run, cancel };
};
