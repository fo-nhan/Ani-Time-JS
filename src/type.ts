export type FormatDateOptions =
  | "YYYY/MM/DD"
  | "DD/MM/YYYY"
  | "YYYY-MM-DD"
  | "MM-DD-YYYY"
  | "YY/MM"
  | "MM/YY"
  | "DD/MM"
  | "MM/DD"
  | "YYYY/MM"
  | "MM/YYYY"
  | "YY-MM"
  | "MM-YY"
  | "DD-MM"
  | "MM-DD"
  | "YYYY-MM"
  | "MM-YYYY"
  | "L"
  | "LL"
  | "LT"
  | "F"
  | "YYYY/MM/DD HH:mm"
  | "DD/MM/YYYY HH:mm"
  | "YYYY-MM-DD HH:mm"
  | "MM-DD-YYYY HH:mm"
  | "YYYY/MM/DD HH:mm:ss"
  | "DD/MM/YYYY HH:mm:ss"
  | "YYYY-MM-DD HH:mm:ss"
  | "MM-DD-YYYY HH:mm:ss"
  | "HH:mm"
  | "HH:mm:ss"
  | "HH:mm:ss.SSS"
  | (string & {}); // Thêm cả mili giây nếu cần

export type DateLocalization = {
  L: string[]; // Danh sách các ngày trong tuần viết hoa
  l: string[]; // Danh sách các ngày trong tuần viết thường
  tK: string; // Ký tự cho "lúc" viết thường
  TK: string; // Ký tự cho "Lúc" viết hoa
  eM: string[]; // Danh sách các tháng viết thường
  EM: string[]; // Danh sách các tháng viết hoa
  tY: string; // Ký tự cho "năm" viết thường
  TY: string; // Ký tự cho "Năm" viết hoa
  vx: string; // Ký tự cho "Vừa xong"
  vp: string; // Ký tự cho "Vài giây trước"
  vs: string; // Ký tự cho "Sắp tới"
  vv: string; // Ký tự cho "trước"
  xx: string; // Ký tự cho "sau"
  tD: string; // Ký tự cho "ngày" viết thường
  TD: string; // Ký tự cho "Ngày" viết hoa
  tM: string; // Ký tự cho "tháng" viết thường
  TM: string; // Ký tự cho "Tháng" viết hoa
  tH: string; // Ký tự cho "giờ" viết thường
  TH: string; // Ký tự cho "Giờ" viết hoa
  tI: string; // Ký tự cho "phút" viết thường
  TI: string; // Ký tự cho "Phút" viết hoa
  tS: string; // Ký tự cho "giây" viết thường
  TS: string; // Ký tự cho "Giây" viết hoa
};

export type DateLocalizationConfig = {
  L: string[]; 
  l: string[]; 
  tK: string; 
  TK: string; 
  eM: string[]; 
  EM: string[]; 
  tY: string; 
  TY: string; 
  vx: string; 
  vp: string; 
  vs: string; 
  vv: string;
  xx: string; 
  tD: string; 
  TD: string; 
  tM: string; 
  TM: string; 
  tH: string; 
  TH: string; 
  tI: string; 
  TI: string; 
  tS: string; 
  TS: string; 
};

export type Language = "vi" | "en" | "ja" | "lo" | "zh" | "fr" | "ko";

export type TimeZone = 
  | "UTC"
  | "Europe/London"
  | "Europe/Paris"
  | "Europe/Berlin"
  | "Europe/Madrid"
  | "Europe/Rome"
  | "Europe/Amsterdam"
  | "Europe/Athens"
  | "Europe/Moscow"
  | "Europe/Istanbul"
  | "Europe/Kiev"
  | "Europe/Zurich"
  | "Africa/Cairo"
  | "Africa/Lagos"
  | "Africa/Johannesburg"
  | "Africa/Nairobi"
  | "Africa/Algiers"
  | "Africa/Casablanca"
  | "America/New_York"
  | "America/Chicago"
  | "America/Denver"
  | "America/Los_Angeles"
  | "America/Toronto"
  | "America/Vancouver"
  | "America/Mexico_City"
  | "America/Caracas"
  | "America/Sao_Paulo"
  | "America/Buenos_Aires"
  | "America/Lima"
  | "America/Bogota"
  | "Asia/Tokyo"
  | "Asia/Seoul"
  | "Asia/Shanghai"
  | "Asia/Hong_Kong"
  | "Asia/Singapore"
  | "Asia/Taipei"
  | "Asia/Kuala_Lumpur"
  | "Asia/Bangkok"
  | "Asia/Ho_Chi_Minh"
  | "Asia/Manila"
  | "Asia/Jakarta"
  | "Asia/Kolkata"
  | "Asia/Dubai"
  | "Asia/Riyadh"
  | "Asia/Baghdad"
  | "Asia/Karachi"
  | "Asia/Kathmandu"
  | "Asia/Colombo"
  | "Australia/Sydney"
  | "Australia/Melbourne"
  | "Australia/Brisbane"
  | "Australia/Perth"
  | "Australia/Adelaide"
  | "Australia/Darwin"
  | "Pacific/Auckland"
  | "Pacific/Fiji"
  | "Pacific/Honolulu"
  | "Pacific/Tahiti"
  | "Pacific/Guam"
  | "Pacific/Port_Moresby"
  | "Antarctica/Casey"
  | "Antarctica/Macquarie"
  | "Atlantic/Azores"
  | "Atlantic/Cape_Verde"
  | "Atlantic/Reykjavik"
  | "Atlantic/Canary";

