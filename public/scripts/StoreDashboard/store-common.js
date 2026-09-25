// ============================================================
// store-common.js - با fix کامل popup
// ============================================================

(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const toFa = (v) => String(v).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const toEn = (v) => String(v).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  const money = (v) => {
    if (v === null || v === undefined || v === "") return "۰";
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    if (isNaN(n)) return String(v);
    return toFa(n.toLocaleString("en-US"));
  };
  const parseNumber = (v) => Number(String(v || "").replace(/[^\d]/g, "")) || 0;

  // ========== TOAST ==========
  let toastTimer = null;
  function showToast(msg, type = "default", dur = 2500) {
    const t = document.getElementById("toast");
    if (!t) { console.log("[Toast]", msg); return; }
    t.style.background = type === "success" ? "#19864b" :
                        type === "error" ? "#c53a3a" :
                        type === "warning" ? "#d98b15" : "#333";
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add("hidden"), dur);
  }

  // ========== MOBILE ==========
  function isMobile() { return window.innerWidth < 768; }
  function getOverlay() { return document.getElementById("popupOverlay"); }

  // ========== BOTTOM SHEET (موبایل) ==========
  let activeMobileMenu = null;

  function openMobileMenu(id) {
    closeMobileMenu();
    const menu = document.getElementById(id);
    if (!menu) return;
    $$("[data-popup]").forEach((m) => {
      if (m.id !== id) m.classList.add("hidden");
    });
    if (isMobile()) {
      menu.classList.add("mobile-bottom");
      menu.classList.remove("hidden");
      const ov = getOverlay();
      if (ov) { ov.classList.add("show"); ov.style.display = "block"; }
      document.body.classList.add("overflow-hidden");
      requestAnimationFrame(() => menu.classList.add("open"));
      activeMobileMenu = id;
    }
  }

  function closeMobileMenu() {
    if (!activeMobileMenu) return;
    const menu = document.getElementById(activeMobileMenu);
    if (menu) {
      menu.classList.remove("open");
      setTimeout(() => {
        menu.classList.add("hidden");
        menu.classList.remove("mobile-bottom");
      }, 300);
    }
    const ov = getOverlay();
    if (ov) { ov.classList.remove("show"); ov.style.display = "none"; }
    document.body.classList.remove("overflow-hidden");
    activeMobileMenu = null;
  }

  // ========== MODAL ==========
  let activeModal = null;
  let activeBackdrop = null;

  function openModal(modalId, backdropId = null) {
    const m = document.getElementById(modalId);
    if (!m) { console.warn("Modal not found:", modalId); return; }
    document.querySelectorAll(".store-modal").forEach((x) => {
      if (x.id !== modalId) {
        x.classList.add("hidden");
        x.classList.remove("modal-open");
      }
    });
    m.classList.remove("hidden");
    void m.offsetWidth;
    m.classList.add("modal-open");
    const b = backdropId ? document.getElementById(backdropId) : null;
    if (b) b.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    activeModal = modalId;
    activeBackdrop = backdropId;
  }

  function closeModal(modalId = null) {
    const id = modalId || activeModal;
    if (id) {
      const m = document.getElementById(id);
      if (m) {
        m.classList.remove("modal-open");
        setTimeout(() => m.classList.add("hidden"), 200);
      }
    }
    if (activeBackdrop) {
      const b = document.getElementById(activeBackdrop);
      if (b) b.classList.add("hidden");
    }
    document.body.classList.remove("overflow-hidden");
    activeModal = null;
    activeBackdrop = null;
  }

  function closeAllModals() {
    document.querySelectorAll(".store-modal").forEach((m) => {
      m.classList.add("hidden");
      m.classList.remove("modal-open");
    });
    ["modalBackdrop","modalOverlay","popupOverlay","settlementBackdrop",
     "bankModalBackdrop","deleteBankBackdrop","feedbackBackdrop",
     "productModalBackdrop","cancelBackdrop","txFilterBackdrop",
     "filterBackdrop","drawerBackdrop"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    document.body.classList.remove("overflow-hidden");
    activeModal = null;
    activeBackdrop = null;
  }

  // ========== FILTER DRAWER ==========
  function openFilterDrawer() {
    const d = document.getElementById("filterDrawer") || document.getElementById("txFilterDrawer");
    const b = document.getElementById("filterBackdrop") || document.getElementById("txFilterBackdrop") || document.getElementById("drawerBackdrop");
    if (d) { d.classList.remove("translate-x-full"); d.classList.add("open"); d.setAttribute("aria-hidden","false"); }
    if (b) b.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }

  function closeFilterDrawer() {
    const d = document.getElementById("filterDrawer") || document.getElementById("txFilterDrawer");
    const b = document.getElementById("filterBackdrop") || document.getElementById("txFilterBackdrop") || document.getElementById("drawerBackdrop");
    if (d) { d.classList.add("translate-x-full"); d.classList.remove("open"); d.setAttribute("aria-hidden","true"); }
    if (b) b.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }

  // ========== PAGINATION ==========
  function renderPagination(containerId, currentPage, totalPages, onPageClick) {
    const c = document.getElementById(containerId);
    if (!c) return;
    if (totalPages <= 1) { c.innerHTML = ""; return; }

    let html = "";
    const maxV = 5;
    let start = Math.max(1, currentPage - Math.floor(maxV / 2));
    let end = Math.min(totalPages, start + maxV - 1);
    if (end - start < maxV - 1) start = Math.max(1, end - maxV + 1);

    html += `<button class="page-btn store-page-btn" data-page="${currentPage - 1}" ${currentPage <= 1 ? "disabled" : ""} aria-label="قبلی">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>`;

    if (start > 1) {
      html += `<button class="page-num store-page-num" data-page="1">۱</button>`;
      if (start > 2) html += `<span class="px-1 text-gray-400">...</span>`;
    }

    for (let i = start; i <= end; i++) {
      const active = i === currentPage ? "bg-brand-700 text-white" : "hover:bg-gray-100 text-gray-700";
      html += `<button class="page-num store-page-num ${active}" data-page="${i}">${toFa(i)}</button>`;
    }

    if (end < totalPages) {
      if (end < totalPages - 1) html += `<span class="px-1 text-gray-400">...</span>`;
      html += `<button class="page-num store-page-num" data-page="${totalPages}">${toFa(totalPages)}</button>`;
    }

    html += `<button class="page-btn store-page-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages ? "disabled" : ""} aria-label="بعدی">
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
      </svg>
    </button>`;

    c.innerHTML = html;
    c.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const p = parseInt(this.dataset.page, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages && p !== currentPage) onPageClick(p);
      });
    });
  }

  // ========== DEBOUNCE ==========
  function debounce(fn, delay = 300) {
    let t = null;
    return function (...a) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, a), delay);
    };
  }

  // ========== MORE MENU ==========
  function setupMoreMenu(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("hidden");
      this.setAttribute("aria-expanded", String(!menu.classList.contains("hidden")));
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(`#${btnId}`) && !e.target.closest(`#${menuId}`)) {
        menu.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ========== FLOATING MENU ==========
  function closeFloatingMenus() {
    $$(".floating-menu").forEach((m) => m.remove());
  }

  function openFloatingMenu(trigger, html, opts = {}) {
    closeFloatingMenus();
    const rect = trigger.getBoundingClientRect();
    const menu = document.createElement("div");
    menu.className = "floating-menu fixed z-[9999] overflow-hidden rounded-xl border border-[#e2e2e2] bg-white py-1 shadow-menu fade-in";
    menu.style.width = opts.width || "190px";
    const top = Math.min(rect.bottom + 6, window.innerHeight - (opts.height || 220));
    const left = Math.max(10, rect.left - (opts.offsetX || 150));
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.innerHTML = html;
    document.body.appendChild(menu);
    return menu;
  }

  // ============================================================
  // DROPDOWN TRIGGERS — popup داخل relative خودش می‌مونه
  // ============================================================
  function setupDropdownTriggers() {
    const triggers = $$("[data-popup-trigger], [data-dropdown]");
    console.log("[StoreUI] trigger count:", triggers.length);

    triggers.forEach((btn) => {
      if (btn._popupBound) return;
      btn._popupBound = true;

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const key = this.dataset.popupTrigger || this.dataset.dropdown;
        const menu =
          document.getElementById(key) ||
          document.getElementById(`popup-${key}`) ||
          document.querySelector(`[data-popup="${key}"]`);

        if (!menu) {
          console.warn("[StoreUI] popup not found:", key);
          return;
        }

        const isOpen = !menu.classList.contains("hidden");

        if (isOpen) {
          menu.classList.add("hidden");
          menu.classList.remove("open", "mobile-bottom");
          return;
        }

        // بستن بقیه
        $$("[data-popup]").forEach((m) => {
          m.classList.add("hidden");
          m.classList.remove("open", "mobile-bottom");
        });

        if (isMobile()) {
          openMobileMenu(menu.id);
        } else {
          // ⭐ دسکتاپ: نمایش داخل relative خودش، z-index بالا
          menu.classList.remove("mobile-bottom", "open", "hidden");
          menu.style.zIndex = "9999";

          // اطمینان از اینکه والدش overflow نداره
          let parent = menu.parentElement;
          while (parent && parent !== document.body) {
            const style = window.getComputedStyle(parent);
            if (style.overflow === "hidden" || style.overflowY === "hidden") {
              parent.style.overflow = "visible";
            }
            parent = parent.parentElement;
          }
        }
      });
    });

    // بستن
    $$("[data-close-popup], [data-close-dropdown]").forEach((b) => {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        const p = this.closest("[data-popup]");
        if (isMobile()) closeMobileMenu();
        else if (p) p.classList.add("hidden");
      });
    });

    const ov = getOverlay();
    if (ov) ov.addEventListener("click", closeMobileMenu);

    // کلیک بیرون
    document.addEventListener("click", function (e) {
      if (isMobile()) return;
      if (e.target.closest("[data-popup]")) return;
      if (e.target.closest("[data-popup-trigger]")) return;
      if (e.target.closest("[data-dropdown]")) return;

      $$("[data-popup]").forEach((m) => {
        if (!m.classList.contains("hidden")) {
          m.classList.add("hidden");
          m.classList.remove("open", "mobile-bottom");
        }
      });
    });

    // ESC
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      closeMobileMenu();
      closeFilterDrawer();
      closeAllModals();
      closeFloatingMenus();
      $$("[data-popup]").forEach((m) => {
        m.classList.add("hidden");
        m.classList.remove("open", "mobile-bottom");
      });
    });

    // Floating menu close
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".floating-menu") && !e.target.closest("[data-floating-trigger]")) {
        closeFloatingMenus();
      }
    });
  }

  // ========== FILTER DRAWER SETUP ==========
  function setupFilterDrawer() {
    document.querySelectorAll(".openDrawerBtn, [data-open-filter], [data-open-tx-filter]").forEach((b) => {
      if (b._filterBound) return;
      b._filterBound = true;
      b.addEventListener("click", (e) => { e.preventDefault(); openFilterDrawer(); });
    });
    document.querySelectorAll("#closeDrawer, [data-close-drawer], #closeTxFilterDrawer, #closeTransactionFilters").forEach((b) => {
      if (b._filterCloseBound) return;
      b._filterCloseBound = true;
      b.addEventListener("click", (e) => { e.preventDefault(); closeFilterDrawer(); });
    });
    const bd = document.getElementById("filterBackdrop") || document.getElementById("txFilterBackdrop") || document.getElementById("drawerBackdrop");
    if (bd && !bd._filterBdBound) {
      bd._filterBdBound = true;
      bd.addEventListener("click", closeFilterDrawer);
    }
  }

  // ========== RESIZE ==========
  function setupResizeHandler() {
    let t = null;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (!isMobile() && activeMobileMenu) closeMobileMenu();
      }, 200);
    });
  }

  // ========== STORE UI ==========
  const StoreUI = {
    $, $$, toFa, toEn, money, parseNumber, debounce, isMobile,
    showToast,
    openMobileMenu, closeMobileMenu,
    openModal, closeModal, closeAllModals,
    openFilterDrawer, closeFilterDrawer,
    openFloatingMenu, closeFloatingMenus,
    renderPagination,
    setupMoreMenu,
    setupDropdownTriggers,
    setupFilterDrawer,
    setupEscapeHandler: () => {},
    setupClickOutside: () => {},

    init() {
      console.log("[StoreUI] init");
      setupDropdownTriggers();
      setupFilterDrawer();
      setupResizeHandler();
    },
  };

  window.StoreUI = StoreUI;
})();