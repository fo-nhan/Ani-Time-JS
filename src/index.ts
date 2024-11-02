import { multilingual } from "./helper";
import {
  DateLocalization,
  DateLocalizationConfig,
  FormatDateOptions,
  Language,
  TimeZone,
} from "./type";

class Time {
  private date: Date;
  private locale: string;
  private endDate: Date | null;

  constructor(date?: Date | string, endDate?: Date | string) {
    this.date = date ? new Date(date) : new Date();
    if (isNaN(this.date.getTime())) {
      throw new Error(
        "The date is not valid. Please provide a valid date string or Date object."
      );
    }

    if (endDate) {
      this.endDate = new Date(endDate);
      if (isNaN(this.endDate.getTime())) {
        throw new Error(
          "The endDate is not valid. Please provide a valid date string or Date object."
        );
      }
    } else {
      this.endDate = null;
    }

    this.locale = "vi"; // Default locale
  }

  private formatDate(
    format: FormatDateOptions,
    formatLanguage: DateLocalization
  ): string {
    let newFormat: any = format;
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
    const pad = (n: number) => (n < 10 ? `0${n}` : n.toString());

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
      .map((key: any) =>
        key?.trim()
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
          : ""
      )
      .join(" ");
  }

  // Kiểm tra startDate hay endDate lớn hơn
  public isStartDateGreater(): boolean {
    if (this.endDate) {
      return this.date > this.endDate;
    }
    return false;
  }

  // Tính khoảng cách giữa hai ngày (trả về mili giây)
  public getDateDifference(): number {
    if (this.endDate) {
      return Math.abs(this.endDate.getTime() - this.date.getTime());
    }

    return 0;
  }

