type SortOrder = "asc" | "desc";

interface SortOptions<T = any> {
  key?: string; // Key để sắp xếp (cho object cấp cao nhất)
  order?: SortOrder; // "asc" hoặc "desc" (mặc định là "asc")
  deepKeys?: { deepKey: string; sortKey?: string; order?: SortOrder }[]; // Thông tin mảng con cần xử lý
}

export const sortArray = <T = any>(array: T[], options: SortOptions<T> = {}): T[] => {
  const { key, order = "asc", deepKeys = [] } = options;

  // Hàm so sánh cơ bản
  const baseCompare = (a: any, b: any): number => {
    if (a === b) return 0;
    return a > b ? 1 : -1;
  };

  // Hàm xử lý sắp xếp chính
  const sortFn = (a: T, b: T): number => {
    const valueA = key ? (a as any)[key] : a;
    const valueB = key ? (b as any)[key] : b;

    let result = baseCompare(valueA, valueB);
    if (order === "desc") result *= -1;

    return result;
  };

  // Sắp xếp mảng hiện tại
  const sortedArray = [...array].sort(sortFn);

  // Xử lý các mảng con theo `deepKeys`
  if (deepKeys.length > 0) {
    for (const item of sortedArray) {
      for (const { deepKey, sortKey, order: deepOrder = "asc" } of deepKeys) {
        if (Array.isArray((item as any)[deepKey])) {
          (item as any)[deepKey] = sortArray((item as any)[deepKey], {
            key: sortKey,
            order: deepOrder,
            deepKeys, // Truyền lại `deepKeys` để xử lý sâu hơn nếu cần
          });
        }
      }
    }
  }

  return sortedArray;
}