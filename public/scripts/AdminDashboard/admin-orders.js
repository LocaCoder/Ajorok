// ============================================================
// admin-orders.js - سفارش‌های فروشنده
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
  statusMeta,
} from "./admin-common.js";

// ===== Data =====
const orders = [
  {
    id: 1,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "preparing",
    hasData: true,
  },
  {
    id: 2,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "preparing",
    hasData: true,
  },
  {
    id: 3,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "preparing",
    hasData: true,
  },
  {
    id: 4,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "preparing",
    hasData: true,
  },
  {
    id: 5,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "-",
    time: "",
    orderNo: "-",
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "pending",
    hasData: false,
  },
  {
    id: 6,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "completed",
    hasData: true,
  },
  {
    id: 7,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "canceled",
    hasData: true,
  },
  {
    id: 8,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "pending",
    hasData: false,
  },
  {
    id: 9,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "completed",
    hasData: true,
  },
  {
    id: 10,
    product: "عنوان محصول عنوان محصول عنوان محصول",
    orderDate: "شنبه ۱۴۰۴/۰۴/۰۴",
    time: "۱۳:۵۲",
    orderNo: 123456,
    price: 5000000000,
    quantity: 123456789,
    unit: "واحد",
    status: "canceled",
    hasData: true,
  },
];

// ===== State =====
const state = {
  tab: "all",
  query: "",
  sort: "newest",
  statuses: new Set(),
  minAmount: null,
  maxAmount: null,
  currentPage: 1,
  pageSize: 10,
};

// ===== Filter Functions =====
function getFilteredOrders() {
  let data = [...orders];

  if (state.tab !== "all") {
    data = data.filter((item) => item.status === state.tab);
  }

  if (state.statuses.size) {
    data = data.filter((item) => state.statuses.has(item.status));
  }

  const q = state.query.trim();
  if (q) {
    data = data.filter(
      (item) =>
        item.product.includes(q) ||
        String(item.orderNo).includes(q) ||
        String(item.quantity).includes(q)
    );
  }

  if (state.minAmount !== null) {
    data = data.filter((item) => item.price >= state.minAmount);
  }
  if (state.maxAmount !== null) {
    data = data.filter((item) => item.price <= state.maxAmount);
  }

  if (state.sort === "oldest") data.reverse();
  if (state.sort === "highest") data.sort((a, b) => b.price - a.price);
  if (state.sort === "lowest") data.sort((a, b) => a.price - a.price);

  return data;
}

function getPaginatedData(data) {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return data.slice(start, end);
}

// ===== Render Functions =====
function productCell(product) {
  const words = product.split(" ");
  const line = words.slice(0, 4).join(" ");
  return `
    <div class="flex items-center gap-4">
      <span class="h-[56px] w-[56px] shrink-0 rounded-[5px] bg-custom-brown"></span>
      <div class="max-w-[170px] leading-[1.55] text-[#333]">
        <p>${line}</p>
      </div>
    </div>
  `;
}

function rowTemplate(order) {
  const meta = statusMeta[order.status] || statusMeta.pending;
  return `
    <tr class="h-[92px] border-b border-[#d6d6d6] last:border-b-0" data-id="${
      order.id
    }">
      <td class="px-5 py-3">${productCell(order.product)}</td>
      <td class="px-4 py-3 text-center leading-6">
        <span>${order.orderDate === "-" ? "-" : order.orderDate}</span>
        ${order.time ? `<br><span>${order.time}</span>` : ""}
      </td>
      <td class="px-4 py-3 text-center">${
        order.orderNo === "-" ? "-" : toFa(order.orderNo)
      }</td>
      <td class="px-4 py-3 text-center">${money(order.price)}</td>
      <td class="px-4 py-3 text-center">${toFa(order.quantity)}</td>
      <td class="px-4 py-3 text-center">${order.unit}</td>
      <td class="px-4 py-3 text-center">
        ${
          order.hasData
            ? `<span class="inline-flex rounded-[5px] px-3 py-2 text-[12px] font-medium ${meta.classes}">${meta.label}</span>`
            : "<span>-</span>"
        }
      </td>
      <td class="relative px-4 py-3 text-center">
        <button class="row-menu-btn grid h-9 w-9 place-items-center rounded-md hover:bg-[#f1f1f1]" data-id="${
          order.id
        }" aria-label="عملیات سفارش">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="5" r="1.6"/>
            <circle cx="12" cy="12" r="1.6"/>
            <circle cx="12" cy="19" r="1.6"/>
          </svg>
        </button>
      </td>
    </tr>
  `;
}

