

document.addEventListener("DOMContentLoaded", () => {
  initModals();
  initTabsUsers();
  initTabs();
  initStatusFilter();
  initPagination();
  initpaymentFilter();
});

/* =======================
          Modal Management
   ======================= */
function initModals() {
  // Get all modal elements
  const modalNatural = document.getElementById("modal_form_natural");
  const modalLegal = document.getElementById("model_edid_form_legal_entity");
  const overlay = document.getElementById("overlay");

  const openNatural = document.getElementById("open_model_edid_form_natural");
  const closeNatural = document.getElementById("close_model_edid_form_natural");
  const openLegal = document.getElementById(
    "open_model_edid_form_legal_entity"
  );
  const closeLegal = document.getElementById(
    "close_model_edid_form_legal_entity"
  );

  // Return if essential elements don't exist
  if (!overlay) return;

  // Helper functions
  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    document.body.style.overflow = "auto";
  }

  function showOverlay() {
    overlay.classList.remove("invisible", "opacity-0");
    overlay.classList.add("opacity-50", "transition-opacity", "duration-500");
  }

  function hideOverlay() {
    overlay.classList.add("invisible", "opacity-0");
    overlay.classList.remove(
      "opacity-50",
      "transition-opacity",
      "duration-500"
    );
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    showOverlay();
    lockBodyScroll();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    hideOverlay();
    unlockBodyScroll();
  }

  // Add event listeners for natural person modal
  if (openNatural && modalNatural) {
    openNatural.addEventListener("click", () => openModal(modalNatural));
  }

  if (closeNatural && modalNatural) {
    closeNatural.addEventListener("click", () => closeModal(modalNatural));
  }

  // Add event listeners for legal entity modal
  if (openLegal && modalLegal) {
    openLegal.addEventListener("click", () => openModal(modalLegal));
  }

  if (closeLegal && modalLegal) {
    closeLegal.addEventListener("click", () => closeModal(modalLegal));
  }

  // Close modal when clicking on overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      if (modalNatural && !modalNatural.classList.contains("hidden")) {
        closeModal(modalNatural);
      }
      if (modalLegal && !modalLegal.classList.contains("hidden")) {
        closeModal(modalLegal);
      }
    });
  }
}

/* =======================
           Tabs (حقیقی / حقوقی)
   ======================= */
function initTabsUsers() {
  const tabButtons = document.querySelectorAll(".profile-tab-btn");
  const tabContents = document.querySelectorAll(".profile-tab-content");

  if (!tabButtons.length || !tabContents.length) return;

  function deactivateAllButtons() {
    tabButtons.forEach((btn) => {
      btn.classList.remove(
        "active-tab",
        "border-b-4",
        "border-custom-brown",
        "text-custom-brown"
      );
      btn.classList.add("bg-transparent", "text-[#262626]");
    });
  }

  function activateButton(button) {
    button.classList.add(
      "active-tab",
      "border-b-4",
      "border-custom-brown",
      "text-custom-brown"
    );
    button.classList.remove("bg-transparent", "text-[#262626]");
  }

  function hideAllContents() {
    tabContents.forEach((content) => {
      content.classList.add("hidden");
      content.classList.remove("active-tab");
    });
  }

  function showContent(tabId) {
    const content = document.getElementById(`${tabId}-form`);
    if (content) {
      content.classList.remove("hidden");
      content.classList.add("active-tab");
    }
  }

  // Add click handlers to all tab buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.dataset.tab;

      deactivateAllButtons();
      activateButton(this);
      hideAllContents();
      showContent(targetTab);
    });
  });

  // Activate first tab by default
  if (tabButtons.length > 0) {
    const firstTab = tabButtons[0];
    const firstTabId = firstTab.dataset.tab;

    deactivateAllButtons();
    activateButton(firstTab);
    hideAllContents();
    showContent(firstTabId);
  }
}
/* =======================
           Tabs (سفارش‌ها / پرداخت‌ها)
 ======================= */
function initTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  const order_tab = document.querySelector(".order_tab");
  const payment_tab = document.querySelector(".payment_tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // حذف حالت active از همه تب‌ها
      tabs.forEach((t) => {
        t.classList.remove(
          "text-custom-brown",
          "border-b-[3px]",
          "border-custom-brown"
        );
        t.classList.add("text-gray-700");
      });

      // فعال کردن تب کلیک‌شده
      tab.classList.remove("text-gray-700");
      tab.classList.add(
        "text-custom-brown",
        "border-b-[3px]",
        "border-custom-brown"
      );

      // در آینده: سوییچ محتوا
      //  | "payments"

      if (tab.dataset.tab === "orders") {
        order_tab.classList.remove("hidden");
        payment_tab.classList.add("hidden");
      } else if (tab.dataset.tab === "payments") {
        payment_tab.classList.remove("hidden");
        order_tab.classList.add("hidden");
      }
    });
  });
}

