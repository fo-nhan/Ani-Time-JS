import { DateLocalizationConfig, FormatDateOptions, Language, TimeZone } from "./type";
import useTimer from "./useTimer";
import { animate, timeline, stagger, spring, physics, sequence, createTransform, effects, easingFunctions } from "./animate";
import { numbers } from "./number";
import { random } from "./random";
import { sortArray } from "./sort";
import { createSlug, createUniqueSlug, getSlugPart, isValidSlug } from "./slug";
import { RegexHelper } from "./regex";
declare class Time {
    private date;
    private endDate;
    private static locale;
    private static timezone;
    constructor(date?: Date | string, endDate?: Date | string);
    private parseDate;
    private formatDate;
    isStartDateGreater(): boolean;
    getDateDifference(): number;
    dateCal(): {
        milliseconds: number;
        seconds: number;
        minutes: number;
        hours: number;
        days: number;
        months: number;
        years: number;
    };
    format(format?: FormatDateOptions, configLanguage?: DateLocalizationConfig): string;
    formats(formats: Array<{
        logic: FormatDateOptions;
        time: number;
    }>, configLanguage?: DateLocalizationConfig): string;
    countdown(): {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;
        isPast: boolean;
    };
    lang(lang: Language): this;
    toString(): string;
    toLocaleDateString(): string;
    toLocaleTimeString(): string;
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    getTime(): number;
    getYears(start?: number, end?: number): number[];
    getWeek(): Date[];
    getDayInWeek(): number;
    getTimeZone(): TimeZone;
    getLocale(): string;
    getPreviousDay(): Date;
    getNextDay(): Date;
    getPreviousYear(): Date;
    getNextYear(): Date;
    getPreviousMonth(): Date;
    getNextMonth(): Date;
    getWeekOfYear(): number;
    getDaysOfWeekInYear(dayOfWeek: number): Date[];
    setTimeZone(timeZone: TimeZone): this;
    add(value: number, unit: "days" | "hours" | "minutes" | "seconds" | "months" | "years"): this;
    subtract(value: number, unit: "days" | "hours" | "minutes" | "seconds" | "months" | "years"): this;
    arrangeTime(arrayDate: (Date | string)[], order?: "asc" | "desc"): this;
    arrangeTimeObject(arrayDate: any[], order?: "asc" | "desc", keyPath?: string): this;
    calculateWorkingDays(week: number[], // Mảng chứa các thứ trong tuần muốn loại bỏ (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
    holidays: (Date | string)[]): {
        workingDays: Date[];
        holidaysExcluded: Date[];
    };
    /**
     * Lấy danh sách các ngày lễ theo quốc gia cho năm cụ thể
     * @param year Năm cần lấy ngày lễ (mặc định là năm hiện tại)
     * @param country Mã quốc gia (mặc định: 'vi' - Việt Nam)
     * @returns Mảng các ngày lễ
     */
    getHolidays(year?: number, country?: Language): Date[];
    /**
     * Lấy danh sách các ngày lễ kèm tên theo quốc gia cho năm cụ thể
     * @param year Năm cần lấy ngày lễ (mặc định là năm hiện tại)
     * @param country Mã quốc gia (mặc định: 'vi' - Việt Nam)
     * @returns Mảng các ngày lễ kèm tên
     */
    getNamedHolidays(year?: number, country?: Language): Array<{
        name: string;
        date: Date;
    }>;
    /**
     * Chuyển đổi từ ngày dương lịch sang ngày âm lịch
     * @param date Ngày dương lịch (nếu không cung cấp, sử dụng this.date)
     * @returns Đối tượng chứa thông tin ngày âm lịch
     */
    toLunarDate(date?: Date): {
        day: number;
        month: number;
        year: number;
        leap: boolean;
        dateString: string;
    };
    /**
     * Chuyển đổi từ ngày âm lịch sang ngày dương lịch
     * @param lunarDay Ngày âm lịch
     * @param lunarMonth Tháng âm lịch
     * @param lunarYear Năm âm lịch
     * @param isLeapMonth Có phải tháng nhuận không
     * @returns Ngày dương lịch tương ứng
     */
    fromLunarDate(lunarDay: number, lunarMonth: number, lunarYear: number, isLeapMonth?: boolean): Date;
    /**
     * Chuyển đổi một khoảng thời gian từ dương lịch sang âm lịch
     * @returns Mảng các ngày âm lịch trong khoảng từ this.date đến this.endDate
     */
    toLunarDateRange(): Array<{
        solar: Date;
        lunar: {
            day: number;
            month: number;
            year: number;
            leap: boolean;
            dateString: string;
        };
    }>;
    /**
     * Lấy thông tin về tháng nhuận trong năm âm lịch
     * @param lunarYear Năm âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Số thứ tự của tháng nhuận (1-12), 0 nếu không có tháng nhuận
     */
    private getLunarLeapMonth;
    /**
     * Lấy số ngày của tháng nhuận trong năm âm lịch
     * @param lunarYear Năm âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Số ngày của tháng nhuận (29 hoặc 30)
     */
    private getLunarLeapDays;
    /**
     * Lấy số ngày của một tháng âm lịch thường
     * @param lunarYear Năm âm lịch
     * @param lunarMonth Tháng âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Số ngày của tháng (29 hoặc 30)
     */
    private getLunarMonthDays;
    /**
     * Lấy tổng số ngày trong năm âm lịch
     * @param lunarYear Năm âm lịch
     * @param lunarInfo Bảng dữ liệu lịch âm
     * @returns Tổng số ngày trong năm
     */
    private getLunarYearDays;
    getMonthStartEndDates(): {
        startDate: Date;
        endDate: Date;
    };
    getDaysInMonth(): Date[];
    getCalendars(): Date[];
    getMonthsAndYears(step: number, count: number): {
        month: number;
        year: number;
    }[];
    getTimeIntervals(step: number): string[];
    isValidDate(date: Date | string): boolean;
    static setGlobalConfig({ locale, timezone, }: {
        locale?: Language;
        timezone?: TimeZone;
    }): void;
}
export declare const numberOfTime: (seconds: number, format?: "hh:mm:ss" | "mm:ss" | "ss") => string;
export declare const anitimejs: (date?: Date | string, endDate?: Date | string) => Time;
export declare const anitimejsGlobalConfig: typeof Time.setGlobalConfig;
export { useTimer, animate, numbers, random, sortArray, timeline, stagger, spring, physics, sequence, createTransform, effects, easingFunctions, createSlug, createUniqueSlug, getSlugPart, isValidSlug, RegexHelper, };
