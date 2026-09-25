// ============================================================
// store-notifications.js - اعلان‌های فروشگاه
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) {
      console.error("[Notifications] StoreUI یافت نشد");
      return;
    }

    const { $, $$, showToast, isMobile, toFa } = UI;

    // ============================================================
    // DATA
    // ============================================================
    const notifications = [
      {
        id: 1,
        type: "success",
        title: "سفارش جدید ثبت شد",
        text: "یک سفارش جدید از شرکت سازه برتر دریافت کردید. لطفاً برای بررسی به بخش سفارش‌ها مراجعه کنید.",
        date: "۱۲ دقیقه پیش",
        read: false,
      },
      {
        id: 2,
        type: "warning",
        title: "موجودی محصول در حال اتمام است",
        text: "موجودی محصول «سیمان تیپ ۱» به ۵ واحد رسیده است. برای جلوگیری از قطع فروش، موجودی خود را افزایش دهید.",
        date: "۱ ساعت پیش",
        read: false,
      },
      {
        id: 3,
        type: "info",
        title: "به‌روزرسانی قوانین فروش",
        text: "قوانین فروش و تسویه‌حساب فروشگاه‌ها به‌روزرسانی شد. لطفاً برای اطلاع از تغییرات، بخش قوانین را مطالعه کنید.",
        date: "دیروز",
        read: true,
      },
      {
        id: 4,
        type: "error",
        title: "تسویه‌حساب ناموفق",
        text: "درخواست تسویه‌حساب شما به دلیل مشکل در شماره شبا با خطا مواجه شد. لطفاً اطلاعات حساب بانکی خود را بررسی کنید.",
        date: "۲ روز پیش",
        read: false,
      },
      {
        id: 5,
        type: "success",
        title: "محصول شما تأیید شد",
        text: "محصول «میلگرد آجدار A3 سایز ۱۲» پس از بررسی توسط تیم پشتیبانی تأیید و منتشر شد.",
        date: "۳ روز پیش",
        read: true,
      },
      {
        id: 6,
        type: "warning",
        title: "نظر جدید در انتظار پاسخ",
        text: "یک نظر جدید برای محصول «گچ سفیدکاری» ثبت شده است که در انتظار پاسخ شماست.",
        date: "۴ روز پیش",
        read: true,
      },
      {
        id: 7,
        type: "info",
        title: "کمپین فروش ویژه",
        text: "کمپین فروش ویژه فصل به فروشگاه‌های فعال اضافه شد. برای شرکت در کمپین به بخش تخفیف‌ها مراجعه کنید.",
        date: "۱ هفته پیش",
        read: true,
      },
      {
        id: 8,
        type: "error",
        title: "حساب بانکی رد شد",
        text: "اطلاعات حساب بانکی جدید شما تأیید نشد. لطفاً شماره شبا و نام صاحب حساب را بررسی و مجدداً ثبت کنید.",
        date: "۱ هفته پیش",
        read: true,
      },
    ];

    // ============================================================
    // STATE
    // ============================================================
    const state = {
      tab: "all",
      typeFilter: "all",
    };

    // ============================================================
    // TYPE META
    // ============================================================
    const typeMeta = {
      success: {
        bg: "bg-[#dcf6e8]",
        text: "text-[#16864a]",
        iconId: "icon-check-circle",
        border: "border-[#b8e6cd]",
        unreadBg: "bg-[#f3fdf8]",
      },
      warning: {
        bg: "bg-[#fff2d7]",
        text: "text-[#d98b15]",
        iconId: "icon-warning",
        border: "border-[#f3e0b8]",
        unreadBg: "bg-[#fffcf5]",
      },
      error: {
        bg: "bg-[#fde3e3]",
        text: "text-[#c53a3a]",
        iconId: "icon-error-circle",
        border: "border-[#f3bcbc]",
        unreadBg: "bg-[#fff7f7]",
      },
      info: {
        bg: "bg-[#dcecff]",
        text: "text-[#2b78c5]",
        iconId: "icon-info-circle",
        border: "border-[#b7d6f5]",
        unreadBg: "bg-[#f7fbff]",
      },
    };

    // ============================================================
    // FILTER
    // ============================================================
    function getFiltered() {
      let data = [...notifications];

      if (state.tab === "unread") {
        data = data.filter((n) => !n.read);
      }

      if (state.typeFilter !== "all") {
        data = data.filter((n) => n.type === state.typeFilter);
      }

      return data;
    }

    // ============================================================
    // RENDER
    // ============================================================
    function notifCardTemplate(n) {
      const meta = typeMeta[n.type] || typeMeta.info;
      const isUnread = !n.read;

      return `
        <article
          class="notif-card relative flex cursor-pointer gap-3 rounded-[12px] border p-4 transition hover:shadow-sm md:gap-4 md:p-5 ${
            isUnread
              ? `${meta.border} ${meta.unreadBg}`
              : "border-[#ececec] bg-white"
          }"
          data-notif-id="${n.id}"
        >
          <!-- آیکون -->
          <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full md:h-12 md:w-12 ${meta.bg} ${meta.text}">
            <svg class="h-5 w-5 md:h-6 md:w-6" aria-hidden="true">
              <use href="#${meta.iconId}"></use>
            </svg>
          </div>

          <!-- متن -->
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <h3 class="text-[13px] font-bold text-[#252525] md:text-[14px]">
                ${n.title}
                ${isUnread ? '<span class="mr-2 inline-block h-2 w-2 rounded-full bg-[#aa4938] align-middle"></span>' : ""}
              </h3>
              <span class="shrink-0 text-[11px] text-[#999]">${n.date}</span>
            </div>
            <p class="mt-2 text-[12px] leading-6 text-[#666] md:text-[13px]">
              ${n.text}
            </p>
          </div>
        </article>
      `;
    }

    function render() {
      const listEl = document.getElementById("notificationList");
      const emptyEl = document.getElementById("notificationEmpty");
      if (!listEl) return;

      const filtered = getFiltered();

      if (filtered.length) {
        listEl.innerHTML = filtered.map(notifCardTemplate).join("");
        listEl.classList.remove("hidden");
        if (emptyEl) emptyEl.classList.add("hidden");
      } else {
        listEl.innerHTML = "";
        listEl.classList.add("hidden");
        if (emptyEl) emptyEl.classList.remove("hidden");
      }

      bindNotifClicks();
    }

    function bindNotifClicks() {
      $$(".notif-card").forEach((card) => {
        card.addEventListener("click", function () {
          const id = Number(this.dataset.notifId);
          const notif = notifications.find((n) => n.id === id);
          if (!notif) return;

          if (!notif.read) {
            notif.read = true;
            render();
          }
        });
      });
    }

    // ============================================================
    // MARK ALL READ
    // ============================================================
    function markAllRead() {
      let count = 0;
      notifications.forEach((n) => {
        if (!n.read) {
          n.read = true;
          count++;
        }
      });

      if (count > 0) {
        render();
        showToast("همه اعلان‌ها خوانده شدند.", "success");
      } else {
        showToast("اعلان خوانده‌نشده‌ای وجود ندارد.", "warning");
      }
    }

    // ============================================================
    // TABS
    // ============================================================
    function initTabs() {
      $$("[data-notif-tab]").forEach((tab) => {
        tab.addEventListener("click", function () {
          const key = this.dataset.notifTab;
          state.tab = key;

          $$("[data-notif-tab]").forEach((t) => {
            t.className =
              "notif-tab h-[58px] shrink-0 border-b-[3px] border-transparent px-4 text-[14px] text-[#333]";
          });

          this.className =
            "notif-tab h-[58px] shrink-0 border-b-[3px] border-[#aa4938] px-4 text-[14px] font-medium text-[#aa4938]";

          render();
        });
      });
    }

    // ============================================================
    // TYPE CHIPS
    // ============================================================
    function initTypeChips() {
      $$("[data-notif-type]").forEach((chip) => {
        chip.addEventListener("click", function () {
          const type = this.dataset.notifType;
          state.typeFilter = type;

          $$("[data-notif-type]").forEach((c) => {
            c.className =
              "notif-chip shrink-0 rounded-full border border-[#d0d0d0] bg-white px-4 py-2 text-[12px] text-[#444]";
          });

          this.className =
            "notif-chip shrink-0 rounded-full border border-[#aa4938] bg-[#fff6f3] px-4 py-2 text-[12px] font-medium text-[#aa4938]";

          render();
        });
      });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
      // دکمه‌های بازگشت
      document.querySelectorAll("[data-store-back]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.history.length > 1) window.history.back();
          else window.location.href = "StoreDashboard.html";
        });
      });

      // دکمه‌های خواندن همه
      document.getElementById("markAllReadBtn")?.addEventListener("click", markAllRead);
      document.getElementById("mobileMarkAllReadBtn")?.addEventListener("click", markAllRead);

      // تب‌ها + چیپ‌ها
      initTabs();
      initTypeChips();

      // رندر اولیه
      render();
    }

    UI.init();
    init();
  }
})();