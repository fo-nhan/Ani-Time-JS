# AnitimeJS ⚡️

AnitimeJS là một thư viện JavaScript/TypeScript nhẹ và linh hoạt giúp xử lý thời gian, số liệu, và nhiều tác vụ tiện ích khác trong các dự án web của bạn.

Thư viện được tạo ra nhằm tối ưu hóa việc sử dụng số và thời gian. Chúc mọi người thành công!

- **Lightweight**: Thư viện nhỏ gọn, tối ưu hóa hiệu suất cho ứng dụng của bạn
- **Flexible & composable**: Các hàm có thể kết hợp với nhau để thực hiện các tác vụ phức tạp
- **Accessible**: Tuân thủ các tiêu chuẩn mã nguồn mở và dễ dàng tích hợp vào bất kỳ dự án nào

## Cài đặt

```sh
$ yarn add anitimejs
# hoặc
$ npm install --save anitimejs
```

## Sử dụng cơ bản

```jsx
import { anitimejs, anitimejsGlobalConfig, useTimer } from "anitimejs";

// Khởi tạo với ngày hiện tại
const today = anitimejs();

// Khởi tạo với ngày cụ thể
const birthday = anitimejs("15/04/2025");

// Định dạng thời gian
console.log(birthday.format("DD/MM/YYYY")); // "15/04/2025"
```

## Tài liệu chi tiết

### Lớp Time

Lớp `Time` là trung tâm của thư viện AnitimeJS, cung cấp nhiều phương thức để làm việc với thời gian.

#### Khởi tạo

```jsx
// Khởi tạo với ngày hiện tại
const time = anitimejs();

// Khởi tạo với ngày cụ thể (các định dạng được hỗ trợ)
const time1 = anitimejs("25/12/2023");
const time2 = anitimejs("2023-12-25");
const time3 = anitimejs("25/12/2023 14:30:00");
const time4 = anitimejs(new Date(2023, 11, 25));

// Khởi tạo với ngày bắt đầu và ngày kết thúc
const timeRange = anitimejs("01/01/2023", "31/12/2023");

// Lấy danh sách ngày lễ trong năm
console.log(time.getHolidays());

// Chuyển đổi từ ngày âm lịch sang ngày dương lịch
console.log(time.getHolidays());

// Lấy danh sách âm lịch theo khoảng thời gian
console.log(timeRange.toLunarDateRange());

// Chuyển đổi 1 ngày dương lịch sang âm lịch
console.log(time.toLunarDate());
```

#### Định dạng thời gian

```jsx
const date = anitimejs("15/04/2025");

// Định dạng cơ bản
date.format("DD/MM/YYYY"); // "15/04/2025"
date.format("YYYY-MM-DD"); // "2025-04-15"
date.format("DD/MM/YYYY HH:mm:ss"); // "15/04/2025 00:00:00"

// Định dạng với ngôn ngữ
date.lang("vi").format("L, DD eM tY YYYY"); // "Thứ ba, 15 tháng 04 năm 2025"
date.lang("en").format("L, DD eM YYYY"); // "Tuesday, 15 April 2025"

// Định dạng nhanh
date.format("L"); // "Thứ ba, 15 tháng 04 năm 2025"
date.format("LL"); // "Thứ ba, 15 tháng 04 năm 2025 lúc 00:00"
date.format("F"); // Định dạng thông minh tùy theo khoảng thời gian
```

#### Thêm và bớt thời gian

```jsx
const date = anitimejs("15/04/2025");

// Thêm thời gian
date.add(1, "days").format("DD/MM/YYYY"); // "16/04/2025"
date.add(2, "months").format("DD/MM/YYYY"); // "16/06/2025"
date.add(1, "years").format("DD/MM/YYYY"); // "16/06/2026"

// Bớt thời gian
date.subtract(1, "days").format("DD/MM/YYYY"); // "15/06/2026"
date.subtract(2, "hours").format("DD/MM/YYYY HH:mm"); // "15/06/2026 22:00"
```

#### Lấy thông tin thời gian

```jsx
const date = anitimejs("15/04/2025");

// Lấy thông tin cơ bản
date.getDay(); // 15
date.getMonth(); // 4
date.getYear(); // 2025
date.getHours(); // 0
date.getMinutes(); // 0
date.getWeekOfYear(); // 16

// Lấy thông tin về tuần
date.getDayInWeek(); // 2 (0: CN, 1: T2, 2: T3, ...)
date.getWeek(); // Mảng các ngày trong tuần

// Lấy ngày kế tiếp/trước đó
const nextDay = date.getNextDay(); // 16/04/2025
const prevDay = date.getPreviousDay(); // 14/04/2025
```

#### Cấu hình múi giờ và ngôn ngữ

```jsx
// Cấu hình cho một đối tượng
const date = anitimejs().setTimeZone("America/New_York").lang("en");

// Cấu hình toàn cục
anitimejsGlobalConfig({
  locale: "en",
  timezone: "Europe/London",
});
```

#### Tính toán khoảng thời gian

