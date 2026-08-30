/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🔹 مسیرهایی که Tailwind باید برای کلاس‌ها اسکن کند (مخصوص Blazor Server)
  content: [
    "./**/*.razor",
    "./**/*.cshtml",
    "./**/*.html",
    "./**/**/*.html",
    "./**/*.js",
  ],

  // 🔹 کلاس‌هایی که حتی اگر به‌صورت داینامیک ساخته شوند، حذف (purge) نشوند
  safelist: [
    "text-red-600",
    "text-red-500",
    "text-green-600",
    "bg-red-500",
    "bg-green-500",
  ],

  theme: {
    screens: {
      xxs: "360px",
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "0px",
        xs: "0px",
        sm: "1rem",
        lg: "2rem",
        xl: "2rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        
        "custom-brown": "#9C4639",
        "custom-yellow": "#FFF6DA",
        "custom-gray": "#E0E0E0",
        "custom-bg": "#F2F2F2",
        "custom-black": "#262626",
      },
      size: {
        18: "72px",
      },
      height: {
        103: "410px",
      },
      width: {
        84: "336px",
      },
      fontFamily: {
        IRANSansXBlack: "IRANSansX-Black",
        IRANSansXBold: "IRANSansX-Bold",
        IRANSansXDemiBold: "IRANSansX-DemiBold",
        IRANSansXMedium: "IRANSansX-Medium",
        IRANSansXRegular: "IRANSansX-Regular",
        IRANSansXLight: "IRANSansX-Light",
        IRANSansXThin: "IRANSansX-Thin",
        IRANSansXUltraLight: "IRANSansX-UltraLight",
      },
    },
  },

  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