/* =======================
           Status Filter (فعال، پایان‌یافته، لغو)
        ======================= */
function initStatusFilter() {
  const statusButtons = document.querySelectorAll("[data-status]");
  const orders = document.querySelectorAll("[data-order]");
  const emptyState = document.getElementById("emptyState");

  if (!statusButtons.length || !orders.length || !emptyState) return;

  const DEFAULT_STATUS = "active";

  function applyFilter(status) {
    let hasVisibleOrder = false;

    orders.forEach((order) => {
      if (order.dataset.status === status) {
        order.classList.remove("hidden");
        hasVisibleOrder = true;
      } else {
        order.classList.add("hidden");
      }
    });

    // نمایش یا مخفی کردن Empty State
    if (hasVisibleOrder) {
      emptyState.classList.add("hidden");
    } else {
      emptyState.classList.remove("hidden");
    }
  }

  // فیلتر اولیه
  applyFilter(DEFAULT_STATUS);

  statusButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // UI تب‌ها
      statusButtons.forEach((b) => {
        b.classList.remove(
          "text-custom-brown",
          "border-b-[3px]",
          "border-custom-brown"
        );
        b.classList.add("text-gray-700");
      });

      btn.classList.add(
        "text-custom-brown",
        "border-b-[3px]",
        "border-custom-brown"
      );
      btn.classList.remove("text-gray-700");

      // فیلتر واقعی
      applyFilter(btn.dataset.status);
    });
  });
}

/* =======================
           Pagination
        ======================= */
function initPagination() {
  const pages = document.querySelectorAll("[data-page]");

  if (!pages.length) return;

  pages.forEach((page) => {
    page.addEventListener("click", () => {
      // حذف active از همه صفحات
      pages.forEach((p) => {
        p.classList.remove("bg-custom-brown", "text-white", "rounded-full");
        p.classList.add("text-gray-700");
      });

      // فعال کردن صفحه انتخاب‌شده
      page.classList.remove("text-gray-700");
      page.classList.add("bg-custom-brown", "text-white", "rounded-full");

      const pageNumber = page.dataset.page;
      // loadOrders(pageNumber)
    });
  });
}

function initpaymentFilter() {
  // Toggle dropdowns
  const sortBtn = document.getElementById("sortBtn");
  const sortDropdown = document.getElementById("sortDropdown");
  const sortLabel = document.getElementById("sortLabel");

  const statusBtn = document.getElementById("statusBtn");
  const statusDropdown = document.getElementById("statusDropdown");
  const statusLabel = document.getElementById("statusLabel");

  sortBtn.addEventListener("click", () => {
    sortDropdown.classList.toggle("hidden");
  });

  statusBtn.addEventListener("click", () => {
    statusDropdown.classList.toggle("hidden");
  });

  // Close dropdowns if clicked outside
  document.addEventListener("click", (e) => {
    if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
      sortDropdown.classList.add("hidden");
    }
    if (!statusBtn.contains(e.target) && !statusDropdown.contains(e.target)) {
      statusDropdown.classList.add("hidden");
    }
  });

  // Sorting functionality
  const paymentsContainer = document.getElementById("paymentsContainer");
  sortDropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const sortType = item.dataset.sort;
      sortLabel.textContent = sortType;
      sortDropdown.classList.add("hidden");

      const rows = Array.from(
        paymentsContainer.querySelectorAll("[data-payment]")
      );
      rows.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return sortType === "جدیدترین" ? dateB - dateA : dateA - dateB;
      });
      rows.forEach((row) => paymentsContainer.appendChild(row));
    });
  });

  // Status filter functionality
  statusDropdown.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const status = item.dataset.status;
      statusLabel.textContent = item.textContent;
      statusDropdown.classList.add("hidden");

      paymentsContainer.querySelectorAll("[data-payment]").forEach((row) => {
        if (status === "all" || row.dataset.status === status) {
          row.classList.remove("hidden");
        } else {
          row.classList.add("hidden");
        }
      });
    });
  });
}

 