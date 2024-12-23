export type separatorType = "." | "," | "/" | ":" | "-" | "_" | "+";

export const number = (
  number: number,
  options: {
    separator?: separatorType;
    groupSize?: number;
    toWords?: boolean;
    compact?: boolean;
  }
): string | number => {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("Tham số `number` phải là một số hợp lệ.");
  }

  const {
    separator,
    groupSize = 3,
    toWords = false,
    compact = false,
  } = options || {};

  if (groupSize < 1 || !Number.isInteger(groupSize)) {
    throw new Error("`groupSize` phải là số nguyên lớn hơn hoặc bằng 1.");
  }

  const numberToWords = (num: number): string => {
    const digits = [
      "không",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const units = ["", "nghìn", "triệu", "tỷ"];

    if (num === 0) return "Không";

    const processSegment = (segment: number): string => {
      let result = "";
      const hundred = Math.floor(segment / 100);
      const ten = Math.floor((segment % 100) / 10);
      const unit = segment % 10;

      if (hundred > 0) result += `${digits[hundred]} trăm `;

      if (ten > 1) {
        result += `${digits[ten]} mươi `;
        if (unit === 1) result += "mốt";
        else if (unit === 5) result += "lăm";
        else if (unit > 0) result += digits[unit];
      } else if (ten === 1) {
        result += "mười ";
        if (unit === 5) result += "lăm";
        else if (unit > 0) result += digits[unit];
      } else if (unit > 0) {
        result += digits[unit];
      }

      return result.trim();
    };

    const parts: string[] = [];
    let temp = num;
    let unitIndex = 0;

    while (temp > 0) {
      const segment = temp % 1000;
      if (segment > 0) {
        parts.unshift(`${processSegment(segment)} ${units[unitIndex]}`.trim());
      }
      temp = Math.floor(temp / 1000);
      unitIndex++;
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
  };

  const addSeparator = (
    num: string,
    size: number,
    sep: separatorType
  ): string =>
    num.replace(new RegExp(`\\B(?=(\\d{${size}})+(?!\\d))`, "g"), sep);

  const compactNumber = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
    return num.toString();
  };

  try {
    if (toWords) {
      const result = numberToWords(number);
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
    if (compact) return compactNumber(number);
    if (separator) return addSeparator(number.toFixed(0), groupSize, separator);

    return number;
  } catch (error: any) {
    throw new Error(`Đã xảy ra lỗi khi xử lý số: ${error.message}`);
  }
};
