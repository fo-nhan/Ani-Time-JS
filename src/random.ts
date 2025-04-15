export type RandomOptions<T = any> = {
  // Các tùy chọn cho chuỗi ngẫu nhiên
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecials?: boolean;
  customCharset?: string; // Tập ký tự tùy chỉnh
  
  // Các tùy chọn cho phạm vi số
  min?: number;
  max?: number;
  step?: number; // Bước nhảy cho dãy số (ví dụ: 2, 4, 6, ...)
  
  // Các tùy chọn loại trừ và điều kiện
  exclude?: (string | number | T)[]; // Loại trừ dựa trên giá trị hoặc object
  excludeRegex?: RegExp | RegExp[]; // Loại trừ dựa trên biểu thức chính quy
  filter?: (item: T | string | number) => boolean; // Hàm lọc tùy chỉnh
  
  // Tùy chọn phân phối xác suất
  probability?: Record<string, number>; // Xác suất theo key hoặc object
  distribution?: 'uniform' | 'normal' | 'exponential' | 'custom'; // Loại phân phối
  distributionParams?: { mean?: number; stdDev?: number; lambda?: number; custom?: (x: number) => number }; // Tham số phân phối
  
  // Các tùy chọn kết quả
  length?: number; // Số lượng kết quả
  data?: T[]; // Mảng dữ liệu để random (có thể là object)
  unique?: boolean; // Random không trùng lặp
  sort?: boolean | ((a: any, b: any) => number); // Sắp xếp kết quả
  
  // Các tùy chọn định dạng
  format?: 'string' | 'array' | 'object'; // Định dạng kết quả trả về
  formatTemplate?: string; // Mẫu định dạng kết quả (ví dụ: "###-##-####")
  prefix?: string; // Tiền tố cho kết quả
  suffix?: string; // Hậu tố cho kết quả
  
  // Các tùy chọn nâng cao
  seed?: number; // Hạt giống cho bộ sinh số ngẫu nhiên
  groupBy?: number; // Nhóm kết quả thành các mảng con với kích thước xác định
  mapFunction?: (value: any) => any; // Hàm ánh xạ để biến đổi mỗi giá trị
  
  // Tùy chọn loại random đặc biệt
  type?: 'default' | 'uuid' | 'color' | 'filename'; // Loại random đặc biệt
  
  // Tùy chọn cho UUID
  uuidOptions?: {
    dashes?: boolean; // Có sử dụng dấu gạch ngang trong UUID hay không
    version?: 4 | 1; // Phiên bản UUID (hiện hỗ trợ v4)
  };
  
  // Tùy chọn cho màu sắc
  colorOptions?: {
    alpha?: boolean; // Có thêm kênh alpha hay không
    format?: 'hex' | 'rgb' | 'hsl'; // Định dạng màu sắc
    minBrightness?: number; // Độ sáng tối thiểu (0-1)
    maxBrightness?: number; // Độ sáng tối đa (0-1)
  };
  
  // Tùy chọn cho tên tệp
  filenameOptions?: {
    extension?: string; // Phần mở rộng (vd: '.jpg')
    includeTimestamp?: boolean; // Thêm timestamp vào tên
    nameLength?: number; // Độ dài của phần tên ngẫu nhiên
  };
};

