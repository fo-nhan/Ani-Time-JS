type SortOrder = "asc" | "desc";

interface SortOptions<T = any> {
  key?: string; // Key để sắp xếp (cho object cấp cao nhất)
  order?: SortOrder; // "asc" hoặc "desc" (mặc định là "asc")
  deepKeys?: { deepKey: string; sortKey?: string; order?: SortOrder }[]; // Thông tin mảng con cần xử lý
  customCompare?: (a: any, b: any) => number; // Hàm so sánh tùy chỉnh
  nullsPosition?: 'first' | 'last'; // Vị trí của giá trị null/undefined
}

export const sortArray = <T = any>(array: T[], options: SortOptions<T> = {}): T[] => {
  if (!array || !Array.isArray(array)) {
    return [];
  }
  
  const { 
    key, 
    order = "asc", 
    deepKeys = [],
    customCompare,
    nullsPosition = 'last'
  } = options;

  // Hàm so sánh cơ bản với xử lý null/undefined
  const baseCompare = (a: any, b: any): number => {
    // Xử lý giá trị null hoặc undefined
    if (a === undefined || a === null) {
      return nullsPosition === 'first' ? -1 : 1;
    }
    if (b === undefined || b === null) {
      return nullsPosition === 'first' ? 1 : -1;
    }
    
    // So sánh dựa trên kiểu dữ liệu
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    }
    
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }
    
    if (a === b) return 0;
    return a > b ? 1 : -1;
  };

  // Hàm xử lý sắp xếp chính
  const sortFn = (a: T, b: T): number => {
    // Sử dụng hàm so sánh tùy chỉnh nếu được cung cấp
    if (customCompare) {
      return order === "asc" ? customCompare(a, b) : customCompare(b, a);
    }

    const valueA = key ? (a as any)[key] : a;
    const valueB = key ? (b as any)[key] : b;

    let result = baseCompare(valueA, valueB);
    if (order === "desc") result *= -1;

    return result;
  };

  // Tạo bản sao để tránh thay đổi mảng gốc và sắp xếp
  const sortedArray = [...array].sort(sortFn);

  // Xử lý các mảng con theo `deepKeys`
  if (deepKeys.length > 0) {
    for (const item of sortedArray) {
      for (const { deepKey, sortKey, order: deepOrder = "asc" } of deepKeys) {
        if ((item as any) && (item as any)[deepKey]) {
          if (Array.isArray((item as any)[deepKey])) {
            // Xử lý đệ quy các mảng con, nhưng loại bỏ deepKeys để tránh vòng lặp vô hạn
            (item as any)[deepKey] = sortArray((item as any)[deepKey], {
              key: sortKey,
              order: deepOrder,
              nullsPosition,
              // Không truyền lại deepKeys để tránh xử lý đệ quy vô hạn
            });
          }
        }
      }
    }
  }

  return sortedArray;
};