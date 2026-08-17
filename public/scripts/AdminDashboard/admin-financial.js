// ============================================================
// admin-financial.js - موجودی و تسویه فروشنده
// ============================================================

import {
  $,
  $$,
  toFa,
  money,
  showToast,
  isMobile,
  openMobileMenu,
  closeMobileMenu,
  openModal,
  closeModal,
  renderPagination,
  openFilterDrawer,
  closeFilterDrawer,
  setupDropdownTriggers,
  setupSellerActions,
  setupMoreMenu,
  debounce,
} from "./admin-common.js";

// ===== Data =====
const financialCards = [
  { title: "مجموع مانده", amount: 120000000000 },
  { title: "قابل تسویه", amount: 120000000000 },
  { title: "مانده در انتظار", amount: 120000000000 },
];

const settlements = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  settlementId: "۱۲۳۴۵۶",
  requestDate: "۱۴۰۵/۱۲/۱۲",
  requestTime: "۱۴:۳۲",
  amount: 120000000,
  destination: "بانک ملت",
  accountNumber: "۶۱۰۴-۳۳۷۸-۱۲۳۴-۵۶۷۸",
  depositDate: "۱۴۰۵/۱۲/۱۲",
  depositTime: "۱۴:۳۲",
  status: index < 7 ? "paid" : index === 7 ? "pending" : "paid",
  description: "تسویه فروش محصولات و سهم فروشگاه",
}));

// ===== State =====
const state = {
  query: "",
  sort: "newest",
  statuses: new Set(),
  minAmount: null,
  maxAmount: null,
  currentPage: 1,
  pageSize: 10,
  dateFrom: null,
  dateTo: null,
};

// ===== Render Financial Cards =====
function renderFinancialCards() {
  const container = document.getElementById("financialCards");
  if (!container) return;

  container.innerHTML = financialCards
    .map(
      (card) => `
      <article class="rounded-[11px] border border-[#cfcfcf] px-5 py-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[14px] text-[#555]">${card.title}</p>
            <p class="mt-6 text-[18px] font-semibold">${money(
              card.amount
            )} <span class="text-[12px] font-normal">تومان</span></p>
          </div>
          <span class="grid h-9 w-9 place-items-center rounded-[5px] bg-[#f7f3f2] text-custom-brown">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
              <rect x="4" y="5" width="16" height="14" rx="2"/>
              <path stroke-linecap="round" d="M4 9h16M8 14h3"/>
            </svg>
          </span>
        </div>
      </article>
    `
    )
    .join("");
}

// ===== Filter Functions =====
function getFilteredSettlements() {
  let data = [...settlements];

  const q = state.query.trim();
  if (q) {
    data = data.filter(
      (item) =>
        item.settlementId.includes(q) ||
        item.destination.includes(q) ||
        item.accountNumber.includes(q) ||
        String(item.amount).includes(q)
    );
  }

  if (state.statuses.size) {
    data = data.filter((item) => state.statuses.has(item.status));
  }

  if (state.minAmount !== null) {
    data = data.filter((item) => item.amount >= state.minAmount);
  }
  if (state.maxAmount !== null) {
    data = data.filter((item) => item.amount <= state.maxAmount);
  }

  if (state.sort === "oldest") data.reverse();
  if (state.sort === "highest") data.sort((a, b) => b.amount - a.amount);
  if (state.sort === "lowest") data.sort((a, b) => a.amount - a.amount);

  return data;
}

function getPaginatedData(data) {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return data.slice(start, end);
}