```jsx
// Tính ngày làm việc trong khoảng thời gian
const workCalendar = anitimejs("01/04/2025", "30/04/2025").calculateWorkingDays(
  [0, 6], // loại bỏ chủ nhật và thứ 7
  ["15/04/2025"] // loại bỏ ngày cố định. Mảng chứa các ngày lễ muốn loại bỏ, có thể ở dạng "DD/MM" hoặc "DD/MM/YYYY"
);
console.log(workCalendar.workingDays); // Mảng các ngày làm việc
console.log(workCalendar.holidaysExcluded); // Mảng các ngày nghỉ

// Đếm ngược
const countdown = anitimejs("31/12/2025 23:59:59").countdown();
console.log(countdown.days); // Số ngày
console.log(countdown.hours); // Số giờ
console.log(countdown.isPast); // false
```

#### Làm việc với tháng và lịch

```jsx
const date = anitimejs("15/04/2025");

// Lấy thông tin về tháng
const monthDates = date.getMonthStartEndDates();
console.log(monthDates.startDate); // 01/04/2025
console.log(monthDates.endDate); // 30/04/2025

// Lấy tất cả ngày trong tháng
const daysInMonth = date.getDaysInMonth();
// [01/04/2025, 02/04/2025, ..., 30/04/2025]

// Lấy dữ liệu cho view calendar
const calendarView = date.getCalendars();
// Mảng 42 ngày bao gồm ngày trong tháng và ngày của tháng kề

// Lấy danh sách tháng và năm
const monthsYears = date.getMonthsAndYears(1, 12);
// [{month: 4, year: 2025}, {month: 5, year: 2025}, ...]
```

#### Sắp xếp thời gian

```jsx
// Sắp xếp mảng các ngày
const dates = ["15/04/2025", "01/01/2025", "31/12/2025"];
anitimejs().arrangeTime(dates, "asc");
// ["01/01/2025", "15/04/2025", "31/12/2025"]

// Sắp xếp mảng object có chứa ngày
const events = [
  { id: 1, date: "15/04/2025", title: "Meeting" },
  { id: 2, date: "01/01/2025", title: "New Year" },
  { id: 3, date: "31/12/2025", title: "Party" },
];
anitimejs().arrangeTimeObject(events, "desc", "date");
// Kết quả: events được sắp xếp theo date giảm dần
```

### Hàm Random

Hàm `random` cung cấp nhiều cách để tạo dữ liệu ngẫu nhiên:

```jsx
import { random } from "anitimejs";

// Random mật khẩu an toàn
const password = random({
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSpecials: true,
  exclude: ["I", "l", "1", "O", "0"], // Loại bỏ các ký tự dễ nhầm lẫn
});

// Random số điện thoại theo định dạng
const phoneNumber = random({
  formatTemplate: "###-###-####",
  includeNumbers: true,
  prefix: "+84 ",
});

// Random các phần tử từ mảng theo phân phối chuẩn
const selections = random({
  data: ["Red", "Green", "Blue", "Yellow", "Purple"],
  length: 10,
  distribution: "normal",
  distributionParams: { mean: 2, stdDev: 1 },
});

// Random số chẵn từ 1 đến 100
const evenNumbers = random({
  min: 1,
  max: 100,
  step: 2,
  length: 5,
  unique: true,
});

// Tạo UUID
const uuid = random({ type: "uuid" });
// Kết quả: "123e4567-e89b-12d3-a456-426614174000"

// Tạo UUID không có dấu gạch ngang
const compactUuid = random({
  type: "uuid",
  uuidOptions: { dashes: false },
});
// Kết quả: "123e4567e89b12d3a456426614174000"

// Tạo mã màu HEX
const hexColor = random({ type: "color" });
// Kết quả: "#a1b2c3"

// Tạo mã màu RGBA
const rgbaColor = random({
  type: "color",
  colorOptions: { alpha: true, format: "rgb" },
});
// Kết quả: "rgba(161, 178, 195, 0.75)"

// Tạo tên tệp ngẫu nhiên
const filename = random({
  type: "filename",
  prefix: "IMG_",
  filenameOptions: {
    extension: "jpg",
    includeTimestamp: true,
  },
});
// Kết quả: "IMG_1681546325896-a1b2c3d4.jpg"
```

### Hàm Numbers

Hàm `numbers` giúp xử lý và định dạng số:

```jsx
import { numbers } from "anitimejs";

// Chuyển đổi từ string
numbers("123456"); // 123456
numbers("100.000", { parseOptions: { format: "eu" } }); // 100

// Định dạng số với dấu phân cách
numbers(1234567, { separator: "." }); // "1.234.567"
numbers(1234567, { separator: ".", decimals: 2 }); // "1.234.567,00"

// Làm tròn và số thập phân
numbers(123.456, { decimals: 2 }); // "123.46"
numbers(123.456, { decimals: 2, rounding: "floor" }); // "123.45"

// Định dạng tiền tệ
numbers(1234.56, { currency: "$", currencyPosition: "prefix" }); // "$1234.56"
numbers(1234.56, {
  currency: "đ",
  currencyPosition: "suffix",
  separator: ".",
}); // "1.234.56đ"

// Chuyển đổi sang chữ
numbers(1234.56, { toWords: true });
// "Một nghìn hai trăm ba mươi bốn phẩy năm sáu"

// Định dạng ngắn gọn
numbers(1234567, { compact: true }); // "1.2M"
```

### Hook useTimer

