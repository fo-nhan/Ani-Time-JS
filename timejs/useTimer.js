"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTimer = ({ initialStartTime = Date.now(), } = {}) => {
    const [startTime, setStartTime] = (0, react_1.useState)(initialStartTime);
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(0);
    const [offsetTime, setOffsetTime] = (0, react_1.useState)(Math.floor(initialStartTime / 1000));
    const [timeDifference, setTimeDifference] = (0, react_1.useState)(0);
    const timerRef = (0, react_1.useRef)(null);
    const isRunningRef = (0, react_1.useRef)(false);
    const updateTimes = (0, react_1.useCallback)(() => {
        const now = Date.now();
        if (isRunningRef.current) {
            setElapsedTime((prev) => prev + 1);
            setOffsetTime((prev) => prev + 1);
        }
        setTimeDifference(Math.floor((now - startTime) / 1000));
    }, [startTime]);
    const start = (0, react_1.useCallback)(() => {
        if (!timerRef.current) {
            isRunningRef.current = true;
            timerRef.current = setInterval(updateTimes, 1000);
        }
    }, [updateTimes]);
    const stop = (0, react_1.useCallback)(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            isRunningRef.current = false;
        }
    }, []);
    const reset = (0, react_1.useCallback)(() => {
        stop();
        setElapsedTime(0);
        setOffsetTime(Math.floor(startTime / 1000));
        setTimeDifference(0);
    }, [stop, startTime]);
    const setTime = (0, react_1.useCallback)((newTime) => {
        if (typeof newTime !== "number" || newTime <= 0) {
            console.error("Invalid time provided to setTime");
            return;
        }
        stop();
        setStartTime(newTime);
        setElapsedTime(0);
        setOffsetTime(Math.floor(newTime / 1000));
        setTimeDifference(0);
    }, [stop]);
    (0, react_1.useEffect)(() => {
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
exports.default = useTimer;
