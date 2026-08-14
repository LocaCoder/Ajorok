// ============================================================
// admin-product-detail-orders.js - سفارش‌های محصول
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
  setupDropdownTriggers,
  debounce,
} from "./admin-common.js";

// ===== Data =====
const orders = [
  {
    id: 1,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "pending",
  },
  {
    id: 2,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "preparing",
  },
  {
    id: 3,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "preparing",
  },
  {
    id: 4,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "sent",
  },
  {
    id: 5,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "sent",
  },
  {
    id: 6,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "sent",
  },
  {
    id: 7,
    orderNo: "۱۲۳۳۴۶۷",
    date: "۱۴۰۴/۰۴/۰۴",
    amount: 125000000,
    quantity: 125,
    status: "canceled",
  },
];

const statusMeta = {
  pending: { label: "در انتظار بررسی", classes: "bg-[#f7ebe8] text-[#a45040]" },
  preparing: {
    label: "در حال آماده‌سازی",
    classes: "bg-[#dcecff] text-[#2b78c5]",
  },
  sent: { label: "ارسال شد", classes: "bg-[#dcf6e8] text-[#19a55a]" },
  canceled: { label: "لغو شد", classes: "bg-[#fde3e3] text-[#d54242]" },
};

// ===== State =====
const state = {
  sort: "newest",
  statuses: new Set(),
  currentPage: 1,
  pageSize: 10,
};

// ===== Filter Functions =====
function getFilteredOrders() {
  let data = [...orders];

  if (state.statuses.size) {
    data = data.filter((order) => state.statuses.has(order.status));
  }

  if (state.sort === "oldest") data.reverse();
  if (state.sort === "highest") data.sort((a, b) => b.amount - a.amount);
  if (state.sort === "lowest") data.sort((a, b) => a.amount - b.amount);

  return data;
}

function getPaginatedData(data) {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return data.slice(start, end);
}

