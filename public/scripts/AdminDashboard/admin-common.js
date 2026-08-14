// ============================================================
// admin-common.js - توابع مشترک پنل ادمین
// ============================================================

// ===== Selectors =====
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector),
];

// ===== Number Utilities =====
export const toFa = (value) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
export const toEn = (value) =>
  String(value).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
export const money = (value) => {
  if (typeof value !== "number") return value;
  return toFa(value.toLocaleString("en-US"));
};

// ===== Toast =====
let toastTimer = null;
export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

// ===== Mobile Detection =====
export function isMobile() {
  return window.innerWidth < 768;
}

// ===== Mobile Bottom Sheet Manager =====
let activeMobileMenu = null;
const mobileOverlay = document.getElementById("mobileOverlay");

export function openMobileMenu(menuId) {
  closeMobileMenu();
  const menu = document.getElementById(menuId);
  if (!menu) return;

  document.querySelectorAll(".dropdown-menu").forEach((m) => {
    if (m.id !== menuId) m.classList.add("hidden");
  });

  if (isMobile()) {
    menu.classList.add("mobile-bottom");
    menu.classList.remove("hidden");
    if (mobileOverlay) {
      mobileOverlay.classList.add("show");
      mobileOverlay.style.display = "block";
    }
    document.body.classList.add("overflow-hidden");
    requestAnimationFrame(() => menu.classList.add("open"));
    activeMobileMenu = menuId;
  } else {
    menu.classList.remove("mobile-bottom", "open");
    menu.classList.remove("hidden");
  }
}

export function closeMobileMenu() {
  if (activeMobileMenu) {
    const menu = document.getElementById(activeMobileMenu);
    if (menu) {
      menu.classList.remove("open");
      setTimeout(() => {
        menu.classList.add("hidden");
        menu.classList.remove("mobile-bottom");
      }, 300);
    }
    if (mobileOverlay) {
      mobileOverlay.classList.remove("show");
      mobileOverlay.style.display = "none";
    }
    document.body.classList.remove("overflow-hidden");
    activeMobileMenu = null;
  }
}

// ===== Modal Manager =====
export function openModal(title, bodyHTML, modalType = "default") {
  const overlay = document.getElementById("modalOverlay");
  const container = document.getElementById("modalContainer");
  const titleEl = document.getElementById("modalTitle");
  const bodyEl = document.getElementById("modalBody");

  if (modalType === "confirm") {
    const confirmOverlay = document.getElementById("confirmOverlay");
    const confirmContainer = document.getElementById("confirmContainer");
    const confirmTitle = document.getElementById("confirmTitle");
    const confirmBody = document.getElementById("confirmBody");

    if (confirmTitle) confirmTitle.textContent = title;
    if (confirmBody) confirmBody.innerHTML = bodyHTML;
    if (confirmOverlay) confirmOverlay.classList.add("active");
    if (confirmContainer) confirmContainer.classList.add("active");
    document.body.classList.add("overflow-hidden");
    return;
  }

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = bodyHTML;
  if (overlay) overlay.classList.add("active");
  if (container) container.classList.add("active");
  document.body.classList.add("overflow-hidden");
}

export function closeModal(modalType = "default") {
  if (modalType === "confirm") {
    const confirmOverlay = document.getElementById("confirmOverlay");
    const confirmContainer = document.getElementById("confirmContainer");
    if (confirmOverlay) confirmOverlay.classList.remove("active");
    if (confirmContainer) confirmContainer.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
    return;
  }

  const overlay = document.getElementById("modalOverlay");
  const container = document.getElementById("modalContainer");
  if (overlay) overlay.classList.remove("active");
  if (container) container.classList.remove("active");
  document.body.classList.remove("overflow-hidden");
}

// ===== Pagination Renderer =====
export function renderPagination(
  containerId,
  currentPage,
  totalPages,
  onPageClick
) {
  let html = "";
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  if (startPage > 1) {
    html += `<button class="page-num h-8 w-8 rounded-full text-center text-[13px]" data-page="1">1</button>`;
    if (startPage > 2)
      html += `<span class="h-8 w-8 text-center text-[13px]">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    const active =
      i === currentPage ? "bg-custom-brown text-white" : "hover:bg-gray-100";
    html += `<button class="page-num h-8 w-8 rounded-full text-center text-[13px] ${active}" data-page="${i}">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1)
      html += `<span class="h-8 w-8 text-center text-[13px]">...</span>`;
    html += `<button class="page-num h-8 w-8 rounded-full text-center text-[13px]" data-page="${totalPages}">${totalPages}</button>`;
  }

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML =
      html || `<span class="text-sm text-gray-400">صفحه ۱</span>`;
    container.querySelectorAll(".page-num").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page, 10);
        if (!isNaN(page) && page !== currentPage) onPageClick(page);
      });
    });
  }
}