Hook `useTimer` là giải pháp toàn diện cho việc quản lý thời gian trong ứng dụng React. Hook này cung cấp nhiều tùy chọn linh hoạt và chức năng hữu ích cho việc tạo đồng hồ đếm ngược, đồng hồ bấm giờ, hoặc bất kỳ ứng dụng thời gian nào khác.

#### Tính năng chính của useTimer

- 🕒 **Đa chức năng**: Hỗ trợ đếm tiến, đếm lùi và đồng hồ hiển thị thời gian thực
- ⚡ **Hiệu suất tối ưu**: Sử dụng hooks và refs để giảm thiểu render không cần thiết
- 🔄 **Tự động cập nhật**: Theo dõi nhiều trạng thái thời gian khác nhau
- 🛠️ **Tùy biến cao**: Nhiều tùy chọn và callback để điều chỉnh theo nhu cầu

#### API của useTimer

##### Tùy chọn

```typescript
interface UseTimerOptions {
  initialStartTime?: number; // Thời điểm bắt đầu ban đầu (timestamp, mặc định: Date.now())
  autoStart?: boolean; // Tự động bắt đầu timer khi khởi tạo (mặc định: false)
  interval?: number; // Khoảng thời gian cập nhật (ms, mặc định: 1000ms)
  onTick?: (time: TimerState) => void; // Callback khi timer tick
}
```

##### Giá trị trả về

```typescript
interface UseTimerReturn {
  // Trạng thái
  elapsedTime: number; // Thời gian đã trôi qua (giây)
  offsetTime: number; // Thời điểm hiện tại (giây tính từ epoch)
  timeDifference: number; // Chênh lệch thời gian từ lúc bắt đầu (giây)
  isRunning: boolean; // Trạng thái đang chạy
  startedAt: number | null; // Thời điểm bắt đầu gần nhất
  pausedAt: number | null; // Thời điểm tạm dừng gần nhất

  // Phương thức
  start: () => void; // Bắt đầu timer
  stop: () => void; // Dừng timer
  reset: (startImmediately?: boolean) => void; // Reset timer
  setTime: (newTime: number) => void; // Đặt thời gian mới
  toggle: () => void; // Chuyển đổi trạng thái timer
  formatTime: (format?: string) => string; // Format thời gian dạng chuỗi
}
```

#### Ví dụ sử dụng useTimer

##### Đồng hồ đếm ngược đơn giản

```jsx
import { useTimer } from "anitimejs";
import { useEffect } from "react";

function CountdownComponent() {
  const { elapsedTime, isRunning, start, stop, reset, formatTime } = useTimer({
    autoStart: true,
    interval: 1000,
  });

  // Giả sử đếm ngược từ 60 giây
  const remainingTime = Math.max(0, 60 - elapsedTime);

  useEffect(() => {
    if (remainingTime === 0 && isRunning) {
      stop();
      alert("Hết giờ!");
    }
  }, [remainingTime, isRunning, stop]);

  return (
    <div>
      <div>Thời gian còn lại: {remainingTime} giây</div>
      <div>Định dạng: {formatTime("MM:SS")}</div>
      <button onClick={isRunning ? stop : start}>
        {isRunning ? "Tạm dừng" : "Tiếp tục"}
      </button>
      <button onClick={() => reset(true)}>Bắt đầu lại</button>
    </div>
  );
}
```

##### Đồng hồ bấm giờ với lưu vòng

```jsx
import { useTimer } from "anitimejs";
import { useState } from "react";

function StopwatchComponent() {
  const [laps, setLaps] = useState([]);
  const { elapsedTime, isRunning, start, stop, reset, formatTime } = useTimer({
    interval: 100, // Cập nhật mỗi 100ms để hiển thị chính xác hơn
    onTick: (time) => {
      // Có thể xử lý logic phức tạp tại đây
    },
  });

  const handleLap = () => {
    if (isRunning) {
      setLaps([...laps, elapsedTime]);
    }
  };

  return (
    <div>
      <div className="stopwatch">{formatTime("HH:MM:SS")}</div>

      <div className="controls">
        <button onClick={isRunning ? stop : start}>
          {isRunning ? "Dừng" : "Bắt đầu"}
        </button>
        <button onClick={handleLap} disabled={!isRunning}>
          Vòng
        </button>
        <button
          onClick={() => {
            reset();
            setLaps([]);
          }}
        >
          Đặt lại
        </button>
      </div>

      <div className="laps">
        <h3>Các vòng</h3>
        <ul>
          {laps.map((lap, index) => (
            <li key={index}>
              Vòng {index + 1}: {Math.floor(lap / 60)}:
              {(lap % 60).toString().padStart(2, "0")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

##### Đồng hồ thời gian thực với nhiều định dạng

```jsx
import { useTimer } from "anitimejs";
import { useEffect } from "react";

