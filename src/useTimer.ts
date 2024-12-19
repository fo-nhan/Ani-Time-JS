import { useState, useRef, useCallback, useEffect } from "react";

export interface UseTimerOptions {
  initialStartTime?: number;
}

export interface UseTimerReturn {
  elapsedTime: number;
  offsetTime: number;
  timeDifference: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
  setTime: (newTime: number) => void;
}

const useTimer = ({
  initialStartTime = Date.now(),
}: UseTimerOptions = {}): UseTimerReturn => {
  const [startTime, setStartTime] = useState<number>(initialStartTime);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [offsetTime, setOffsetTime] = useState<number>(
    Math.floor(initialStartTime / 1000)
  );
  const [timeDifference, setTimeDifference] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const updateTimes = useCallback(() => {
    const now = Date.now();
    if (isRunningRef.current) {
      setElapsedTime((prev) => prev + 1);
      setOffsetTime((prev) => prev + 1);
    }
    setTimeDifference(Math.floor((now - startTime) / 1000));
  }, [startTime]);

  const start = useCallback(() => {
    if (!timerRef.current) {
      isRunningRef.current = true;
      timerRef.current = setInterval(updateTimes, 1000);
    }
  }, [updateTimes]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      isRunningRef.current = false;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsedTime(0);
    setOffsetTime(Math.floor(startTime / 1000));
    setTimeDifference(0);
  }, [stop, startTime]);

  const setTime = useCallback(
    (newTime: number) => {
      if (typeof newTime !== "number" || newTime <= 0) {
        console.error("Invalid time provided to setTime");
        return;
      }
      stop();
      setStartTime(newTime);
      setElapsedTime(0);
      setOffsetTime(Math.floor(newTime / 1000));
      setTimeDifference(0);
    },
    [stop]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    elapsedTime,
    offsetTime,
    timeDifference,
    start,
    stop,
    reset,
    setTime,
  };
};

export default useTimer;
