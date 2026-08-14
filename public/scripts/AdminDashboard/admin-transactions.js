// ============================================================
// admin-transactions.js - تراکنش‌های فروشنده
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
  renderPagination,
  openFilterDrawer,
  closeFilterDrawer,
  setupDropdownTriggers,
  setupSellerActions,
  setupMoreMenu,
  debounce,
} from "./admin-common.js";

// ===== Data =====
const transactions = [
  {
    id: 1,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 2,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 3,
    type: "refund",
    title: "بازگشت وجه",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 4,
    type: "adjustment",
    title: "اصلاح حساب",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 5,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 6,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 7,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 8,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 9,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
  {
    id: 10,
    type: "sale",
    title: "فروش سفارش",
    orderNo: "شماره سفارش",
    date: "۱۴۰۵/۱۲/۱۲",
    time: "۱۴:۳۲",
    buyer: "نام خریدار",
    sale: 120000000,
    sellerShare: 108000000,
    platformShare: 12000000,
    transactionId: "۱۲۳۴۵۶",
    buyerInfo: "اطلاعات خریدار",
    stores: [
      {
        name: "نام فروشگاه",
        sale: 120000000,
        commission: 12000000,
        share: 108000000,
      },
    ],
  },
];

const summaryCards = [
  { title: "مجموع فروش", amount: 120000000 },
  { title: "مجموع کارمزد", amount: 12000000 },
  { title: "سهم فروشگاه", amount: 108000000 },
  { title: "تعداد تراکنش", amount: 123 },
];

// ===== State =====
const state = {
  query: "",
  sort: "newest",
  types: new Set(),
  buyers: new Set(),
  minAmount: null,
  maxAmount: null,
  currentPage: 1,
  pageSize: 10,
};

// ===== Render Summary =====
function renderSummaryCards() {
  const container = document.getElementById("summaryCards");
  if (!container) return;

  container.innerHTML = summaryCards
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
function getFilteredTransactions() {
  let data = [...transactions];

  const q = state.query.trim();
  if (q) {
    data = data.filter(
      (item) =>
        item.title.includes(q) ||
        item.orderNo.includes(q) ||
        item.buyer.includes(q) ||
        String(item.sale).includes(q)
    );
  }

  if (state.types.size) {
    data = data.filter((item) => state.types.has(item.type));
  }

  if (state.buyers.size) {
    data = data.filter((item) => state.buyers.has(item.buyer));
  }

  if (state.minAmount !== null) {
    data = data.filter((item) => item.sale >= state.minAmount);
  }
  if (state.maxAmount !== null) {
    data = data.filter((item) => item.sale <= state.maxAmount);
  }

  if (state.sort === "oldest") data.reverse();
  if (state.sort === "highest") data.sort((a, b) => b.sale - a.sale);
  if (state.sort === "lowest") data.sort((a, b) => a.sale - b.sale);

  return data;
}

function getPaginatedData(data) {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return data.slice(start, end);
}

// ===== Render Functions =====
function rowTemplate(item) {
  const typeLabels = {
    sale: "فروش سفارش",
    refund: "بازگشت وجه",
    adjustment: "اصلاح حساب",
  };
  return `
    <tr class="h-[72px] border-b border-[#d7d7d7] last:border-b-0">
      <td class="px-5">
        <p class="font-medium">${typeLabels[item.type] || item.title}</p>
        <p class="mt-1 text-[11px] text-[#888]">${item.orderNo}</p>
      </td>
      <td class="px-4 text-center leading-6">
        <span>${item.date}</span><br />
        <span>${item.time}</span>
      </td>
      <td class="px-4 text-center">${item.buyer}</td>
      <td class="px-4 text-center">${money(item.sale)}</td>
      <td class="px-4 text-center">${money(item.sellerShare)}</td>
      <td class="px-4 text-center">${money(item.platformShare)}</td>
      <td class="px-4 text-center">
        <button data-id="${
          item.id
        }" class="detail-btn text-xl leading-none text-[#555] hover:text-custom-brown" aria-label="مشاهده جزئیات">‹</button>
      </td>
    </tr>
  `;
}

function renderTransactions() {
  const filtered = getFilteredTransactions();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const paginated = getPaginatedData(filtered);

  const body = document.getElementById("transactionsBody");
  const emptyState = document.getElementById("emptyState");
  const table = document.getElementById("transactionsTable");

  if (body) {
    body.innerHTML = paginated.map(rowTemplate).join("");
  }
  if (emptyState) {
    emptyState.classList.toggle("hidden", paginated.length > 0);
  }
  if (table) {
    table.classList.toggle("hidden", paginated.length === 0);
  }

  const mobileList = document.getElementById("mobileTransactionList");
  if (mobileList) {
    if (paginated.length) {
      mobileList.innerHTML = paginated
        .map((item) => {
          const typeLabels = {
            sale: "فروش سفارش",
            refund: "بازگشت وجه",
            adjustment: "اصلاح حساب",
          };
          return `
            <div class="transaction-item p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <div class="transaction-title-mobile">${
                    typeLabels[item.type] || item.title
                  }</div>
                  <p class="text-[11px] text-[#888]">${item.orderNo}</p>
                </div>
                <button data-id="${
                  item.id
                }" class="detail-btn-mobile grid h-8 w-8 place-items-center rounded-md hover:bg-[#f1f1f1] text-[#555] hover:text-custom-brown text-xl" aria-label="مشاهده جزئیات">‹</button>
              </div>
              <div class="grid grid-cols-2 gap-1">
                <div class="transaction-info-row">
                  <span class="label">تاریخ:</span>
                  <span class="value">${item.date}</span>
                </div>
                <div class="transaction-info-row">
                  <span class="label">زمان:</span>
                  <span class="value">${item.time}</span>
                </div>
                <div class="transaction-info-row">
                  <span class="label">خریدار:</span>
                  <span class="value">${item.buyer}</span>
                </div>
                <div class="transaction-info-row">
                  <span class="label">مبلغ فروش:</span>
                  <span class="value">${money(item.sale)} تومان</span>
                </div>
                <div class="transaction-info-row">
                  <span class="label">سهم فروشگاه:</span>
                  <span class="value">${money(item.sellerShare)} تومان</span>
                </div>
                <div class="transaction-info-row">
                  <span class="label">سهم آجروک:</span>
                  <span class="value">${money(item.platformShare)} تومان</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
      mobileList.classList.remove("hidden");
    } else {
      mobileList.innerHTML = `<div class="py-12 text-center text-sm text-[#777]">تراکنشی مطابق جست‌وجو یا فیلترها پیدا نشد.</div>`;
      mobileList.classList.remove("hidden");
    }
  }

  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    const hasFilter =
      state.query ||
      state.types.size ||
      state.buyers.size ||
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
      renderTransactions();
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
  const item = transactions.find((row) => row.id === id);
  if (item) openTransactionDrawer(item);
}

// ===== Transaction Drawer =====
function calculationRows(item) {
  return `
    <div class="overflow-hidden rounded-[7px] border border-[#d6d6d6] bg-white">
      <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
        <span>مبلغ فروش</span>
        <strong class="font-medium text-[#222]">${money(
          item.sale
        )} تومان</strong>
      </div>
      <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
        <span>کارمزد آجروک <small class="mr-1 text-[11px] text-[#8b8b8b]">۱۰٪</small></span>
        <strong class="font-medium text-[#222]">${money(
          item.platformShare
        )} تومان</strong>
      </div>
      <div class="flex items-center justify-between px-3 py-[11px]">
        <span>سهم فروشگاه</span>
        <strong class="font-medium text-[#222]">${money(
          item.sellerShare
        )} تومان</strong>
      </div>
    </div>
  `;
}

function storeCards(item) {
  const stores = item.stores || [
    {
      name: "نام فروشگاه",
      sale: item.sale,
      commission: item.platformShare,
      share: item.sellerShare,
    },
  ];
  return stores
    .map(
      (store) => `
      <article class="border-b border-[#d6d6d6] px-3 py-[13px] last:border-b-0">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-[#777]">نام فروشگاه</span>
          <strong class="font-medium text-[#222]">${store.name}</strong>
        </div>
        <div class="space-y-[8px]">
          <div class="flex items-center justify-between">
            <span>مبلغ فروش</span>
            <strong class="font-medium text-[#222]">${money(
              store.sale
            )} تومان</strong>
          </div>
          <div class="flex items-center justify-between">
            <span>کارمزد آجروک</span>
            <strong class="font-medium text-[#222]">${money(
              store.commission
            )} تومان</strong>
          </div>
          <div class="flex items-center justify-between">
            <span>سهم فروشگاه</span>
            <strong class="font-medium text-[#222]">${money(
              store.share
            )} تومان</strong>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function openTransactionDrawer(item) {
  const drawerId = document.getElementById("drawerTransactionId");
  if (drawerId) drawerId.textContent = item.orderNo;

  const body = document.getElementById("transactionDrawerBody");
  if (body) {
    body.innerHTML = `
      <section class="rounded-[7px] bg-[#f5f5f5] px-4 py-[15px] text-center">
        <p class="text-[12px] text-[#777]">مبلغ تراکنش</p>
        <p class="mt-2 text-[18px] font-semibold text-[#222]">${money(
          item.sale
        )} <span class="text-[13px] font-normal">تومان</span></p>
      </section>
      <section class="mt-[26px]">
        <h4 class="mb-[11px] text-[15px] font-semibold text-[#222]">جزئیات محاسبه</h4>
        ${calculationRows(item)}
      </section>
      <section class="mt-[27px]">
        <h4 class="mb-[11px] text-[15px] font-semibold text-[#222]">اطلاعات تراکنش</h4>
        <div class="overflow-hidden rounded-[7px] border border-[#d6d6d6] bg-white">
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>شماره سفارش</span>
            <strong class="font-medium text-[#222]">${item.orderNo}</strong>
          </div>
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>زمان ثبت</span>
            <strong class="font-medium text-[#222]">${item.date} - ${
      item.time
    }</strong>
          </div>
          <div class="flex items-center justify-between border-b border-[#d6d6d6] px-3 py-[11px]">
            <span>شناسه تراکنش</span>
            <strong class="font-medium text-[#222]">${
              item.transactionId || "۱۲۳۴۵۶"
            }</strong>
          </div>
          <div class="flex items-center justify-between px-3 py-[11px]">
            <span>اطلاعات خریدار</span>
            <strong class="font-medium text-[#222]">${
              item.buyerInfo || item.buyer
            }</strong>
          </div>
        </div>
      </section>
      <section class="mt-[27px]">
        <h4 class="mb-[11px] text-[15px] font-semibold text-[#222]">اطلاعات به تفکیک فروشگاه</h4>
        <div class="overflow-hidden rounded-[7px] border border-[#d6d6d6] bg-white">${storeCards(
          item
        )}</div>
      </section>
    `;
  }

  const backdrop = document.getElementById("transactionBackdrop");
  const drawer = document.getElementById("transactionDrawer");
  if (backdrop) backdrop.classList.remove("hidden");
  if (drawer) drawer.classList.remove("-translate-x-full");
  document.body.classList.add("overflow-hidden");
}

function closeTransactionDrawer() {
  const backdrop = document.getElementById("transactionBackdrop");
  const drawer = document.getElementById("transactionDrawer");
  if (backdrop) backdrop.classList.add("hidden");
  if (drawer) drawer.classList.add("-translate-x-full");
  document.body.classList.remove("overflow-hidden");
}

// ===== Sync Filters =====
function syncFilters() {
  $$("[data-type-filter]").forEach((el) => {
    el.checked = state.types.has(el.value);
  });
  $$("[data-drawer-type]").forEach((el) => {
    el.checked = state.types.has(el.value);
  });
  $$("[data-buyer-filter]").forEach((el) => {
    el.checked = state.buyers.has(el.value);
  });
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

  renderSummaryCards();

  const monthBtn = document.getElementById("monthBtn");
  const monthMenu = document.getElementById("monthMenu");
  if (monthBtn && monthMenu) {
    monthBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      monthMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll("[data-period]").forEach((button) => {
    button.addEventListener("click", function () {
      const labels = {
        month: "این ماه",
        "last-month": "ماه گذشته",
        quarter: "سه ماه اخیر",
        year: "امسال",
      };
      if (monthBtn)
        monthBtn.childNodes[2].textContent = labels[this.dataset.period];
      if (monthMenu) monthMenu.classList.add("hidden");
      showToast("بازه خلاصه تراکنش‌ها تغییر کرد.");
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(function () {
        state.query = this.value;
        state.currentPage = 1;
        renderTransactions();
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
        newest: "مرتب‌سازی: جدیدترین تراکنش",
        oldest: "مرتب‌سازی: قدیمی‌ترین تراکنش",
        highest: "مرتب‌سازی: بیشترین مبلغ فروش",
        lowest: "مرتب‌سازی: کمترین مبلغ فروش",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      renderTransactions();
      if (isMobile()) closeMobileMenu();
      showToast("مرتب‌سازی به حالت پیش‌فرض بازگشت.");
    });

  $$('input[name="sort"]').forEach((r) => {
    r.addEventListener("change", function () {
      state.sort = this.value;
      state.currentPage = 1;
      const labels = {
        newest: "مرتب‌سازی: جدیدترین تراکنش",
        oldest: "مرتب‌سازی: قدیمی‌ترین تراکنش",
        highest: "مرتب‌سازی: بیشترین مبلغ فروش",
        lowest: "مرتب‌سازی: کمترین مبلغ فروش",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      if (isMobile()) closeMobileMenu();
      renderTransactions();
    });
  });

  $$("[data-type-filter]").forEach((el) => {
    el.addEventListener("change", function () {
      if (this.checked) state.types.add(this.value);
      else state.types.delete(this.value);
      state.currentPage = 1;
      syncFilters();
      renderTransactions();
    });
  });

  $$("[data-buyer-filter]").forEach((el) => {
    el.addEventListener("change", function () {
      if (this.checked) state.buyers.add(this.value);
      else state.buyers.delete(this.value);
      state.currentPage = 1;
      syncFilters();
      renderTransactions();
    });
  });

  document
    .querySelector('[data-clear="type"]')
    ?.addEventListener("click", function () {
      state.types.clear();
      state.currentPage = 1;
      syncFilters();
      renderTransactions();
      if (isMobile()) closeMobileMenu();
      showToast("فیلتر نوع تراکنش پاک شد.");
    });

  document
    .querySelector('[data-clear="buyer"]')
    ?.addEventListener("click", function () {
      state.buyers.clear();
      state.currentPage = 1;
      syncFilters();
      renderTransactions();
      if (isMobile()) closeMobileMenu();
      showToast("فیلتر خریدار پاک شد.");
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
      renderTransactions();
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
      renderTransactions();
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
      $$("[data-drawer-type]").forEach((input) => (input.checked = false));
      const minInput = document.getElementById("drawerMinAmount");
      const maxInput = document.getElementById("drawerMaxAmount");
      const dateFrom = document.getElementById("drawerDateFrom");
      const dateTo = document.getElementById("drawerDateTo");
      if (minInput) minInput.value = "";
      if (maxInput) maxInput.value = "";
      if (dateFrom) dateFrom.value = "";
      if (dateTo) dateTo.value = "";
      state.types.clear();
      state.minAmount = null;
      state.maxAmount = null;
      state.currentPage = 1;
      renderTransactions();
      showToast("همه فیلترها پاک شدند.");
    });

  document
    .getElementById("applyDrawerFilters")
    ?.addEventListener("click", function () {
      state.types = new Set(
        [...$$("[data-drawer-type]:checked")].map((input) => input.value)
      );

      const minInput = document.getElementById("drawerMinAmount");
      const maxInput = document.getElementById("drawerMaxAmount");
      const min = minInput?.value.replace(/[^\d]/g, "") || "";
      const max = maxInput?.value.replace(/[^\d]/g, "") || "";
      state.minAmount = min ? Number(min) : null;
      state.maxAmount = max ? Number(max) : null;
      state.currentPage = 1;

      renderTransactions();
      closeFilterDrawer();
      showToast("فیلترها اعمال شدند.");
    });

  document
    .getElementById("closeTransactionDrawer")
    ?.addEventListener("click", closeTransactionDrawer);
  document
    .getElementById("transactionBackdrop")
    ?.addEventListener("click", closeTransactionDrawer);

  document.getElementById("prevPage")?.addEventListener("click", function () {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderTransactions();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", function () {
    const totalItems = getFilteredTransactions().length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderTransactions();
    }
  });

  document.getElementById("pageSize")?.addEventListener("change", function () {
    state.pageSize = parseInt(this.value, 10);
    state.currentPage = 1;
    renderTransactions();
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
    if (!e.target.closest("#monthBtn") && !e.target.closest("#monthMenu")) {
      if (monthMenu) monthMenu.classList.add("hidden");
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
      closeTransactionDrawer();
      if (monthMenu) monthMenu.classList.add("hidden");
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

  renderTransactions();
}

document.addEventListener("DOMContentLoaded", init);