function RealTimeClock() {
  const { offsetTime, start, formatTime } = useTimer({
    autoStart: true,
    interval: 1000,
  });

  // Tạo các định dạng thời gian khác nhau
  const getTimeFormats = () => {
    const date = new Date(offsetTime * 1000);
    return {
      standard: formatTime("HH:MM:SS"),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      iso: date.toISOString(),
    };
  };

  const formats = getTimeFormats();

  return (
    <div className="clock-container">
      <h2>Đồng hồ thời gian thực</h2>
      <div className="time-display">
        <div>Định dạng tiêu chuẩn: {formats.standard}</div>
        <div>Ngày: {formats.date}</div>
        <div>Giờ địa phương: {formats.time}</div>
        <div>ISO: {formats.iso}</div>
      </div>
    </div>
  );
}
```

### Hàm sortArray

`sortArray` là một hàm tiện ích mạnh mẽ để sắp xếp các mảng với nhiều tùy chọn linh hoạt. Hàm này giúp đơn giản hóa quá trình sắp xếp dữ liệu phức tạp trong các ứng dụng JavaScript hoặc React.

#### Tính năng chính của sortArray

- 🔄 **Sắp xếp linh hoạt**: Hỗ trợ tất cả các kiểu dữ liệu JavaScript phổ biến
- 🌳 **Sắp xếp đa cấp**: Xử lý được cả thuộc tính lồng nhau và mảng con
- 🧰 **Nhiều tùy biến**: Cho phép định nghĩa vị trí của giá trị null, thứ tự sắp xếp và hàm so sánh tùy chỉnh
- 🛡️ **An toàn**: Xử lý các trường hợp đặc biệt và tránh các lỗi phổ biến

#### API của sortArray

```typescript
type SortOrder = "asc" | "desc";

interface SortOptions<T = any> {
  key?: string; // Key để sắp xếp (cho object cấp cao nhất)
  order?: SortOrder; // "asc" hoặc "desc" (mặc định là "asc")
  deepKeys?: {
    // Thông tin mảng con cần xử lý
    deepKey: string;
    sortKey?: string;
    order?: SortOrder;
  }[];
  customCompare?: (a: any, b: any) => number; // Hàm so sánh tùy chỉnh
  nullsPosition?: "first" | "last"; // Vị trí của giá trị null/undefined (mặc định: 'last')
}

function sortArray<T = any>(array: T[], options?: SortOptions<T>): T[];
```

#### Ví dụ sử dụng sortArray

##### Sắp xếp các kiểu dữ liệu cơ bản

```javascript
import { sortArray } from "anitimejs";

// Sắp xếp mảng số
sortArray([3, 1, 4, 2], { order: "asc" });
// Kết quả: [1, 2, 3, 4]

// Sắp xếp mảng chuỗi
sortArray(["banana", "apple", "cherry", "date"], { order: "desc" });
// Kết quả: ['date', 'cherry', 'banana', 'apple']

// Sắp xếp mảng ngày tháng
const dates = [
  new Date("2023-05-15"),
  new Date("2023-01-10"),
  new Date("2023-12-25"),
];
sortArray(dates);
// Kết quả: [Date('2023-01-10'), Date('2023-05-15'), Date('2023-12-25')]
```

##### Sắp xếp mảng đối tượng

```javascript
import { sortArray } from "anitimejs";

// Mảng người dùng
const users = [
  { name: "Alice", age: 30, active: true },
  { name: "Bob", age: 25, active: false },
  { name: "Charlie", age: 35, active: true },
  { name: "Dave", age: null, active: true },
];

// Sắp xếp theo tuổi (tăng dần)
sortArray(users, { key: "age" });
// Kết quả: [Bob, Alice, Charlie, Dave] (null ở cuối)

// Sắp xếp theo tuổi (giảm dần) với null ở đầu
sortArray(users, {
  key: "age",
  order: "desc",
  nullsPosition: "first",
});
// Kết quả: [Dave, Charlie, Alice, Bob]

// Sắp xếp theo tên và xử lý giá trị active
sortArray(users, {
  key: "name",
  customCompare: (a, b) => {
    // So sánh active trước, sau đó đến tên
    if (a.active === b.active) {
      return a.name.localeCompare(b.name);
    }
    return a.active ? -1 : 1; // Active lên đầu
  },
});
// Kết quả: [Alice, Charlie, Dave, Bob]
```

##### Sắp xếp cấu trúc lồng nhau

```javascript
import { sortArray } from "anitimejs";

// Danh sách sản phẩm theo danh mục
const inventory = [
  {
    category: "Điện tử",
    items: [
      { name: "Laptop", price: 1200, stock: 5 },
      { name: "Điện thoại", price: 800, stock: 10 },
      { name: "Tai nghe", price: 100, stock: 15 },
    ],
  },
  {
    category: "Thời trang",
    items: [
      { name: "Áo phông", price: 20, stock: 50 },
      { name: "Quần jean", price: 50, stock: 30 },
      { name: "Giày", price: 80, stock: 25 },
    ],
  },
];

// Sắp xếp danh mục và sắp xếp sản phẩm theo giá trong mỗi danh mục
const sortedInventory = sortArray(inventory, {
  key: "category",
  order: "asc",
  deepKeys: [
    {
      deepKey: "items",
      sortKey: "price",
      order: "desc",
    },
  ],
});

// Kết quả:
// [
//   {
//     category: "Điện tử",
//     items: [
//       { name: "Laptop", price: 1200, stock: 5 },
//       { name: "Điện thoại", price: 800, stock: 10 },
//       { name: "Tai nghe", price: 100, stock: 15 }
//     ]
//   },
//   {
//     category: "Thời trang",
//     items: [
//       { name: "Giày", price: 80, stock: 25 },
//       { name: "Quần jean", price: 50, stock: 30 },
//       { name: "Áo phông", price: 20, stock: 50 }
//     ]
//   }
// ]
```

##### Sắp xếp dựa trên thuộc tính lồng nhau

```javascript
import { sortArray } from "anitimejs";

