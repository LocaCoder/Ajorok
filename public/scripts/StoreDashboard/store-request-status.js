// ============================================================
// store-request-status.js - وضعیت درخواست فروشگاه
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) { console.error("[RequestStatus] StoreUI یافت نشد"); return; }

    const { toFa } = UI;

    // ============================================================
    // ۳ حالت مختلف صفحه
    // ============================================================
    const STATUS_TYPES = {
      // حالت ۱: در حال بررسی
      PENDING: "pending",
      // حالت ۲: نیاز به اصلاحات
      REVISION: "revision",
      // حالت ۳: رد شده
      REJECTED: "rejected",
    };

    // ============================================================
    // تعیین حالت فعال (برای تست — بعداً از API بگیر)
    // ============================================================
    // حالت رو از query string یا localStorage می‌تونی بگیری
    // مثلاً: StoreDashboard_RequestStatus.html?status=revision
    const urlParams = new URLSearchParams(window.location.search);
    const currentStatus = urlParams.get("status") || STATUS_TYPES.PENDING;

    console.log("[RequestStatus] حالت فعال:", currentStatus);

    // ============================================================
    // محتوای هر حالت
    // ============================================================
    const contentMap = {
      // ---------- حالت ۱: در حال بررسی ----------
      pending: {
        icon: `
          <svg viewBox="0 0 64 64" fill="none" class="h-full w-full">
            <circle cx="32" cy="32" r="30" fill="#fde8e4" opacity="0.4"/>
            <path d="M22 20h20v22H22z" fill="#fff" stroke="#aa4938" stroke-width="2" stroke-linejoin="round"/>
            <path d="M22 20h20M20 18h24v26H20z" fill="none" stroke="#aa4938" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M24 25h16M24 30h16M24 35h10" stroke="#aa4938" stroke-width="2" stroke-linecap="round"/>
            <circle cx="44" cy="44" r="9" fill="#16a34a"/>
            <path d="m40 44 3 3 5-5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        `,
        title: "درخواست فروشگاه شما در حال بررسی است",
        subtitle: "اطلاعات فروشگاه و مدارک شما با موفقیت دریافت شد و اکنون توسط تیم متخصص آجرک درحال بررسی است.",
        extraNote: "پس از تکمیل بررسی، نتیجه از طریق پیامک به شما اعلام خواهد شد.",
        showFields: true, // نمایش ۳ فیلد پایین
        fields: [
          { icon: "icon-calendar", label: "تاریخ ارسال", value: "۱۴۰۵/۱۲/۱۲ ۱۰:۳۰" },
          { icon: "icon-clock-circle", label: "مدت زمان تقریبی بررسی", value: "۱ الی ۳ روز کاری" },
          { icon: "icon-ticket", label: "شماره پیگیری", value: "۱۲۳۴۶۵۷۹۸" },
        ],
        expertTitle: null,
        expertText: null,
      },

      // ---------- حالت ۲: نیاز به اصلاحات ----------
      revision: {
        icon: `
          <svg viewBox="0 0 64 64" fill="none" class="h-full w-full">
            <circle cx="32" cy="32" r="30" fill="#fde8e4" opacity="0.4"/>
            <path d="M20 16h20l6 6v26H20z" fill="#fff" stroke="#aa4938" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M40 16v6h6" fill="none" stroke="#aa4938" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M25 28h14M25 34h14M25 40h9" stroke="#aa4938" stroke-width="2" stroke-linecap="round"/>
            <circle cx="46" cy="46" r="9" fill="#ef4444"/>
            <path d="M46 41v6M46 50h.01" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        `,
        title: "اطلاعات فروشگاه نیاز به اصلاحات دارد",
        subtitle: "بررسی درخواست فروشگاه شما انجام شد. برای ادامه فرایند و فعال‌سازی فروشگاه، لطفا موارد زیر را براساس توضیحات درج شده اصلاح کرده و مجددا ارسال کنید.",
        extraNote: null,
        showFields: false,
        fields: null,
        expertTitle: "توضیحات کارشناس آجرک",
        expertText: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد`,
      },

      // ---------- حالت ۳: رد شده ----------
      rejected: {
        icon: `
          <svg viewBox="0 0 64 64" fill="none" class="h-full w-full">
            <circle cx="32" cy="32" r="30" fill="#fde8e4" opacity="0.4"/>
            <path d="M20 16h20l6 6v26H20z" fill="#fff" stroke="#aa4938" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M40 16v6h6" fill="none" stroke="#aa4938" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M25 28h14M25 34h14M25 40h9" stroke="#aa4938" stroke-width="2" stroke-linecap="round"/>
            <circle cx="46" cy="46" r="9" fill="#ef4444"/>
            <path d="M42 42l8 8M50 42l-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        `,
        title: "درخواست ثبت فروشگاه تایید نشد",
        subtitle: "درخواست شما برای ثبت فروشگاه بررسی شد و متاسفانه تایید نشد. دلیل تایید عدم درخواست در بخش زیر نمایش داده شده است.",
        extraNote: null,
        showFields: false,
        fields: null,
        expertTitle: "توضیحات کارشناس آجرک",
        expertText: `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد`,
      },
    };

    // ============================================================
    // رندر محتوای اصلی
    // ============================================================
    function renderStatus() {
      const data = contentMap[currentStatus];
      if (!data) {
        console.warn("[RequestStatus] حالت نامعتبر:", currentStatus);
        return;
      }

      const statusEl = document.getElementById("statusContent");
      const expertBoxEl = document.getElementById("expertBox");
      const expertTextEl = document.getElementById("expertText");

      if (!statusEl) return;

      // فیلدهای اضافی (فقط برای حالت pending)
      const fieldsHTML = data.showFields && data.fields
        ? `
          <div class="mt-8 grid grid-cols-1 gap-4 border-t border-[#f0f0f0] pt-6 md:grid-cols-3">
            ${data.fields.map(f => `
              <div class="status-info-row">
                <div class="label">
                  <svg class="h-5 w-5 text-[#999]"><use href="#${f.icon}"></use></svg>
                  <span>${f.label}</span>
                </div>
                <div class="value">${f.value}</div>
              </div>
            `).join("")}
          </div>
        `
        : "";

      // توضیح اضافه (فقط حالت pending)
      const extraNoteHTML = data.extraNote
        ? `<p class="mt-5 text-center text-[12px] leading-7 text-[#666]">${data.extraNote}</p>`
        : "";

      statusEl.innerHTML = `
        <div class="flex flex-col items-center text-center">
          <div class="status-icon-wrap">
            ${data.icon}
          </div>

          <h2 class="mt-6 text-[16px] font-semibold text-[#252525] md:text-[18px]">
            ${data.title}
          </h2>

          <p class="mt-4 max-w-[520px] text-[12px] leading-7 text-[#666] md:text-[13px]">
            ${data.subtitle}
          </p>

          ${extraNoteHTML}
          ${fieldsHTML}
        </div>
      `;

      // جعبه توضیحات کارشناس
      if (data.expertText && expertBoxEl && expertTextEl) {
        expertBoxEl.classList.remove("hidden");
        expertTextEl.textContent = data.expertText;

        // تغییر متن دکمه ویرایش برای حالت رد شده
        const editBtn = expertBoxEl.querySelector('a[href*="Profile_Filled"]');
        if (editBtn && currentStatus === STATUS_TYPES.REJECTED) {
          editBtn.textContent = "ویرایش اطلاعات";
        }
      } else {
        expertBoxEl?.classList.add("hidden");
      }
    }

    // ============================================================
    // Drawer موبایل
    // ============================================================
    function setupDrawer() {
      const drawer = document.getElementById("mobileDrawer");
      const backdrop = document.getElementById("drawerBackdrop");
      const openBtn = document.getElementById("openDrawerBtn");
      const closeBtn = document.getElementById("closeDrawerBtn");

      if (!drawer || !backdrop) return;

      function open() {
        drawer.classList.add("open");
        backdrop.classList.add("open");
        document.body.classList.add("overflow-hidden");
      }

      function close() {
        drawer.classList.remove("open");
        backdrop.classList.remove("open");
        document.body.classList.remove("overflow-hidden");
      }

      openBtn?.addEventListener("click", open);
      closeBtn?.addEventListener("click", close);
      backdrop.addEventListener("click", close);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }

    // ============================================================
    // راه‌اندازی
    // ============================================================
    UI.init();
    renderStatus();
    setupDrawer();

    // برای تست سریع: در کنسول اینا رو بزن
    // location.search = "?status=pending"
    // location.search = "?status=revision"
    // location.search = "?status=rejected"
    console.log("[RequestStatus] برای تغییر حالت از URL استفاده کن:");
    console.log("  ?status=pending (پیش‌فرض)");
    console.log("  ?status=revision");
    console.log("  ?status=rejected");
  }
})();