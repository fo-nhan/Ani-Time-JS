import { DateLocalizationConfig, FormatDateOptions, Language, TimeZone } from "./type";
import useTimer from "./useTimer";
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
export declare const anitimejs: (date?: Date | string, endDate?: Date | string) => Time;
export declare const anitimejsGlobalConfig: typeof Time.setGlobalConfig;
export { useTimer };
