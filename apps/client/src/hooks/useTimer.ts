import { useEffect, useRef, useState } from 'react';

type IntervalRef = React.RefObject<ReturnType<typeof setInterval> | undefined>;

const stopCountdown = (intervalRef: IntervalRef) => {
  clearInterval(intervalRef.current);
  intervalRef.current = undefined;
};

// 이전 interval을 정리한 뒤 from부터 1초마다 줄이고, 0 이하가 되면 멈춤
const startCountdown = (
  intervalRef: IntervalRef,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  from: number,
) => {
  stopCountdown(intervalRef);

  let remaining = from;
  intervalRef.current = setInterval(() => {
    remaining -= 1;
    setCount(remaining);
    if (remaining <= 0) stopCountdown(intervalRef);
  }, 1000);
};

const useTimer = ({
  sec,
  setIsFirst,
  keepAfterRefresh,
}: {
  sec: number;
  setIsFirst: React.Dispatch<React.SetStateAction<boolean>>;
  keepAfterRefresh: boolean;
}) => {
  const [count, setCount] = useState<number>(0);
  // interval id는 화면에 쓰이지 않으므로 state 대신 ref에 보관해 불필요한 렌더를 막음
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const startTimer = () => {
    const endTime = new Date().getTime() + sec * 1000;
    if (keepAfterRefresh) document.cookie = `endTime=${endTime}; max-age=${sec}`;

    setCount(sec);
    startCountdown(intervalRef, setCount, sec);
    setIsFirst(false);
  };

  const stopTimer = () => {
    document.cookie = 'endTime=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    stopCountdown(intervalRef);
    setCount(0);
  };

  useEffect(() => {
    // 새로고침 후 타이머 복원: cookie는 클라이언트 전용 외부 저장소라
    // 마운트 후 effect에서 읽어 반영해야 함 (렌더 중 접근 불가)
    const endTime = document.cookie.match('(^|;) ?' + 'endTime' + '=([^;]*)(;|$)');
    if (endTime) {
      const currentTime = new Date().getTime();
      const count = Math.floor((Number(endTime[2]) - currentTime) / 1000);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(count);
      if (count > 0) startCountdown(intervalRef, setCount, count);
    }

    // 언마운트 시 남은 interval 정리
    return () => stopCountdown(intervalRef);
  }, []);

  return { count, startTimer, stopTimer };
};

export default useTimer;
