export interface UseTimerOptions {
    initialStartTime?: number;
    autoStart?: boolean;
    interval?: number;
    onTick?: (time: TimerState) => void;
}
export interface TimerState {
    elapsedTime: number;
    offsetTime: number;
    timeDifference: number;
    isRunning: boolean;
    startedAt: number | null;
    pausedAt: number | null;
}
export interface UseTimerReturn extends TimerState {
    start: () => void;
    stop: () => void;
    reset: (startImmediately?: boolean) => void;
    setTime: (newTime: number) => void;
    toggle: () => void;
    formatTime: (format?: string) => string;
}
declare const useTimer: ({ initialStartTime, autoStart, interval, onTick, }?: UseTimerOptions) => UseTimerReturn;
export default useTimer;
