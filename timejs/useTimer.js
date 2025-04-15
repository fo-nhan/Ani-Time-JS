"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTimer = ({ initialStartTime = Date.now(), autoStart = false, interval = 1000, onTick, } = {}) => {
    const [startTime, setStartTime] = (0, react_1.useState)(initialStartTime);
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(0);
    const [offsetTime, setOffsetTime] = (0, react_1.useState)(Math.floor(initialStartTime / 1000));
    const [timeDifference, setTimeDifference] = (0, react_1.useState)(0);
    const [isRunning, setIsRunning] = (0, react_1.useState)(autoStart);
    const [startedAt, setStartedAt] = (0, react_1.useState)(autoStart ? Date.now() : null);
    const [pausedAt, setPausedAt] = (0, react_1.useState)(null);
    const timerRef = (0, react_1.useRef)(null);
    const isRunningRef = (0, react_1.useRef)(autoStart);
    const updateTimes = (0, react_1.useCallback)(() => {
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
    const start = (0, react_1.useCallback)(() => {
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
    const stop = (0, react_1.useCallback)(() => {
        if (isRunningRef.current && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            isRunningRef.current = false;
            setIsRunning(false);
            setPausedAt(Date.now());
        }
    }, []);
    const reset = (0, react_1.useCallback)((startImmediately = false) => {
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
    const setTime = (0, react_1.useCallback)((newTime) => {
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
    }, [stop, start]);
    const toggle = (0, react_1.useCallback)(() => {
        if (isRunningRef.current) {
            stop();
        }
        else {
            start();
        }
    }, [start, stop]);
    // Định dạng thời gian thành chuỗi
    const formatTime = (0, react_1.useCallback)((format = "HH:MM:SS") => {
        const seconds = elapsedTime % 60;
        const minutes = Math.floor(elapsedTime / 60) % 60;
        const hours = Math.floor(elapsedTime / 3600);
        const padZero = (num) => num.toString().padStart(2, '0');
        return format
            .replace('HH', padZero(hours))
            .replace('MM', padZero(minutes))
            .replace('SS', padZero(seconds));
    }, [elapsedTime]);
    // Khởi động timer nếu autoStart = true
    (0, react_1.useEffect)(() => {
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
exports.default = useTimer;