// Dữ liệu sản phẩm với chi tiết lồng nhau
const products = [
  { id: 1, details: { price: 200, stock: { warehouse: 10, store: 5 } } },
  { id: 2, details: { price: 100, stock: { warehouse: 5, store: 15 } } },
  { id: 3, details: { price: 300, stock: { warehouse: 2, store: 0 } } },
];

// Tạo hàm truy cập thuộc tính lồng nhau
function getNestedValue(obj, path) {
  return path
    .split(".")
    .reduce((o, p) => (o && o[p] !== undefined ? o[p] : null), obj);
}

// Sắp xếp theo giá (đường dẫn lồng nhau)
const sortedByPrice = sortArray(products, {
  customCompare: (a, b) => {
    const priceA = getNestedValue(a, "details.price");
    const priceB = getNestedValue(b, "details.price");
    return priceA - priceB;
  },
});
// Kết quả: [{ id: 2, ... }, { id: 1, ... }, { id: 3, ... }]

// Sắp xếp theo tổng kho hàng
const sortedByTotalStock = sortArray(products, {
  customCompare: (a, b) => {
    const stockA = getNestedValue(a, "details.stock");
    const stockB = getNestedValue(b, "details.stock");
    const totalA = stockA ? stockA.warehouse + stockA.store : 0;
    const totalB = stockB ? stockB.warehouse + stockB.store : 0;
    return totalB - totalA; // Giảm dần
  },
});
// Kết quả: [{ id: 2, ... }, { id: 1, ... }, { id: 3, ... }]
```

### Hàm RegexHelper

Hàm `RegexHelper` cung cấp các tiện ích xử lý chuỗi, validate và mã hóa:

```typescript
import { RegexHelper } from "your-library-name";

// Validate email
RegexHelper.validate("email", "example@gmail.com"); // true
RegexHelper.validate("email", "invalid-email"); // false

// Validate mật khẩu với tùy chọn
RegexHelper.validate("password", "P@ssw0rd123", {
  minLength: 10,
  requireSpecial: true,
}); // true

// Ẩn thông tin email
RegexHelper.mask("email", "nhantgn123@gmail.com");
// Kết quả: n**********@***.com

// Ẩn số điện thoại
RegexHelper.mask("phone", "0912345678", 3);
// Kết quả: 091****678

// Loại bỏ HTML
RegexHelper.process("stripHtml", "<p>Hello <strong>world</strong></p>");
// Kết quả: "Hello world"

// Trích xuất URLs từ văn bản
RegexHelper.process(
  "extractUrls",
  "Truy cập https://example.com và https://test.com"
);
// Kết quả: ["https://example.com", "https://test.com"]

// Phân tích URL
const urlInfo = RegexHelper.process(
  "parseUrl",
  "https://example.com/path?query=123#hash"
);
/* Kết quả: 
{
  protocol: "https:",
  host: "example.com",
  hostname: "example.com",
  port: "",
  pathname: "/path",
  search: "?query=123",
  hash: "#hash",
  params: { query: "123" }
}
*/

// Băm chuỗi đơn giản
RegexHelper.crypto("hash", "Secret message");
// Kết quả: chuỗi băm

// Mã hóa đơn giản
const encrypted = RegexHelper.crypto("encrypt", "Secret message", "mykey");
// Kết quả: chuỗi đã mã hóa

// Giải mã
const original = RegexHelper.crypto("decrypt", encrypted, "mykey");
// Kết quả: "Secret message"
```

### Hiệu ứng

Hàm `animate` cung cấp các hiệu ứng animation:

#### Tính năng chính

- 🚀 API trực quan, dễ sử dụng
- 🔄 Hỗ trợ Timeline để điều phối nhiều animation
- ⏱️ Stagger animations cho hiệu ứng tuần tự
- 🎢 Nhiều hàm easing và hiệu ứng physics
- 🎨 Hỗ trợ keyframes và màu sắc
- 📱 Hỗ trợ đầy đủ cho CSS, SVG và thuộc tính JavaScript
- 🎮 API điều khiển đầy đủ (play, pause, seek, reverse...)

#### Hướng dẫn sử dụng cơ bản

##### Animation cơ bản

```javascript
import { animate } from "anitimejs";

// Animation đơn giản
animate({
  targets: ".box",
  props: {
    translateX: ["0px", "200px"],
    opacity: [0, 1],
  },
  duration: 1000,
  easing: "easeOutQuad",
});
```

##### Sử dụng Timeline

Timeline cho phép bạn điều phối nhiều animation theo thứ tự:

```javascript
import { timeline } from "anitimejs";

const tl = timeline()
  .add({
    targets: ".circle",
    props: { scale: [0, 1] },
    duration: 500,
  })
  .add(
    {
      targets: ".square",
      props: { rotate: ["0deg", "45deg"] },
      duration: 600,
    },
    "+=200"
  ) // Thêm delay 200ms sau animation trước
  .add(
    {
      targets: ".text",
      props: { opacity: [0, 1] },
      duration: 400,
    },
    "-=300"
  ); // Bắt đầu sớm hơn 300ms so với kết thúc animation trước

