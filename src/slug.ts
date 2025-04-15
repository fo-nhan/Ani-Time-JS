/**
 * Tùy chọn cho hàm tạo và xử lý slug
 */
export interface SlugOptions {
  /** Ký tự phân cách giữa các từ (mặc định: "-") */
  separator?: string;
  /** Chuyển đổi sang chữ thường (mặc định: true) */
  lowercase?: boolean;
  /** Loại bỏ dấu tiếng Việt (mặc định: true) */
  removeAccents?: boolean;
  /** Giới hạn độ dài slug (mặc định: 0 - không giới hạn) */
  maxLength?: number;
  /** Loại bỏ các ký tự không phải chữ và số (mặc định: true) */
  removeNonAlphanumeric?: boolean;
  /** Thay thế ký tự khoảng trắng (mặc định: true - dùng separator) */
  replaceWhitespace?: boolean;
  /** Xử lý các ký tự đặc biệt (mặc định: {}) */
  customReplacements?: Record<string, string>;
}

/**
 * Tạo slug từ chuỗi với nhiều tùy chọn
 *
 * @param input Chuỗi đầu vào cần chuyển thành slug
 * @param options Tùy chọn xử lý slug
 * @returns Chuỗi slug đã được xử lý
 *
 * @example
 * // Tạo slug cơ bản
 * createSlug("Hello World"); // "hello-world"
 *
 * // Xử lý tiếng Việt
 * createSlug("Chào Thế Giới"); // "chao-the-gioi"
 *
 * // Với tùy chọn
 * createSlug("Product Name (Version 2.0)", {
 *   separator: "_",
 *   maxLength: 20,
 *   customReplacements: { "2.0": "2-0" }
 * }); // "product_name_version"
 */
export function createSlug(input: string, options: SlugOptions = {}): string {
  if (!input) return "";

  const {
    separator = "-",
    lowercase = true,
    removeAccents = true,
    maxLength = 0,
    removeNonAlphanumeric = true,
    replaceWhitespace = true,
    customReplacements = {},
  } = options;

  // Áp dụng các thay thế tùy chỉnh
  let slug = input;
  Object.entries(customReplacements).forEach(([from, to]) => {
    slug = slug.replace(new RegExp(from, "g"), to);
  });

  // Xử lý chữ thường nếu cần
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Loại bỏ dấu tiếng Việt nếu cần
  if (removeAccents) {
    slug = removeVietnameseAccents(slug);
  }

  // Thay thế khoảng trắng bằng dấu phân cách
  if (replaceWhitespace) {
    slug = slug.replace(/\s+/g, separator);
  }

  // Loại bỏ các ký tự không phải chữ và số
  if (removeNonAlphanumeric) {
    slug = slug.replace(/[^\w\-]+/g, "");
    slug = slug.replace(/\_+/g, separator);
  }

  // Loại bỏ các dấu phân cách trùng lặp
  const separatorRegex = new RegExp(`\\${separator}{2,}`, "g");
  slug = slug.replace(separatorRegex, separator);

  // Loại bỏ dấu phân cách ở đầu và cuối
  slug = slug.replace(new RegExp(`^\\${separator}|\\${separator}$`, "g"), "");

  // Giới hạn độ dài nếu cần
  if (maxLength > 0 && slug.length > maxLength) {
    // Cắt tại vị trí dấu phân cách gần nhất để tránh cắt giữa từ
    const lastPos = slug.substring(0, maxLength).lastIndexOf(separator);
    slug = slug.substring(0, lastPos > 0 ? lastPos : maxLength);
  }

  return slug;
}

/**
 * Kiểm tra xem một chuỗi có phải slug hợp lệ không
 *
 * @param slug Chuỗi slug cần kiểm tra
 * @param pattern Mẫu regex tùy chỉnh (tùy chọn)
 * @returns true nếu là slug hợp lệ, false nếu không
 *
 * @example
 * isValidSlug("hello-world"); // true
 * isValidSlug("hello world"); // false
 * isValidSlug("product_123", /^[a-z0-9_]+$/); // true
 */
export function isValidSlug(slug: string, pattern?: RegExp): boolean {
  if (!slug) return false;

  // Mẫu mặc định: chữ thường, số và dấu gạch ngang
  const defaultPattern = /^[a-z0-9\-]+$/;
  const regex = pattern || defaultPattern;

  return regex.test(slug);
}

/**
 * Tạo một slug duy nhất từ một chuỗi, thêm hậu tố số nếu cần
 *
 * @param input Chuỗi đầu vào
 * @param existingSlugs Mảng các slug đã tồn tại để kiểm tra trùng lặp
 * @param options Tùy chọn xử lý slug
 * @returns Slug duy nhất đã được xử lý
 *
 * @example
 * createUniqueSlug("Hello", ["hello", "hello-1"]); // "hello-2"
 */
export function createUniqueSlug(
  input: string,
  existingSlugs: string[] = [],
  options: SlugOptions = {}
): string {
  const baseSlug = createSlug(input, options);

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  // Tìm số hiện tại nếu slug có dạng base-1, base-2, ...
  const slugPattern = new RegExp(`^${baseSlug}(\\-\\d+)?$`);
  const { separator = "-" } = options;

  let maxNumber = 0;
  existingSlugs.forEach((slug) => {
    if (slugPattern.test(slug)) {
      const match = slug.match(new RegExp(`${baseSlug}${separator}(\\d+)$`));
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  });

  return `${baseSlug}${separator}${maxNumber + 1}`;
}

/**
 * Lấy một phần của slug, mặc định là phần cuối cùng
 *
 * @param slug Chuỗi slug cần xử lý
 * @param position Vị trí cần lấy (mặc định: 'last')
 * @param separator Ký tự phân cách (mặc định: "-")
 * @returns Phần của slug đã được xử lý
 *
 * @example
 * getSlugPart("blog/2023/post-title"); // "post-title"
 * getSlugPart("blog/2023/post-title", 'first', '/'); // "blog"
 * getSlugPart("blog/2023/post-title", 1, '/'); // "2023"
 */
export function getSlugPart(
  slug: string,
  position: "first" | "last" | number = "last",
  separator: string = "-"
): string {
  if (!slug) return "";

  const parts = slug.split(separator);

  if (position === "first") {
    return parts[0] || "";
  } else if (position === "last") {
    return parts[parts.length - 1] || "";
  } else if (typeof position === "number") {
    return parts[position] || "";
  }

  return "";
}

/**
 * Hàm trợ giúp loại bỏ dấu tiếng Việt
 *
 * @param str Chuỗi cần xử lý
 * @returns Chuỗi đã loại bỏ dấu
 */
function removeVietnameseAccents(str: string): string {
  const map: Record<string, string> = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    đ: "d",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
  };

  return str.replace(/[^A-Za-z0-9\s]/g, (a) => map[a] || a);
}