  public dateCal(): {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    months: number;
    years: number;
  } {
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

  public format(
    format: FormatDateOptions = "DD/MM/YYYY",
    configLanguage?: DateLocalizationConfig
  ): string {
    const formatLanguage = multilingual[this.locale];
    return this.formatDate(format, {
      ...formatLanguage,
      ...(configLanguage ? configLanguage : {}),
    });
  }

  public countdown(): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    isPast: boolean;
  } {
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

  public lang(lang: Language): this {
    if (!multilingual[lang]) {
      throw new Error(`Language '${lang}' not supported.`);
    }
    this.locale = lang;
    return this;
  }

  public toString(): string {
    return this.format("DD/MM/YYYY HH:mm:ss.SSS");
  }

  public getDay(): number {
    return this.date.getDate();
  }

  public getMonth(): number {
    return this.date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần +1
  }

  public getYear(): number {
    return this.date.getFullYear();
  }

  public getHours(): number {
    return this.date.getHours();
  }

  public getMinutes(): number {
    return this.date.getMinutes();
  }

  public getSeconds(): number {
    return this.date.getSeconds();
  }

  public setTimeZone(timeZone: TimeZone): this {
    try {
      const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const [
        { value: month },
        { value: day },
        { value: year },
        { value: hour },
        { value: minute },
        { value: second },
      ] = dateTimeFormat.formatToParts(this.date);

      // Chuyển đổi các giá trị thành định dạng ISO 8601
      this.date = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}`
      );
    } catch (error) {
      throw new Error(`Invalid time zone: '${timeZone}'`);
    }
    return this;
  }

  // Hàm thêm thời gian
  public add(
    value: number,
    unit: "days" | "hours" | "minutes" | "seconds" | "months" | "years"
  ): this {
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
  public subtract(
    value: number,
    unit: "days" | "hours" | "minutes" | "seconds" | "months" | "years"
  ): this {
    return this.add(-value, unit);
  }

  public arrangeTime(
    arrayDate: (Date | string)[],
    order: "asc" | "desc" = "asc"
  ): this {
    // Chuyển đổi tất cả các giá trị trong mảng thành đối tượng Date
    const dates = arrayDate.map((date) => new Date(date));

    // Kiểm tra xem có giá trị không hợp lệ trong mảng không
    if (dates.some((date) => isNaN(date.getTime()))) {
      throw new Error("Một trong các ngày không hợp lệ.");
    }

    // Sắp xếp mảng theo thứ tự tăng dần hoặc giảm dần
    dates.sort((a, b) =>
      order === "asc" ? a.getTime() - b.getTime() : b.getTime() - a.getTime()
    );

    return this;
  }

  public calculateWorkingDays(
    week: number[], // Mảng chứa các thứ trong tuần muốn loại bỏ (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
    holidays: (Date | string)[] // Mảng chứa các ngày lễ muốn loại bỏ
  ): { workingDays: Date[]; holidaysExcluded: Date[] } {
    const start = this.date;
    const end = this.endDate || this.date;
    const holidaysExcluded: Date[] = [];

    // Chuyển đổi và lọc ngày lễ
    const holidayDates = holidays
      .map((holiday) => new Date(holiday))
      .filter((date) => !isNaN(date.getTime()));

    const workingDays: Date[] = [];

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();

      // Kiểm tra xem ngày hiện tại có phải là ngày nghỉ cuối tuần hoặc ngày lễ không
      const isWeekend = week.includes(dayOfWeek);
      const isHoliday = holidayDates.some(
        (holiday) => holiday.getTime() === date.getTime()
      );

      if (!isWeekend && !isHoliday) {
        workingDays.push(new Date(date)); // Thêm vào ngày làm việc
      } else if (isHoliday) {
        holidaysExcluded.push(new Date(date)); // Thêm vào ngày lễ
      }
    }

    return { workingDays, holidaysExcluded };
  }

  public getMonthStartEndDates(): { startDate: Date; endDate: Date } {
    const inputDate = this.date;
    if (isNaN(inputDate.getTime())) {
      throw new Error(
        "Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ."
      );
    }

    // Ngày đầu tiên của tháng
    const startDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      1
    );

    // Ngày cuối cùng của tháng
    const endDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth() + 1,
      0
    );

    return { startDate, endDate };
  }

  public getDaysInMonth(): Date[] {
    const inputDate = this.date;
    if (isNaN(inputDate.getTime())) {
      throw new Error(
        "Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ."
      );
    }

    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Lấy số ngày trong tháng

    const dates: Date[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day)); // Thêm từng ngày vào mảng
    }

    return dates;
  }

  public getCalendars(): Date[] {
    const inputDate = this.date;
    if (isNaN(inputDate.getTime())) {
      throw new Error(
        "Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ."
      );
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

    const dates: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i); // Thêm các ngày tiếp theo
      dates.push(currentDate);
    }

    return dates;
  }

  public getMonthsAndYears(
    step: number,
    count: number
  ): { month: number; year: number }[] {
    const inputDate = this.date;
    if (isNaN(inputDate.getTime())) {
      throw new Error(
        "Ngày không hợp lệ. Vui lòng cung cấp một chuỗi hoặc đối tượng Date hợp lệ."
      );
    }

    const monthsAndYears: { month: number; year: number }[] = [];
    let currentYear = inputDate.getFullYear();
    let currentMonth = inputDate.getMonth(); // Tháng từ 0 (Tháng 1) đến 11 (Tháng 12)

    for (let i = 0; i < count; i++) {
      monthsAndYears.push({ month: currentMonth + 1, year: currentYear }); // Tháng cần cộng thêm 1

      // Tính toán tháng và năm cho lần lặp tiếp theo
      currentMonth += step;
      if (currentMonth >= 12) {
        currentMonth -= 12; // Quay lại tháng 0 nếu tháng lớn hơn 11
        currentYear += 1; // Tăng năm lên
      } else if (currentMonth < 0) {
        currentMonth += 12; // Đảm bảo tháng không âm
        currentYear -= 1; // Giảm năm xuống
      }
    }

    return monthsAndYears;
  }
  public getTimeIntervals(step: number): string[] {
    if (step <= 0 || step > 60) {
      throw new Error(
        "Bước thời gian phải lớn hơn 0 và không vượt quá 60 phút."
      );
    }

    const timeIntervals: string[] = [];
    const totalMinutes = 24 * 60; // Tổng số phút trong 24 giờ

    for (let i = 0; i < totalMinutes; i += step) {
      const hours = String(Math.floor(i / 60)).padStart(2, "0");
      const minutes = String(i % 60).padStart(2, "0");
      timeIntervals.push(`${hours}:${minutes}`);
    }

    return timeIntervals;
  }

  public isValidDate(date: Date | string): boolean {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    // Kiểm tra nếu date là hợp lệ
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }
}

const timejs = (date?: Date | string, endDate?: Date | string) =>
  new Time(date, endDate);

export default timejs;
