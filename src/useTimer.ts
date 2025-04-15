import { useState, useRef, useCallback, useEffect } from "react";

export interface UseTimerOptions {
  initialStartTime?: number;
  autoStart?: boolean;        // Tự động bắt đầu timer khi khởi tạo
  interval?: number;          // Khoảng thời gian cập nhật (mặc định: 1000ms)
  onTick?: (time: TimerState) => void; // Callback khi timer tick
}

export interface TimerState {
  elapsedTime: number;        // Thời gian đã trôi qua (giây)
  offsetTime: number;         // Thời điểm hiện tại (giây tính từ epoch)
  timeDifference: number;     // Chênh lệch thời gian từ lúc bắt đầu (giây)
  isRunning: boolean;         // Trạng thái đang chạy
  startedAt: number | null;   // Thời điểm bắt đầu gần nhất
  pausedAt: number | null;    // Thời điểm tạm dừng gần nhất
}

export interface UseTimerReturn extends TimerState {
  start: () => void;                  // Bắt đầu timer
  stop: () => void;                   // Dừng timer
  reset: (startImmediately?: boolean) => void; // Reset timer
  setTime: (newTime: number) => void; // Đặt thời gian mới
  toggle: () => void;                 // Chuyển đổi trạng thái timer
  formatTime: (format?: string) => string; // Format thời gian dạng chuỗi
}

const useTimer = ({
  initialStartTime = Date.now(),
  autoStart = false,
  interval = 1000,
  onTick,
}: UseTimerOptions = {}): UseTimerReturn => {
  const [startTime, setStartTime] = useState<number>(initialStartTime);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [offsetTime, setOffsetTime] = useState<number>(Math.floor(initialStartTime / 1000));
  const [timeDifference, setTimeDifference] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [startedAt, setStartedAt] = useState<number | null>(autoStart ? Date.now() : null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(autoStart);

  const updateTimes = useCallback(() => {
    const now = Date.now();
    
    if (isRunningRef.current) {
      setElapsedTime((prev) => prev + 1);
      setOffsetTime((prev) => prev + 1);
      setTimeDifference(Math.floor((now - startTime) / 1000));
      
      // Gọi callback onTick nếu được cung cấp
      if (onTick) {
        onTick({
          elapsedTime: elapsedTime + 1,
          offsetTime: offsetTime + 1,
          timeDifference: Math.floor((now - startTime) / 1000),
          isRunning: true,
          startedAt,
          pausedAt
        });
      }
    }
  }, [startTime, elapsedTime, offsetTime, onTick, startedAt, pausedAt]);

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      const now = Date.now();
      isRunningRef.current = true;
      setIsRunning(true);
      setStartedAt(now);
      setPausedAt(null);
      
      // Xóa interval cũ nếu có
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(updateTimes, interval);
    }
  }, [updateTimes, interval]);

  const stop = useCallback(() => {
    if (isRunningRef.current && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      isRunningRef.current = false;
      setIsRunning(false);
      setPausedAt(Date.now());
    }
  }, []);

  const reset = useCallback((startImmediately = false) => {
    stop();
    const now = Date.now();
    setStartTime(now);
    setElapsedTime(0);
    setOffsetTime(Math.floor(now / 1000));
    setTimeDifference(0);
    setPausedAt(null);
    setStartedAt(null);
    
    if (startImmediately) {
      setStartedAt(now);
      setIsRunning(true);
      isRunningRef.current = true;
      timerRef.current = setInterval(updateTimes, interval);
    }
  }, [stop, updateTimes, interval]);

  const setTime = useCallback(
    (newTime: number) => {
      if (typeof newTime !== "number" || newTime < 0) {
        console.error("Invalid time provided to setTime");
        return;
      }
      
      const wasRunning = isRunningRef.current;
      stop();
      
      setStartTime(newTime);
      setElapsedTime(0);
      setOffsetTime(Math.floor(newTime / 1000));
      setTimeDifference(0);
      
      // Khởi động lại nếu đang chạy trước đó
      if (wasRunning) {
        start();
      }
    },
    [stop, start]
  );
  
  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);
  
  // Định dạng thời gian thành chuỗi
  const formatTime = useCallback((format = "HH:MM:SS") => {
    const seconds = elapsedTime % 60;
    const minutes = Math.floor(elapsedTime / 60) % 60;
    const hours = Math.floor(elapsedTime / 3600);
    
    const padZero = (num: number) => num.toString().padStart(2, '0');
    
    return format
      .replace('HH', padZero(hours))
      .replace('MM', padZero(minutes))
      .replace('SS', padZero(seconds));
  }, [elapsedTime]);

  // Khởi động timer nếu autoStart = true
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoStart, start]);

  return {
    elapsedTime,
    offsetTime,
    timeDifference,
    isRunning,
    startedAt,
    pausedAt,
    start,
    stop,
    reset,
    setTime,
    toggle,
    formatTime
  };
};

export default useTimer;