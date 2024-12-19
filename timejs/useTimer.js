"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTimer = ({ initialStartTime, } = {}) => {
    const [startTime, setStartTime] = (0, react_1.useState)(initialStartTime || Date.now());
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)(0); // Thời gian từ 0
    const [offsetTime, setOffsetTime] = (0, react_1.useState)(0); // Thời gian từ startTime
    const [timeDifference, setTimeDifference] = (0, react_1.useState)(0); // Chênh lệch với thời gian thực
    const timerRef = (0, react_1.useRef)(null); // Trạng thái interval
    // Bắt đầu bộ đếm
    const start = (0, react_1.useCallback)(() => {
        if (!timerRef.current) {
            const startTimestamp = Date.now();
            timerRef.current = setInterval(() => {
                const now = Date.now();
                setElapsedTime((prev) => prev + 1); // Tăng elapsedTime mỗi giây
                setOffsetTime(Math.floor((now - startTime) / 1000)); // Tính thời gian chênh lệch từ startTime
                setTimeDifference(Math.floor((now - startTimestamp) / 1000)); // Chênh lệch thời gian thực
            }, 1000);
        }
    }, [startTime]);
    // Dừng bộ đếm
    const stop = (0, react_1.useCallback)(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    // Reset bộ đếm về 0
    const reset = (0, react_1.useCallback)(() => {
        stop();
        setElapsedTime(0);
        setOffsetTime(0);
        setTimeDifference(0);
    }, [stop]);
    // Cập nhật thời gian bắt đầu và reset bộ đếm
    const setTime = (0, react_1.useCallback)((newTime) => {
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
    }, [stop, start]);
    // Cleanup khi component bị hủy
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