// ===== Render Functions =====
function rowTemplate(item) {
  const statusMeta = {
    pending: {
      label: "در انتظار بررسی",
      classes: "bg-[#fff2d7] text-[#d98b15]",
    },
    paid: { label: "واریز شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
    rejected: { label: "رد شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
  };
  const meta = statusMeta[item.status] || statusMeta.pending;

  return `
    <tr class="h-[72px] border-b border-[#d7d7d7] last:border-b-0">
      <td class="px-5 text-right">${item.settlementId}</td>
      <td class="px-4 text-center leading-6">${item.requestDate}<br />${
    item.requestTime
  }</td>
      <td class="px-4 text-center">${money(item.amount)}</td>
      <td class="px-4 text-center">${item.destination}</td>
      <td class="px-4 text-center leading-6">${item.depositDate}<br />${
    item.depositTime
  }</td>
      <td class="px-4 text-center">
        <button data-id="${
          item.id
        }" class="detail-btn hover:text-custom-brown" aria-label="مشاهده جزئیات">
          <img class="rotate-90" src="../../../images/AdminDashboard/Seller/direction-down 01.svg">
        </button>
      </td>
    </tr>
  `;
}

function renderSettlements() {
  const filtered = getFilteredSettlements();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const paginated = getPaginatedData(filtered);

  const body = document.getElementById("settlementsBody");
  const emptyState = document.getElementById("emptyState");
  const table = document.getElementById("settlementsTable");

  if (body) {
    body.innerHTML = paginated.map(rowTemplate).join("");
  }
  if (emptyState) {
    emptyState.classList.toggle("hidden", paginated.length > 0);
  }
  if (table) {
    table.classList.toggle("hidden", paginated.length === 0);
  }

  const mobileList = document.getElementById("mobileSettlementList");
  if (mobileList) {
    if (paginated.length) {
      mobileList.innerHTML = paginated
        .map((item) => {
          const statusMeta = {
            pending: {
              label: "در انتظار بررسی",
              classes: "bg-[#fff2d7] text-[#d98b15]",
            },
            paid: {
              label: "واریز شده",
              classes: "bg-[#dcf6e8] text-[#16864a]",
            },
            rejected: {
              label: "رد شده",
              classes: "bg-[#fde3e3] text-[#c53a3a]",
            },
          };
          const meta = statusMeta[item.status] || statusMeta.pending;
          return `
            <div class="settlement-item p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <div class="settlement-title-mobile">شناسه: ${
                    item.settlementId
                  }</div>
                  <p class="text-[11px] text-[#888]">${item.destination}</p>
                </div>
                <button data-id="${
                  item.id
                }" class="detail-btn-mobile grid h-8 w-8 place-items-center rounded-md hover:bg-[#f1f1f1] text-[#555] hover:text-custom-brown text-xl" aria-label="مشاهده جزئیات"><img class="rotate-90" src="../../../images/AdminDashboard/Seller/direction-down 01.svg"></button>
              </div>
              <div class="grid grid-cols-1 gap-1">
                <div class="settlement-info-row">
                  <span class="label">تاریخ درخواست:</span>
                  <span class="value">${item.requestDate}</span>
                </div>
                <div class="settlement-info-row">
                  <span class="label">زمان:</span>
                  <span class="value">${item.requestTime}</span>
                </div>
                <div class="settlement-info-row">
                  <span class="label">مبلغ:</span>
                  <span class="value">${money(item.amount)} تومان</span>
                </div>
                <div class="settlement-info-row">
                  <span class="label">واریز:</span>
                  <span class="value">${item.depositDate}</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
      mobileList.classList.remove("hidden");
    } else {
      mobileList.innerHTML = `<div class="py-12 text-center text-sm text-[#777]">درخواست تسویه‌ای مطابق جست‌وجو یا فیلترها پیدا نشد.</div>`;
      mobileList.classList.remove("hidden");
    }
  }

  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    const hasFilter =
      state.query ||
      state.statuses.size ||
      state.minAmount !== null ||
      state.maxAmount !== null;
    resultCount.textContent = hasFilter ? toFa(totalItems) : "۱۲۳";
  }

  renderPagination(
    "paginationNumbers",
    state.currentPage,
    totalPages,
    (page) => {
      state.currentPage = page;
      renderSettlements();
    }
  );

  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  if (prevPage) {
    prevPage.disabled = state.currentPage <= 1;
    prevPage.classList.toggle("opacity-40", state.currentPage <= 1);
  }
  if (nextPage) {
    nextPage.disabled = state.currentPage >= totalPages;
    nextPage.classList.toggle("opacity-40", state.currentPage >= totalPages);
  }

  bindDetailButtons();
}

// ===== Detail Buttons =====
function bindDetailButtons() {
  $$(".detail-btn").forEach((btn) => {
    btn.removeEventListener("click", handleDetailClick);
    btn.addEventListener("click", handleDetailClick);
  });
  $$(".detail-btn-mobile").forEach((btn) => {
    btn.removeEventListener("click", handleDetailClick);
    btn.addEventListener("click", handleDetailClick);
  });
}

function handleDetailClick() {
  const id = Number(this.dataset.id);
  const item = settlements.find((row) => row.id === id);
  if (item) openSettlementDrawer(item);
}

// ===== Settlement Drawer =====
function openSettlementDrawer(item) {
  const drawerId = document.getElementById("drawerSettlementId");
  if (drawerId) drawerId.textContent = item.settlementId;

  const statusMeta = {
    pending: {
      label: "در انتظار بررسی",
      classes: "bg-[#fff2d7] text-[#d98b15]",
    },
    paid: { label: "واریز شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
    rejected: { label: "رد شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
  };
  const meta = statusMeta[item.status] || statusMeta.pending;

  const body = document.getElementById("settlementDrawerBody");
  if (body) {
    body.innerHTML = `
      <section class="rounded-[7px] bg-[#f5f5f5] px-4 py-[15px] text-center">
        <p class="text-[12px] text-[#777]">مبلغ تسویه</p>
        <p class="mt-2 text-[18px] font-semibold text-[#222]">${money(
          item.amount
        )} <span class="text-[13px] font-normal">تومان</span></p>
      </section>
      <section class="mt-[26px]">
        <h4 class="mb-[11px] text-[15px] font-semibold text-[#222]">اطلاعات تسویه</h4>
        <div class="overflow-hidden rounded-[7px] border border-[#d6d6d6] bg-white">
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>شناسه تسویه</span>
            <strong class="font-medium text-[#222]">${
              item.settlementId
            }</strong>
          </div>
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>تاریخ درخواست</span>
            <strong class="font-medium text-[#222]">${item.requestDate} - ${
      item.requestTime
    }</strong>
          </div>
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>وضعیت</span>
            <span class="rounded px-3 py-2 text-[12px] font-medium ${
              meta.classes
            }">${meta.label}</span>
          </div>
          <div class="flex items-center justify-between px-3 py-[11px]">
            <span>توضیحات</span>
            <strong class="max-w-[200px] text-left font-medium text-[#222]">${
              item.description
            }</strong>
          </div>
        </div>
      </section>
      <section class="mt-[27px]">
        <h4 class="mb-[11px] text-[15px] font-semibold text-[#222]">حساب مقصد</h4>
        <div class="overflow-hidden rounded-[7px] border border-[#d6d6d6] bg-white">
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>بانک</span>
            <strong class="font-medium text-[#222]">${item.destination}</strong>
          </div>
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>شماره حساب</span>
            <strong class="font-medium text-[#222]">${
              item.accountNumber
            }</strong>
          </div>
          <div class="flex items-center justify-between px-3 py-[11px]">
            <span>تاریخ واریز</span>
            <strong class="font-medium text-[#222]">${item.depositDate} - ${
      item.depositTime
    }</strong>
          </div>
        </div>
      </section>
      <div class="mt-7 flex gap-3">
        <button class="h-11 flex-1 rounded-lg bg-custom-brown text-white">دانلود رسید</button>
        <button class="h-11 flex-1 rounded-lg border border-custom-brown text-custom-brown hover:bg-[#fbf2ef]">چاپ جزئیات</button>
      </div>
    `;
  }

  const backdrop = document.getElementById("settlementBackdrop");
  const drawer = document.getElementById("settlementDrawer");
  if (backdrop) backdrop.classList.remove("hidden");
  if (drawer) drawer.classList.remove("-translate-x-full");
  document.body.classList.add("overflow-hidden");
}

function closeSettlementDrawer() {
  const backdrop = document.getElementById("settlementBackdrop");
  const drawer = document.getElementById("settlementDrawer");
  if (backdrop) backdrop.classList.add("hidden");
  if (drawer) drawer.classList.add("-translate-x-full");
  document.body.classList.remove("overflow-hidden");
}

// ===== Sync Filters =====
function syncFilters() {
  $$("[data-status-filter]").forEach((el) => {
    el.checked = state.statuses.has(el.value);
  });
  $$("[data-drawer-status]").forEach((el) => {
    el.checked = state.statuses.has(el.value);
  });
}

// ===== Financial Adjustment Modal =====
function openFinancialAdjustmentModal() {
  const formHTML = `
    <form id="adjustmentForm" class="space-y-4">
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">نوع اصلاح</span>
        <select id="adjustmentType" class="h-11 w-full rounded-lg border border-[#c9c9c9] bg-white px-3 text-[14px]">
          <option value="increase">افزایش موجودی</option>
          <option value="decrease">کاهش موجودی</option>
        </select>
      </label>
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">مبلغ اصلاح</span>
        <input id="adjustmentAmount" inputmode="numeric" placeholder="مبلغ به تومان" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
      </label>
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">دلیل اصلاح</span>
        <textarea id="adjustmentReason" rows="4" placeholder="توضیحات اصلاح مالی" class="w-full rounded-lg border border-[#c9c9c9] px-3 py-3 text-[14px]"></textarea>
      </label>
      <button type="submit" class="h-11 w-full rounded-lg bg-custom-brown text-white">ثبت اصلاح مالی</button>
    </form>
  `;

  openModal("ثبت اصلاح مالی", formHTML);

  const form = document.getElementById("adjustmentForm");
  if (form) {
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      closeModal();
      showToast("اصلاح مالی با موفقیت ثبت شد.");
    });
  }
}

// ===== Init =====
function init() {
  setupSellerActions(
    "approveBtn",
    "rejectBtn",
    "statusBadge",
    "completionLabel"
  );
  setupMoreMenu("moreBtn", "moreMenu");
  setupDropdownTriggers();

  renderFinancialCards();

  const adjustBtn = document.getElementById("financialAdjustmentBtn");
  if (adjustBtn) {
    adjustBtn.addEventListener("click", openFinancialAdjustmentModal);
  }

  const closeModalBtn = document.getElementById("closeModalBtn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => closeModal());
  }
  const overlay = document.getElementById("modalOverlay");
  if (overlay) {
    overlay.addEventListener("click", () => closeModal());
  }

  const periodBtn = document.getElementById("periodBtn");
  const periodMenu = document.getElementById("periodMenu");
  if (periodBtn && periodMenu) {
    periodBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      periodMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll("[data-period]").forEach((button) => {
    button.addEventListener("click", function () {
      const periodLabel = document.getElementById("periodLabel");
      if (periodLabel) periodLabel.textContent = this.dataset.period;
      const menu = document.getElementById("periodMenu");
      if (menu) menu.classList.add("hidden");
      showToast("بازه خلاصه مالی تغییر کرد.");
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(function () {
        state.query = this.value;
        state.currentPage = 1;
        renderSettlements();
      })
    );
  }

  document
    .querySelector("[data-clear-sort]")
    ?.addEventListener("click", function () {
      state.sort = "newest";
      document.querySelector(
        'input[name="sort"][value="newest"]'
      ).checked = true;
      state.currentPage = 1;
      const labels = {
        newest: "مرتب‌سازی: جدیدترین درخواست تسویه",
        oldest: "مرتب‌سازی: قدیمی‌ترین درخواست تسویه",
        highest: "مرتب‌سازی: بیشترین مبلغ",
        lowest: "مرتب‌سازی: کمترین مبلغ",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      renderSettlements();
      if (isMobile()) closeMobileMenu();
      showToast("مرتب‌سازی به حالت پیش‌فرض بازگشت.");
    });

  $$('input[name="sort"]').forEach((r) => {
    r.addEventListener("change", function () {
      state.sort = this.value;
      state.currentPage = 1;
      const labels = {
        newest: "مرتب‌سازی: جدیدترین درخواست تسویه",
        oldest: "مرتب‌سازی: قدیمی‌ترین درخواست تسویه",
        highest: "مرتب‌سازی: بیشترین مبلغ",
        lowest: "مرتب‌سازی: کمترین مبلغ",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      if (isMobile()) closeMobileMenu();
      renderSettlements();
    });
  });

  $$("[data-status-filter]").forEach((el) => {
    el.addEventListener("change", function () {
      if (this.checked) state.statuses.add(this.value);
      else state.statuses.delete(this.value);
      state.currentPage = 1;
      syncFilters();
      renderSettlements();
    });
  });

  document
    .querySelector('[data-clear="status"]')
    ?.addEventListener("click", function () {
      state.statuses.clear();
      state.currentPage = 1;
      syncFilters();
      renderSettlements();
      if (isMobile()) closeMobileMenu();
      showToast("فیلتر وضعیت پاک شد.");
    });

  document
    .getElementById("applyDateFilter")
    ?.addEventListener("click", function () {
      if (isMobile()) closeMobileMenu();
      document.getElementById("dateMenu")?.classList.add("hidden");
      showToast("بازه زمانی اعمال شد.");
    });

  document
    .getElementById("clearDateFilter")
    ?.addEventListener("click", function () {
      const dateFrom = document.getElementById("dateFrom");
      const dateTo = document.getElementById("dateTo");
      if (dateFrom) dateFrom.value = "";
      if (dateTo) dateTo.value = "";
      if (isMobile()) closeMobileMenu();
      document.getElementById("dateMenu")?.classList.add("hidden");
      showToast("فیلتر بازه زمانی حذف شد.");
    });

  document
    .getElementById("applyAmountFilter")
    ?.addEventListener("click", function () {
      const minInput = document.getElementById("minAmount");
      const maxInput = document.getElementById("maxAmount");
      const min = minInput?.value.replace(/[^\d]/g, "") || "";
      const max = maxInput?.value.replace(/[^\d]/g, "") || "";
      state.minAmount = min ? Number(min) : null;
      state.maxAmount = max ? Number(max) : null;
      state.currentPage = 1;
      if (isMobile()) closeMobileMenu();
      document.getElementById("amountMenu")?.classList.add("hidden");
      renderSettlements();
      showToast("فیلتر مبلغ اعمال شد.");
    });

  document
    .getElementById("clearAmountFilter")
    ?.addEventListener("click", function () {
      const minInput = document.getElementById("minAmount");
      const maxInput = document.getElementById("maxAmount");
      if (minInput) minInput.value = "";
      if (maxInput) maxInput.value = "";
      state.minAmount = null;
      state.maxAmount = null;
      state.currentPage = 1;
      if (isMobile()) closeMobileMenu();
      document.getElementById("amountMenu")?.classList.add("hidden");
      renderSettlements();
      showToast("فیلتر مبلغ حذف شد.");
    });

  const filterBtn = document.getElementById("filterBtn");
  const filterBtnMobile = document.getElementById("filterBtnMobile");
  if (filterBtn) filterBtn.addEventListener("click", openFilterDrawer);
  if (filterBtnMobile)
    filterBtnMobile.addEventListener("click", openFilterDrawer);

  const closeDrawer = document.getElementById("closeDrawer");
  if (closeDrawer) closeDrawer.addEventListener("click", closeFilterDrawer);

  const backdrop = document.getElementById("drawerBackdrop");
  if (backdrop) backdrop.addEventListener("click", closeFilterDrawer);

  document
    .getElementById("clearAllFilters")
    ?.addEventListener("click", function () {
      $$("[data-drawer-status]").forEach((input) => (input.checked = false));
      const drawerMin = document.getElementById("drawerMinAmount");
      const drawerMax = document.getElementById("drawerMaxAmount");
      const drawerDateFrom = document.getElementById("drawerDateFrom");
      const drawerDateTo = document.getElementById("drawerDateTo");
      if (drawerMin) drawerMin.value = "";
      if (drawerMax) drawerMax.value = "";
      if (drawerDateFrom) drawerDateFrom.value = "";
      if (drawerDateTo) drawerDateTo.value = "";
      state.statuses.clear();
      state.minAmount = null;
      state.maxAmount = null;
      state.currentPage = 1;
      syncFilters();
      renderSettlements();
      showToast("همه فیلترها پاک شدند.");
    });

  document
    .getElementById("applyDrawerFilters")
    ?.addEventListener("click", function () {
      state.statuses = new Set(
        [...$$("[data-drawer-status]:checked")].map((input) => input.value)
      );

      const minInput = document.getElementById("drawerMinAmount");
      const maxInput = document.getElementById("drawerMaxAmount");
      const min = minInput?.value.replace(/[^\d]/g, "") || "";
      const max = maxInput?.value.replace(/[^\d]/g, "") || "";
      state.minAmount = min ? Number(min) : null;
      state.maxAmount = max ? Number(max) : null;
      state.currentPage = 1;

      syncFilters();
      renderSettlements();
      closeFilterDrawer();
      showToast("فیلترها اعمال شدند.");
    });

  document
    .getElementById("closeSettlementDrawer")
    ?.addEventListener("click", closeSettlementDrawer);
  document
    .getElementById("settlementBackdrop")
    ?.addEventListener("click", closeSettlementDrawer);

  document.getElementById("prevPage")?.addEventListener("click", function () {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderSettlements();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", function () {
    const totalItems = getFilteredSettlements().length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderSettlements();
    }
  });

  document.getElementById("pageSize")?.addEventListener("change", function () {
    state.pageSize = parseInt(this.value, 10);
    state.currentPage = 1;
    renderSettlements();
  });

  document.addEventListener("click", function (e) {
    if (!isMobile()) {
      if (
        !e.target.closest(".dropdown-trigger") &&
        !e.target.closest(".dropdown-menu")
      ) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.add("hidden");
        });
      }
    }
    if (!e.target.closest("#periodBtn") && !e.target.closest("#periodMenu")) {
      if (periodMenu) periodMenu.classList.add("hidden");
    }
    if (!e.target.closest("#moreBtn") && !e.target.closest("#moreMenu")) {
      const moreMenu = document.getElementById("moreMenu");
      if (moreMenu) moreMenu.classList.add("hidden");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isMobile()) closeMobileMenu();
      closeFilterDrawer();
      closeSettlementDrawer();
      closeModal();
      if (periodMenu) periodMenu.classList.add("hidden");
      const moreMenu = document.getElementById("moreMenu");
      if (moreMenu) moreMenu.classList.add("hidden");
    }
  });

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (
        !isMobile() &&
        document.querySelector(".dropdown-menu.mobile-bottom.open")
      ) {
        closeMobileMenu();
      }
    }, 200);
  });

  renderSettlements();
}

document.addEventListener("DOMContentLoaded", init);
