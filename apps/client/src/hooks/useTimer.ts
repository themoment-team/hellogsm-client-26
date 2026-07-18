import { useEffect, useState } from 'react';

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
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const startTimer = () => {
    const endTime = new Date().getTime() + sec * 1000;
    if (keepAfterRefresh) document.cookie = `endTime=${endTime}; max-age=${sec}`;

    setCount(sec);

    const intervalId = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    setIntervalId(intervalId);
    setIsFirst(false);
  };

  const stopTimer = () => {
    document.cookie = 'endTime=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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

      const intervalId = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      setIntervalId(intervalId);
    }
  }, []);

  useEffect(() => {
    if (intervalId && count <= 0) {
      clearInterval(intervalId);
    }
  }, [intervalId, count]);

  return { count, startTimer, stopTimer };
};

export default useTimer;
