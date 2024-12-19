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
export declare const useTimerInterval: ({ initialStartTime }?: UseTimerOptions) => UseTimerReturn;
