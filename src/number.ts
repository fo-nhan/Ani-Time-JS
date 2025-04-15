export type separatorType = "." | "," | "/" | ":" | "-" | "_" | "+";

export type NumberParseOptions = {
  /**
   * Định dạng của chuỗi đầu vào (nếu là string)
   * - 'default': phân tích chuỗi theo định dạng mặc định
   * - 'eu': phân tích theo định dạng châu Âu (dấu phẩy là dấu thập phân)
   * - 'custom': cho phép tùy chỉnh decimalSeparator và thousandSeparator
   */
  format?: 'default' | 'eu' | 'custom';
  
  /**
   * Ký tự phân cách phần thập phân trong chuỗi đầu vào
   */
  decimalSeparator?: string;
  
  /**
   * Ký tự phân cách hàng nghìn trong chuỗi đầu vào
   */
  thousandSeparator?: string;
};

export type NumberFormatOptions = {
  /**
   * Ký tự phân cách hàng nghìn trong kết quả
   */
  separator?: separatorType;
  
  /**
   * Kích thước nhóm chữ số (mặc định là 3)
   */
  groupSize?: number;
  
  /**
   * Chuyển đổi số thành chữ
   */
  toWords?: boolean;
  
  /**
   * Định dạng số dạng ngắn gọn (1k, 1M, 1B)
   */
  compact?: boolean;
  
  /**
   * Số chữ số thập phân cần hiển thị
   */
  decimals?: number;
  
  /**
   * Làm tròn số thập phân
   * - 'round': làm tròn thông thường (5 trở lên làm tròn lên)
   * - 'floor': luôn làm tròn xuống
   * - 'ceil': luôn làm tròn lên
   */
  rounding?: 'round' | 'floor' | 'ceil';
  
  /**
   * Hiển thị dấu + cho số dương
   */
  showPositiveSign?: boolean;
  
  /**
   * Ký tự phân cách phần thập phân trong kết quả
   */
  decimalSeparator?: string;
  
  /**
   * Định dạng là tiền tệ
   */
  currency?: string;
  
  /**
   * Vị trí ký hiệu tiền tệ ('prefix' hoặc 'suffix')
   */
  currencyPosition?: 'prefix' | 'suffix';
  
  /**
   * Phân tích chuỗi đầu vào
   */
  parseOptions?: NumberParseOptions;
};

