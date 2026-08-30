/**
 * validator.js
 * Shared validation logic for all pages
 * Pure functions with no DOM dependencies
 */

/* =========================================================
   DIGIT CONVERSION UTILITIES
   ========================================================= */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const EN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Convert Persian/Arabic digits to English digits */
function toEnglishDigits(str = "") {
  return String(str)
    .replace(/[۰-۹]/g, (d) => EN_DIGITS[FA_DIGITS.indexOf(d)])
    .replace(/[٠-٩]/g, (d) => EN_DIGITS["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
}

/** Convert English digits to Persian digits */
function toPersianDigits(str = "") {
  return String(str).replace(/[0-9]/g, (d) => FA_DIGITS[EN_DIGITS.indexOf(d)]);
}

/** Extract only digits from string (any script → English digits) */
function digitsOnly(str = "") {
  return toEnglishDigits(str).replace(/\D/g, "");
}

/* =========================================================
   MOBILE NUMBER VALIDATION
   ========================================================= */

const MOBILE_REGEX = /^09\d{9}$/;

/**
 * Validate Iranian mobile number
 * @param {string} rawValue - Input value (may contain Persian digits)
 * @returns {{ valid: boolean, empty: boolean, value: string, message: string }}
 */
function validateMobile(rawValue) {
  const value = digitsOnly(rawValue);

  if (value.length === 0) {
    return {
      valid: false,
      empty: true,
      value,
      message: "لطفا این قسمت را خالی نگذارید.",
    };
  }

  if (!MOBILE_REGEX.test(value)) {
    return {
      valid: false,
      empty: false,
      value,
      message: "شماره وارد شده صحیح نمی‌باشد.",
    };
  }

  return { valid: true, empty: false, value, message: "" };
}

/* =========================================================
   OTP CODE VALIDATION
   ========================================================= */

/**
 * Validate OTP digits from separate input boxes
 * @param {string[]} digits - Array of digit strings
 * @param {number} length - Expected OTP length (default: 4)
 * @returns {{ valid: boolean, complete: boolean, value: string, message: string }}
 */
function validateOtp(digits, length = 4) {
  const joined = digits.map((d) => digitsOnly(d)).join("");

  if (joined.length < length) {
    return { valid: false, complete: false, value: joined, message: "" };
  }

  // Server-side validation required in production
  return { valid: true, complete: true, value: joined, message: "" };
}

/* =========================================================
   NATIONAL ID & COMPANY ID VALIDATION
   ========================================================= */

/**
 * Validate Iranian National ID (10 digits) using checksum algorithm
 * @param {string} rawValue - Input value
 * @returns {{ valid: boolean, empty: boolean, value: string, message: string }}
 */
function validateNationalCode(rawValue) {
  const value = digitsOnly(rawValue);

  if (value.length === 0) {
    return {
      valid: false,
      empty: true,
      value,
      message: "لطفا این قسمت را خالی نگذارید.",
    };
  }

  // Reject invalid format or all identical digits
  const invalidFormat = value.length !== 10 || /^(\d)\1{9}$/.test(value);

  if (invalidFormat) {
    return {
      valid: false,
      empty: false,
      value,
      message: "کد ملی وارد شده صحیح نمی‌باشد.",
    };
  }

  // Checksum validation
  const digitsArr = value.split("").map(Number);
  const checkDigit = digitsArr[9];
  const sum = digitsArr
    .slice(0, 9)
    .reduce((acc, d, i) => acc + d * (10 - i), 0);
  const remainder = sum % 11;
  const expected = remainder < 2 ? remainder : 11 - remainder;

  if (checkDigit !== expected) {
    return {
      valid: false,
      empty: false,
      value,
      message: "کد ملی وارد شده صحیح نمی‌باشد.",
    };
  }

  return { valid: true, empty: false, value, message: "" };
}

/**
 * Validate Company National ID (11 digits)
 * Note: Official checksum is complex and entity-type dependent
 * @param {string} rawValue - Input value
 * @returns {{ valid: boolean, empty: boolean, value: string, message: string }}
 */
function validateCompanyNationalId(rawValue) {
  const value = digitsOnly(rawValue);

  if (value.length === 0) {
    return {
      valid: false,
      empty: true,
      value,
      message: "لطفا این قسمت را خالی نگذارید.",
    };
  }

  if (value.length !== 11 || /^(\d)\1{10}$/.test(value)) {
    return {
      valid: false,
      empty: false,
      value,
      message: "شناسه ملی وارد شده صحیح نمی‌باشد.",
    };
  }

  return { valid: true, empty: false, value, message: "" };
}

/**
 * Validate Sheba number (Iranian IBAN) using mod-97 algorithm
 * @param {string} rawValue - Input value (with or without IR prefix)
 * @returns {{ valid: boolean, empty: boolean, value: string, message: string }}
 */
function validateSheba(rawValue) {
  const cleaned = toEnglishDigits(String(rawValue))
    .replace(/\s+/g, "")
    .toUpperCase();
  const withoutPrefix = cleaned.startsWith("IR") ? cleaned : `IR${cleaned}`;

  if (withoutPrefix === "IR" || withoutPrefix.length === 0) {
    return {
      valid: false,
      empty: true,
      value: "",
      message: "لطفا این قسمت را خالی نگذارید.",
    };
  }

  if (!/^IR\d{24}$/.test(withoutPrefix)) {
    return {
      valid: false,
      empty: false,
      value: withoutPrefix,
      message: "شماره شبا وارد شده صحیح نمی‌باشد.",
    };
  }

  // IBAN mod-97 checksum
  const rearranged = withoutPrefix.slice(4) + withoutPrefix.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (ch) =>
    String(ch.charCodeAt(0) - 55)
  );

  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 7) {
    remainder = Number(String(remainder) + numeric.substr(i, 7)) % 97;
  }

  if (remainder !== 1) {
    return {
      valid: false,
      empty: false,
      value: withoutPrefix,
      message: "شماره شبا وارد شده صحیح نمی‌باشد.",
    };
  }

  return { valid: true, empty: false, value: withoutPrefix, message: "" };
}