// Phát timeline
tl.play();
```

##### Stagger Animations

Tạo hiệu ứng chuyển động tuần tự cho nhiều phần tử:

```javascript
import { animate, stagger } from "anitimejs";

animate({
  targets: ".item",
  props: {
    translateY: ["-20px", "0px"],
    opacity: [0, 1],
  },
  delay: stagger(100, { from: "center" }), // Phát từ phần tử giữa ra ngoài
  duration: 600,
  easing: "easeOutQuad",
});
```

##### Keyframes

Keyframes cho phép định nghĩa nhiều trạng thái chuyển tiếp:

```javascript
animate({
  targets: ".box",
  props: {
    translateX: {
      "0%": "0px",
      "25%": "100px",
      "50%": "50px",
      "100%": "200px",
    },
    rotate: ["0deg", "90deg", "45deg", "180deg"],
  },
  duration: 2000,
  easing: "linear",
});
```

##### Spring Physics

Tạo animation với vật lý lò xo tự nhiên:

```javascript
import { physics } from "anitimejs";

physics({
  targets: ".ball",
  props: {
    translateY: ["0px", "300px"],
  },
  duration: 800,
  physics: {
    mass: 1,
    stiffness: 100,
    damping: 10,
    velocity: 0,
  },
});
```

##### Các hiệu ứng có sẵn

Thư viện cung cấp các hiệu ứng thông dụng:

```javascript
import { effects } from "anitimejs";

// Hiệu ứng fade in
effects.fadeIn(".element", 500);

// Hiệu ứng slide in từ bên trái
effects.slideIn(".card", "left", "100%", 800);

// Hiệu ứng zoom
effects.zoom(".image", 0.5, 1, 1000);

// Hiệu ứng bounce
effects.bounce(".button", "20px", 800);
```

#### API chi tiết

##### animate()

Hàm chính để tạo animation:

```javascript
animate({
  // Element(s) hoặc selector để áp dụng animation
  targets: string | HTMLElement | HTMLElement[] | Record<string, any>,

  // Các thuộc tính cần thay đổi
  props: {
    [property: string]: number | string | object
  },

  // Thời gian chạy (ms)
  duration: number,

  // Độ trễ trước khi bắt đầu (ms hoặc function)
  delay?: number | ((el: any, i: number, total: number) => number),

  // Độ trễ sau khi kết thúc (ms)
  endDelay?: number,

  // Hàm easing
  easing?: ((t: number) => number) | keyof typeof easingFunctions,

  // Làm tròn số
  round?: number | boolean,

  // Lặp lại
  loop?: number | boolean,

  // Hướng chạy animation
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse",

  // Callback khi animation cập nhật
  update?: (currentState: any, progress: { completed: number, remaining: number }) => void,

  // Callback khi animation bắt đầu
  begin?: () => void,

  // Callback khi animation kết thúc
  complete?: () => void,

  // Tự động phát
  autoplay?: boolean
});
```

##### timeline()

Tạo timeline để điều phối nhiều animation:

```javascript
timeline({
  // Tự động phát
  autoplay?: boolean,

  // Hướng chạy timeline
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse",

  // Lặp lại
  loop?: number | boolean,

  // Callback khi timeline cập nhật
  update?: (progress: { completed: number, remaining: number }) => void,

  // Callback khi timeline kết thúc
  complete?: () => void
});
```

Các phương thức của Timeline:

- `add(animationConfig, timePosition)`: Thêm animation vào timeline
- `play()`: Phát timeline
- `pause()`: Tạm dừng timeline
- `restart()`: Phát lại từ đầu
- `seek(progress)`: Nhảy đến vị trí cụ thể (0-1)
- `reverse()`: Đảo ngược hướng chạy

##### stagger()

Tạo các độ trễ theo tuần tự:

```javascript
stagger(value, {
  // Độ trễ ban đầu
  start?: number,

  // Phần tử bắt đầu
  from?: number | 'center' | 'edges' | 'first' | 'last',

  // Hướng stagger
  direction?: 'normal' | 'reverse',

  // Lưới (rows, cols) cho stagger 2D
  grid?: [rows: number, cols: number],

  // Trục áp dụng với grid
  axis?: 'x' | 'y',

  // Easing cho phân phối độ trễ
  easing?: (t: number) => number
});
```

##### Các hàm Easing

Thư viện cung cấp nhiều hàm easing:

- `linear`
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- `easeInQuart`, `easeOutQuart`, `easeInOutQuart`
- `easeInExpo`, `easeOutExpo`, `easeInOutExpo`
- `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
- `easeInBounce`, `easeOutBounce`, `easeInOutBounce`
- `spring`

##### Hiệu ứng có sẵn

```javascript
effects.fadeIn(targets, duration, options);
effects.fadeOut(targets, duration, options);
effects.slideIn(targets, direction, distance, duration, options);
effects.slideOut(targets, direction, distance, duration, options);
effects.zoom(targets, start, end, duration, options);
effects.pulse(targets, scale, duration, options);
effects.shake(targets, intensity, duration, options);
effects.flipIn(targets, axis, duration, options);
effects.bounce(targets, height, duration, options);
```

