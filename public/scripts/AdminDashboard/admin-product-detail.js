// ============================================================
// admin-product-detail.js - جزئیات محصول
// ============================================================

import {
  $,
  $$,
  showToast,
  isMobile,
  openModal,
  closeModal,
  setupDropdownTriggers,
  debounce,
} from "./admin-common.js";

// ===== Data =====
const productData = {
  id: 1,
  title: "عنوان محصول",
  price: 5000000,
  stock: 123,
  status: "pending",
  stockStatus: "available",
};

// ===== Stock & Publish Badges =====
function updateStockBadge(status) {
  const badge = document.getElementById("stockBadge");
  if (!badge) return;

  const map = {
    available: ["موجود", "bg-[#dcecff]", "text-[#2b78c5]"],
    out: ["ناموجود", "bg-[#fde3e3]", "text-[#c53a3a]"],
  };
  const [label, bg, color] = map[status] || [
    "نامشخص",
    "bg-[#eee]",
    "text-[#666]",
  ];
  badge.textContent = label;
  badge.className = `rounded-[5px] px-3 py-2 text-[12px] font-medium ${bg} ${color}`;
}

function updatePublishBadge(status) {
  const badge = document.getElementById("publishBadge");
  if (!badge) return;

  const map = {
    pending: ["در انتظار تایید", "bg-[#fff0d8]", "text-[#db8b15]"],
    published: ["منتشر شده", "bg-[#dcf6e8]", "text-[#16864a]"],
    rejected: ["رد شده", "bg-[#fde3e3]", "text-[#c53a3a]"],
    archived: ["بایگانی شده", "bg-[#eeeeee]", "text-[#666]"],
  };
  const [label, bg, color] = map[status] || [
    "نامشخص",
    "bg-[#eee]",
    "text-[#666]",
  ];
  badge.textContent = label;
  badge.className = `rounded-[5px] px-3 py-2 text-[12px] font-medium ${bg} ${color}`;
}

// ===== Modal Functions =====
function openEditModal() {
  openModal(
    "ویرایش محصول",
    `
    <div class="space-y-4">
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">عنوان محصول</span>
        <input id="editTitleInput" value="${
          productData.title
        }" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
      </label>
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">قیمت</span>
        <input id="editPriceInput" value="${productData.price.toLocaleString()}" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
      </label>
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">توضیحات</span>
        <textarea rows="4" class="w-full rounded-lg border border-[#c9c9c9] px-3 py-3 text-[14px]">توضیحات محصول</textarea>
      </label>
      <button id="saveEditBtn" class="h-11 w-full rounded-lg bg-custom-brown text-white transition">ذخیره تغییرات</button>
    </div>
  `
  );

  document
    .getElementById("saveEditBtn")
    ?.addEventListener("click", function () {
      const titleInput = document.getElementById("editTitleInput");
      if (titleInput) productData.title = titleInput.value;
      closeModal();
      showToast("تغییرات محصول ذخیره شد.");
      const titleEl = document.querySelector("h1");
      if (titleEl) titleEl.textContent = productData.title;
    });
}

function openStockModal() {
  openModal(
    "تغییر موجودی",
    `
    <div class="space-y-4">
      <label class="block">
        <span class="mb-2 block text-[13px] text-[#555]">موجودی جدید</span>
        <input id="stockInput" type="number" value="${productData.stock}" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
      </label>
      <div class="flex gap-3">
        <button id="markAvailableBtn" class="h-11 flex-1 rounded-lg bg-custom-brown text-white transition">ذخیره موجودی</button>
        <button id="markUnavailableBtn" class="h-11 flex-1 rounded-lg border border-custom-brown text-custom-brown hover:bg-[#fbf2ef] transition">ناموجود</button>
      </div>
    </div>
  `
  );

  document
    .getElementById("markAvailableBtn")
    ?.addEventListener("click", function () {
      const stockInput = document.getElementById("stockInput");
      if (stockInput) {
        productData.stock = parseInt(stockInput.value) || 0;
        productData.stockStatus = "available";
        updateStockBadge("available");
        const stockDisplay = document.querySelector(".stat-stock");
        if (stockDisplay)
          stockDisplay.textContent = `${productData.stock} واحد`;
      }
      closeModal();
      showToast("موجودی محصول به‌روزرسانی شد.");
    });

  document
    .getElementById("markUnavailableBtn")
    ?.addEventListener("click", function () {
      productData.stockStatus = "out";
      productData.stock = 0;
      updateStockBadge("out");
      const stockDisplay = document.querySelector(".stat-stock");
      if (stockDisplay) stockDisplay.textContent = "۰ واحد";
      closeModal();
      showToast("محصول ناموجود شد.");
    });
}

