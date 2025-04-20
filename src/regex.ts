// regex.ts

/**
 * Các loại validation có thể thực hiện
 */
export type ValidationType = "email" | "password" | "phone" | "url";

/**
 * Các loại masking có thể thực hiện
 */
export type MaskingType = "email" | "phone" | "card";

/**
 * Các loại xử lý chuỗi
 */
export type StringProcessingType = "stripHtml" | "extractUrls" | "parseUrl";

/**
 * Các loại mã hóa
 */
export type CryptoType = "hash" | "encrypt" | "decrypt";

/**
 * Tùy chọn cho validation mật khẩu
 */
export interface PasswordOptions {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecial: boolean;
}

/**
 * Kết quả phân tích URL
 */
export interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}

/**
 * Class chính xử lý các hàm regex và mã hóa
 */
export class RegexHelper {
  /**
   * Thực hiện validation theo loại
   * @param type Loại validation
   * @param value Giá trị cần kiểm tra
   * @param options Tùy chọn (cho password)
   * @returns true nếu hợp lệ, false nếu không
   */
  public validate(
    type: ValidationType,
    value: string,
    options?: Partial<PasswordOptions> | string
  ): boolean {
    switch (type) {
      case "email":
        return this.validateEmail(value);
      case "password":
        const passwordOptions = (options as Partial<PasswordOptions>) || {};
        return this.validatePassword(value, {
          minLength: passwordOptions.minLength || 8,
          requireUppercase: passwordOptions.requireUppercase !== false,
          requireLowercase: passwordOptions.requireLowercase !== false,
          requireNumbers: passwordOptions.requireNumbers !== false,
          requireSpecial: passwordOptions.requireSpecial !== false,
        });
      case "phone":
        const country = typeof options === "string" ? options : "VN";
        return this.validatePhone(value, country as "VN" | "US" | "INT");
      case "url":
        return this.validateUrl(value);
      default:
        return false;
    }
  }

  /**
   * Thực hiện ẩn thông tin theo loại
   * @param type Loại ẩn thông tin
   * @param value Giá trị cần ẩn
   * @param options Tùy chọn bổ sung
   * @returns Chuỗi đã được ẩn thông tin
   */
  public mask(type: MaskingType, value: string, options?: number): string {
    switch (type) {
      case "email":
        return this.maskEmail(value);
      case "phone":
        return this.maskPhone(value, options || 2);
      case "card":
        return this.maskCard(value, options || 4);
      default:
        return value;
    }
  }

  /**
   * Xử lý chuỗi theo loại
   * @param type Loại xử lý
   * @param value Chuỗi cần xử lý
   * @returns Kết quả xử lý
   */
  public process(
    type: StringProcessingType,
    value: string
  ): string | string[] | ParsedUrl {
    switch (type) {
      case "stripHtml":
        return this.stripHtml(value);
      case "extractUrls":
        return this.extractUrls(value);
      case "parseUrl":
        return this.parseUrl(value);
      default:
        return value;
    }
  }

  /**
   * Thực hiện mã hóa/băm theo loại
   * @param type Loại mã hóa
   * @param value Chuỗi cần mã hóa
   * @param key Khóa mã hóa (cho encrypt/decrypt)
   * @returns Kết quả mã hóa
   */
  public crypto(type: CryptoType, value: string, key?: string): string {
    switch (type) {
      case "hash":
        return this.simpleHash(value);
      case "encrypt":
        if (!key) throw new Error("Key is required for encryption");
        return this.simpleEncrypt(value, key);
      case "decrypt":
        if (!key) throw new Error("Key is required for decryption");
        return this.simpleDecrypt(value, key);
      default:
        return value;
    }
  }

  /**
   * Các hàm private bên dưới
   */

  public validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  public validatePassword(password: string, options: PasswordOptions): boolean {
    if (password.length < options.minLength) return false;
    if (options.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (options.requireLowercase && !/[a-z]/.test(password)) return false;
    if (options.requireNumbers && !/[0-9]/.test(password)) return false;
    if (
      options.requireSpecial &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    )
      return false;
    return true;
  }

  public validatePhone(
    phone: string,
    country: "VN" | "US" | "INT" = "VN"
  ): boolean {
    // Loại bỏ các ký tự không phải số
    const digits = phone.replace(/\D/g, "");

    switch (country) {
      case "VN":
        // Số điện thoại Việt Nam: 10 chữ số, bắt đầu bằng 0 hoặc +84
        return /^(0|84|\+84)(\d{9})$/.test(phone);
      case "US":
        // Số điện thoại Mỹ: 10 chữ số, có thể bắt đầu bằng +1
        return /^(\+?1)?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/.test(
          phone
        );
      case "INT":
        // Số điện thoại quốc tế: ít nhất 8 chữ số
        return digits.length >= 8;
      default:
        return false;
    }
  }

  public validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  }

  public extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }

  public parseUrl(url: string): ParsedUrl {
    try {
      const parsedUrl = new URL(url);
      const params: Record<string, string> = {};

      // Phân tích query parameters
      parsedUrl.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return {
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hash: parsedUrl.hash,
        params,
      };
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  public maskEmail(email: string): string {
    if (!email || typeof email !== "string") return "";

    const [localPart, domain] = email.split("@");
    if (!domain) return email; // Không phải email hợp lệ

    const [domainName, extension] = domain.split(".");
    if (!extension) return email; // Không phải email hợp lệ

    // Giữ ký tự đầu tiên của local part, còn lại thay bằng *
    const maskedLocalPart =
      localPart.charAt(0) + "*".repeat(localPart.length - 1);

    // Thay thế domain name bằng ***
    const maskedDomain = "*".repeat(3);

    return `${maskedLocalPart}@${maskedDomain}.${extension}`;
  }

  public maskPhone(phone: string, visibleDigits: number = 2): string {
    if (!phone || typeof phone !== "string") return "";

    // Loại bỏ các ký tự không phải số
    const digits = phone.replace(/\D/g, "");

    if (digits.length <= visibleDigits * 2) return phone;

    const prefix = digits.slice(0, visibleDigits);
    const suffix = digits.slice(-visibleDigits);
    const masked = "*".repeat(digits.length - visibleDigits * 2);

    return `${prefix}${masked}${suffix}`;
  }

  public maskCard(cardNumber: string, visibleDigits: number = 4): string {
    if (!cardNumber || typeof cardNumber !== "string") return "";

    // Loại bỏ các ký tự không phải số
    const digits = cardNumber.replace(/\D/g, "");

    if (digits.length <= visibleDigits * 2) return cardNumber;

    const prefix = digits.slice(0, visibleDigits);
    const suffix = digits.slice(-visibleDigits);
    const masked = "*".repeat(digits.length - visibleDigits * 2);

    return `${prefix}${masked}${suffix}`;
  }

  public simpleHash(input: string): string {
    let hash = 0;
    if (!input.length) return hash.toString(16);

    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16);
  }

  public simpleEncrypt(input: string, key: string): string {
    const result: string[] = [];

    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result.push(String.fromCharCode(charCode));
    }

    return btoa(result.join(""));
  }

  public simpleDecrypt(encrypted: string, key: string): string {
    try {
      const encryptedText = atob(encrypted);
      const result: string[] = [];

      for (let i = 0; i < encryptedText.length; i++) {
        const charCode =
          encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result.push(String.fromCharCode(charCode));
      }

      return result.join("");
    } catch (e) {
      return "";
    }
  }
}
