"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegexHelper = exports.isValidSlug = exports.getSlugPart = exports.createUniqueSlug = exports.createSlug = exports.easingFunctions = exports.effects = exports.createTransform = exports.sequence = exports.physics = exports.spring = exports.stagger = exports.timeline = exports.sortArray = exports.random = exports.numbers = exports.animate = exports.useTimer = exports.anitimejsGlobalConfig = exports.anitimejs = exports.numberOfTime = void 0;
const helper_1 = require("./helper");
const useTimer_1 = require("./useTimer");
exports.useTimer = useTimer_1.default;
const animate_1 = require("./animate");
Object.defineProperty(exports, "animate", { enumerable: true, get: function () { return animate_1.animate; } });
Object.defineProperty(exports, "timeline", { enumerable: true, get: function () { return animate_1.timeline; } });
Object.defineProperty(exports, "stagger", { enumerable: true, get: function () { return animate_1.stagger; } });
Object.defineProperty(exports, "spring", { enumerable: true, get: function () { return animate_1.spring; } });
Object.defineProperty(exports, "physics", { enumerable: true, get: function () { return animate_1.physics; } });
Object.defineProperty(exports, "sequence", { enumerable: true, get: function () { return animate_1.sequence; } });
Object.defineProperty(exports, "createTransform", { enumerable: true, get: function () { return animate_1.createTransform; } });
Object.defineProperty(exports, "effects", { enumerable: true, get: function () { return animate_1.effects; } });
Object.defineProperty(exports, "easingFunctions", { enumerable: true, get: function () { return animate_1.easingFunctions; } });
const number_1 = require("./number");
Object.defineProperty(exports, "numbers", { enumerable: true, get: function () { return number_1.numbers; } });
const random_1 = require("./random");
Object.defineProperty(exports, "random", { enumerable: true, get: function () { return random_1.random; } });
const sort_1 = require("./sort");
Object.defineProperty(exports, "sortArray", { enumerable: true, get: function () { return sort_1.sortArray; } });
const slug_1 = require("./slug");
Object.defineProperty(exports, "createSlug", { enumerable: true, get: function () { return slug_1.createSlug; } });
Object.defineProperty(exports, "createUniqueSlug", { enumerable: true, get: function () { return slug_1.createUniqueSlug; } });
Object.defineProperty(exports, "getSlugPart", { enumerable: true, get: function () { return slug_1.getSlugPart; } });
Object.defineProperty(exports, "isValidSlug", { enumerable: true, get: function () { return slug_1.isValidSlug; } });
const regex_1 = require("./regex");
Object.defineProperty(exports, "RegexHelper", { enumerable: true, get: function () { return regex_1.RegexHelper; } });
class Time {
    constructor(date, endDate) {
        this.date = date ? this.parseDate(date) : new Date();
        if (isNaN(this.date.getTime())) {
            throw new Error("The date is not valid. Please provide a valid date string or Date object.");
        }
        if (endDate) {
            this.endDate = this.parseDate(endDate);
            if (isNaN(this.endDate.getTime())) {
                throw new Error("The endDate is not valid. Please provide a valid date string or Date object.");
            }
        }
        else {
            this.endDate = null;
        }
        this.setTimeZone(Time.timezone);
    }
    parseDate(date) {
        if (date instanceof Date) {
            return new Date(date);
        }
        if (typeof date === "string") {
            // Try parsing standard date format first
            const standardDate = new Date(date);
            if (!isNaN(standardDate.getTime())) {
                return standardDate;
            }
            // Try custom DD/MM/YYYY format
            const dateRegex = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;
            const dateTimeRegex = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}) (\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
            const dateMatch = date.match(dateRegex);
            const dateTimeMatch = date.match(dateTimeRegex);
            if (dateMatch) {
                const day = parseInt(dateMatch[1], 10);
                const month = parseInt(dateMatch[2], 10) - 1; // Month is 0-based
                const year = parseInt(dateMatch[3], 10);
                // Validate ranges
                if (month < 0 || month > 11)
                    throw new Error(`Invalid month: ${month + 1}`);
                if (day < 1 || day > 31)
                    throw new Error(`Invalid day: ${day}`);
                return new Date(year, month, day);
            }
            if (dateTimeMatch) {
                const day = parseInt(dateTimeMatch[1], 10);
                const month = parseInt(dateTimeMatch[2], 10) - 1; // Month is 0-based
                const year = parseInt(dateTimeMatch[3], 10);
                const hours = parseInt(dateTimeMatch[4], 10);
                const minutes = parseInt(dateTimeMatch[5], 10);
                const seconds = dateTimeMatch[6] ? parseInt(dateTimeMatch[6], 10) : 0;
                // Validate ranges
                if (month < 0 || month > 11)
                    throw new Error(`Invalid month: ${month + 1}`);
                if (day < 1 || day > 31)
                    throw new Error(`Invalid day: ${day}`);
                if (hours < 0 || hours > 23)
                    throw new Error(`Invalid hours: ${hours}`);
                if (minutes < 0 || minutes > 59)
                    throw new Error(`Invalid minutes: ${minutes}`);
                if (seconds < 0 || seconds > 59)
                    throw new Error(`Invalid seconds: ${seconds}`);
                return new Date(year, month, day, hours, minutes, seconds);
            }
            // Additional format: DD-MM-YYYY
            const dashDateRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
            const dashMatch = date.match(dashDateRegex);
            if (dashMatch) {
                const day = parseInt(dashMatch[1], 10);
                const month = parseInt(dashMatch[2], 10) - 1;
                const year = parseInt(dashMatch[3], 10);
                if (month < 0 || month > 11)
                    throw new Error(`Invalid month: ${month + 1}`);
                if (day < 1 || day > 31)
                    throw new Error(`Invalid day: ${day}`);
                return new Date(year, month, day);
            }
            // If we've gotten here, try one more standard parsing approach
            const fallbackDate = new Date(date.replace(/-/g, "/"));
            if (!isNaN(fallbackDate.getTime())) {
                return fallbackDate;
            }
            throw new Error(`Unable to parse date from string: ${date}`);
        }
        // If we get here, the input is neither a Date nor a string
        throw new Error(`Invalid date input: ${String(date)}`);
    }
    formatDate(format, formatLanguage) {
        let newFormat = format;
        if (format === "L") {
            newFormat = "L, DD eM tY YYYY";
        }
        if (format === "LL") {
            newFormat = "L, DD eM tY YYYY tK HH:mm";
        }
        if (format === "LT") {
            newFormat = "L, DD eM tY YYYY tK hh:mm";
        }
        if (format === "F") {
            const now = new Date().getTime();
            const timeUnil = this.date.getTime();
            const diff = now - timeUnil;
            // Thay đổi đơn vị thời gian theo nhu cầu
            const seconds = 1000;
            const minutes = seconds * 60;
            const hours = minutes * 60;
            const days = hours * 24;
            const month = days * 30;
            const year = days * 365.6;
            newFormat = `MM/YYYY`;
            if (diff < minutes) {
                newFormat = "vx";
            }
            if (diff < 30 * seconds) {
                newFormat = "vp";
            }
            if (diff < 0) {
                newFormat = "vs";
            }
            if (diff >= minutes && diff < hours) {
                newFormat = `${Math.floor(diff / minutes)} tI vv`;
            }
            if (diff >= hours && diff < days) {
                newFormat = `${Math.floor(diff / hours)} tH vv`;
            }
            if (diff >= days && diff < month) {
                newFormat = `${Math.floor(diff / days)} tD vv`;
            }
            if (diff >= month && diff < year) {
                newFormat = `DD/MM`;
            }
        }
        const pad = (n) => (n < 10 ? `0${n}` : n.toString());
        const year = this.date.getFullYear();
        const month = pad(this.date.getMonth() + 1);
        const day = pad(this.date.getDate());
        // Lấy giờ, phút, giây và mili giây
        const hours24 = this.date.getHours();
        const minutes = pad(this.date.getMinutes());
        const seconds = pad(this.date.getSeconds());
        const milliseconds = this.date.getMilliseconds(); // Mili giây không cần pad vì có thể lớn hơn 100
        // Lấy thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ... 6: Thứ 7)
        const yearShort = year.toString().slice(-2);
        const hours12 = hours24 % 12 || 12;
        const ampm = hours24 >= 12 ? "PM" : "AM";
        return newFormat
            .split(" ")
            .map((key) => (key === null || key === void 0 ? void 0 : key.trim())
            ? key
                .replace("YYYY", year.toString())
                .replace("YY", yearShort)
                .replace("MM", month)
                .replace("DD", day)
                .replace("HH", pad(hours24)) // giờ theo định dạng 24 giờ
                .replace("hh", pad(hours12)) // giờ theo định dạng 12 giờ
                .replace("mm", minutes)
                .replace("ss", seconds)
                .replace("SSS", milliseconds)
                .replace("A", ampm) // thêm AM/PM
                .replace("L", formatLanguage.L[this.date.getDay()])
                .replace("l", formatLanguage.l[this.date.getDay()])
                .replace("tK", formatLanguage.tK)
                .replace("TK", formatLanguage.TK)
                .replace("eM", formatLanguage.eM[this.date.getMonth()])
                .replace("EM", formatLanguage.EM[this.date.getMonth()])
                .replace("tY", formatLanguage.tY)
                .replace("TY", formatLanguage.TY)
                .replace("vx", formatLanguage.vx)
                .replace("vp", formatLanguage.vp)
                .replace("vv", formatLanguage.vv)
                .replace("vs", formatLanguage.vs)
                .replace("xx", formatLanguage.xx)
                .replace("tD", formatLanguage.tD)
                .replace("TD", formatLanguage.TD)
                .replace("tM", formatLanguage.tM)
                .replace("TM", formatLanguage.TM)
                .replace("tH", formatLanguage.tH)
                .replace("TH", formatLanguage.TH)
                .replace("tI", formatLanguage.tI)
                .replace("TI", formatLanguage.TI)
                .replace("tS", formatLanguage.tS)
                .replace("TS", formatLanguage.TS)
            : "")
            .join(" ");
    }
    // Kiểm tra startDate hay endDate lớn hơn
    isStartDateGreater() {
        if (this.endDate) {
            return this.date > this.endDate;
        }
        return false;
    }
    // Tính khoảng cách giữa hai ngày (trả về mili giây)
    getDateDifference() {
        if (this.endDate) {
            return Math.abs(this.endDate.getTime() - this.date.getTime());
        }
        return 0;
    }
    dateCal() {
        const diffMilliseconds = this.getDateDifference();
        const seconds = Math.floor(diffMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const years = Math.floor(days / 365.25); // Trung bình có 365.25 ngày trong một năm
        const months = Math.floor(days / 30.44); // Trung bình có 30.44 ngày trong một tháng
        return {
            milliseconds: diffMilliseconds,
            seconds: seconds,
            minutes: minutes,
            hours: hours,
            days: days,
            months: months,
            years: years,
        };
    }
    format(format = "DD/MM/YYYY", configLanguage) {
        const formatLanguage = helper_1.multilingual[Time.locale];
        return this.formatDate(format, Object.assign(Object.assign({}, formatLanguage), (configLanguage ? configLanguage : {})));
    }
    formats(formats, configLanguage) {
        const formatLanguage = helper_1.multilingual[Time.locale];
        const currentTime = Date.now();
        // Lặp qua từng định dạng trong mảng
        for (const { logic, time } of formats) {
            const timeInMilliseconds = time * 1000;
            // Nếu thời gian hiện tại trong khoảng thời gian `time`, trả về định dạng này
            if (currentTime - this.date.getTime() <= timeInMilliseconds) {
                return this.formatDate(logic, Object.assign(Object.assign({}, formatLanguage), (configLanguage ? configLanguage : {})));
            }
        }
        // Trường hợp không thuộc khoảng nào, lấy định dạng cuối cùng
        const lastFormat = formats[formats.length - 1].logic;
        return this.formatDate(lastFormat, Object.assign(Object.assign({}, formatLanguage), (configLanguage ? configLanguage : {})));
    }
    countdown() {
        const target = this.date; // Sử dụng this.date làm mốc thời gian
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        const milliseconds = Math.abs(diff);
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        return {
            days,
            hours,
            minutes,
            seconds,
            milliseconds: milliseconds % 1000, // Lấy mili giây còn lại
            isPast: diff < 0, // Kiểm tra xem thời gian đã qua hay chưa
        };
    }
    lang(lang) {
        if (!helper_1.multilingual[lang]) {
            throw new Error(`Language '${lang}' not supported.`);
        }
        Time.locale = lang;
        return this;
    }
    toString() {
        return this.format("DD/MM/YYYY HH:mm:ss");
    }
    toLocaleDateString() {
        return this.format("DD/MM/YYYY");
    }
    toLocaleTimeString() {
        return this.format("DD/MM/YYYY HH:mm:ss.SSS");
    }
    getDay() {
        return this.date.getDate();
    }
    getMonth() {
        return this.date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1
    }
    getYear() {
        return this.date.getFullYear();
    }
    getHours() {
        return this.date.getHours();
    }
    getMinutes() {
        return this.date.getMinutes();
    }
    getSeconds() {
        return this.date.getSeconds();
    }
    getTime() {
        return this.date.getTime();
    }
    getYears(start = 0, end = 0) {
        // Lấy năm hiện tại từ `this.date`
        const currentYear = this.date.getFullYear();
        // Xác định năm bắt đầu và năm kết thúc dựa trên start và end
        const startYear = currentYear - start;
        const endYear = currentYear + end;
        // Tạo mảng chứa các năm trong khoảng thời gian từ startYear đến endYear
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        return years;
    }
    getWeek() {
        const currentDayIndex = this.date.getDay(); // Lấy chỉ số của ngày hiện tại trong tuần
        const startOfWeek = new Date(this.date); // Tạo một bản sao của `this.date`
        // Điều chỉnh `startOfWeek` để trỏ đến Chủ Nhật của tuần hiện tại
        startOfWeek.setDate(this.date.getDate() - currentDayIndex);
        // Tạo mảng chứa các ngày trong tuần
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            // Đẩy từng ngày vào mảng, từ Chủ Nhật đến Thứ Bảy
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            weekDays.push(day);
        }
        return weekDays;
    }
    getDayInWeek() {
        return this.date.getDay();
    }
    getTimeZone() {
        return Time.timezone;
    }
    getLocale() {
        return Time.locale;
    }
    getPreviousDay() {
        const previousDay = new Date(this.date); // Tạo một bản sao của `this.date`
        previousDay.setDate(this.date.getDate() - 1); // Lùi ngày xuống 1
        return previousDay;
    }
    getNextDay() {
        const nextDay = new Date(this.date); // Tạo một bản sao của `this.date`
        nextDay.setDate(this.date.getDate() + 1); // Tăng ngày lên 1
        return nextDay;
    }
    getPreviousYear() {
        const previousYear = new Date(this.date);
        previousYear.setFullYear(this.date.getFullYear() - 1); // Lùi năm xuống 1
        return previousYear;
    }
    getNextYear() {
        const nextYear = new Date(this.date);
        nextYear.setFullYear(this.date.getFullYear() + 1); // Tăng năm lên 1
        return nextYear;
    }
    getPreviousMonth() {
        const previousMonth = new Date(this.date);
        previousMonth.setMonth(this.date.getMonth() - 1); // Lùi tháng xuống 1
        return previousMonth;
    }
    getNextMonth() {
        const nextMonth = new Date(this.date);
        nextMonth.setMonth(this.date.getMonth() + 1); // Tăng tháng lên 1
        return nextMonth;
    }
    getWeekOfYear() {
        // Tạo bản sao của `this.date` để đảm bảo không thay đổi giá trị gốc
        const currentDate = new Date(this.date);
        // Đặt ngày về thứ Hai của tuần hiện tại
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));
        // Tính số ngày từ ngày 1 tháng 1
        const firstOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const daysSinceFirstOfYear = Math.floor((currentDate.getTime() - firstOfYear.getTime()) / (24 * 60 * 60 * 1000));
        // Tính tuần trong năm
        const weekOfYear = Math.ceil((daysSinceFirstOfYear + 1) / 7);
        return weekOfYear;
    }
    getDaysOfWeekInYear(dayOfWeek) {
        const year = this.date.getFullYear(); // Lấy năm từ this.date
        const dates = [];
        // Khởi tạo ngày đầu tiên của năm
        let currentDate = new Date(year, 0, 1);
        // Tìm ngày đầu tiên trong năm khớp với `dayOfWeek`
        while (currentDate.getDay() !== dayOfWeek) {
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // Thêm tất cả các ngày trong năm trùng với `dayOfWeek`
        while (currentDate.getFullYear() === year) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7); // Tăng lên 7 ngày để đến tuần tiếp theo
        }
        return dates;
    }
    setTimeZone(timeZone) {
        try {
            // Lấy thời gian hiện tại theo múi giờ mới
            const localDate = new Date(this.date.toLocaleString("en-US", { timeZone }));
            // Cập nhật `this.date` với thời gian mới
            this.date.setTime(localDate.getTime());
            // Cập nhật biến static timezone
            Time.timezone = timeZone;
        }
        catch (error) {
            throw new Error(`Invalid time zone: '${timeZone}'`);
        }
        return this;
    }
    // Hàm thêm thời gian
    add(value, unit) {
        switch (unit) {
            case "days":
                this.date.setDate(this.date.getDate() + value);
                break;
            case "hours":
                this.date.setHours(this.date.getHours() + value);
                break;
            case "minutes":
                this.date.setMinutes(this.date.getMinutes() + value);
                break;
            case "seconds":
                this.date.setSeconds(this.date.getSeconds() + value);
                break;
            case "months":
                this.date.setMonth(this.date.getMonth() + value);
                break;
            case "years":
                this.date.setFullYear(this.date.getFullYear() + value);
                break;
            default:
                throw new Error("Unsupported time unit.");
        }
        return this;
    }
    // Hàm trừ thời gian
    subtract(value, unit) {
        return this.add(-value, unit);
    }
    arrangeTime(arrayDate, order = "asc") {
        // Chuyển đổi tất cả các giá trị trong mảng thành đối tượng Date
        const dates = arrayDate.map((date) => new Date(date));
        // Kiểm tra xem có giá trị không hợp lệ trong mảng không
        if (dates.some((date) => isNaN(date.getTime()))) {
            throw new Error("Một trong các ngày không hợp lệ.");
        }
        // Sắp xếp mảng theo thứ tự tăng dần hoặc giảm dần
        dates.sort((a, b) => order === "asc" ? a.getTime() - b.getTime() : b.getTime() - a.getTime());
        return this;
    }
    arrangeTimeObject(arrayDate, order = "asc", keyPath = "date") {
        // Hàm phụ để lấy giá trị ngày từ đối tượng theo `keyPath`
        const getDateValue = (obj) => {
            // Tách keyPath thành các phần (hỗ trợ các trường hợp lồng nhau như `time.date`)
            const keys = keyPath.split(".");
            // Duyệt qua từng phần để lấy giá trị cuối cùng
            let value = obj;
            for (const key of keys) {
                value = value[key];
                if (value === undefined) {
                    throw new Error(`Không tìm thấy đường dẫn '${keyPath}' trong đối tượng.`);
                }
            }
            return new Date(value);
        };
        // Chuyển đổi tất cả các giá trị thành đối tượng Date
        const dates = arrayDate.map((obj) => {
            const date = getDateValue(obj);
            if (isNaN(date.getTime())) {
                throw new Error("Một trong các ngày không hợp lệ.");
            }
            return Object.assign(Object.assign({}, obj), { _parsedDate: date }); // Lưu ngày đã phân tích để sắp xếp
        });
        // Sắp xếp mảng theo thứ tự tăng dần hoặc giảm dần
        dates.sort((a, b) => order === "asc"
            ? a._parsedDate.getTime() - b._parsedDate.getTime()
            : b._parsedDate.getTime() - a._parsedDate.getTime());
        // Xóa trường `_parsedDate` sau khi sắp xếp
        dates.forEach((obj) => delete obj._parsedDate);
        // Gán lại mảng đã sắp xếp
        arrayDate.length = 0;
        arrayDate.push(...dates);
        return this;
    }
    calculateWorkingDays(week, // Mảng chứa các thứ trong tuần muốn loại bỏ (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
    holidays // Mảng chứa các ngày lễ muốn loại bỏ, có thể ở dạng "DD/MM" hoặc "DD/MM/YYYY"
    ) {
        const start = this.date;
        const end = this.endDate || this.date;
        const holidaysExcluded = [];
        const currentYear = start.getFullYear();
        // Chuyển đổi và lọc ngày lễ
        const holidayDates = holidays
            .map((holiday) => {
            if (holiday instanceof Date) {
                return holiday;
            }
            if (typeof holiday === "string") {
                // Xử lý định dạng "DD/MM"
                const dayMonthMatch = holiday.match(/^(\d{1,2})\/(\d{1,2})$/);
                if (dayMonthMatch) {
                    const day = parseInt(dayMonthMatch[1], 10);
                    const month = parseInt(dayMonthMatch[2], 10) - 1; // Tháng bắt đầu từ 0
                    return new Date(currentYear, month, day);
                }
                // Xử lý các định dạng khác qua hàm parseDate hiện có
                try {
                    return this.parseDate(holiday);
                }
                catch (e) {
                    console.warn(`Không thể chuyển đổi ngày lễ: ${holiday}`);
                    return new Date(NaN); // Trả về ngày không hợp lệ
                }
            }
            return new Date(NaN); // Trả về ngày không hợp lệ
        })
            .filter((date) => !isNaN(date.getTime()));
        const workingDays = [];
        // Clone start date to avoid modifying the original
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            // Kiểm tra xem ngày hiện tại có phải là ngày nghỉ cuối tuần hoặc ngày lễ không
            const isWeekend = week.includes(dayOfWeek);
            const isHoliday = holidayDates.some((holiday) => holiday.getDate() === currentDate.getDate() &&
                holiday.getMonth() === currentDate.getMonth());
            if (!isWeekend && !isHoliday) {
                workingDays.push(new Date(currentDate)); // Thêm vào ngày làm việc
            }
            else if (isHoliday) {
                holidaysExcluded.push(new Date(currentDate)); // Thêm vào ngày lễ
            }
            // Tăng ngày lên 1
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return { workingDays, holidaysExcluded };
    }
    /**
     * Lấy danh sách các ngày lễ theo quốc gia cho năm cụ thể
     * @param year Năm cần lấy ngày lễ (mặc định là năm hiện tại)
     * @param country Mã quốc gia (mặc định: 'vi' - Việt Nam)
     * @returns Mảng các ngày lễ
     */
    getHolidays(year, country = "vi") {
        const targetYear = year || this.date.getFullYear();
        // Lấy danh sách ngày lễ có tên
        const namedHolidays = this.getNamedHolidays(targetYear, country);
        // Chỉ trả về phần Date
        return namedHolidays.map((holiday) => holiday.date);
    }
    /**
     * Lấy danh sách các ngày lễ kèm tên theo quốc gia cho năm cụ thể
     * @param year Năm cần lấy ngày lễ (mặc định là năm hiện tại)
     * @param country Mã quốc gia (mặc định: 'vi' - Việt Nam)
     * @returns Mảng các ngày lễ kèm tên
     */
    getNamedHolidays(year, country = "vi") {
        const targetYear = year || this.date.getFullYear();
        // Danh sách ngày lễ cố định (dương lịch) theo quốc gia
        const fixedHolidays = {
            // Việt Nam
            vi: [
                { name: "Tết Dương Lịch", day: 1, month: 1 },
                { name: "Ngày Giỗ Tổ Hùng Vương", day: 10, month: 4 },
                { name: "Ngày Giải phóng miền Nam", day: 30, month: 4 },
                { name: "Ngày Quốc tế Lao động", day: 1, month: 5 },
                { name: "Ngày Quốc khánh", day: 2, month: 9 },
            ],
            // Hoa Kỳ/Anh (tiếng Anh)
            en: [
                { name: "New Year's Day", day: 1, month: 1 },
                { name: "Independence Day", day: 4, month: 7 },
                { name: "Veterans Day", day: 11, month: 11 },
                { name: "Christmas Day", day: 25, month: 12 },
                { name: "Boxing Day", day: 26, month: 12 },
            ],
            // Nhật Bản
            ja: [
                { name: "New Year's Day (元日)", day: 1, month: 1 },
                { name: "Coming of Age Day (成人の日)", day: 8, month: 1 },
                { name: "National Foundation Day (建国記念の日)", day: 11, month: 2 },
                { name: "Showa Day (昭和の日)", day: 29, month: 4 },
                { name: "Constitution Memorial Day (憲法記念日)", day: 3, month: 5 },
                { name: "Greenery Day (みどりの日)", day: 4, month: 5 },
                { name: "Children's Day (こどもの日)", day: 5, month: 5 },
                { name: "Marine Day (海の日)", day: 18, month: 7 },
                { name: "Mountain Day (山の日)", day: 11, month: 8 },
                { name: "Respect for the Aged Day (敬老の日)", day: 15, month: 9 },
                { name: "Culture Day (文化の日)", day: 3, month: 11 },
                { name: "Labor Thanksgiving Day (勤労感謝の日)", day: 23, month: 11 },
                { name: "Emperor's Birthday (天皇誕生日)", day: 23, month: 2 },
            ],
            // Lào
            lo: [
                { name: "Pi Mai Lào (Lào New Year)", day: 14, month: 4 },
                { name: "International Labour Day", day: 1, month: 5 },
                { name: "National Day (ວັນຊາດ)", day: 2, month: 12 },
                { name: "New Year's Day", day: 1, month: 1 },
            ],
            // Trung Quốc
            zh: [
                { name: "春节 (Tết Nguyên Đán)", day: 1, month: 1 },
                { name: "清明节 (Thanh Minh)", day: 4, month: 4 },
                { name: "劳动节 (Ngày Lao động)", day: 1, month: 5 },
                { name: "国庆节 (Quốc khánh)", day: 1, month: 10 },
                { name: "中秋节 (Tết Trung Thu)", day: 15, month: 8 },
            ],
            // Pháp
            fr: [
                { name: "Jour de l'an", day: 1, month: 1 },
                { name: "Fête du Travail", day: 1, month: 5 },
                { name: "Victoire 1945", day: 8, month: 5 },
                { name: "Fête nationale", day: 14, month: 7 },
                { name: "Assomption", day: 15, month: 8 },
                { name: "Toussaint", day: 1, month: 11 },
                { name: "Noël", day: 25, month: 12 },
            ],
            // Hàn Quốc
            ko: [
                { name: "New Year's Day (신정)", day: 1, month: 1 },
                { name: "Independence Movement Day (삼일절)", day: 1, month: 3 },
                { name: "Children's Day (어린이날)", day: 5, month: 5 },
                { name: "Memorial Day (현충일)", day: 6, month: 6 },
                { name: "Liberation Day (광복절)", day: 15, month: 8 },
                { name: "National Foundation Day (개천절)", day: 3, month: 10 },
                { name: "Hangul Day (한글날)", day: 9, month: 10 },
                { name: "Christmas Day (크리스마스)", day: 25, month: 12 },
            ],
        };
        // Danh sách ngày lễ âm lịch theo quốc gia
        const lunarHolidays = {
            // Việt Nam
            vi: [
                { name: "Tết Nguyên Đán", day: 1, month: 1, durationDays: 5 },
                { name: "Tết Hàn Thực", day: 3, month: 3 },
                { name: "Lễ Phật Đản", day: 15, month: 4 },
                { name: "Tết Đoan Ngọ", day: 5, month: 5 },
                { name: "Lễ Vu Lan", day: 15, month: 7 },
                { name: "Tết Trung Thu", day: 15, month: 8 },
                { name: "Tết Thường Tân", day: 10, month: 10 },
            ],
            // Trung Quốc
            zh: [
                { name: "春节", day: 1, month: 1, durationDays: 7 },
                { name: "元宵节", day: 15, month: 1 },
                { name: "清明节", day: 5, month: 4 },
                { name: "端午节", day: 5, month: 5 },
                { name: "中秋节", day: 15, month: 8 },
            ],
            // Hàn Quốc
            ko: [
                { name: "설날 (Seollal)", day: 1, month: 1, durationDays: 3 },
                { name: "석가탄신일 (Buddha's Birthday)", day: 8, month: 4 },
                { name: "추석 (Chuseok)", day: 15, month: 8, durationDays: 3 },
            ],
            // Lào
            lo: [
                {
                    name: "Boun Khao Phansa (Start of Buddhist Lent)",
                    day: 1,
                    month: 11,
                },
                { name: "Boun Ok Phansa (End of Buddhist Lent)", day: 15, month: 3 },
            ],
        };
        const result = [];
        // Thêm các ngày lễ dương lịch cố định
        const countryFixedHolidays = fixedHolidays[country] || [];
        countryFixedHolidays.forEach((holiday) => {
            result.push({
                name: holiday.name,
                date: new Date(targetYear, holiday.month - 1, holiday.day),
            });
        });
        // Thêm các ngày lễ âm lịch (chuyển sang dương lịch)
        const countryLunarHolidays = lunarHolidays[country] || [];
        countryLunarHolidays.forEach((holiday) => {
            // Chuyển từ ngày âm lịch sang dương lịch
            const solarDate = this.fromLunarDate(holiday.day, holiday.month, targetYear);
            // Thêm ngày lễ chính
            result.push({
                name: holiday.name,
                date: solarDate,
            });
            // Thêm các ngày nghỉ bổ sung nếu có
            if (holiday.durationDays && holiday.durationDays > 1) {
                for (let i = 1; i < holiday.durationDays; i++) {
                    const nextDate = new Date(solarDate);
                    nextDate.setDate(solarDate.getDate() + i);
                    result.push({
                        name: `${holiday.name} (ngày ${i + 1})`,
                        date: nextDate,
                    });
                }
            }
        });
        return result;
    }
    /**
     * Chuyển đổi từ ngày dương lịch sang ngày âm lịch
     * @param date Ngày dương lịch (nếu không cung cấp, sử dụng this.date)
     * @returns Đối tượng chứa thông tin ngày âm lịch
     */
    toLunarDate(date) {
        const targetDate = date || this.date;
        // Bảng dữ liệu lịch âm từ 1900-2100
        // Mỗi số trong mảng đại diện cho thông tin về một năm âm lịch
        // Bit 0-4: Tháng nhuận trong năm (0 nếu không có tháng nhuận)
        // Bit 5-16: Lưu thông tin về độ dài của các tháng (0: 29 ngày, 1: 30 ngày)
        // Bit 17-20: Đại diện cho năm nhuận (thường dùng bit 17 để kiểm tra)
        const lunarInfo = [
            0x04bd8,
            0x04ae0,
            0x0a570,
            0x054d5,
            0x0d260,
            0x0d950,
            0x16554,
            0x056a0,
            0x09ad0,
            0x055d2, // 1900-1909
            0x04ae0,
            0x0a5b6,
            0x0a4d0,
            0x0d250,
            0x1d255,
            0x0b540,
            0x0d6a0,
            0x0ada2,
            0x095b0,
            0x14977, // 1910-1919
            0x04970,
            0x0a4b0,
            0x0b4b5,
            0x06a50,
            0x06d40,
            0x1ab54,
            0x02b60,
            0x09570,
            0x052f2,
            0x04970, // 1920-1929
            0x06566,
            0x0d4a0,
            0x0ea50,
            0x06e95,
            0x05ad0,
            0x02b60,
            0x186e3,
            0x092e0,
            0x1c8d7,
            0x0c950, // 1930-1939
            0x0d4a0,
            0x1d8a6,
            0x0b550,
            0x056a0,
            0x1a5b4,
            0x025d0,
            0x092d0,
            0x0d2b2,
            0x0a950,
            0x0b557, // 1940-1949
            0x06ca0,
            0x0b550,
            0x15355,
            0x04da0,
            0x0a5b0,
            0x14573,
            0x052b0,
            0x0a9a8,
            0x0e950,
            0x06aa0, // 1950-1959
            0x0aea6,
            0x0ab50,
            0x04b60,
            0x0aae4,
            0x0a570,
            0x05260,
            0x0f263,
            0x0d950,
            0x05b57,
            0x056a0, // 1960-1969
            0x096d0,
            0x04dd5,
            0x04ad0,
            0x0a4d0,
            0x0d4d4,
            0x0d250,
            0x0d558,
            0x0b540,
            0x0b6a0,
            0x195a6, // 1970-1979
            0x095b0,
            0x049b0,
            0x0a974,
            0x0a4b0,
            0x0b27a,
            0x06a50,
            0x06d40,
            0x0af46,
            0x0ab60,
            0x09570, // 1980-1989
            0x04af5,
            0x04970,
            0x064b0,
            0x074a3,
            0x0ea50,
            0x06b58,
            0x055c0,
            0x0ab60,
            0x096d5,
            0x092e0, // 1990-1999
            0x0c960,
            0x0d954,
            0x0d4a0,
            0x0da50,
            0x07552,
            0x056a0,
            0x0abb7,
            0x025d0,
            0x092d0,
            0x0cab5, // 2000-2009
            0x0a950,
            0x0b4a0,
            0x0baa4,
            0x0ad50,
            0x055d9,
            0x04ba0,
            0x0a5b0,
            0x15176,
            0x052b0,
            0x0a930, // 2010-2019
            0x07954,
            0x06aa0,
            0x0ad50,
            0x05b52,
            0x04b60,
            0x0a6e6,
            0x0a4e0,
            0x0d260,
            0x0ea65,
            0x0d530, // 2020-2029
            0x05aa0,
            0x076a3,
            0x096d0,
            0x04afb,
            0x04ad0,
            0x0a4d0,
            0x1d0b6,
            0x0d250,
            0x0d520,
            0x0dd45, // 2030-2039
            0x0b5a0,
            0x056d0,
            0x055b2,
            0x049b0,
            0x0a577,
            0x0a4b0,
            0x0aa50,
            0x1b255,
            0x06d20,
            0x0ada0, // 2040-2049
            0x14b63,
            0x09370,
            0x049f8,
            0x04970,
            0x064b0,
            0x168a6,
            0x0ea50,
            0x06b20,
            0x1a6c4,
            0x0aae0, // 2050-2059
            0x0a2e0,
            0x0d2e3,
            0x0c960,
            0x0d557,
            0x0d4a0,
            0x0da50,
            0x05d55,
            0x056a0,
            0x0a6d0,
            0x055d4, // 2060-2069
            0x052d0,
            0x0a9b8,
            0x0a950,
            0x0b4a0,
            0x0b6a6,
            0x0ad50,
            0x055a0,
            0x0aba4,
            0x0a5b0,
            0x052b0, // 2070-2079
            0x0b273,
            0x06930,
            0x07337,
            0x06aa0,
            0x0ad50,
            0x14b55,
            0x04b60,
            0x0a570,
            0x054e4,
            0x0d160, // 2080-2089
            0x0e968,
            0x0d520,
            0x0daa0,
            0x16aa6,
            0x056d0,
            0x04ae0,
            0x0a9d4,
            0x0a2d0,
            0x0d150,
            0x0f252, // 2090-2099
            0x0d520, // 2100
        ];
        // Tính ngày Julius
        const baseDate = new Date(1900, 0, 31); // 31/01/1900
        let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
        // Tìm năm âm lịch
        let i, temp = 0, leap;
        for (i = 1900; i < 2101 && offset > 0; i++) {
            temp = this.getLunarYearDays(i, lunarInfo);
            offset -= temp;
        }
        if (offset < 0) {
            offset += temp;
            i--;
        }
        const year = i;
        // Tìm tháng âm lịch
        leap = this.getLunarLeapMonth(year, lunarInfo);
        let isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
            // Kiểm tra tháng nhuận
            if (leap > 0 && i === leap + 1 && isLeap === false) {
                --i;
                isLeap = true;
                temp = this.getLunarLeapDays(year, lunarInfo);
            }
            else {
                temp = this.getLunarMonthDays(year, i, lunarInfo);
            }
            // Nếu là tháng nhuận, khi tính xong thì đánh dấu là kết thúc tháng nhuận
            if (isLeap === true && i === leap + 1) {
                isLeap = false;
            }
            offset -= temp;
        }
        // Nếu offset = 0 và đang ở tháng nhuận, cần điều chỉnh
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) {
                isLeap = false;
            }
            else {
                isLeap = true;
                --i;
            }
        }
        // Nếu offset < 0, trừ về tháng trước
        if (offset < 0) {
            offset += temp;
            --i;
        }
        const month = i;
        const day = offset + 1;
        return {
            day,
            month,
            year,
            leap: isLeap,
            dateString: `${day}/${month}/${year}${isLeap ? " (nhuận)" : ""}`,
        };
    }
    /**
     * Chuyển đổi từ ngày âm lịch sang ngày dương lịch
     * @param lunarDay Ngày âm lịch
     * @param lunarMonth Tháng âm lịch
     * @param lunarYear Năm âm lịch
     * @param isLeapMonth Có phải tháng nhuận không
     * @returns Ngày dương lịch tương ứng
     */
    fromLunarDate(lunarDay, lunarMonth, lunarYear, isLeapMonth = false) {
        // Kiểm tra tính hợp lệ của ngày tháng năm
        if (lunarMonth < 1 || lunarMonth > 12) {
            throw new Error("Tháng âm lịch phải từ 1 đến 12");
        }
        // Bảng dữ liệu lịch âm
        const lunarInfo = [
            0x04bd8,
            0x04ae0,
            0x0a570,
            0x054d5,
            0x0d260,
            0x0d950,
            0x16554,
            0x056a0,
            0x09ad0,
            0x055d2, // 1900-1909
            0x04ae0,
            0x0a5b6,
            0x0a4d0,
            0x0d250,
            0x1d255,
            0x0b540,
            0x0d6a0,
            0x0ada2,
            0x095b0,
            0x14977, // 1910-1919
            0x04970,
            0x0a4b0,
            0x0b4b5,
            0x06a50,
            0x06d40,
            0x1ab54,
            0x02b60,
            0x09570,
            0x052f2,
            0x04970, // 1920-1929
            0x06566,
            0x0d4a0,
            0x0ea50,
            0x06e95,
            0x05ad0,
            0x02b60,
            0x186e3,
            0x092e0,
            0x1c8d7,
            0x0c950, // 1930-1939
            0x0d4a0,
            0x1d8a6,
            0x0b550,
            0x056a0,
            0x1a5b4,
            0x025d0,
            0x092d0,
            0x0d2b2,
            0x0a950,
            0x0b557, // 1940-1949
            0x06ca0,
            0x0b550,
            0x15355,
            0x04da0,
            0x0a5b0,
            0x14573,
            0x052b0,
            0x0a9a8,
            0x0e950,
            0x06aa0, // 1950-1959
            0x0aea6,
            0x0ab50,
            0x04b60,
            0x0aae4,
            0x0a570,
            0x05260,
            0x0f263,
            0x0d950,
            0x05b57,
            0x056a0, // 1960-1969
            0x096d0,
            0x04dd5,
            0x04ad0,
            0x0a4d0,
            0x0d4d4,
            0x0d250,
            0x0d558,
            0x0b540,
            0x0b6a0,
            0x195a6, // 1970-1979
            0x095b0,
            0x049b0,
            0x0a974,
            0x0a4b0,
            0x0b27a,
            0x06a50,
            0x06d40,
            0x0af46,
            0x0ab60,
            0x09570, // 1980-1989
            0x04af5,
            0x04970,
            0x064b0,
            0x074a3,
            0x0ea50,
            0x06b58,
            0x055c0,
            0x0ab60,
            0x096d5,
            0x092e0, // 1990-1999
            0x0c960,
            0x0d954,
            0x0d4a0,
            0x0da50,
            0x07552,
            0x056a0,
            0x0abb7,
            0x025d0,
            0x092d0,
            0x0cab5, // 2000-2009
            0x0a950,
            0x0b4a0,
            0x0baa4,
            0x0ad50,
            0x055d9,
            0x04ba0,
            0x0a5b0,
            0x15176,
            0x052b0,
            0x0a930, // 2010-2019
            0x07954,
            0x06aa0,
            0x0ad50,
            0x05b52,
            0x04b60,
            0x0a6e6,
            0x0a4e0,
            0x0d260,
            0x0ea65,
            0x0d530, // 2020-2029
            0x05aa0,
            0x076a3,
            0x096d0,
            0x04afb,
            0x04ad0,
            0x0a4d0,
            0x1d0b6,
            0x0d250,
            0x0d520,
            0x0dd45, // 2030-2039
            0x0b5a0,
            0x056d0,
            0x055b2,
            0x049b0,
            0x0a577,
            0x0a4b0,
            0x0aa50,
            0x1b255,
            0x06d20,
            0x0ada0, // 2040-2049
            0x14b63,
            0x09370,
            0x049f8,
            0x04970,
            0x064b0,
            0x168a6,
            0x0ea50,
            0x06b20,
            0x1a6c4,
            0x0aae0, // 2050-2059
            0x0a2e0,
            0x0d2e3,
            0x0c960,
            0x0d557,
            0x0d4a0,
            0x0da50,
            0x05d55,
            0x056a0,
            0x0a6d0,
            0x055d4, // 2060-2069
            0x052d0,
            0x0a9b8,
            0x0a950,
            0x0b4a0,
            0x0b6a6,
            0x0ad50,
            0x055a0,
            0x0aba4,
            0x0a5b0,
            0x052b0, // 2070-2079
            0x0b273,
            0x06930,
            0x07337,
            0x06aa0,
            0x0ad50,
            0x14b55,
            0x04b60,
            0x0a570,
            0x054e4,
            0x0d160, // 2080-2089
            0x0e968,
            0x0d520,
            0x0daa0,
            0x16aa6,
            0x056d0,
            0x04ae0,
            0x0a9d4,
            0x0a2d0,
            0x0d150,
            0x0f252, // 2090-2099
            0x0d520, // 2100
        ];
        // Kiểm tra giới hạn ngày
        const maxDays = isLeapMonth
            ? this.getLunarLeapDays(lunarYear, lunarInfo)
            : this.getLunarMonthDays(lunarYear, lunarMonth, lunarInfo);
        if (lunarDay < 1 || lunarDay > maxDays) {
            throw new Error(`Ngày âm lịch phải từ 1 đến ${maxDays} đối với ${lunarMonth}/${lunarYear}${isLeapMonth ? " (nhuận)" : ""}`);
        }
        if (lunarYear < 1900 || lunarYear > 2100) {
            throw new Error("Năm âm lịch phải từ 1900 đến 2100");
        }
        // Tính tổng số ngày từ 1900/1/1 âm lịch
        let offset = 0;
        // Tính tổng số ngày các năm trước
        for (let i = 1900; i < lunarYear; i++) {
            offset += this.getLunarYearDays(i, lunarInfo);
        }
        // Tháng nhuận của năm hiện tại
        const leapMonth = this.getLunarLeapMonth(lunarYear, lunarInfo);
        // Xử lý tháng nhuận
        if (isLeapMonth && leapMonth !== lunarMonth) {
            throw new Error(`Năm ${lunarYear} không có tháng ${lunarMonth} nhuận`);
        }
        // Cộng số ngày của các tháng trước trong năm
        for (let i = 1; i < lunarMonth; i++) {
            // Cộng số ngày của tháng thường
            offset += this.getLunarMonthDays(lunarYear, i, lunarInfo);
            // Nếu có tháng nhuận trước tháng hiện tại, cộng thêm số ngày
            if (leapMonth > 0 && i === leapMonth) {
                offset += this.getLunarLeapDays(lunarYear, lunarInfo);
            }
        }
        // Nếu là tháng nhuận, cộng thêm số ngày của tháng thường cùng số
        if (isLeapMonth) {
            offset += this.getLunarMonthDays(lunarYear, lunarMonth, lunarInfo);
        }
        // Cộng số ngày trong tháng hiện tại
        offset += lunarDay - 1;
        // Tính ngày dương lịch tương ứng (từ ngày 31/1/1900)
        const baseDate = new Date(1900, 0, 31);
        const result = new Date(baseDate);
        result.setDate(baseDate.getDate() + offset);
        return result;
    }
    /**
     * Chuyển đổi một khoảng thời gian từ dương lịch sang âm lịch
     * @returns Mảng các ngày âm lịch trong khoảng từ this.date đến this.endDate
     */
    toLunarDateRange() {
        if (!this.endDate) {
            throw new Error("EndDate không được xác định. Vui lòng thiết lập endDate trước khi gọi toLunarDateRange.");
        }
        const result = [];
        const currentDate = new Date(this.date);
        // Tạo bản sao để không ảnh hưởng đến this.date gốc
        while (currentDate <= this.endDate) {
            const lunarDate = this.toLunarDate(new Date(currentDate));
            result.push({
                solar: new Date(currentDate), // Tạo bản sao để tránh tham chiếu
                lunar: lunarDate,
            });
            // Tăng ngày lên 1
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return result;
    }
    /**
     * Lấy thông tin về tháng nhuận trong năm âm lịch
     * @param lunarYear Năm âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Số thứ tự của tháng nhuận (1-12), 0 nếu không có tháng nhuận
     */
    getLunarLeapMonth(lunarYear, lunarInfo) {
        const yearCode = lunarInfo[lunarYear - 1900];
        return yearCode & 0xf; // Lấy 4 bit cuối để xác định tháng nhuận
    }
    /**
     * Lấy số ngày của tháng nhuận trong năm âm lịch
     * @param lunarYear Năm âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Số ngày của tháng nhuận (29 hoặc 30)
     */
    getLunarLeapDays(lunarYear, lunarInfo) {
        const leapMonth = this.getLunarLeapMonth(lunarYear, lunarInfo);
        if (leapMonth === 0) {
            return 0;
        }
        const yearCode = lunarInfo[lunarYear - 1900];
        // Bit thứ 16 (0x10000) xác định tháng nhuận có 30 ngày (1) hay 29 ngày (0)
        return yearCode & 0x10000 ? 30 : 29;
    }
    /**
     * Lấy số ngày của một tháng âm lịch thường
     * @param lunarYear Năm âm lịch
     * @param lunarMonth Tháng âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Số ngày của tháng (29 hoặc 30)
     */
    getLunarMonthDays(lunarYear, lunarMonth, lunarInfo) {
        const yearCode = lunarInfo[lunarYear - 1900];
        // Bit tương ứng với tháng xác định số ngày là 30 (1) hay 29 (0)
        // Bit 4-15 tương ứng với các tháng từ 12 đến 1
        const bitPosition = 0x10000 >> lunarMonth;
        return yearCode & bitPosition ? 30 : 29;
    }
    /**
     * Lấy tổng số ngày trong năm âm lịch
     * @param lunarYear Năm âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Tổng số ngày trong năm
     */
    getLunarYearDays(lunarYear, lunarInfo) {
        let totalDays = 0;
        const leapMonth = this.getLunarLeapMonth(lunarYear, lunarInfo);
        // Tính số ngày của 12 tháng thường
        for (let i = 1; i <= 12; i++) {
            totalDays += this.getLunarMonthDays(lunarYear, i, lunarInfo);
        }
        // Cộng thêm số ngày của tháng nhuận (nếu có)
        if (leapMonth > 0) {
            totalDays += this.getLunarLeapDays(lunarYear, lunarInfo);
        }
        return totalDays;
    }
    getMonthStartEndDates() {
        const inputDate = this.date;
        if (isNaN(inputDate.getTime())) {
            throw new Error("Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ.");
        }
        // Ngày đầu tiên của tháng
        const startDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
        // Ngày cuối cùng của tháng
        const endDate = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);
        return { startDate, endDate };
    }
    getDaysInMonth() {
        const inputDate = this.date;
        if (isNaN(inputDate.getTime())) {
            throw new Error("Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ.");
        }
        const year = inputDate.getFullYear();
        const month = inputDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Lấy số ngày trong tháng
        const dates = [];
        for (let day = 1; day <= daysInMonth; day++) {
            dates.push(new Date(year, month, day)); // Thêm từng ngày vào mảng
        }
        return dates;
    }
    getCalendars() {
        const inputDate = this.date;
        if (isNaN(inputDate.getTime())) {
            throw new Error("Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ.");
        }
        // Lấy năm và tháng từ ngày đầu vào
        const year = inputDate.getFullYear();
        const month = inputDate.getMonth();
        // Tìm ngày đầu tháng
        const firstDayOfMonth = new Date(year, month, 1);
        // Tìm Chủ nhật trước ngày đầu tháng
        const dayOfWeek = firstDayOfMonth.getDay(); // 0 = Chủ nhật, 1 = Thứ hai, ..., 6 = Thứ bảy
        const sundayOffset = dayOfWeek === 0 ? 0 : -dayOfWeek; // Số ngày để lùi về Chủ nhật
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(firstDayOfMonth.getDate() + sundayOffset); // Ngày bắt đầu
        const dates = [];
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i); // Thêm các ngày tiếp theo
            dates.push(currentDate);
        }
        return dates;
    }
    getMonthsAndYears(step, count) {
        const inputDate = this.date;
        if (isNaN(inputDate.getTime())) {
            throw new Error("Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ.");
        }
        const monthsAndYears = [];
        let currentYear = inputDate.getFullYear();
        let currentMonth = inputDate.getMonth(); // Tháng từ 0 (Tháng 1) đến 11 (Tháng 12)
        for (let i = 0; i < count; i++) {
            monthsAndYears.push({ month: currentMonth + 1, year: currentYear }); // Tháng cần cộng thêm 1
            // Tính toán tháng và năm cho lần lặp tiếp theo
            currentMonth += step;
            if (currentMonth >= 12) {
                currentMonth -= 12; // Quay lại tháng 0 nếu tháng lớn hơn 11
                currentYear += 1; // Tăng năm lên
            }
            else if (currentMonth < 0) {
                currentMonth += 12; // Đảm bảo tháng không âm
                currentYear -= 1; // Giảm năm xuống
            }
        }
        return monthsAndYears;
    }
    getTimeIntervals(step) {
        if (step <= 0 || step > 60) {
            throw new Error("Bước thời gian phải lớn hơn 0 và không vượt quá 60 phút.");
        }
        const timeIntervals = [];
        const totalMinutes = 24 * 60; // Tổng số phút trong 24 giờ
        for (let i = 0; i < totalMinutes; i += step) {
            const hours = String(Math.floor(i / 60)).padStart(2, "0");
            const minutes = String(i % 60).padStart(2, "0");
            timeIntervals.push(`${hours}:${minutes}`);
        }
        return timeIntervals;
    }
    isValidDate(date) {
        const parsedDate = typeof date === "string" ? new Date(date) : date;
        // Kiểm tra nếu date là hợp lệ
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    }
    // Phương thức để thiết lập cấu hình toàn cục cho locale, timezone và date
    static setGlobalConfig({ locale, timezone, }) {
        if (locale) {
            Time.locale = locale;
        }
        if (timezone) {
            Time.timezone = timezone;
        }
    }
}
Time.locale = "vi";
Time.timezone = "Asia/Ho_Chi_Minh";
const numberOfTime = (seconds, format = "mm:ss") => {
    try {
        if (seconds < 0) {
            throw new Error("Seconds must be a non-negative number.");
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const formattedHours = hours.toString().padStart(2, "0");
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
        switch (format) {
            case "hh:mm:ss":
                return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            case "mm:ss":
                return `${formattedMinutes}:${formattedSeconds}`;
            case "ss":
                return `${seconds}`;
            default:
                throw new Error("Invalid format. Use 'hh:mm:ss', 'mm:ss', or 'ss'.");
        }
    }
    catch (error) {
        console.error((error === null || error === void 0 ? void 0 : error.message) || "ERROR");
        return "Invalid input";
    }
};
exports.numberOfTime = numberOfTime;
const anitimejs = (date, endDate) => new Time(date, endDate);
exports.anitimejs = anitimejs;
exports.anitimejsGlobalConfig = Time.setGlobalConfig;