function openPublishModal() {
  const currentStatus = productData.status;
  openModal(
    "تغییر وضعیت انتشار",
    `
    <div class="space-y-4 text-[14px]">
      <label class="flex cursor-pointer items-center justify-between rounded-lg border border-[#dedede] p-4 ${
        currentStatus === "published" ? "border-custom-brown bg-[#fbf2ef]" : ""
      }">
        <span>منتشر شده</span>
        <span class="flex">
          <input type="radio" name="publish" value="published" ${
            currentStatus === "published" ? "checked" : ""
          } class="sr-only">
          <span class="radio-ui"></span>
        </span>
      </label>
      <label class="flex cursor-pointer items-center justify-between rounded-lg border border-[#dedede] p-4 ${
        currentStatus === "pending" ? "border-custom-brown bg-[#fbf2ef]" : ""
      }">
        <span>در انتظار تایید</span>
        <span class="flex">
          <input type="radio" name="publish" value="pending" ${
            currentStatus === "pending" ? "checked" : ""
          } class="sr-only">
          <span class="radio-ui"></span>
        </span>
      </label>
      <label class="flex cursor-pointer items-center justify-between rounded-lg border border-[#dedede] p-4 ${
        currentStatus === "archived" ? "border-custom-brown bg-[#fbf2ef]" : ""
      }">
        <span>بایگانی شده</span>
        <span class="flex">
          <input type="radio" name="publish" value="archived" ${
            currentStatus === "archived" ? "checked" : ""
          } class="sr-only">
          <span class="radio-ui"></span>
        </span>
      </label>
      <button id="savePublishBtn" class="h-11 w-full rounded-lg bg-custom-brown text-white transition">ذخیره وضعیت</button>
    </div>
  `
  );

  document
    .getElementById("savePublishBtn")
    ?.addEventListener("click", function () {
      const selected = document.querySelector(
        'input[name="publish"]:checked'
      )?.value;
      if (selected) {
        productData.status = selected;
        updatePublishBadge(selected);
        closeModal();
        showToast("وضعیت انتشار تغییر کرد.");
      }
    });
}

// ===== Gallery =====
function setupGallery() {
  const thumbs = document.querySelectorAll(".gallery-thumb");
  const mainImage = document.getElementById("mainProductImage");
  if (!thumbs.length || !mainImage) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      thumbs.forEach((t) => {
        t.classList.remove("border-custom-brown");
        t.classList.add("border-transparent");
      });
      this.classList.remove("border-transparent");
      this.classList.add("border-custom-brown");
      mainImage.src = this.dataset.src;
    });
  });
}

// ===== Tabs =====
function setupTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  const panels = {
    info: document.getElementById("tab-info"),
    reviews: document.getElementById("tab-reviews"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabKey = this.dataset.tab;

      tabs.forEach((t) => {
        t.classList.remove("tab-active");
        t.classList.add("border-transparent");
      });
      this.classList.add("tab-active");
      this.classList.remove("border-transparent");

      Object.keys(panels).forEach((key) => {
        if (panels[key]) {
          panels[key].style.display = key === tabKey ? "" : "none";
        }
      });
    });
  });

  const defaultTab = document.querySelector('[data-tab="info"]');
  if (defaultTab) defaultTab.click();
}

// ===== Product Actions =====
function setupProductActions() {
  document
    .getElementById("approveProductBtn")
    ?.addEventListener("click", function () {
      productData.status = "published";
      updatePublishBadge("published");
      showToast("محصول با موفقیت تایید شد.");
    });

  document
    .getElementById("rejectProductBtn")
    ?.addEventListener("click", function () {
      productData.status = "rejected";
      updatePublishBadge("rejected");
      showToast("محصول رد شد.");
    });

  document.getElementById("editBtn")?.addEventListener("click", openEditModal);

  document
    .getElementById("changeStockBtn")
    ?.addEventListener("click", openStockModal);

  document
    .getElementById("changePublishBtn")
    ?.addEventListener("click", openPublishModal);

  document.querySelectorAll("[data-top-action]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.dataset.topAction;
      if (action === "edit") {
        openEditModal();
      } else if (action === "archive") {
        productData.status = "archived";
        updatePublishBadge("archived");
        showToast("محصول بایگانی شد.");
      } else if (action === "delete") {
        showToast("درخواست حذف محصول ثبت شد.");
      }
      document.getElementById("topMoreMenu")?.classList.add("hidden");
    });
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

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#topMoreBtn") && !e.target.closest("#topMoreMenu")) {
      if (topMoreMenu) topMoreMenu.classList.add("hidden");
      if (topMoreBtn) topMoreBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== Init =====
function init() {
  setupDropdownTriggers();
  setupGallery();
  setupTabs();
  setupProductActions();

  document
    .getElementById("closeModalBtn")
    ?.addEventListener("click", () => closeModal());
  document
    .getElementById("modalOverlay")
    ?.addEventListener("click", () => closeModal());

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();
      const topMoreMenu = document.getElementById("topMoreMenu");
      if (topMoreMenu) topMoreMenu.classList.add("hidden");
    }
  });

  updateStockBadge(productData.stockStatus);
  updatePublishBadge(productData.status);
}

document.addEventListener("DOMContentLoaded", init);
