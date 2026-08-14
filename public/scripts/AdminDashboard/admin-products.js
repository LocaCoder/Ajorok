// ============================================================
// admin-products.js - محصولات فروشنده
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
const products = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: "عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول",
  price: i === 2 ? 5000000000 : 50000000000,
  date: i % 2 ? "۱۴۰۵/۱۲/۱۲" : "۱۴۰۵/۱۲/۱۲",
  stock: 123456 - i * 136,
  stockStatus: i % 5 === 4 ? "out" : i % 3 === 0 ? "available" : "limited",
  publish: i % 6 === 5 ? "rejected" : i % 4 === 0 ? "published" : "pending",
  updated: 100 - i,
  created: 100 - i * 2,
}));

// ===== State =====
const state = {
  query: "",
  tab: "all",
  sort: "updated",
  stock: new Set(),
  publish: new Set(),
  currentPage: 1,
  pageSize: 10,
};

// ===== Stock & Publish Badges =====
function stockBadge(status) {
  const map = {
    available: ["موجود", "#dff5e8", "#19864b"],
    limited: ["موجودی محدود", "#eee7ff", "#6d43dd"],
    out: ["ناموجود", "#ffe5e5", "#c23b3b"],
  };
  const [label, bg, color] = map[status] || ["نامشخص", "#eee", "#666"];
  return `<span class="inline-flex rounded-[4px] px-3 py-2 text-[12px] font-medium" style="background:${bg};color:${color}">${label}</span>`;
}

function publishBadge(status) {
  const map = {
    published: ["منتشر شده", "#def3e5", "#18824a"],
    pending: ["در انتظار تایید", "#fff0d8", "#df8900"],
    rejected: ["رد شده", "#ffe3e3", "#c43b3b"],
  };
  const [label, bg, color] = map[status] || ["نامشخص", "#eee", "#666"];
  return `<span class="inline-flex rounded-[4px] px-3 py-2 text-[12px] font-medium" style="background:${bg};color:${color}">${label}</span>`;
}

// ===== Filter Functions =====
function getFilteredProducts() {
  let data = products.filter((p) => {
    const q = state.query.trim();
    const matchQuery = !q || p.title.includes(q) || String(p.stock).includes(q);
    const matchTab = state.tab === "all" || p.publish === "pending";
    const matchStock = !state.stock.size || state.stock.has(p.stockStatus);
    const matchPublish = !state.publish.size || state.publish.has(p.publish);
    return matchQuery && matchTab && matchStock && matchPublish;
  });

  data.sort((a, b) => {
    if (state.sort === "stock") return b.stock - a.stock;
    if (state.sort === "price") return b.price - a.price;
    if (state.sort === "created") return b.created - a.created;
    return b.updated - a.updated;
  });

  return data;
}

function getPaginatedData(data) {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return data.slice(start, end);
}

