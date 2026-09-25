// ============================================================
// store-product-detail.js - JS مشترک صفحات جزئیات محصول
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) {
      console.error("[ProductDetail] StoreUI یافت نشد");
      return;
    }

    const {
      $, $$, toFa, money, showToast, isMobile,
      openModal, closeModal,
      openMobileMenu, closeMobileMenu,
      renderPagination, debounce,
    } = UI;

    // ============================================================
    // تشخیص صفحه فعلی
    // ============================================================
    const page = detectPage();
    console.log("[ProductDetail] صفحه:", page);

    // ============================================================
    // INIT StoreUI
    // ============================================================
    UI.init();

    // ============================================================
    // دکمه بازگشت
    // ============================================================
    document.querySelectorAll("[data-store-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = "StoreDashboard_ProductsList.html";
      });
    });

    // ============================================================
    // اجرای منطق هر صفحه
    // ============================================================
    if (page === "info") initInfo();
    if (page === "orders") initOrders();
    if (page === "reviews") initReviews();
    if (page === "messages") initMessages();

    // ============================================================
    // پیاده‌سازی هر صفحه
    // ============================================================

    // ---------- INFO ----------
    function initInfo() {
      // گالری
      const thumbs = $$(".product-thumb");
      const mainImage = document.getElementById("mainProductImage");

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", function () {
          thumbs.forEach((t) => {
            t.classList.remove("border-[#aa4938]");
            t.classList.add("border-transparent");
          });
          this.classList.remove("border-transparent");
          this.classList.add("border-[#aa4938]");

          if (mainImage && this.dataset.src) {
            mainImage.src = this.dataset.src;
          }
        });
      });

      // Modal تغییر موجودی
      document.getElementById("changeStockBtn")?.addEventListener("click", () => {
        openModal("stockModal", "stockModalBackdrop");
      });

      document.querySelector("[data-save-stock]")?.addEventListener("click", function () {
        const val = document.getElementById("stockInput")?.value;
        if (!val || !val.trim()) {
          showToast("موجودی جدید را وارد کنید.", "error");
          return;
        }
        closeModal("stockModal");
        showToast("موجودی محصول به‌روزرسانی شد.", "success");
      });

      // Modal تغییر وضعیت انتشار
      document.getElementById("changePublishBtn")?.addEventListener("click", () => {
        openModal("publishModal", "publishModalBackdrop");
      });

      document.getElementById("publishForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        closeModal("publishModal");
        showToast("وضعیت انتشار تغییر کرد.", "success");
      });

      // ویرایش
      document.getElementById("editProductBtn")?.addEventListener("click", () => {
        showToast("صفحه ویرایش محصول باز می‌شود.", "info");
      });

      // دکمه‌های بستن Modal
      bindModalCloseButtons();
    }

    // ---------- ORDERS ----------
    function initOrders() {
      const orders = [
        { id: 1, orderNo: "۱۲۳۳۴۶۷", date: "۱۴۰۴/۰۴/۰۴", amount: 125000000, qty: 125, status: "pending" },
        { id: 2, orderNo: "۱۲۳۳۴۶۸", date: "۱۴۰۴/۰۴/۰۴", amount: 125000000, qty: 125, status: "preparing" },
        { id: 3, orderNo: "۱۲۳۳۴۶۹", date: "۱۴۰۴/۰۴/۰۳", amount: 125000000, qty: 125, status: "preparing" },
        { id: 4, orderNo: "۱۲۳۳۴۷۰", date: "۱۴۰۴/۰۴/۰۳", amount: 125000000, qty: 125, status: "shipped" },
        { id: 5, orderNo: "۱۲۳۳۴۷۱", date: "۱۴۰۴/۰۴/۰۲", amount: 125000000, qty: 125, status: "shipped" },
        { id: 6, orderNo: "۱۲۳۳۴۷۲", date: "۱۴۰۴/۰۴/۰۲", amount: 125000000, qty: 125, status: "completed" },
        { id: 7, orderNo: "۱۲۳۳۴۷۳", date: "۱۴۰۴/۰۴/۰۱", amount: 125000000, qty: 125, status: "cancelled" },
        { id: 8, orderNo: "۱۲۳۳۴۷۴", date: "۱۴۰۴/۰۴/۰۱", amount: 125000000, qty: 125, status: "pending" },
      ];

      const statusMeta = {
        pending: { label: "در انتظار بررسی", classes: "bg-[#fff2d7] text-[#d98b15]" },
        preparing: { label: "در حال آماده‌سازی", classes: "bg-[#dcecff] text-[#2b78c5]" },
        shipped: { label: "ارسال شد", classes: "bg-[#dcf6e8] text-[#16864a]" },
        completed: { label: "تکمیل شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
        cancelled: { label: "لغو شد", classes: "bg-[#fde3e3] text-[#c53a3a]" },
      };

      const state = {
        sort: "newest",
        statuses: new Set(),
        currentPage: 1,
        pageSize: 10,
      };

      function getFiltered() {
        let data = [...orders];
        if (state.statuses.size) {
          data = data.filter((o) => state.statuses.has(o.status));
        }
        if (state.sort === "oldest") data.reverse();
        if (state.sort === "highest") data.sort((a, b) => b.amount - a.amount);
        if (state.sort === "lowest") data.sort((a, b) => a.amount - b.amount);
        return data;
      }

      function badge(status) {
        const meta = statusMeta[status] || statusMeta.pending;
        return `<span class="inline-flex rounded-[4px] px-2.5 py-1 text-[11px] font-medium ${meta.classes}">${meta.label}</span>`;
      }

      function rowTemplate(o) {
        return `
          <tr class="h-[68px] border-b border-[#ececec] last:border-b-0">
            <td class="px-5 text-right font-medium">${o.orderNo}</td>
            <td class="px-5 text-right">${o.date}</td>
            <td class="px-5 text-right">${money(o.amount)}</td>
            <td class="px-5 text-right">${toFa(o.qty)}</td>
            <td class="px-5">${badge(o.status)}</td>
            <td class="px-5 text-left">
              <button type="button" class="text-[11px] font-medium text-[#aa4938] hover:underline" data-view-order="${o.id}">
                جزئیات
              </button>
            </td>
          </tr>
        `;
      }

      function cardTemplate(o) {
        return `
          <div class="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
            <div class="mb-3 flex items-center justify-between gap-2">
              <b class="text-[13px]">${o.orderNo}</b>
              ${badge(o.status)}
            </div>
            <div class="space-y-1.5 text-[12px]">
              <div class="flex justify-between"><span class="text-[#888]">تاریخ:</span><b>${o.date}</b></div>
              <div class="flex justify-between"><span class="text-[#888]">مبلغ:</span><b>${money(o.amount)} تومان</b></div>
              <div class="flex justify-between"><span class="text-[#888]">مقدار:</span><b>${toFa(o.qty)} واحد</b></div>
            </div>
            <button type="button" class="mt-3 w-full rounded-[7px] border border-[#aa4938] py-2 text-[12px] font-medium text-[#aa4938] hover:bg-[#fbf2ef]"
              data-view-order="${o.id}">
              مشاهده جزئیات
            </button>
          </div>
        `;
      }

      function render() {
        const filtered = getFiltered();
        const total = filtered.length;
        const totalPages = Math.ceil(total / state.pageSize) || 1;
        if (state.currentPage > totalPages) state.currentPage = totalPages;

        const start = (state.currentPage - 1) * state.pageSize;
        const paginated = filtered.slice(start, start + state.pageSize);

        const rows = document.getElementById("ordersRows");
        const cards = document.getElementById("ordersCards");
        const empty = document.getElementById("ordersEmpty");
        const count = document.getElementById("ordersCount");

        if (rows) rows.innerHTML = paginated.map(rowTemplate).join("");
        if (cards) cards.innerHTML = paginated.map(cardTemplate).join("");
        if (empty) empty.classList.toggle("hidden", paginated.length > 0);
        if (count) count.textContent = toFa(total);

        renderPagination("ordersPagination", state.currentPage, totalPages, (p) => {
          state.currentPage = p;
          render();
        });

        $$("[data-view-order]").forEach((btn) => {
          btn.addEventListener("click", function () {
            showToast("صفحه جزئیات سفارش باز می‌شود.", "info");
          });
        });
      }

      // صفحه‌بندی
      document.getElementById("ordersPageSize")?.addEventListener("change", function () {
        state.pageSize = parseInt(this.value, 10);
        state.currentPage = 1;
        render();
      });

      render();
    }

    // ---------- REVIEWS ----------
    function initReviews() {
      // فعلاً static — دکمه‌های «پاسخ» و «بیشتر»
      $$("[data-review-action]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const action = this.dataset.reviewAction;
          if (action === "reply") showToast("فرم پاسخ باز می‌شود.", "info");
          else if (action === "more") showToast("گزینه‌های بیشتر...", "info");
        });
      });
    }

    // ---------- MESSAGES ----------
    function initMessages() {
      const form = document.getElementById("productChatForm");
      const input = document.getElementById("productChatInput");

      form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = input?.value.trim();
        if (!text) return;

        // اضافه کردن پیام
        const container = form.previousElementSibling;
        if (container) {
          const msg = document.createElement("div");
          msg.className = "flex justify-end";
          msg.innerHTML = `
            <div class="max-w-[75%] rounded-[14px] rounded-tl-none border border-[#e5e5e5] bg-white px-4 py-3 shadow-sm">
              <p class="text-[12px] leading-6 text-[#333]">${text}</p>
              <div class="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#999]">
                <span>اکنون</span>
                <svg class="h-3.5 w-3.5 text-blue-500"><use href="#icon-double-check"></use></svg>
              </div>
            </div>
          `;
          container.appendChild(msg);
          container.scrollTop = container.scrollHeight;
        }

        input.value = "";
        showToast("پیام ارسال شد.", "success", 1500);
      });
    }

    // ---------- UTILS ----------
    function bindModalCloseButtons() {
      $$("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const modal = this.closest(".store-modal");
          if (modal) closeModal(modal.id);
        });
      });

      document.getElementById("stockModalBackdrop")?.addEventListener("click", () => closeModal("stockModal"));
      document.getElementById("publishModalBackdrop")?.addEventListener("click", () => closeModal("publishModal"));
    }

    function detectPage() {
      const path = location.pathname;
      if (path.includes("ProductDetail_Info")) return "info";
      if (path.includes("ProductDetail_Orders")) return "orders";
      if (path.includes("ProductDetail_Reviews")) return "reviews";
      if (path.includes("ProductDetail_Messages")) return "messages";
      return "info";
    }
  }
})();