export const random = <T = any>(options: RandomOptions<T> = {}): string | number | T | (string | number | T)[] => {
  const {
    // Các tùy chọn cơ bản
    includeUppercase = false,
    includeLowercase = false,
    includeNumbers = false,
    includeSpecials = false,
    customCharset = "",
    min,
    max,
    step = 1,
    exclude = [],
    excludeRegex,
    filter,
    probability = {},
    distribution = 'uniform',
    distributionParams = {},
    length = 1,
    data = [],
    unique = false,
    sort = false,
    format = 'auto',
    formatTemplate = '',
    prefix = '',
    suffix = '',
    seed,
    groupBy,
    mapFunction,
    
    // Các tùy chọn loại đặc biệt
    type = 'default',
    uuidOptions = { dashes: true, version: 4 },
    colorOptions = { alpha: false, format: 'hex', minBrightness: 0, maxBrightness: 1 },
    filenameOptions = { extension: '', includeTimestamp: false, nameLength: 8 }
  } = options;

  // Xử lý các loại random đặc biệt
  if (type === 'uuid') {
    return generateUUID(uuidOptions);
  } else if (type === 'color') {
    return generateColor(colorOptions);
  } else if (type === 'filename') {
    return generateFilename(filenameOptions, prefix);
  }

  // Các bộ ký tự cơ bản
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~";

  // Khởi tạo bộ sinh số ngẫu nhiên với hạt giống (nếu có)
  let randomFunction = Math.random;
  if (seed !== undefined) {
    // Bộ sinh số ngẫu nhiên có thể tái tạo sử dụng hạt giống
    const seededRandom = createSeededRandom(seed);
    randomFunction = seededRandom.next;
  }

  // Xây dựng tập hợp ký tự
  let pool: any = "";
  if (includeUppercase) pool += uppercaseChars;
  if (includeLowercase) pool += lowercaseChars;
  if (includeNumbers) pool += numberChars;
  if (includeSpecials) pool += specialChars;
  if (customCharset) pool += customCharset;

  // Lọc các ký tự bị loại trừ
  const exclusionFilter = (item: any) => {
    // Kiểm tra loại trừ bằng giá trị
    if (exclude.some(excluded => {
      if (typeof excluded === "object" && typeof item === "object")
        return JSON.stringify(excluded) === JSON.stringify(item);
      return excluded === item;
    })) return false;

    // Kiểm tra loại trừ bằng regex
    if (excludeRegex && typeof item === 'string') {
      const regexes = Array.isArray(excludeRegex) ? excludeRegex : [excludeRegex];
      if (regexes.some(regex => regex.test(item))) return false;
    }

    // Áp dụng hàm lọc tùy chỉnh
    if (filter && !filter(item)) return false;

    return true;
  };

  // Xử lý random số trong phạm vi
  if (min !== undefined && max !== undefined) {
    if (min > max) throw new Error("`min` phải nhỏ hơn hoặc bằng `max`.");
    
    // Tạo mảng phạm vi với bước nhảy
    const range: number[] = [];
    for (let i = min; i <= max; i += step) {
      range.push(i);
    }
    
    const filteredRange = range.filter(exclusionFilter);
    
    if (filteredRange.length === 0) {
      throw new Error("Không có giá trị nào trong phạm vi sau khi áp dụng các điều kiện loại trừ");
    }
    
    // Random từ phạm vi số
    return generateRandomResult(filteredRange);
  }

  // Xử lý random từ pool ký tự
  if (pool.length > 0) {
    const filteredPool = pool.split("").filter(exclusionFilter);
    
    if (filteredPool.length === 0) {
      throw new Error("Không có ký tự nào hợp lệ để random sau khi áp dụng các điều kiện loại trừ");
    }
    
    // Xử lý mẫu định dạng nếu có
    if (formatTemplate) {
      return applyFormatTemplate(formatTemplate, filteredPool);
    }
    
    // Random từ tập ký tự
    return generateRandomResult(filteredPool);
  }

  // Xử lý random từ mảng dữ liệu
  if (data.length > 0) {
    const filteredData = data.filter(exclusionFilter);
    
    if (filteredData.length === 0) {
      throw new Error("Không có phần tử nào trong data sau khi áp dụng các điều kiện loại trừ");
    }
    
    // Random từ mảng dữ liệu
    return generateRandomResult(filteredData);
  }

  throw new Error("Không có dữ liệu hợp lệ để random. Vui lòng cung cấp tập ký tự, phạm vi số hoặc mảng dữ liệu.");

  // Hàm tạo kết quả ngẫu nhiên từ tập dữ liệu đầu vào
  function generateRandomResult<R>(items: R[]): string | R | R[] {
    let result: R[];
    
    // Áp dụng phân phối xác suất
    if (unique) {
      // Trường hợp unique: trộn và lấy các phần tử đầu tiên
      result = shuffleArray<R>(items).slice(0, Math.min(items.length, length));
    } else {
      // Trường hợp không unique: random với phân phối đã chọn
      result = Array.from({ length }, () => {
        return getRandomItemWithDistribution(items);
      });
    }
    
    // Áp dụng hàm biến đổi nếu có
    if (mapFunction) {
      result = result.map(mapFunction);
    }
    
    // Sắp xếp kết quả nếu có yêu cầu
    if (sort) {
      if (typeof sort === 'function') {
        result.sort(sort);
      } else {
        result.sort((a: any, b: any) => {
          if (typeof a === 'number' && typeof b === 'number') return a - b;
          return String(a).localeCompare(String(b));
        });
      }
    }
    
    // Nhóm kết quả nếu có yêu cầu
    if (groupBy && groupBy > 0) {
      const groups: R[][] = [];
      for (let i = 0; i < result.length; i += groupBy) {
        groups.push(result.slice(i, i + groupBy));
      }
      return groups as any;
    }
    
    // Định dạng kết quả cuối cùng
    if (typeof items[0] === 'string' && format !== 'array') {
      // Ghép chuỗi nếu các phần tử là chuỗi và không yêu cầu định dạng mảng
      const stringResult = result.join('');
      return prefix + stringResult + suffix;
    }
    
    // Trả về kết quả: số duy nhất, phần tử duy nhất hoặc mảng
    if (length === 1 && format !== 'array') {
      return prefix ? prefix + String(result[0]) + suffix : result[0];
    }
    
    // Thêm prefix và suffix cho từng phần tử nếu có
    if ((prefix || suffix) && typeof result[0] === 'string') {
      return result.map(item => prefix + String(item) + suffix) as any;
    }
    
    return result;
  }

  // Hàm lấy phần tử ngẫu nhiên theo phân phối
  function getRandomItemWithDistribution<R>(items: R[]): R {
    switch (distribution) {
      case 'normal': {
        // Phân phối chuẩn (Gaussian)
        const mean = distributionParams.mean ?? items.length / 2;
        const stdDev = distributionParams.stdDev ?? items.length / 6;
        let index = Math.floor(normalRandom(mean, stdDev));
        // Đảm bảo index nằm trong phạm vi hợp lệ
        index = Math.max(0, Math.min(items.length - 1, index));
        return items[index];
      }
      case 'exponential': {
        // Phân phối hàm mũ
        const lambda = distributionParams.lambda ?? 1;
        const value = -Math.log(1 - randomFunction()) / lambda;
        const index = Math.floor(value * items.length) % items.length;
        return items[index];
      }
      case 'custom': {
        // Phân phối tùy chỉnh
        if (!distributionParams.custom) {
          throw new Error("Hàm phân phối tùy chỉnh không được cung cấp");
        }
        let total = 0;
        const weights: number[] = [];
        for (let i = 0; i < items.length; i++) {
          const weight = distributionParams.custom(i / items.length);
          weights.push(weight);
          total += weight;
        }
        const r = randomFunction() * total;
        let acc = 0;
        for (let i = 0; i < items.length; i++) {
          acc += weights[i];
          if (r <= acc) return items[i];
        }
        return items[items.length - 1];
      }
      case 'uniform':
      default: {
        // Phân phối đều hoặc phân phối theo trọng số
        return weightedRandom(items, probability);
      }
    }
  }

  // Hàm random theo trọng số (xác suất)
  function weightedRandom<R>(items: R[], probabilities: Record<string, number>): R {
    const totalWeight = items.reduce((sum, item) => {
      const key = typeof item === "object" ? JSON.stringify(item) : String(item);
      return sum + (probabilities[key] || 1);
    }, 0);

    let r = randomFunction() * totalWeight;

    for (const item of items) {
      const key = typeof item === "object" ? JSON.stringify(item) : String(item);
      const weight = probabilities[key] || 1;
      if (r < weight) return item;
      r -= weight;
    }
    
    return items[items.length - 1]; // Fallback
  }

  // Hàm trộn ngẫu nhiên mảng
  function shuffleArray<R>(arr: R[]): R[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(randomFunction() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Hàm áp dụng mẫu định dạng
  function applyFormatTemplate(template: string, charPool: string[]): string {
    return prefix + template.replace(/[#?*]/g, (symbol) => {
      const randomIndex = Math.floor(randomFunction() * charPool.length);
      return charPool[randomIndex];
    }) + suffix;
  }

  // Hàm tạo số ngẫu nhiên theo phân phối chuẩn
  function normalRandom(mean: number, stdDev: number): number {
    // Thuật toán Box-Muller để tạo số ngẫu nhiên theo phân phối chuẩn
    const u1 = randomFunction();
    const u2 = randomFunction();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  // Tạo bộ sinh số ngẫu nhiên có thể tái tạo từ hạt giống
  function createSeededRandom(seed: number) {
    let state = seed;
    
    // Thuật toán Xorshift để tạo số ngẫu nhiên
    function next() {
      state ^= state << 13;
      state ^= state >> 17;
      state ^= state << 5;
      // Chuẩn hóa về phạm vi [0, 1)
      return (state >>> 0) / 4294967296;
    }
    
    return { next };
  }

  // Hàm tạo UUID ngẫu nhiên
  function generateUUID(options: { dashes?: boolean; version?: number } = {}): string {
    const { dashes = true, version = 4 } = options;
    
    const hexChars = '0123456789abcdef';
    let uuid = '';
    
    for (let i = 0; i < 36; i++) {
      if (dashes && (i === 8 || i === 13 || i === 18 || i === 23)) {
        uuid += '-';
      } else if (i === 14) {
        uuid += version.toString(); // Phiên bản UUID
      } else if (i === 19) {
        // Byte xác định variant (8, 9, A hoặc B)
        uuid += hexChars.charAt(8 + Math.floor(randomFunction() * 4));
      } else {
        uuid += hexChars.charAt(Math.floor(randomFunction() * 16));
      }
    }
    
    return uuid;
  }

  // Hàm tạo mã màu ngẫu nhiên
  function generateColor(options: { 
    alpha?: boolean; 
    format?: 'hex' | 'rgb' | 'hsl';
    minBrightness?: number;
    maxBrightness?: number;
  } = {}): string {
    const { 
      alpha = false, 
      format = 'hex',
      minBrightness = 0,
      maxBrightness = 1
    } = options;
    
    // Tạo các giá trị RGB với độ sáng trong khoảng cho phép
    let r, g, b, a;
    
    do {
      r = Math.floor(randomFunction() * 256);
      g = Math.floor(randomFunction() * 256);
      b = Math.floor(randomFunction() * 256);
      
      // Tính độ sáng (0-1) theo công thức sRGB luminance
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Tiếp tục nếu độ sáng không nằm trong khoảng yêu cầu
      if (brightness >= minBrightness && brightness <= maxBrightness) {
        break;
      }
    } while (true);
    
    // Tạo giá trị alpha nếu cần
    if (alpha) {
      a = randomFunction().toFixed(2);
    }
    
    // Trả về theo định dạng yêu cầu
    switch (format) {
      case 'rgb':
        return alpha 
          ? `rgba(${r}, ${g}, ${b}, ${a})` 
          : `rgb(${r}, ${g}, ${b})`;
      
      case 'hsl': {
        // Chuyển RGB sang HSL
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case rNorm:
              h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
              break;
            case gNorm:
              h = (bNorm - rNorm) / d + 2;
              break;
            case bNorm:
              h = (rNorm - gNorm) / d + 4;
              break;
          }
          
          h /= 6;
        }
        
        const hDeg = Math.round(h * 360);
        const sPercent = Math.round(s * 100);
        const lPercent = Math.round(l * 100);
        
        return alpha 
          ? `hsla(${hDeg}, ${sPercent}%, ${lPercent}%, ${a})` 
          : `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`;
      }
      
      case 'hex':
      default:
        let hexColor = '#' + 
          r.toString(16).padStart(2, '0') + 
          g.toString(16).padStart(2, '0') + 
          b.toString(16).padStart(2, '0');
        
        if (alpha) {
          const alphaHex = Math.floor(parseFloat(a as string) * 255).toString(16).padStart(2, '0');
          hexColor += alphaHex;
        }
        
        return hexColor;
    }
  }

  // Hàm tạo tên tệp ngẫu nhiên
  function generateFilename(options: { 
    extension?: string;
    includeTimestamp?: boolean;
    nameLength?: number;
  } = {}, prefix = ''): string {
    const { 
      extension = '', 
      includeTimestamp = false,
      nameLength = 8
    } = options;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let filename = prefix;
    
    // Thêm timestamp nếu cần
    if (includeTimestamp) {
      filename += Date.now() + '-';
    }
    
    // Tạo phần ngẫu nhiên
    for (let i = 0; i < nameLength; i++) {
      filename += chars.charAt(Math.floor(randomFunction() * chars.length));
    }
    
    // Thêm phần mở rộng nếu có
    if (extension) {
      if (!extension.startsWith('.')) {
        filename += '.';
      }
      filename += extension;
    }
    
    return filename;
  }
};