/**
 * Generic required field validator for text inputs
 * @param {string} rawValue - Input value
 * @returns {{ valid: boolean, empty: boolean, value: string, message: string }}
 */
function validateRequiredText(rawValue) {
  const value = String(rawValue ?? "").trim();
  if (value.length === 0) {
    return {
      valid: false,
      empty: true,
      value,
      message: "لطفا این قسمت را خالی نگذارید.",
    };
  }
  return { valid: true, empty: false, value, message: "" };
}

/* =========================================================
   FILE UPLOAD VALIDATION
   ========================================================= */

const DEFAULT_ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
const DEFAULT_ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

/** Extract file extension from filename */
function getFileExtension(fileName = "") {
  const parts = String(fileName).split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

/** Format file size in MB with Persian digits */
function formatFileSizeMB(bytes) {
  const mb = bytes / (1024 * 1024);
  return toPersianDigits(mb.toFixed(1));
}

/**
 * Validate uploaded file format and size
 * @param {File} file - File object to validate
 * @param {Object} options - Validation options
 * @param {string[]} options.allowedTypes - MIME types allowed
 * @param {string[]} options.allowedExtensions - File extensions allowed
 * @param {number} options.maxSizeMB - Maximum file size in MB
 * @returns {{ valid: boolean, message: string }}
 */
function validateFile(file, options = {}) {
  const {
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
    maxSizeMB = 10,
  } = options;

  if (!file) {
    return { valid: false, message: "لطفا یک فایل انتخاب کنید." };
  }

  // Check file type
  const ext = getFileExtension(file.name);
  const typeOk =
    allowedTypes.includes(file.type) || allowedExtensions.includes(ext);
  if (!typeOk) {
    return {
      valid: false,
      message: "فرمت فایل مجاز نیست. فرمت‌های مجاز: PDF، JPG، PNG",
    };
  }

  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      message: `حجم فایل نباید بیشتر از ${toPersianDigits(
        String(maxSizeMB)
      )} مگابایت باشد.`,
    };
  }

  return { valid: true, message: "" };
}

/* =========================================================
   COUNTDOWN TIMER
   ========================================================= */

/**
 * Countdown timer for "Resend Code" functionality
 */
class Countdown {
  /**
   * @param {number} seconds - Duration in seconds
   * @param {(text: string) => void} onTick - Called every second
   * @param {() => void} onFinish - Called when timer completes
   */
  constructor(seconds, onTick, onFinish) {
    this.total = seconds;
    this.remaining = seconds;
    this.onTick = onTick;
    this.onFinish = onFinish;
    this.timerId = null;
  }

  /** Format time as MM:SS with Persian digits */
  static formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const text = `${m}:${String(s).padStart(2, "0")}`;
    return toPersianDigits(text);
  }

  /** Start the countdown */
  start() {
    this.stop();
    this.remaining = this.total;
    this.onTick(Countdown.formatTime(this.remaining));
    this.timerId = setInterval(() => {
      this.remaining -= 1;
      if (this.remaining <= 0) {
        this.onTick(Countdown.formatTime(0));
        this.stop();
        this.onFinish && this.onFinish();
        return;
      }
      this.onTick(Countdown.formatTime(this.remaining));
    }, 1000);
  }

  /** Stop the countdown */
  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

/* =========================================================
   EXPORTS
   ========================================================= */

window.Validator = {
  toEnglishDigits,
  toPersianDigits,
  digitsOnly,
  validateMobile,
  validateOtp,
  validateNationalCode,
  validateCompanyNationalId,
  validateSheba,
  validateRequiredText,
  validateFile,
  formatFileSizeMB,
  getFileExtension,
  Countdown,
  MOBILE_REGEX,
};