export const numbers = (
  input: number | string,
  options: NumberFormatOptions = {}
): string | number => {
  const {
    separator,
    groupSize = 3,
    toWords = false,
    compact = false,
    decimals,
    rounding = 'round',
    showPositiveSign = false,
    decimalSeparator = '.',
    currency,
    currencyPosition = 'prefix',
    parseOptions = { format: 'default' }
  } = options;

  // Kiểm tra groupSize
  if (groupSize < 1 || !Number.isInteger(groupSize)) {
    throw new Error("`groupSize` phải là số nguyên lớn hơn hoặc bằng 1.");
  }

  // Chuyển input thành số
  let numericValue: number;

  if (typeof input === 'number') {
    numericValue = input;
  } else if (typeof input === 'string') {
    numericValue = parseNumericString(input, parseOptions);
  } else {
    throw new Error("Tham số đầu vào phải là số hoặc chuỗi.");
  }

  // Kiểm tra số hợp lệ
  if (isNaN(numericValue)) {
    throw new Error("Không thể chuyển đổi thành số hợp lệ.");
  }

  // Chuyển đổi sang chữ nếu cần
  if (toWords) {
    const result = numberToWords(numericValue);
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  // Định dạng số ngắn gọn
  if (compact) {
    return compactNumber(numericValue, decimals !== undefined ? decimals : 1);
  }

  // Áp dụng việc làm tròn số thập phân nếu được yêu cầu
  if (decimals !== undefined) {
    switch (rounding) {
      case 'floor':
        numericValue = Math.floor(numericValue * Math.pow(10, decimals)) / Math.pow(10, decimals);
        break;
      case 'ceil':
        numericValue = Math.ceil(numericValue * Math.pow(10, decimals)) / Math.pow(10, decimals);
        break;
      case 'round':
      default:
        numericValue = Math.round(numericValue * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
  }

  // Chuyển số thành chuỗi với số thập phân
  let numStr = decimals !== undefined
    ? numericValue.toFixed(decimals)
    : numericValue.toString();

  // Xử lý phần nguyên và phần thập phân riêng biệt
  const parts = numStr.split('.');
  
  // Thêm dấu phân cách cho phần nguyên nếu cần
  if (separator) {
    parts[0] = addSeparator(parts[0], groupSize, separator);
  }

  // Ghép phần nguyên và phần thập phân
  numStr = parts.length > 1 
    ? `${parts[0]}${decimalSeparator}${parts[1]}`
    : parts[0];

  // Thêm dấu cộng cho số dương nếu cần
  if (showPositiveSign && numericValue > 0) {
    numStr = `+${numStr}`;
  }

  // Thêm đơn vị tiền tệ
  if (currency) {
    numStr = currencyPosition === 'prefix' 
      ? `${currency}${numStr}` 
      : `${numStr}${currency}`;
  }

  return numStr;
};

/**
 * Hàm phân tích chuỗi thành số
 */
function parseNumericString(input: string, options: NumberParseOptions = {}): number {
  const { format = 'default', decimalSeparator, thousandSeparator } = options;
  
  // Loại bỏ tất cả khoảng trắng
  let cleanedStr = input.trim().replace(/\s+/g, '');
  
  // Xử lý các định dạng số khác nhau
  if (format === 'eu') {
    // Định dạng châu Âu: 1.234,56
    cleanedStr = cleanedStr
      .replace(/\./g, '') // Xóa dấu phân cách hàng nghìn
      .replace(/,/g, '.'); // Chuyển dấu phẩy thành dấu chấm thập phân
  } else if (format === 'custom' && decimalSeparator && thousandSeparator) {
    // Định dạng tùy chỉnh
    const escapedThousandSep = thousandSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedDecimalSep = decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Xóa dấu phân cách hàng nghìn, thay dấu thập phân bằng dấu chấm
    const regex = new RegExp(escapedThousandSep, 'g');
    cleanedStr = cleanedStr
      .replace(regex, '')
      .replace(escapedDecimalSep, '.');
  } else {
    // Định dạng mặc định: xóa tất cả trừ số, dấu chấm, dấu cộng và dấu trừ
    cleanedStr = cleanedStr.replace(/[^\d.+-]/g, '');
  }
  
  return parseFloat(cleanedStr);
}

/**
 * Thêm dấu phân cách ngàn vào số
 */
function addSeparator(
  num: string,
  size: number,
  sep: separatorType
): string {
  return num.replace(new RegExp(`\\B(?=(\\d{${size}})+(?!\\d))`, "g"), sep);
}

/**
 * Chuyển đổi số sang dạng compact (1k, 1M, 1B)
 */
function compactNumber(num: number, decimals: number = 1): string {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1e12) return `${sign}${(absNum / 1e12).toFixed(decimals)}T`;
  if (absNum >= 1e9) return `${sign}${(absNum / 1e9).toFixed(decimals)}B`;
  if (absNum >= 1e6) return `${sign}${(absNum / 1e6).toFixed(decimals)}M`;
  if (absNum >= 1e3) return `${sign}${(absNum / 1e3).toFixed(decimals)}k`;
  
  return num.toString();
}

/**
 * Chuyển đổi số thành chữ (tiếng Việt)
 */
function numberToWords(num: number): string {
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
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  // Xử lý số âm
  if (num < 0) {
    return `âm ${numberToWords(Math.abs(num))}`;
  }
  
  // Xử lý số 0
  if (num === 0) return "không";

  // Xử lý số thập phân
  if (num % 1 !== 0) {
    const parts = num.toString().split('.');
    const integerPart = parseInt(parts[0]);
    const decimalPart = parts[1];
    
    let result = numberToWords(integerPart);
    result += " phẩy ";
    
    // Đọc từng chữ số sau dấu phẩy
    for (let i = 0; i < decimalPart.length; i++) {
      result += `${digits[parseInt(decimalPart[i])]} `;
    }
    
    return result.trim();
  }

  const processSegment = (segment: number): string => {
    if (segment === 0) return "";
    
    let result = "";
    const hundred = Math.floor(segment / 100);
    const ten = Math.floor((segment % 100) / 10);
    const unit = segment % 10;

    if (hundred > 0) {
      result += `${digits[hundred]} trăm `;
    }

    if (ten > 1) {
      result += `${digits[ten]} mươi `;
      if (unit === 1) {
        result += "mốt";
      } else if (unit === 5) {
        result += "lăm";
      } else if (unit > 0) {
        result += digits[unit];
      }
    } else if (ten === 1) {
      result += "mười ";
      if (unit === 5) {
        result += "lăm";
      } else if (unit > 0) {
        result += digits[unit];
      }
    } else if (unit > 0 || segment === 0) {
      // Trường hợp chỉ có đơn vị hoặc là số 0
      if (hundred > 0 || ten > 0) {
        // Nếu có hàng trăm hoặc chục, thì thêm "lẻ" trước đơn vị
        result += `lẻ ${digits[unit]}`;
      } else {
        result += digits[unit];
      }
    }

    return result.trim();
  };

  const parts: string[] = [];
  let temp = Math.floor(num);
  let unitIndex = 0;

  while (temp > 0) {
    const segment = temp % 1000;
    
    if (segment > 0) {
      parts.unshift(`${processSegment(segment)} ${units[unitIndex]}`.trim());
    } else if (unitIndex > 0 && unitIndex % 3 === 0) {
      // Thêm đơn vị lớn (tỷ, nghìn tỷ, ...) kể cả khi segment = 0
      parts.unshift(units[unitIndex]);
    }
    
    temp = Math.floor(temp / 1000);
    unitIndex++;
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}