// ===== Render Functions =====
function renderProducts() {
  const filtered = getFilteredProducts();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  const paginated = getPaginatedData(filtered);

  const resultCount = document.getElementById("resultCount");
  if (resultCount) resultCount.textContent = toFa(totalItems);

  const emptyState = document.getElementById("emptyState");
  if (emptyState) emptyState.classList.toggle("hidden", paginated.length > 0);

  const tbody = document.getElementById("productBody");
  if (tbody) {
    tbody.innerHTML = paginated
      .map(
        (p, index) => `
                <tr class="h-[94px] border-t border-[#d5d5d5] ${
                  index % 2 ? "bg-[#fcfcfc]" : "bg-white"
                }" data-row="${p.id}">
                    <td class="px-5 py-3">
                        <div class="flex items-center gap-4">
                            <span class="h-[58px] w-[58px] shrink-0 rounded-[6px] bg-custom-brown" role="img" aria-label="تصویر محصول"></span>
                            <p class="max-w-[170px] leading-[1.55]">${
                              p.title
                            }</p>
                        </div>
                    </td>
                    <td class="px-4 text-center leading-6"><div>${money(
                      p.price
                    )}</div><div>واحد</div></td>
                    <td class="px-4 text-center">${p.date}</td>
                    <td class="px-4 text-center">${toFa(p.stock)}</td>
                    <td class="px-4 text-center">${stockBadge(
                      p.stockStatus
                    )}</td>
                    <td class="px-4 text-center">${publishBadge(p.publish)}</td>
                    <td class="relative px-4 text-center">
                        <button class="row-more grid h-9 w-9 place-items-center rounded-md hover:bg-[#f1f1f1]" data-id="${
                          p.id
                        }" aria-label="عملیات">
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="5" r="1.7"/>
                                <circle cx="12" cy="12" r="1.7"/>
                                <circle cx="12" cy="19" r="1.7"/>
                            </svg>
                        </button>
                        <div class="row-menu absolute left-4 top-[62px] z-20 hidden w-36 overflow-hidden rounded-xl border bg-white py-1 text-right shadow-xl">
                            <button data-action="view"><a href="AdminDashboard_SellerDetail_ProductDetail_Info.html">مشاهده محصول</a></button>
                            <button data-action="approve">تایید محصول</button>
                            <button data-action="reject" class="text-[#c93434]">رد محصول</button>
                        </div>
                    </td>
                </tr>
            `
      )
      .join("");
  }

  const mobileList = document.getElementById("mobileProductList");
  if (mobileList) {
    if (paginated.length) {
      mobileList.innerHTML = paginated
        .map(
          (p) => `
                    <div class="product-item p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="h-[52px] w-[52px] shrink-0 rounded-[6px] bg-custom-brown" role="img" aria-label="تصویر محصول"></span>
                            <div class="flex-1">
                                <div class="product-title-mobile">${
                                  p.title
                                }</div>
                                <div class="flex items-center gap-2 mt-1 flex-wrap">
                                    ${stockBadge(p.stockStatus)}
                                    ${publishBadge(p.publish)}
                                </div>
                            </div>
                            <button class="row-more-mobile grid h-8 w-8 place-items-center rounded-md hover:bg-[#f1f1f1]" data-id="${
                              p.id
                            }" aria-label="عملیات">
                                <a href="AdminDashboard_SellerDetail_ProductDetail_Info.html">
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="5" r="1.7"/>
                                        <circle cx="12" cy="12" r="1.7"/>
                                        <circle cx="12" cy="19" r="1.7"/>
                                    </svg>
                                </a>
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-1">
                            <div class="product-info-row">
                                <span class="label">قیمت:</span>
                                <span class="value">${money(
                                  p.price
                                )} تومان</span>
                            </div>
                            <div class="product-info-row">
                                <span class="label">تاریخ ثبت:</span>
                                <span class="value">${p.date}</span>
                            </div>
                            <div class="product-info-row">
                                <span class="label">موجودی:</span>
                                <span class="value">${toFa(p.stock)}</span>
                            </div>
                            <div class="product-info-row">
                                <span class="label">واحد:</span>
                                <span class="value">واحد</span>
                            </div>
                        </div>
                    </div>
                `
        )
        .join("");
      mobileList.classList.remove("hidden");
    } else {
      mobileList.innerHTML = `<div class="py-12 text-center text-sm text-[#777]">محصولی مطابق فیلترها پیدا نشد.</div>`;
      mobileList.classList.remove("hidden");
    }
  }

  renderPagination(
    "paginationNumbers",
    state.currentPage,
    totalPages,
    (page) => {
      state.currentPage = page;
      renderProducts();
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
function bindRowMenus() {
  document.querySelectorAll(".row-more").forEach((btn) => {
    btn.removeEventListener("click", handleRowMore);
    btn.addEventListener("click", handleRowMore);
  });

  document.querySelectorAll(".row-menu button").forEach((btn) => {
    btn.removeEventListener("click", handleRowAction);
    btn.addEventListener("click", handleRowAction);
  });

  document.querySelectorAll(".row-more-mobile").forEach((btn) => {
    btn.removeEventListener("click", handleMobileMore);
    btn.addEventListener("click", handleMobileMore);
  });
}

function handleRowMore(e) {
  e.stopPropagation();
  const menu = e.currentTarget.nextElementSibling;
  document.querySelectorAll(".row-menu").forEach((m) => {
    if (m !== menu) m.classList.add("hidden");
  });
  menu.classList.toggle("hidden");
}

function handleRowAction(e) {
  const action = e.currentTarget.dataset.action;
  const labels = {
    view: "صفحه محصول باز شد",
    approve: "محصول تایید شد",
    reject: "محصول رد شد",
  };
  showToast(labels[action] || "عملیات انجام شد");
  e.currentTarget.parentElement.classList.add("hidden");
}

function handleMobileMore(e) {
  e.stopPropagation();
  showToast("گزینه‌ها: مشاهده، تایید، رد");
}

// ===== Sync Filters =====
function syncFilters() {
  $$("[data-stock-filter]").forEach((el) => {
    el.checked = state.stock.has(el.value);
  });
  $$("[data-drawer-stock]").forEach((el) => {
    el.checked = state.stock.has(el.value);
  });
  $$("[data-publish-filter]").forEach((el) => {
    el.checked = state.publish.has(el.value);
  });
  $$("[data-drawer-publish]").forEach((el) => {
    el.checked = state.publish.has(el.value);
  });
}

function updateSet(selector, set) {
  set.clear();
  $$(selector)
    .filter((el) => el.checked)
    .forEach((el) => set.add(el.value));
  state.currentPage = 1;
  syncFilters();
  renderProducts();
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

  $$(".list-tab").forEach((btn) => {
    btn.addEventListener("click", function () {
      $$(".list-tab").forEach((x) => {
        x.className =
          "list-tab border-b-2 border-transparent px-5 pb-3 text-[14px]";
      });
      this.className =
        "list-tab border-b-2 border-custom-brown px-5 pb-3 text-[14px] font-semibold text-custom-brown";
      state.tab = this.dataset.listTab;
      state.currentPage = 1;
      renderProducts();
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(function () {
        state.query = this.value;
        state.currentPage = 1;
        renderProducts();
      })
    );
  }

  document
    .querySelector("[data-clear-sort]")
    ?.addEventListener("click", function () {
      state.sort = "updated";
      document.querySelector(
        'input[name="sort"][value="updated"]'
      ).checked = true;
      state.currentPage = 1;
      const labels = {
        updated: "مرتب‌سازی: جدیدترین (به‌روزرسانی)",
        created: "مرتب‌سازی: جدیدترین ثبت",
        stock: "مرتب‌سازی: بیشترین موجودی",
        price: "مرتب‌سازی: بیشترین قیمت",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort];
      renderProducts();
      if (isMobile()) closeMobileMenu();
      showToast("مرتب‌سازی به حالت پیش‌فرض بازگشت.");
    });

  $$('input[name="sort"]').forEach((r) => {
    r.addEventListener("change", function () {
      state.sort = this.value;
      state.currentPage = 1;
      const labels = {
        updated: "مرتب‌سازی: جدیدترین (به‌روزرسانی)",
        created: "مرتب‌سازی: جدیدترین ثبت",
        stock: "مرتب‌سازی: بیشترین موجودی",
        price: "مرتب‌سازی: بیشترین قیمت",
      };
      const sortLabel = document.getElementById("sortLabel");
      if (sortLabel) sortLabel.textContent = labels[state.sort] || "مرتب‌سازی";
      if (isMobile()) closeMobileMenu();
      renderProducts();
    });
  });

  $$("[data-stock-filter]").forEach((el) => {
    el.addEventListener("change", () =>
      updateSet("[data-stock-filter]", state.stock)
    );
  });

  $$("[data-publish-filter]").forEach((el) => {
    el.addEventListener("change", () =>
      updateSet("[data-publish-filter]", state.publish)
    );
  });

  $$("[data-clear]").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (this.dataset.clear === "stock") state.stock.clear();
      else state.publish.clear();
      state.currentPage = 1;
      syncFilters();
      renderProducts();
      if (isMobile()) closeMobileMenu();
      showToast("فیلتر پاک شد.");
    });
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
    $$("[data-drawer-stock], [data-drawer-publish]").forEach(
      (el) => (el.checked = false)
    );
    state.stock.clear();
    state.publish.clear();
    state.currentPage = 1;
    renderProducts();
    showToast("همه فیلترها پاک شدند.");
  });

  document
    .getElementById("applyDrawer")
    ?.addEventListener("click", function () {
      updateSet("[data-drawer-stock]", state.stock);
      updateSet("[data-drawer-publish]", state.publish);
      closeFilterDrawer();
      showToast("فیلترها اعمال شدند.");
    });

  document.getElementById("prevPage")?.addEventListener("click", function () {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderProducts();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", function () {
    const totalItems = getFilteredProducts().length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage < totalPages) {
      state.currentPage++;
      renderProducts();
    }
  });

  document.getElementById("pageSize")?.addEventListener("change", function () {
    state.pageSize = parseInt(this.value, 10);
    state.currentPage = 1;
    renderProducts();
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
    if (!e.target.closest(".row-more") && !e.target.closest(".row-menu")) {
      document
        .querySelectorAll(".row-menu")
        .forEach((menu) => menu.classList.add("hidden"));
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isMobile()) closeMobileMenu();
      closeFilterDrawer();
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

  renderProducts();
}

document.addEventListener("DOMContentLoaded", init);