// ===== Render Functions =====
function rowTemplate(order) {
  const meta = statusMeta[order.status] || statusMeta.pending;

  return `
    <tr class="h-[68px] border-b border-[#d7d7d7] last:border-b-0">
      <td class="px-4 text-right">${order.orderNo}</td>
      <td class="px-4 text-center">${order.date}</td>
      <td class="px-4 text-center">${money(order.amount)}</td>
      <td class="px-4 text-center">${toFa(order.quantity)}</td>
      <td class="px-4 text-center">
        <span class="inline-flex rounded-[4px] px-3 py-2 text-[12px] font-medium ${
          meta.classes
        }">${meta.label}</span>
      </td>
      <td class="px-4 text-center">
        <button data-order-id="${
          order.id
        }" class="details-btn text-[13px] text-[#777] hover:text-custom-brown">جزئیات</button>
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

  const body = document.getElementById("ordersBody");
  const emptyState = document.getElementById("emptyState");
  const table = document.querySelector("table");

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
              <div class="flex items-center justify-between mb-3">
                <div>
                  <div class="order-title-mobile">شماره: ${order.orderNo}</div>
                  <p class="text-[11px] text-[#888]">${order.date}</p>
                </div>
                <button data-order-id="${
                  order.id
                }" class="details-btn-mobile grid h-8 w-8 place-items-center rounded-md hover:bg-[#f1f1f1] text-[#777] hover:text-custom-brown text-[13px]">جزئیات</button>
              </div>
              <div class="grid grid-cols-2 gap-1">
                <div class="order-info-row">
                  <span class="label">مبلغ:</span>
                  <span class="value">${money(order.amount)} تومان</span>
                </div>
                <div class="order-info-row">
                  <span class="label">مقدار:</span>
                  <span class="value">${toFa(order.quantity)} واحد</span>
                </div>
                <div class="order-info-row col-span-2">
                  <span class="label">وضعیت:</span>
                  <span class="value"><span class="inline-flex rounded-[4px] px-2 py-1 text-[11px] font-medium ${
                    meta.classes
                  }">${meta.label}</span></span>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
      mobileList.classList.remove("hidden");
    } else {
      mobileList.innerHTML = `<div class="py-12 text-center text-sm text-[#777]">سفارشی مطابق فیلترهای انتخابی پیدا نشد.</div>`;
      mobileList.classList.remove("hidden");
    }
  }

  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    resultCount.textContent = state.statuses.size ? toFa(totalItems) : "۱۲۳";
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

  bindDetailsButtons();
}

// ===== Detail Buttons =====
function bindDetailsButtons() {
  $$(".details-btn").forEach((button) => {
    button.removeEventListener("click", handleDetailsClick);
    button.addEventListener("click", handleDetailsClick);
  });
  $$(".details-btn-mobile").forEach((button) => {
    button.removeEventListener("click", handleDetailsClick);
    button.addEventListener("click", handleDetailsClick);
  });
}

function handleDetailsClick() {
  const order = orders.find((item) => item.id === Number(this.dataset.orderId));
  if (!order) return;
  const meta = statusMeta[order.status] || statusMeta.pending;

  openModal(
    "جزئیات سفارش",
    `
    <div class="space-y-4">
      <div class="flex justify-between"><span>شماره سفارش</span><strong class="text-[#222]">${
        order.orderNo
      }</strong></div>
      <div class="flex justify-between"><span>تاریخ</span><strong class="text-[#222]">${
        order.date
      }</strong></div>
      <div class="flex justify-between"><span>مبلغ</span><strong class="text-[#222]">${money(
        order.amount
      )} تومان</strong></div>
      <div class="flex justify-between"><span>مقدار</span><strong class="text-[#222]">${toFa(
        order.quantity
      )} واحد</strong></div>
      <div class="flex justify-between items-center"><span>وضعیت</span><span class="rounded px-3 py-2 ${
        meta.classes
      }">${meta.label}</span></div>
    </div>
  `
  );
}

// ===== Sync Filters =====
function syncFilters() {
  $$("[data-status-filter]").forEach((el) => {
    el.checked = state.statuses.has(el.value);
  });
}

// ===== Product Actions =====
function setupProductActions() {
  const publishBadge = document.getElementById("publishBadge");

  document
    .getElementById("approveProductBtn")
    ?.addEventListener("click", function () {
      if (publishBadge) {
        publishBadge.textContent = "تایید شده";
        publishBadge.className =
          "rounded-[5px] bg-[#dcf6e8] px-3 py-2 text-[12px] font-medium text-[#16864a]";
      }
      showToast("محصول با موفقیت تایید شد.");
    });

  document
    .getElementById("rejectProductBtn")
    ?.addEventListener("click", function () {
      if (publishBadge) {
        publishBadge.textContent = "رد شده";
        publishBadge.className =
          "rounded-[5px] bg-[#fde3e3] px-3 py-2 text-[12px] font-medium text-[#c53a3a]";
      }
      showToast("محصول رد شد.");
    });

  const topMoreBtn = document.getElementById("topMoreBtn");
  const topMoreMenu = document.getElementById("topMoreMenu");

  if (topMoreBtn && topMoreMenu) {
    topMoreBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      topMoreMenu.classList.toggle("hidden");
      this.setAttribute(
        "aria-expanded",
        String(!topMoreMenu.classList.contains("hidden"))
      );
    });
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", function () {
      const action = this.dataset.action;
      if (action === "archive") {
        if (publishBadge) {
          publishBadge.textContent = "بایگانی شده";
          publishBadge.className =
            "rounded-[5px] bg-[#eeeeee] px-3 py-2 text-[12px] font-medium text-[#666]";
        }
        showToast("محصول بایگانی شد.");
      } else if (action === "delete") {
        showToast("درخواست حذف محصول ثبت شد.");
      } else {
        showToast("فرم ویرایش محصول باز شد.");
      }
      if (topMoreMenu) topMoreMenu.classList.add("hidden");
    });
  });
}

// ===== Init =====
function init() {
  setupDropdownTriggers();
  setupProductActions();

  document
    .getElementById("closeModal")
    ?.addEventListener("click", () => closeModal());
  document
    .getElementById("modalBackdrop")
    ?.addEventListener("click", () => closeModal());

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

  $$("[data-status-filter]").forEach((el) => {
    el.addEventListener("change", function () {
      if (this.checked) state.statuses.add(this.value);
      else state.statuses.delete(this.value);
      state.currentPage = 1;
      syncFilters();
      renderOrders();
    });
  });

  document
    .querySelector('[data-clear="status"]')
    ?.addEventListener("click", function () {
      state.statuses.clear();
      state.currentPage = 1;
      syncFilters();
      renderOrders();
      if (isMobile()) closeMobileMenu();
      showToast("فیلتر وضعیت پاک شد.");
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
      const dateFrom = document.getElementById("dateFrom");
      const dateTo = document.getElementById("dateTo");
      if (dateFrom) dateFrom.value = "";
      if (dateTo) dateTo.value = "";
      if (isMobile()) closeMobileMenu();
      document.getElementById("dateMenu")?.classList.add("hidden");
      showToast("فیلتر بازه زمانی حذف شد.");
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

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isMobile()) closeMobileMenu();
      closeModal();
      const topMoreMenu = document.getElementById("topMoreMenu");
      if (topMoreMenu) topMoreMenu.classList.add("hidden");
    }
  });

  renderOrders();
}

document.addEventListener("DOMContentLoaded", init);
