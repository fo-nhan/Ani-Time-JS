# Welcome to AnitimeJS ⚡️

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

- **Lightweight**: AnitimeJS là một thư viện thời gian nhỏ gọn giúp bạn xử lý các tác vụ liên quan đến thời gian một cách dễ dàng.
- **Flexible & composable**: Các hàm trong AnitimeJS có thể được kết hợp với nhau để thực hiện các tác vụ phức tạp hơn.

- **Accessible**: AnitimeJS tuân thủ các tiêu chuẩn mã nguồn mở và dễ dàng sử dụng trong bất kỳ dự án nào.

## Tìm kiếm tài liệu?

Tài liệu sẽ được cập nhật tại [trang tài liệu AnitimeJS](https://ui.ani2am.me/).

## Phát triển dự án cùng nhau

Tham gia vào [GitHub repository của AnitimeJS](https://github.com/fo-nhan/Ani-Time-JS).

## Một số hàm gợi ý

- **format**: Dễ dàng format thời gian về định dạng mà bạn muốn.

- **lang**: Cấu hình ngôn ngữ cho thời gian (Chỉ hỗ trợ ngôn ngữ mặc định).

- **setTimeZone**: Định hình timeZone phù hợp với bạn.
- **arrangeTime**: Sắp xếp mảng thời gian.

- **calculateWorkingDays**: Lấy ra mảng thời gian (Các ngày) làm việc hoặc nghỉ ngơi theo ý bạn.

- **getMonthStartEndDates**: Ngày đầu tiên và ngày cuối tháng.
- **getDaysInMonth**: Mảng số ngày trong tháng của 1 thời gian xác định.
- **getCalendars**: Bạn muốn tạo lịch? Hàm này giúp lấy ra view số ngày cần hiển thị trong 1 tab lịch.
- **useTimer**: Một hook đếm thời gian có thể tuy chỉnh.

## Cài đặt AnitimeJS

⚡️ AnitimeJS bao gồm nhiều hàm tiện ích mà bạn có thể nhập vào khi cần thiết. Chỉ cần cài đặt gói `anitimejs`:

```sh
$ yarn add anitimejs
# hoặc
$ npm install --save anitimejs
```

Và cách sử dụng

```jsx
import { anitimejs, anitimejsGlobalConfig, useTimer } from "anitimejs";
```
