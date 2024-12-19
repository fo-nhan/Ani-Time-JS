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
declare const useTimer: ({ initialStartTime, }?: UseTimerOptions) => UseTimerReturn;
export default useTimer;
