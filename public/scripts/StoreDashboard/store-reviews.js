// ============================================================
// store-reviews.js - نظرات و امتیازها
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) {
      console.error("[Reviews] StoreUI یافت نشد");
      return;
    }

    const { $, $$, toFa, showToast, isMobile, openModal, closeModal, debounce } = UI;

    // ============================================================
    // DATA
    // ============================================================
    const reviews = [
      {
        id: 1,
        user: "نام کاربر",
        date: "۱۴۰۴/۰۴/۰۴",
        time: "۱۳:۵۲",
        rating: 3,
        product: "عنوان محصول",
        productCode: "۱۲۳۴۵۶",
        productImage: "../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
        text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
        reply: null,
        reported: false,
        createdAtRaw: 100,
      },
      {
        id: 2,
        user: "نام کاربر",
        date: "۱۴۰۴/۰۴/۰۴",
        time: "۱۳:۵۲",
        rating: 3,
        product: "عنوان محصول",
        productCode: "۱۲۳۴۵۶",
        productImage: "../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
        text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
        reply: null,
        reported: false,
        highlighted: true, // پس‌زمینه کرم ملایم
        createdAtRaw: 95,
      },
      {
        id: 3,
        user: "نام کاربر",
        date: "۱۴۰۴/۰۴/۰۴",
        time: "۱۳:۵۲",
        rating: 3,
        product: "عنوان محصول",
        productCode: "۱۲۳۴۵۶",
        productImage: "../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
        text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
        reply: null,
        reported: false,
        createdAtRaw: 90,
      },
      {
        id: 4,
        user: "نام کاربر",
        date: "۱۴۰۴/۰۴/۰۴",
        time: "۱۳:۵۲",
        rating: 3,
        product: "عنوان محصول",
        productCode: "۱۲۳۴۵۶",
        productImage: "../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
        text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
        reply: {
          text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است. لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.",
          date: "۱۴۰۴/۰۴/۰۴",
          time: "۱۳:۴۵",
        },
        reported: false,
        createdAtRaw: 85,
      },
    ];

    // ============================================================
    // STATE
    // ============================================================
    const state = {
      query: "",
      sort: "newest",
      quick: "all",
      ratings: new Set(),
      currentReplyReview: null,
    };

    // ============================================================
    // FILTER
    // ============================================================
    function getFiltered() {
      let data = [...reviews];

      if (state.query) {
        const q = state.query.trim();
        data = data.filter((r) => r.text.includes(q) || r.product.includes(q) || r.user.includes(q));
      }

      if (state.quick === "unanswered") data = data.filter((r) => !r.reply);
      if (state.quick === "negative") data = data.filter((r) => r.rating <= 2);
      if (state.quick === "reported") data = data.filter((r) => r.reported);

      if (state.ratings.size) {
        data = data.filter((r) => state.ratings.has(String(r.rating)));
      }

      const sorters = {
        newest: (a, b) => b.createdAtRaw - a.createdAtRaw,
        oldest: (a, b) => a.createdAtRaw - b.createdAtRaw,
        rating: (a, b) => b.rating - a.rating,
      };
      data.sort(sorters[state.sort] || sorters.newest);

      return data;
    }

    // ============================================================
    // RENDER
    // ============================================================
    function stars(n) {
      return Array.from({ length: 5 }, (_, i) => {
        const filled = i < n;
        return `<span class="${filled ? "star-filled" : "star-empty"} text-[16px]" dir="ltr">★</span>`;
      }).join("");
    }

    function reviewCardTemplate(r) {
      const replyHTML = r.reply
        ? `
          <div class="mt-5 overflow-hidden rounded-[8px] border border-[#b8e6c9] bg-[#eefaf3]">
            <div class="flex items-center justify-between border-b border-[#b8e6c9] bg-[#e3f5eb] px-4 py-2">
              <span class="text-[11px] font-bold text-[#16864a]">پاسخ فروشگاه</span>
              <span class="text-[10px] text-[#666]">${r.reply.date} - ${r.reply.time}</span>
            </div>
            <p class="px-4 py-3 text-[11px] leading-6 text-[#333]">${r.reply.text}</p>
          </div>
        `
        : "";

      const highlightedClass = r.highlighted ? "bg-[#fffbf0]" : "bg-white";

      return `
        <article class="review-card shadow-[0_1px_2px_rgba(0,0,0,0.03)]" data-review-id="${r.id}">

          <!-- هدر خاکستری: نام محصول + تصویر + امتیاز -->
          <div class="review-card-header">
            <div class="flex items-center gap-4 min-w-0">

              <!-- امتیاز -->
              <div class="flex items-center gap-2 shrink-0">
                <div class="flex items-center gap-0.5" dir="ltr">${stars(r.rating)}</div>
                <span class="text-[12px] text-[#666]">میانگین:</span>
                <b class="text-[13px] text-[#333]">${toFa(r.rating)}</b>
                <span class="text-[12px] text-[#666]">نظر</span>
              </div>

              <span class="hidden md:block h-6 w-px bg-[#d5d5d5]"></span>

              <!-- نام محصول -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="min-w-0 text-right">
                  <div class="text-[13px] font-medium text-[#333] truncate">${r.product}</div>
                  <div class="text-[11px] text-[#888]">${r.productCode}</div>
                </div>

                <!-- تصویر محصول -->
                <div class="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[8px] border border-[#e0e0e0] bg-[#f4f4f4]">
                  <img src="${r.productImage}" alt="" class="h-full w-full object-cover" />
                </div>
              </div>

            </div>
          </div>

          <!-- بدنه: نظر کاربر -->
          <div class="review-card-body ${highlightedClass}">

            <!-- نام کاربر + ستاره‌ها -->
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="grid h-7 w-7 place-items-center rounded-full bg-[#f0f0f0] text-[#777]">
                  <svg class="h-4 w-4"><use href="#icon-user"></use></svg>
                </div>
                <span class="text-[13px] font-medium text-[#333]">${r.user}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-0.5" dir="ltr">${stars(r.rating)}</div>
                <span class="text-[11px] text-[#999]">${r.date}</span>
              </div>
            </div>

            <!-- متن نظر -->
            <p class="text-[12px] leading-7 text-[#555]">${r.text}</p>

            <!-- اکشن‌ها -->
            <div class="mt-4 flex flex-wrap items-center justify-end gap-5 text-[11px] text-[#666]">
              <button type="button" data-reply-review="${r.id}" class="flex items-center gap-1.5 hover:text-[#aa4938] transition">
                <svg class="h-4 w-4"><use href="#icon-reply"></use></svg>
                <span>پاسخ</span>
              </button>
              <button type="button" class="flex items-center gap-1.5 hover:text-[#aa4938] transition" data-private-msg>
                <svg class="h-4 w-4"><use href="#icon-chat-dots"></use></svg>
                <span>پیام خصوصی</span>
              </button>
              <button type="button" class="flex items-center gap-1.5 hover:text-[#aa4938] transition" data-more>
                <svg class="h-4 w-4"><use href="#icon-more-h"></use></svg>
                <span>بیشتر</span>
              </button>
            </div>

            <!-- پاسخ فروشگاه -->
            ${replyHTML}
          </div>
        </article>
      `;
    }

    function render() {
      const listEl = document.getElementById("reviewsList");
      const emptyEl = document.getElementById("reviewsEmpty");
      if (!listEl) return;

      const filtered = getFiltered();

      if (filtered.length) {
        listEl.innerHTML = filtered.map(reviewCardTemplate).join("");
        listEl.classList.remove("hidden");
        if (emptyEl) emptyEl.classList.add("hidden");
      } else {
        listEl.innerHTML = "";
        listEl.classList.add("hidden");
        if (emptyEl) emptyEl.classList.remove("hidden");
      }

      bindReviewEvents();
    }

    function bindReviewEvents() {
      // Reply
      $$("[data-reply-review]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = Number(this.dataset.replyReview);
          const review = reviews.find((r) => r.id === id);
          if (!review) return;

          state.currentReplyReview = review;

          const originalEl = document.getElementById("replyOriginalReview");
          if (originalEl) {
            originalEl.textContent = `«${review.text}» — ${review.user}`;
          }

          const replyText = document.getElementById("replyText");
          if (replyText) replyText.value = "";

          openModal("replyModal", "replyModalBackdrop");
        });
      });

      // Private msg (fake)
      $$("[data-private-msg]").forEach((btn) => {
        btn.addEventListener("click", () => showToast("پیام خصوصی باز شد.", "info"));
      });

      // More
      $$("[data-more]").forEach((btn) => {
        btn.addEventListener("click", () => showToast("گزینه‌های بیشتر...", "info"));
      });
    }

    // ============================================================
    // RATING LIST
    // ============================================================
    function renderRatingList() {
      const el = document.getElementById("rvRatingList");
      if (!el) return;

      el.innerHTML = [5, 4, 3, 2, 1]
        .map(
          (n) => `
        <label class="flex cursor-pointer items-center justify-between">
          <span class="flex items-center gap-1" dir="ltr">
            <span>${n}</span>
            <span class="star-filled text-[14px]">★</span>
          </span>
          <span class="flex">
            <input class="sr-only rv-rating-checkbox" type="checkbox" value="${n}" />
            <span class="store-check-ui"></span>
          </span>
        </label>
      `
        )
        .join("");

      el.querySelectorAll(".rv-rating-checkbox").forEach((input) => {
        input.addEventListener("change", function () {
          const val = this.value;
          if (this.checked) state.ratings.add(val);
          else state.ratings.delete(val);
          updateChipLabels();
          render();
        });
      });
    }

    function updateChipLabels() {
      const el = document.getElementById("rvRatingChipLabel");
      if (el) {
        el.textContent = state.ratings.size
          ? `امتیاز (${toFa(state.ratings.size)})`
          : "امتیاز";
      }
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
      document.querySelectorAll("[data-store-back]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.history.length > 1) window.history.back();
          else window.location.href = "StoreDashboard.html";
        });
      });

      renderRatingList();
      render();

      // Search
      const search = document.getElementById("reviewSearch");
      if (search) {
        search.addEventListener(
          "input",
          debounce(function () {
            state.query = this.value;
            render();
          }, 300)
        );
      }

      // Sort
      $$('input[name="rvSort"]').forEach((input) => {
        input.addEventListener("change", function () {
          state.sort = this.value;
          const labels = { newest: "جدیدترین", oldest: "قدیمی‌ترین", rating: "بالاترین امتیاز" };
          const el = document.getElementById("rvSortChipLabel");
          if (el) el.textContent = labels[state.sort];
          render();
          if (isMobile()) UI.closeMobileMenu();
        });
      });

      document.querySelector("[data-clear-rv-sort]")?.addEventListener("click", function () {
        state.sort = "newest";
        const r = document.querySelector('input[name="rvSort"][value="newest"]');
        if (r) r.checked = true;
        const el = document.getElementById("rvSortChipLabel");
        if (el) el.textContent = "جدیدترین";
        render();
        if (isMobile()) UI.closeMobileMenu();
        else this.closest(".store-popup")?.classList.add("hidden");
        showToast("مرتب‌سازی بازنشانی شد.");
      });

      // Quick chips
      $$(".rv-quick-chip").forEach((chip) => {
        chip.addEventListener("click", function () {
          state.quick = this.dataset.rvQuick;

          $$(".rv-quick-chip").forEach((c) => {
            c.className = "rv-quick-chip h-9 shrink-0 rounded-full border border-[#ccc] bg-white px-4 text-[12px] text-[#434343]";
          });
          this.className = "rv-quick-chip h-9 shrink-0 rounded-full border border-[#aa4938] bg-[#fff8f6] px-4 text-[12px] font-medium text-[#aa4938]";

          render();
        });
      });

      // Clear rating
      document.querySelector("[data-clear-rv-rating]")?.addEventListener("click", function () {
        state.ratings.clear();
        $$(".rv-rating-checkbox").forEach((i) => (i.checked = false));
        updateChipLabels();
        render();
        if (isMobile()) UI.closeMobileMenu();
        else this.closest(".store-popup")?.classList.add("hidden");
        showToast("فیلتر امتیاز پاک شد.");
      });

      // Reply form
      document.getElementById("replyForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const text = document.getElementById("replyText")?.value.trim();
        if (!text) {
          showToast("متن پاسخ را وارد کنید.", "error");
          return;
        }
        if (state.currentReplyReview) {
          state.currentReplyReview.reply = {
            text,
            date: "۱۴۰۴/۰۴/۰۴",
            time: "اکنون",
          };
        }
        closeModal("replyModal");
        render();
        showToast("پاسخ ارسال شد.", "success");
      });

      // Close modal
      $$("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const modal = this.closest(".store-modal");
          if (modal) closeModal(modal.id);
        });
      });
      document.getElementById("replyModalBackdrop")?.addEventListener("click", () => closeModal("replyModal"));
    }

    UI.init();
    init();
  }
})();