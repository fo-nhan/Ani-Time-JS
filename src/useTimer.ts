import { useState, useRef, useCallback, useEffect } from "react";

export interface UseTimerOptions {
  initialStartTime?: number; // Thời gian bắt đầu ban đầu (timestamp)
}

export  interface UseTimerReturn {
  elapsedTime: number; // Thời gian từ 0
  offsetTime: number; // Thời gian từ thời gian bắt đầu
  timeDifference: number; // Chênh lệch giữa thời gian hiện tại và startTime
  start: () => void; // Bắt đầu bộ đếm
  stop: () => void; // Dừng bộ đếm
  reset: () => void; // Reset bộ đếm về 0
  setTime: (newTime: number) => void; // Cập nhật thời gian bắt đầu
}

export const useTimerInterval = ({ initialStartTime }: UseTimerOptions = {}): UseTimerReturn => {
  const [startTime, setStartTime] = useState<number>(initialStartTime || Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Thời gian từ 0
  const [offsetTime, setOffsetTime] = useState<number>(0); // Thời gian từ startTime
  const [timeDifference, setTimeDifference] = useState<number>(0); // Chênh lệch với thời gian thực
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Trạng thái interval

  // Bắt đầu bộ đếm
  const start = useCallback(() => {
    if (!timerRef.current) {
      const startTimestamp = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setElapsedTime((prev: number) => prev + 1); // Tăng elapsedTime mỗi giây
        setOffsetTime(Math.floor((now - startTime) / 1000)); // Tính thời gian chênh lệch từ startTime
        setTimeDifference(Math.floor((now - startTimestamp) / 1000)); // Chênh lệch thời gian thực
      }, 1000);
    }
  }, [startTime]);

  // Dừng bộ đếm
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset bộ đếm về 0
  const reset = useCallback(() => {
    stop();
    setElapsedTime(0);
    setOffsetTime(0);
    setTimeDifference(0);
  }, [stop]);

  // Cập nhật thời gian bắt đầu và reset bộ đếm
  const setTime = useCallback(
    (newTime: number) => {
      if (typeof newTime !== "number" || newTime <= 0) {
        console.error("Invalid time provided to setTime");
        return;
      }
      stop(); // Dừng bộ đếm hiện tại
      setStartTime(newTime); // Cập nhật startTime
      setElapsedTime(0); // Reset elapsedTime
      setOffsetTime(0); // Reset offsetTime
      setTimeDifference(0); // Reset timeDifference
      start(); // Khởi động lại từ thời gian mới
    },
    [stop, start]
  );

  // Cleanup khi component bị hủy
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { elapsedTime, offsetTime, timeDifference, start, stop, reset, setTime };
};