#### Các tính năng nâng cao

##### Quản lý Transforms

Hỗ trợ tất cả các thuộc tính transform CSS:

- `translateX`, `translateY`, `translateZ`
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `scale`, `scaleX`, `scaleY`, `scaleZ`
- `skew`, `skewX`, `skewY`

Hàm tiện ích để tạo chuỗi transform:

```javascript
import { createTransform } from "anitimejs";

const transformString = createTransform({
  translateX: "100px",
  rotate: "45deg",
  scale: 1.5,
});
// => "translateX(100px) rotate(45deg) scale(1.5)"
```

##### Hỗ trợ Màu sắc

Thư viện tự động hỗ trợ chuyển đổi giữa các định dạng màu khác nhau (HEX, RGB):

```javascript
animate({
  targets: ".element",
  props: {
    backgroundColor: ["#FF0000", "rgb(0, 0, 255)"],
  },
  duration: 1000,
});
```

##### Hỗ trợ SVG

Animation cho các thuộc tính SVG:

```javascript
animate({
  targets: "svg path",
  props: {
    d: [path1, path2],
    fill: ["#FFF", "#000"],
  },
  duration: 1000,
});
```

#### Trường hợp sử dụng điển hình

##### Animation khi cuộn trang

```javascript
// Animation khi phần tử xuất hiện trong viewport
const elements = document.querySelectorAll(".fade-in");

const observerCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      effects.fadeIn(entry.target, 800);
    }
  });
};

const observer = new IntersectionObserver(observerCallback);
elements.forEach((el) => observer.observe(el));
```

##### Animation theo tương tác người dùng

```javascript
document.querySelector(".button").addEventListener("click", () => {
  const card = document.querySelector(".card");

  animate({
    targets: card,
    props: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 2px 5px rgba(0,0,0,0.2)",
        "0 15px 25px rgba(0,0,0,0.3)",
        "0 2px 5px rgba(0,0,0,0.2)",
      ],
    },
    duration: 800,
    easing: "easeOutElastic",
  });
});
```

##### Hiệu ứng Hover phức tạp

```javascript
const buttons = document.querySelectorAll(".fancy-button");

buttons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    animate({
      targets: button.querySelector(".background"),
      props: { width: ["0%", "100%"] },
      duration: 500,
      easing: "easeOutCubic",
    });
  });

  button.addEventListener("mouseleave", () => {
    animate({
      targets: button.querySelector(".background"),
      props: { width: ["100%", "0%"] },
      duration: Plot500,
      easing: "easeOutCubic",
    });
  });
});
```

#### Hiệu suất và Tối ưu hóa

Animate được thiết kế để đạt hiệu suất cao với các chiến lược tối ưu hóa:

- Sử dụng `requestAnimationFrame` để đồng bộ với chu kỳ render của trình duyệt
- Cache các giá trị được tính toán để giảm thiểu reflow và repaint
- Phân tích và áp dụng transform để sử dụng GPU acceleration khi có thể
- Tối ưu hóa các phép tính nội suy để giảm thiểu tiêu thụ CPU

#### Tương thích

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 với polyfill phù hợp

#### Ví dụ tích hợp với các framework

##### React

```jsx
import React, { useEffect, useRef } from "react";
import { animate } from "anitimejs";

function FadeInComponent() {
  const elementRef = useRef(null);

  useEffect(() => {
    animate({
      targets: elementRef.current,
      props: { opacity: [0, 1], translateY: ["20px", "0px"] },
      duration: 800,
      easing: "easeOutQuad",
    });
  }, []);

  return <div ref={elementRef}>Content to fade in</div>;
}
```

##### Vue

```vue
<template>
  <div ref="element">Content to animate</div>
</template>

<script>
import { animate } from "anitimejs";

export default {
  mounted() {
    animate({
      targets: this.$refs.element,
      props: { opacity: [0, 1], translateY: ["20px", "0px"] },
      duration: 800,
      easing: "easeOutQuad",
    });
  },
};
</script>
```

### Slug Utils

Bộ công cụ xử lý và tạo slug cho các ứng dụng web, đặc biệt hỗ trợ tốt cho nội dung tiếng Việt.

#### Tính năng chính

- 🔄 **Tạo slug từ chuỗi bất kỳ**: Chuyển đổi tiêu đề, câu văn thành định dạng URL thân thiện
- 🇻🇳 **Hỗ trợ tiếng Việt**: Tự động loại bỏ dấu, xử lý ký tự đặc biệt tiếng Việt
- ✅ **Kiểm tra tính hợp lệ**: Xác minh định dạng slug theo các tiêu chuẩn tùy biến
- 📋 **Tạo slug độc nhất**: Thêm hậu tố số khi cần để đảm bảo độc nhất
- 🧩 **Phân tích slug**: Trích xuất các thành phần từ chuỗi slug phức tạp

#### API

##### createSlug

Tạo slug từ chuỗi với nhiều tùy chọn cấu hình.