function renderOrders() {
  const filtered = getFilteredOrders();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const paginated = getPaginatedData(filtered);

  const body = document.getElementById("orderBody");
  const emptyState = document.getElementById("emptyState");
  const table = document.querySelector(".orders-table");

  if (body) {
    body.innerHTML = paginated.map(rowTemplate).join("");
  }
  if (emptyState) {
    emptyState.classList.toggle("hidden", paginated.length > 0);
  }
  if (table) {
    table.classList.toggle("hidden", paginated.length === 0);
  }

  const mobileList = document.getElementById("mobileOrderList");
  if (mobileList) {
    if (paginated.length) {
      mobileList.innerHTML = paginated
        .map((order) => {
          const meta = statusMeta[order.status] || statusMeta.pending;
          return `
            <div class="order-item p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="h-[52px] w-[52px] shrink-0 rounded-[5px] bg-custom-brown" role="img" aria-label="تصویر محصول"></span>
                <div class="flex-1">
                  <div class="order-title-mobile">${order.product}</div>
                  <div class="flex items-center gap-2 mt-1 flex-wrap">
                    ${
                      order.hasData
                        ? `<span class="inline-flex rounded-[4px] px-2.5 py-1 text-[11px] font-medium ${meta.classes}">${meta.label}</span>`
                        : '<span class="text-[#777] text-[11px]">-</span>'
                    }
                  </div>
                </div>
                <button class="row-menu-btn-mobile grid h-8 w-8 place-items-center rounded-md hover:bg-[#f1f1f1]" data-id="${
                  order.id
                }" aria-label="عملیات">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="5" r="1.6"/>
                    <circle cx="12" cy="12" r="1.6"/>
                    <circle cx="12" cy="19" r="1.6"/>
                  </svg>
                </button>
              </div>
              <div class="grid grid-cols-2 gap-1">
                <div class="order-info-row">
                  <span class="label">شماره سفارش:</span>
                  <span class="value">${
                    order.orderNo === "-" ? "-" : toFa(order.orderNo)
                  }</span>
                </div>
                <div class="order-info-row">
                  <span class="label">تاریخ ثبت:</span>
                  <span class="value">${
                    order.orderDate === "-" ? "-" : order.orderDate
                  }</span>
                </div>
                <div class="order-info-row">
                  <span class="label">قیمت:</span>
                  <span class="value">${money(order.price)} تومان</span>
                </div>
                <div class="order-info-row">
                  <span class="label">مقدار:</span>
                  <span class="value">${toFa(order.quantity)}</span>
                </div>
                <div class="order-info-row col-span-2">
                  <span class="label">محصول:</span>
                  <span class="value text-left">${order.product}</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
      mobileList.classList.remove("hidden");
    } else {
      mobileList.innerHTML = `<div class="py-12 text-center text-sm text-[#777]">سفارشی مطابق جست‌وجو یا فیلترها پیدا نشد.</div>`;
      mobileList.classList.remove("hidden");
    }
  }

  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    const isDefault =
      !state.query &&
      state.tab === "all" &&
      !state.statuses.size &&
      state.minAmount === null &&
      state.maxAmount === null;
    resultCount.textContent = isDefault ? "۱۲۳" : toFa(totalItems);
  }

  renderPagination(
    "paginationNumbers",
    state.currentPage,
    totalPages,
    (page) => {
      state.currentPage = page;
      renderOrders();
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

  bindRowMenus();
}

// ===== Row Menus =====
function closeAllRowMenus() {
  document.querySelectorAll(".floating-row-menu").forEach((el) => el.remove());
}

function bindRowMenus() {
  document.querySelectorAll(".row-menu-btn").forEach((btn) => {
    btn.removeEventListener("click", handleRowClick);
    btn.addEventListener("click", handleRowClick);
  });
  document.querySelectorAll(".row-menu-btn-mobile").forEach((btn) => {
    btn.removeEventListener("click", handleMobileRowClick);
    btn.addEventListener("click", handleMobileRowClick);
  });
}

function handleRowClick(event) {
  event.stopPropagation();
  const id = Number(this.dataset.id);
  closeAllRowMenus();

  const rect = this.getBoundingClientRect();
  const menu = document.createElement("div");
  menu.className =
    "floating-row-menu row-menu fixed z-[60] w-44 overflow-hidden rounded-xl border border-[#dedede] bg-white py-1 shadow-xl dropdown-enter";
  menu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - 170)}px`;
  menu.style.left = `${Math.max(10, rect.left - 145)}px`;

  menu.innerHTML = `
    <button data-action="view">مشاهده جزئیات سفارش</button>
    <button data-action="status">تغییر وضعیت</button>
    <button data-action="invoice">دانلود فاکتور</button>
    <button data-action="cancel" class="text-[#c93434]">لغو سفارش</button>
  `;

  document.body.appendChild(menu);

  menu.querySelectorAll("button").forEach((actionBtn) => {
    actionBtn.addEventListener("click", () => {
      const action = actionBtn.dataset.action;
      const messages = {
        view: `جزئیات سفارش ${toFa(id)} باز شد.`,
        status: `پنجره تغییر وضعیت سفارش ${toFa(id)} باز شد.`,
        invoice: `فاکتور سفارش ${toFa(id)} آماده دانلود است.`,
        cancel: `سفارش ${toFa(id)} لغو شد.`,
      };
      showToast(messages[action]);
      closeAllRowMenus();
    });
  });
}

function handleMobileRowClick(e) {
  e.stopPropagation();
  const id = this.dataset.id;
  showToast(`گزینه‌های سفارش ${toFa(id)}: مشاهده، تغییر وضعیت، فاکتور، لغو`);
}

// ===== Sync Filters =====
function syncFilters() {
  $$("[data-drawer-status]").forEach((el) => {
    el.checked = state.statuses.has(el.value);
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

  $$(".order-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      state.tab = this.dataset.orderTab;
      state.currentPage = 1;

      $$(".order-tab").forEach((item) => {
        item.classList.remove("order-tab-active");
        item.classList.add("border-transparent");
      });

      this.classList.add("order-tab-active");
      this.classList.remove("border-transparent");
      renderOrders();
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(function () {
        state.query = this.value;
        state.currentPage = 1;
        renderOrders();
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
        newest: "مرتب‌سازی: جدیدترین سفارش",
        oldest: "مرتب‌سازی: قدیمی‌ترین سفارش",
        highest: "مرتب‌سازی: بیشترین مبلغ",
        lowest: "مرتب‌سازی: کمترین مبلغ",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      renderOrders();
      if (isMobile()) closeMobileMenu();
      showToast("مرتب‌سازی به حالت پیش‌فرض بازگشت.");
    });

  $$('input[name="sort"]').forEach((r) => {
    r.addEventListener("change", function () {
      state.sort = this.value;
      state.currentPage = 1;
      const labels = {
        newest: "مرتب‌سازی: جدیدترین سفارش",
        oldest: "مرتب‌سازی: قدیمی‌ترین سفارش",
        highest: "مرتب‌سازی: بیشترین مبلغ",
        lowest: "مرتب‌سازی: کمترین مبلغ",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      if (isMobile()) closeMobileMenu();
      renderOrders();
    });
  });

  $$("[data-drawer-status]").forEach((el) => {
    el.addEventListener("change", function () {
      if (this.checked) state.statuses.add(this.value);
      else state.statuses.delete(this.value);
      state.currentPage = 1;
      syncFilters();
      renderOrders();
    });
  });

  document
    .getElementById("applyDateBtn")
    ?.addEventListener("click", function () {
      if (isMobile()) closeMobileMenu();
      document.getElementById("dateMenu")?.classList.add("hidden");
      showToast("بازه زمانی اعمال شد.");
    });

  document
    .getElementById("clearDateBtn")
    ?.addEventListener("click", function () {
      document.getElementById("dateFrom").value = "";
      document.getElementById("dateTo").value = "";
      if (isMobile()) closeMobileMenu();
      document.getElementById("dateMenu")?.classList.add("hidden");
      showToast("فیلتر بازه زمانی حذف شد.");
    });

  document
    .getElementById("applyAmountBtn")
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
      renderOrders();
      showToast("فیلتر مبلغ اعمال شد.");
    });

  document
    .getElementById("clearAmountBtn")
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
      renderOrders();
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

  document.getElementById("clearAll")?.addEventListener("click", function () {
    $$("[data-drawer-status]").forEach((input) => (input.checked = false));
    const minInput = document.getElementById("minAmount");
    const maxInput = document.getElementById("maxAmount");
    const dateFrom = document.getElementById("drawerDateFrom");
    const dateTo = document.getElementById("drawerDateTo");
    if (minInput) minInput.value = "";
    if (maxInput) maxInput.value = "";
    if (dateFrom) dateFrom.value = "";
    if (dateTo) dateTo.value = "";
    state.statuses.clear();
    state.minAmount = null;
    state.maxAmount = null;
    state.currentPage = 1;
    renderOrders();
    showToast("همه فیلترها پاک شدند.");
  });

  document
    .getElementById("applyFilters")
    ?.addEventListener("click", function () {
      state.statuses = new Set(
        [...$$("[data-drawer-status]:checked")].map((input) => input.value)
      );

      const minInput = document.getElementById("minAmount");
      const maxInput = document.getElementById("maxAmount");
      const min = minInput?.value.replace(/[^\d]/g, "") || "";
      const max = maxInput?.value.replace(/[^\d]/g, "") || "";
      state.minAmount = min ? Number(min) : null;
      state.maxAmount = max ? Number(max) : null;
      state.currentPage = 1;

      renderOrders();
      closeFilterDrawer();
      showToast("فیلترها اعمال شدند.");
    });

  document.getElementById("prevPage")?.addEventListener("click", function () {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderOrders();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", function () {
    const totalItems = getFilteredOrders().length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderOrders();
    }
  });

  document.getElementById("pageSize")?.addEventListener("change", function () {
    state.pageSize = parseInt(this.value, 10);
    state.currentPage = 1;
    renderOrders();
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
    if (!e.target.closest("#moreBtn") && !e.target.closest("#moreMenu")) {
      const moreMenu = document.getElementById("moreMenu");
      if (moreMenu) moreMenu.classList.add("hidden");
    }
    if (
      !e.target.closest(".row-menu-btn") &&
      !e.target.closest(".floating-row-menu")
    ) {
      closeAllRowMenus();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isMobile()) closeMobileMenu();
      closeFilterDrawer();
      closeAllRowMenus();
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

  renderOrders();
}

document.addEventListener("DOMContentLoaded", init);