// ===== Filter Drawer =====
export function openFilterDrawer() {
  const drawer = document.getElementById("filterDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer) drawer.classList.remove("translate-x-full");
  if (backdrop) backdrop.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

export function closeFilterDrawer() {
  const drawer = document.getElementById("filterDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer) drawer.classList.add("translate-x-full");
  if (backdrop) backdrop.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

// ===== Status Badges =====
export const statusMeta = {
  pending: { label: "در انتظار بررسی", classes: "bg-[#fff2d7] text-[#d98b15]" },
  preparing: {
    label: "در حال آماده‌سازی",
    classes: "bg-[#dcecff] text-[#2b78c5]",
  },
  completed: { label: "تکمیل شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
  canceled: { label: "لغو شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
  paid: { label: "واریز شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
  rejected: { label: "رد شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
  active: { label: "فعال", classes: "bg-[#dcf6e8] text-[#16864a]" },
  suspended: { label: "تعلیق شده", classes: "bg-[#fff2d7] text-[#d98b15]" },
};

export function getStatusBadge(status) {
  const meta = statusMeta[status] || statusMeta.pending;
  return `<span class="inline-flex rounded-[5px] px-3 py-2 text-[12px] font-medium ${meta.classes}">${meta.label}</span>`;
}

// ===== Debounce =====
export function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===== Event Helpers =====
export function setupDropdownTriggers() {
  document.querySelectorAll(".dropdown-trigger").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = this.dataset.dropdown;
      const menu = document.getElementById(id);
      if (!menu) return;

      if (isMobile() && menu.classList.contains("open")) {
        closeMobileMenu();
        return;
      }

      document.querySelectorAll(".dropdown-menu").forEach((m) => {
        if (m.id !== id) {
          m.classList.add("hidden");
          m.classList.remove("open", "mobile-bottom");
        }
      });

      if (isMobile()) {
        openMobileMenu(id);
      } else {
        menu.classList.remove("mobile-bottom", "open");
        menu.classList.toggle("hidden");
      }
    });
  });

  document.querySelectorAll(".close-dropdown").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (isMobile()) {
        closeMobileMenu();
      } else {
        this.closest(".dropdown-menu")?.classList.add("hidden");
      }
    });
  });

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileMenu);
  }
}

// ===== Seller Actions =====
export function setupSellerActions(
  approveBtnId,
  rejectBtnId,
  statusBadgeId,
  completionLabelId
) {
  const approveBtn = document.getElementById(approveBtnId);
  const rejectBtn = document.getElementById(rejectBtnId);
  const statusBadge = document.getElementById(statusBadgeId);
  const completionLabel = document.getElementById(completionLabelId);

  if (approveBtn) {
    approveBtn.addEventListener("click", () => {
      if (statusBadge) {
        statusBadge.textContent = "تایید شده";
        statusBadge.className =
          "rounded-[5px] bg-[#dcf6e8] px-3 py-2 text-[12px] font-medium text-[#16864a]";
      }
      if (completionLabel)
        completionLabel.textContent = "اطلاعات فروشگاه تایید شد";
      showToast("فروشگاه با موفقیت تایید شد.");
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      if (statusBadge) {
        statusBadge.textContent = "رد شده";
        statusBadge.className =
          "rounded-[5px] bg-[#fde3e3] px-3 py-2 text-[12px] font-medium text-[#c53a3a]";
      }
      showToast("فروشگاه رد شد.");
    });
  }
}

// ===== More Menu =====
export function setupMoreMenu(btnId, menuId) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  if (!btn || !menu) return;

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    const hidden = menu.classList.toggle("hidden");
    this.setAttribute("aria-expanded", String(!hidden));
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(`#${btnId}`) && !e.target.closest(`#${menuId}`)) {
      menu.classList.add("hidden");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.classList.add("hidden");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  });
}
