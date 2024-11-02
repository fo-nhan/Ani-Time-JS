import { DateLocalizationConfig, FormatDateOptions, Language, TimeZone } from "./type";
declare class Time {
    private date;
    private locale;
    private endDate;
    constructor(date?: Date | string, endDate?: Date | string);
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
    getDay(): number;
    getMonth(): number;
    getYear(): number;
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    setTimeZone(timeZone: TimeZone): this;
    add(value: number, unit: "days" | "hours" | "minutes" | "seconds" | "months" | "years"): this;
    subtract(value: number, unit: "days" | "hours" | "minutes" | "seconds" | "months" | "years"): this;
    arrangeTime(arrayDate: (Date | string)[], order?: "asc" | "desc"): this;
    calculateWorkingDays(week: number[], // Mảng chứa các thứ trong tuần muốn loại bỏ (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
    holidays: (Date | string)[]): {
        workingDays: Date[];
        holidaysExcluded: Date[];
    };
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
}
declare const timejs: (date?: Date | string, endDate?: Date | string) => Time;
export default timejs;
