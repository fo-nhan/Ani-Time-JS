export type RandomOptions<T = any> = {
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecials?: boolean;
  min?: number;
  max?: number;
  exclude?: (string | T)[]; // Loại trừ dựa trên giá trị hoặc object
  probability?: Record<string, number>; // Xác suất theo key hoặc object
  length?: number;
  data?: T[]; // Mảng dữ liệu để random (có thể là object)
  unique?: boolean; // Random không trùng lặp
};

export const random = <T = any>(options: RandomOptions<T>): string | T[] => {
  const {
    includeUppercase = false,
    includeLowercase = false,
    includeNumbers = false,
    includeSpecials = false,
    min,
    max,
    exclude = [],
    probability = {},
    length = 1,
    data = [],
    unique = false,
  } = options;

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~";

  // Xây dựng tập hợp ký tự
  let pool: any = "";
  if (includeUppercase) pool += uppercaseChars;
  if (includeLowercase) pool += lowercaseChars;
  if (includeNumbers) pool += numberChars;
  if (includeSpecials) pool += specialChars;

  // Nếu chỉ có random số và min/max được chỉ định
  if (
    includeNumbers &&
    pool === numberChars &&
    min !== undefined &&
    max !== undefined
  ) {
    if (min > max) throw new Error("`min` phải nhỏ hơn hoặc bằng `max`.");
    const range: any = Array.from(
      { length: max - min + 1 },
      (_, i) => i + min
    ).filter((n: any) => !exclude.includes(n));
    return unique
      ? range.slice(0, Math.min(range.length, length)) // Trả về bao nhiêu phần tử có thể
      : Array.from(
          { length: Math.min(range.length, length) },
          () => range[Math.floor(Math.random() * range.length)]
        );
  }

  // Loại trừ ký tự/phần tử trong tập hợp
  pool = pool
    .split("")
    .filter((char: any) => !exclude.includes(char))
    .join("");

  // Nếu random từ mảng dữ liệu
  if (data.length > 0) {
    const filteredData = data.filter(
      (item) =>
        !exclude.some((excluded) => {
          if (typeof excluded === "object")
            return JSON.stringify(excluded) === JSON.stringify(item);
          return excluded === item;
        })
    );

    if (filteredData.length === 0) return []; // Không có phần tử hợp lệ nào để random

    if (unique) {
      return filteredData.slice(0, Math.min(filteredData.length, length)); // Trả về các phần tử không trùng lặp có sẵn
    }

    return Array.from({ length: Math.min(filteredData.length, length) }, () =>
      weightedRandom(filteredData, probability)
    ) as string | T[];
  }

  if (pool.length === 0)
    throw new Error("Không có ký tự nào hợp lệ để random.");

  // Random từ tập ký tự
  if (unique) {
    return shuffleArray(pool.split(""))
      .slice(0, Math.min(pool.length, length))
      .join("");
  }
  return Array.from({ length: Math.min(pool.length, length) }, () =>
    weightedRandom(pool.split(""), probability)
  ).join("");

  // Hàm random theo trọng số (xác suất)
  function weightedRandom(items: T[], probabilities: any) {
    const totalWeight = items.reduce((sum, item) => {
      const key = typeof item === "object" ? JSON.stringify(item) : item;
      return sum + (probabilities[key] || 1);
    }, 0);

    let random = Math.random() * totalWeight;

    for (const item of items) {
      const key = typeof item === "object" ? JSON.stringify(item) : item;
      const weight = probabilities[key] || 1;
      if (random < weight) return item;
      random -= weight;
    }
  }

  // Hàm trộn ngẫu nhiên mảng
  function shuffleArray(arr: T[]): T[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};