```typescript
function createSlug(input: string, options?: SlugOptions): string;

interface SlugOptions {
  separator?: string; // Ký tự phân cách (mặc định: "-")
  lowercase?: boolean; // Chuyển đổi sang chữ thường (mặc định: true)
  removeAccents?: boolean; // Loại bỏ dấu tiếng Việt (mặc định: true)
  maxLength?: number; // Giới hạn độ dài (mặc định: 0 - không giới hạn)
  removeNonAlphanumeric?: boolean; // Loại bỏ ký tự đặc biệt (mặc định: true)
  replaceWhitespace?: boolean; // Thay khoảng trắng bằng dấu phân cách (mặc định: true)
  customReplacements?: Record<string, string>; // Thay thế ký tự tùy chỉnh
}
```

###### Ví dụ

```javascript
import { createSlug } from "anitimejs";

// Tạo slug cơ bản
createSlug("Hello World");
// => "hello-world"

// Xử lý tiếng Việt
createSlug("Chào Thế Giới");
// => "chao-the-gioi"

// Tùy chỉnh cấu hình
createSlug("Product Name (Version 2.0)", {
  separator: "_",
  maxLength: 20,
  customReplacements: { "2.0": "2-0" },
});
// => "product_name_version"
```

##### isValidSlug

Kiểm tra xem một chuỗi có phải là slug hợp lệ không.

```typescript
function isValidSlug(slug: string, pattern?: RegExp): boolean;
```

###### Ví dụ

```javascript
import { isValidSlug } from "anitimejs";

// Kiểm tra với mẫu mặc định (chữ thường, số, dấu gạch ngang)
isValidSlug("hello-world"); // => true
isValidSlug("hello world"); // => false
isValidSlug("HELLO-WORLD"); // => false

// Kiểm tra với mẫu tùy chỉnh
isValidSlug("product_123", /^[a-z0-9_]+$/); // => true
```

##### createUniqueSlug

Tạo slug độc nhất không trùng với các slug đã tồn tại.

```typescript
function createUniqueSlug(
  input: string,
  existingSlugs?: string[],
  options?: SlugOptions
): string;
```

###### Ví dụ

```javascript
import { createUniqueSlug } from "anitimejs";

// Tạo slug độc nhất
const existingSlugs = ["hello-world", "hello-world-1"];
createUniqueSlug("Hello World", existingSlugs);
// => "hello-world-2"

// Với tùy chỉnh
createUniqueSlug("Hello World", existingSlugs, { separator: "_" });
// => "hello_world_1"
```

##### getSlugPart

Trích xuất một phần cụ thể từ chuỗi slug.

```typescript
function getSlugPart(
  slug: string,
  position?: "first" | "last" | number,
  separator?: string
): string;
```

###### Ví dụ

```javascript
import { getSlugPart } from "anitimejs";

// Trích xuất phần cuối (mặc định)
getSlugPart("blog/2023/post-title", "last", "/");
// => "post-title"

// Trích xuất phần đầu
getSlugPart("blog/2023/post-title", "first", "/");
// => "blog"

// Trích xuất theo vị trí
getSlugPart("blog/2023/post-title", 1, "/");
// => "2023"
```

#### Ứng dụng thực tế

##### SEO-friendly URLs

```javascript
// Tạo đường dẫn URL thân thiện với SEO từ tiêu đề bài viết
const articleTitle = "10 Cách Học Tiếng Anh Hiệu Quả (Phiên bản 2025)";
const slug = createSlug(articleTitle);
// => "10-cach-hoc-tieng-anh-hieu-qua-phien-ban-2025"

const articleUrl = `https://example.com/articles/${slug}`;
// => "https://example.com/articles/10-cach-hoc-tieng-anh-hieu-qua-phien-ban-2025"
```

##### Hệ thống quản lý nội dung (CMS)

```javascript
// Tạo slug cho bài viết mới, đảm bảo độc nhất
function createArticleSlug(title, existingArticles) {
  const existingSlugs = existingArticles.map((article) => article.slug);
  return createUniqueSlug(title, existingSlugs);
}

const articles = [
  { id: 1, title: "Bài viết đầu tiên", slug: "bai-viet-dau-tien" },
  { id: 2, title: "Bài viết thứ hai", slug: "bai-viet-thu-hai" },
];

const newArticle = {
  id: 3,
  title: "Bài viết đầu tiên", // Trùng tiêu đề
  slug: createArticleSlug("Bài viết đầu tiên", articles),
};
// => { id: 3, title: "Bài viết đầu tiên", slug: "bai-viet-dau-tien-1" }
```

##### Phân tích và xử lý đường dẫn

```javascript
// Xử lý đường dẫn phân cấp
const fullPath = "blog/technology/javascript/new-features";

// Trích xuất danh mục
const category = getSlugPart(fullPath, 1, "/"); // => "technology"

// Trích xuất chủ đề
const topic = getSlugPart(fullPath, 2, "/"); // => "javascript"

// Kiểm tra tính hợp lệ của URL
const allParts = fullPath.split("/");
const allValid = allParts.every((part) => isValidSlug(part));
```

## Đóng góp

Tham gia vào [GitHub repository của AnitimeJS](https://github.com/fo-nhan/Ani-Time-JS) để đóng góp ý kiến, báo cáo lỗi hoặc yêu cầu tính năng mới.

## Tìm kiếm tài liệu đầy đủ?

Tài liệu chi tiết sẽ được cập nhật tại [trang tài liệu AnitimeJS](https://ui.ani2am.me/).

## License

MIT © [AnitimeJS Contributors](LICENSE)
