
(function () {
  ("use strict");

  // -------------------- Helpers --------------------
  const $ = (id) => document.getElementById(id) || null;
  const qs = (sel, root = document) => (root || document).querySelector(sel);
  const qsa = (sel, root = document) =>
    Array.from((root || document).querySelectorAll(sel || "") || []);

  const isNode = (v) => v && v.nodeType === 1;

  // safe class toggles (accepts token or array)
  const addClasses = (el, ...cls) => {
    if (!isNode(el)) return;
    el.classList.add(...cls.flat());
  };
  const removeClasses = (el, ...cls) => {
    if (!isNode(el)) return;
    el.classList.remove(...cls.flat());
  };

  // ---------------- Scroll Lock (Mobile Safe) ----------------
  const ScrollLock = (() => {
    let scrollY = 0;
    let locked = false;

    return {
      lock() {
        if (locked) return;
        locked = true;

        scrollY = window.scrollY || document.documentElement.scrollTop;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.body.classList.add("modal-open");
      },

      unlock() {
        if (!locked) return;
        locked = false;

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.classList.remove("modal-open");

        window.scrollTo(0, scrollY);
      },
    };
  })();

  // ---------------- Modal & Overlay Manager (singleton) ----------------
  const ModalManager = (function () {
    let overlay = null;
    const openSet = new Set();
    const listeners = [];

    function ensureOverlay() {
      overlay = $("overlay");
      if (!overlay) {
        // create fallback overlay if not present in HTML
        overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.className = "fixed inset-0 bg-black/50 hidden";
        document.body.appendChild(overlay);
      }
      return overlay;
    }

    function showOverlay() {
      const ov = ensureOverlay();
      ov.classList.remove("hidden", "invisible", "opacity-0");
      // prefer tailwind opacity utilities or fallback style
      ov.classList.add("opacity-50", "transition-opacity", "duration-500");
    }

    function hideOverlay() {
      const ov = ensureOverlay();
      ov.classList.add("invisible", "opacity-0");
      ov.classList.remove("opacity-50", "transition-opacity", "duration-500");
      ov.classList.add("hidden");
    }

    function register(modalEl) {
      if (!isNode(modalEl)) return;
      openSet.add(modalEl);
      modalEl.classList.remove("hidden");
      modalEl.classList.add("flex");
      showOverlay();
    }

    function unregister(modalEl) {
      if (!isNode(modalEl)) return;
      modalEl.classList.add("hidden");
      modalEl.classList.remove("flex");
      openSet.delete(modalEl);
      if (openSet.size === 0) hideOverlay();
    }

    function closeAll() {
      openSet.forEach((m) => {
        try {
          m.classList.add("hidden");
          m.classList.remove("flex");
        } catch (e) {}
      });
      openSet.clear();
      hideOverlay();
    }

    function onOverlayClick(e) {
      const ov = ensureOverlay();
      if (e.target === ov) closeAll();
    }

    function onEsc(e) {
      if (e.key === "Escape") closeAll();
    }

    // init global listeners once
    function init() {
      ensureOverlay();
      listeners.push({ t: document, e: "click", fn: onOverlayClick });
      listeners.push({ t: document, e: "keydown", fn: onEsc });
      listeners.forEach((h) => h.t.addEventListener(h.e, h.fn));
    }

    function destroy() {
      listeners.forEach((h) => h.t.removeEventListener(h.e, h.fn));
      listeners.length = 0;
      openSet.clear();
      overlay = null;
    }

    // initialize immediately
    init();

    return {
      register,
      unregister,
      closeAll,
      ensureOverlay,
      showOverlay,
      hideOverlay,
      destroy,
    };
  })();

  // -------------------- Main Module --------------------
  const ShopRegistrationModule = (function () {
    // configurable DATA (provinces) - قابل تزریق از بیرون
    let PROVINCE_DATA = [
      {
        id: "tehran",
        name: "تهران",
        cities: ["تهران", "شمیرانات", "ری", "اسلامشهر"],
      },
      {
        id: "mazandaran",
        name: "مازندران",
        cities: ["ساری", "بابلسر", "نوشهر"],
      },
      {
        id: "yazd",
        name: "یزد",
        cities: ["میبد", "یزد", "تفت"],
      },
      {
        id: "khorasan",
        name: "خراسان رضوی",
        cities: ["مشهد", "نیشابور", "سبزوار"],
      },
      { id: "ardabil", name: "اردبیل", cities: ["اردبیل", "مشکین‌شهر"] },
    ];

    // نگهدارنده handler ها برای cleanup
    const _handlers = [];

    // helper: store handler ref
    function _on(target, ev, fn, opts) {
      if (!target || !fn) return;
      target.addEventListener(ev, fn, opts);
      _handlers.push({ target, ev, fn, opts });
    }
    function _offAll() {
      _handlers.forEach((h) => {
        try {
          h.target.removeEventListener(h.ev, h.fn, h.opts);
        } catch (e) {}
      });
      _handlers.length = 0;
    }

    // ---------------- 1) Form validation ----------------
    function initShopFormValidation() {
      const form = $("shop-form");
      if (!form) return;

      const onSubmit = function (e) {
        e.preventDefault();
        let isValid = true;

        qsa("input[required], textarea[required]", form).forEach((input) => {
          const parent = input.parentElement;
          const errorMsg = parent ? parent.querySelector(".error-msg") : null;
          const errorIcon = parent ? parent.querySelector(".error-icon") : null;
          const val = (input.value || "").trim();

          if (!val) {
            input.classList.add("error");
            if (errorMsg) errorMsg.classList.remove("hidden");
            if (errorIcon) errorIcon.classList.remove("hidden");
            isValid = false;
          } else {
            input.classList.remove("error");
            if (errorMsg) errorMsg.classList.add("hidden");
            if (errorIcon) errorIcon.classList.add("hidden");
          }
        });

        // example: email format validation (if exists)
        const email = form.querySelector('input[type="email"][required]');
        if (email && email.value) {
          const ok = /^\S+@\S+\.\S+$/.test(email.value.trim());
          if (!ok) {
            isValid = false;
            email.classList.add("error");
            const parent = email.parentElement;
            const errorMsg = parent ? parent.querySelector(".error-msg") : null;
            if (errorMsg) {
              errorMsg.textContent = "ایمیل نامعتبر است";
              errorMsg.classList.remove("hidden");
            }
          }
        }

        if (isValid) {
          // اگر لازم بود از AJAX استفاده کنی، اینجا جای مناسب است.
          form.submit();
        }
      };

      _on(form, "submit", onSubmit);
    }

    function initOptionCards() {
      // اگر کارت‌ها وجود ندارن، کد اجرا نشه
      const optionCards = document.querySelectorAll(".option-card");
      const confirmBtn = document.getElementById("confirm-btn");

      if (!optionCards.length || !confirmBtn) return;

      optionCards.forEach((card) => {
        card.addEventListener("click", () => {
          // حذف حالت انتخاب از همه کارت‌ها
          optionCards.forEach((c) => {
            c.classList.remove(
              "border-[#b64832]",
              "bg-[#fef4f2]",
              "shadow-sm",
              "border-custom-brown",
              "bg-[#F5EDEB]"
            );
            c.classList.add("border-[#CCCCCC]", "bg-[#FCFCFC]");
          });

          // افزودن حالت انتخاب به کارت کلیک‌شده
          card.classList.remove("border-[#CCCCCC]", "bg-[#FCFCFC]");
          card.classList.add("border-custom-brown", "bg-[#F5EDEB]");

          // فعال کردن دکمه تأیید
          confirmBtn.disabled = false;
          confirmBtn.classList.remove(
            "bg-[#F5EDEB]",
            "cursor-not-allowed",
            "text-[#CCCCCC]"
          );
          confirmBtn.classList.add("bg-custom-brown", "text-white");
        });
      });
    }

    // ---------------- 2) Enable edit mode ----------------

    function initCategorySelection() {
      if (!document.querySelector(".store_registration_step_1")) return;

      const categoryCards = qsa(".category-card");
      const confirmBtn = $("confirm-btn");
      if (!confirmBtn) return;

      function detectSelected(card) {
        // پذیرفتن دو نوع: کلاس جدید is-selected یا کلاس رنگ قدیمی
        return (
          card.classList.contains("is-selected") ||
          /\bbg-\[?#?F5EDEB\]?\b/.test(card.className) ||
          card.classList.contains("bg-[#F5EDEB]")
        );
      }

      function setSelected(card, val) {
        if (val) {
          card.classList.add("is-selected", "border", "border-custom-brown");
          // remove legacy unselected color if present
          card.classList.remove("bg-[#F5F5F5]");
          // optionally add color class if your Tailwind supports it
          // card.classList.add("bg-[#F5EDEB]");
        } else {
          card.classList.remove("is-selected", "border", "border-custom-brown");
          // fallback color
          // card.classList.remove("bg-[#F5EDEB]");
          card.classList.add("bg-[#F5F5F5]");
        }
      }

      function updateConfirmButton() {
        const selectedCount = document.querySelectorAll(
          ".category-card.is-selected"
        ).length;
        const active = selectedCount > 0;
        confirmBtn.disabled = !active;
        if (active) {
          removeClasses(
            confirmBtn,
            "bg-[#F5EDEB]",
            "cursor-not-allowed",
            "text-[#CCCCCC]"
          );
          addClasses(confirmBtn, "bg-custom-brown", "text-white");
        } else {
          addClasses(
            confirmBtn,
            "bg-[#F5EDEB]",
            "cursor-not-allowed",
            "text-[#CCCCCC]"
          );
          removeClasses(confirmBtn, "bg-custom-brown", "text-white");
        }
      }

      categoryCards.forEach((card) => {
        const fn = () => {
          const selected = detectSelected(card);
          setSelected(card, !selected);
          updateConfirmButton();
        };
        _on(card, "click", fn);
      });

      updateConfirmButton();
    }

    // ---------------- 4) Modal form + success alert ----------------
    function initModalFormLogic() {
      const openBtn = $("open-modal-btn");
      const modalForm = $("modal-form");
      const successAlert = $("success-alert");
      const confirmBtnAdd = $("confirm-btn-add");
      const closeModalBtns = qsa("#close-modal-btn, #cancel-btn");
      const closeAlertBtns = qsa("#close-alert-btn, #close-alert-submit");

      if (!openBtn || !modalForm) return;

      const openFn = () => {
        ModalManager.register(modalForm);
        if (successAlert) successAlert.classList.add("hidden");
        const nameInput = $("category-name");
        if (nameInput) nameInput.value = "";
      };
      const closeFn = () => {
        ModalManager.unregister(modalForm);
      };

      _on(openBtn, "click", openFn);
      closeModalBtns.forEach((btn) => _on(btn, "click", closeFn));

      if (confirmBtnAdd) {
        _on(confirmBtnAdd, "click", () => {
          const nameInput = $("category-name");
          const name = nameInput ? nameInput.value.trim() : "";
          if (!name) {
            alert("لطفاً نام و توضیحات را وارد کنید.");
            return;
          }
          // TODO: ارسال به سرور یا ذخیره محلی
          ModalManager.unregister(modalForm);
          if (successAlert) successAlert.classList.remove("hidden");
        });
      }

      const closeSuccessAlert = () => {
        if (successAlert) successAlert.classList.add("hidden");
        ModalManager.hideOverlay?.();
      };
      closeAlertBtns.forEach((btn) => _on(btn, "click", closeSuccessAlert));

      // اگر کاربر روی overlay کلیک کرد، ModalManager مرکزی آن را مدیریت می‌کند
    }

    // ---------------- 5) Province / City modals ----------------
    let _selectedProvince = null;

    function initProvinceCityModals(options = {}) {
      if(!document.querySelector(".store_registration_step_2")) return;

        if (Array.isArray(options.DATA)) {
          window.PROVINCE_DATA = options.DATA;
        }

      const provField = document.getElementById("province-field");
      const cityField = document.getElementById("city-field");

      const provinceModal = document.getElementById("province-modal");
      const provinceBox = document.getElementById("province-box");
      const provinceSearch = document.getElementById("province-search");
      const provinceList = document.getElementById("province-list");
      const provCloseBtn = document.getElementById("province-close-btn");

      const cityModal = document.getElementById("city-modal");
      const cityBox = document.getElementById("city-box");
      const citySearch = document.getElementById("city-search");
      const cityList = document.getElementById("city-list");
      const cityCloseBtn = document.getElementById("city-close-btn");

      let selectedProvince = null;

      /* ---------- Helpers ---------- */

      const clearList = (el) => (el.innerHTML = "");

      const createRow = (text, onClick) => {
        const div = document.createElement("div");
        div.className =
          "px-3 py-4 hover:bg-gray-100 cursor-pointer rounded-2xl flex justify-between items-center";
        div.textContent = text;
        div.addEventListener("click", onClick);
        return div;
      };

      /* ---------- Render ---------- */

      function renderProvinces(filter = "") {
        clearList(provinceList);
        const q = filter.trim();

        const items = PROVINCE_DATA.filter((p) => p.name.includes(q));

        if (!items.length) {
          provinceList.innerHTML =
            '<div class="px-3 py-3 text-sm text-gray-500">یافت نشد</div>';
          return;
        }

        items.forEach((p) => {
          const row = createRow(p.name, () => {
            selectedProvince = p;
            provField.value = p.name;

            cityField.disabled = false;
            cityField.placeholder = "انتخاب شهر";
            cityField.value = "";

            closeProvinceModal();
          });

          const arrow = document.createElement("svg");
          arrow.textContent = "›";
          row.appendChild(arrow);

          provinceList.appendChild(row);
          provinceList.appendChild(document.createElement("hr"));
        });
      }

      function renderCities(filter = "") {
        clearList(cityList);

        if (!selectedProvince) {
          cityList.innerHTML =
            '<div class="px-3 py-3 text-sm text-gray-500">ابتدا استان را انتخاب کنید</div>';
          return;
        }

        const q = filter.trim();
        const items = (selectedProvince.cities || []).filter((c) =>
          c.includes(q)
        );

        if (!items.length) {
          cityList.innerHTML =
            '<div class="px-3 py-3 text-sm text-gray-500">یافت نشد</div>';
          return;
        }

        items.forEach((c) => {
          const row = createRow(c, () => {
            cityField.value = c;
            closeCityModal();
          });

          cityList.appendChild(row);
          cityList.appendChild(document.createElement("hr"));
        });
      }

      /* ---------- Modal Controls ---------- */

      function openProvinceModal() {
        ModalManager.register(provinceModal);
        provinceBox.classList.add("active");
        ScrollLock.lock();
      }

      function closeProvinceModal() {
        provinceBox.classList.remove("active");
        ModalManager.unregister(provinceModal);
        ScrollLock.unlock();
      }

      function openCityModal() {
        ModalManager.register(cityModal);
        cityBox.classList.add("active");
        ScrollLock.lock();
      }

      function closeCityModal() {
        cityBox.classList.remove("active");
        ModalManager.unregister(cityModal);
        ScrollLock.unlock();
      }


      /* ---------- Events ---------- */

      provField.addEventListener("click", () => {
        openProvinceModal();
        provinceSearch.value = "";
        renderProvinces();
      });

      cityField.addEventListener("click", () => {
        if (!selectedProvince) return;
        openCityModal();
        citySearch.value = "";
        renderCities();
      });

      provinceSearch.addEventListener("input", (e) =>
        renderProvinces(e.target.value)
      );

      citySearch.addEventListener("input", (e) => renderCities(e.target.value));

      provCloseBtn.addEventListener("click", closeProvinceModal);
      cityCloseBtn.addEventListener("click", closeCityModal);

      provinceModal.addEventListener("click", (e) => {
        if (e.target === provinceModal) closeProvinceModal();
      });

      cityModal.addEventListener("click", (e) => {
        if (e.target === cityModal) closeCityModal();
      });

      [provinceBox, cityBox].forEach((box) => {
        if (!box) return;

        box.addEventListener(
          "touchmove",
          (e) => {
            e.stopPropagation();
          },
          { passive: false }
        );
      });

      /* ---------- Init ---------- */

      cityField.disabled = true;
    }

    // ---------------- 6) Social modal + image previews ----------------
    function initSocialAndImages() {
      if (!document.querySelector(".store_refistration_step_3")) return;

      // ===== helpers (اگر قبلاً داری، اینا تداخلی ندارن) =====
      const $ = (id) => document.getElementById(id);
      const _on = (el, ev, fn) => el && el.addEventListener(ev, fn);

      // ===== Image Elements =====
      const leftBox = $("leftBox");
      const leftInput = $("leftInput");
      const leftPreview = $("leftPreview");
      const leftInitial = $("leftInitial");

      const rightBox = $("rightBox");
      const rightInput = $("rightInput");
      const rightImg = $("rightImg");
      const rightInitial = $("rightInitial");

      // ===== Social Modal Elements =====
      const socialModal = $("socialModal");
      if (!socialModal) return;

      const openBtn = $("openSocialModalBtn");
      const closeBtn = document.querySelector(".social_close");
      const closeBtnExit = document.querySelector(".social_close_exit");
      const confirmBtn = document.querySelector(".social_confirm");

      // ===== Modal Functions =====
      function openModalSocial() {
        socialModal.classList.remove("hidden");
        socialModal.classList.add("flex");
      }

      function closeModalSocial() {
        socialModal.classList.add("hidden");
        socialModal.classList.remove("flex");
      }

      // ===== Modal Events =====
      _on(openBtn, "click", openModalSocial);
      _on(closeBtn, "click", closeModalSocial);
      _on(closeBtnExit, "click", closeModalSocial);

      // کلیک روی بک‌دراپ
      _on(socialModal, "click", (e) => {
        if (e.target === socialModal) closeModalSocial();
      });

      // ===== Confirm Button =====
      _on(confirmBtn, "click", () => {
        const data = {
          instagram: socialModal
            .querySelector('input[placeholder="instagramid"]')
            ?.value.trim(),
          telegram: socialModal
            .querySelector('input[placeholder="لینک بدون @"]')
            ?.value.trim(),
          whatsapp: socialModal
            .querySelectorAll('input[placeholder="لینک بدون @"]')[1]
            ?.value.trim(),
        };

        console.log("Social Links:", data);

        // اینجا می‌تونی:
        // - ارسال به API
        // - ذخیره در فرم
        // - نمایش در صفحه

        closeModalSocial();
      });

      function previewMultipleImages(inputEl, previewEl, initialEl, boxEl) {
        if (!inputEl || !previewEl || !boxEl) return;

        const files = inputEl.files || [];
        previewEl.innerHTML = "";

        const maxImages = 4;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;

        // 🔹 فقط در موبایل حالت اولیه مخفی شود
        if (isMobile) {
          initialEl && initialEl.classList.add("hidden");
        } else {
          initialEl && initialEl.classList.remove("hidden");
        }
        previewEl.classList.remove("hidden");

        // 🔹 اگر موبایل بود → preview بره داخل box
        if (isMobile) {
          if (!boxEl.contains(previewEl)) {
            boxEl.appendChild(previewEl);
          }

          previewEl.className = "grid grid-cols-2 gap-2 w-full h-full p-2";
        } else {
          // 🔹 دسکتاپ → preview برگرده بیرون کنار باکس
          if (boxEl.contains(previewEl)) {
            boxEl.parentElement.appendChild(previewEl);
          }

          previewEl.className = "flex items-center gap-2";
        }

        // 🔹 ساخت تصاویر
        for (let i = 0; i < Math.min(files.length, maxImages); i++) {
          const file = files[i];
          if (!file.type.startsWith("image/")) continue;

          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");

            img.className = isMobile
              ? "w-full h-full rounded-md object-cover"
              : "w-[135px] h-[135px] rounded-lg object-cover mt-8";

            img.src = e.target.result;
            previewEl.appendChild(img);
          };

          reader.readAsDataURL(file);
        }

        // 🔹 more (...)
        if (files.length > maxImages) {
          const more = document.createElement("div");
          more.textContent = "…";

          more.className = isMobile
            ? "hidden"
            : "w-[135px] h-[135px] flex items-center justify-center border border-custom-brown rounded-lg text-5xl mt-8";

          previewEl.appendChild(more);
        }
      }


      function previewSingleImage(inputEl, imgEl, initialEl) {
        if (!inputEl || !imgEl) return;

        if (inputEl.files && inputEl.files[0]) {
          const file = inputEl.files[0];
          if (!file.type.startsWith("image/")) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            imgEl.src = e.target.result;
            initialEl && initialEl.classList.add("hidden");
            imgEl.parentElement &&
              imgEl.parentElement.classList.remove("hidden");
          };
          reader.readAsDataURL(file);
        }
      }

      // ===== Image Events =====
      _on(leftBox, "click", () => leftInput.click());
      _on(leftInput, "change", () =>
        previewMultipleImages(leftInput, leftPreview, leftInitial, leftBox)
      );

      _on(rightBox, "click", () => rightInput.click());
      _on(rightInput, "change", () =>
        previewSingleImage(rightInput, rightImg, rightInitial)
      );

      // ===== Expose =====
      window.openModalSocial = openModalSocial;
      window.closeModalSocial = closeModalSocial;
    }

    // ---------------- 7) Tabs ----------------
    function initProfileTabs() {
      const tabButtons = document.querySelectorAll(".profile-tab-btn");
      const tabContents = document.querySelectorAll(".profile-tab-content");
      if (!tabButtons.length || !tabContents.length) return;

      function setActiveProfileTab(tabName) {
        tabButtons.forEach((btn) => {
          removeClasses(
            btn,
            "active-tab",
            "border-b-4",
            "border-custom-brown",
            "text-custom-brown"
          );
          addClasses(btn, "bg-transparent", "text-[#262626]");
        });
        const targetBtn = [...tabButtons].find(
          (b) => b.dataset.tab === tabName
        );
        if (targetBtn) {
          addClasses(
            targetBtn,
            "active-tab",
            "border-b-4",
            "border-custom-brown",
            "text-custom-brown"
          );
          removeClasses(targetBtn, "bg-transparent", "text-[#262626]");
        }
        tabContents.forEach((c) => {
          addClasses(c, "hidden");
          removeClasses(c, "active-tab");
        });
        const target = document.getElementById(tabName + "-form");
        if (target) {
          removeClasses(target, "hidden");
          addClasses(target, "active-tab");
        }
      }

      tabButtons.forEach((button) => {
        const fn = function () {
          const targetTab = this.dataset.tab;
          if (targetTab) setActiveProfileTab(targetTab);
        };
        _on(button, "click", fn);
      });
    }

    // ---------------- 8) Worktime modal ----------------
    function initWorktimeModule() {
      if (!document.querySelector(".store_refistration_step_2")) return;

      const worktimeField = $("worktime-field");
      const modalWork = $("worktime-modal");
      const confirmBtn = $("worktime-confirm");
      const cancelBtn = $("worktime-cancel");
      const closeBtn = $("close-worktime");

      if (!worktimeField || !modalWork || !confirmBtn) return;

      // -----------------------------
      // Helpers
      // -----------------------------
      const qsa = (root, sel) => Array.from(root.querySelectorAll(sel));
      const qs = (root, sel) => root.querySelector(sel);

      function openWorktimeModal() {
        ModalManager.register(modalWork);
      }
      function closeWorktimeModal() {
        ModalManager.unregister(modalWork);
      }

      // Parse "H:MM صبح/شب" to minutes in 24h for comparing start/end
      function parseTimeToMinutes(val) {
        if (!val) return NaN;
        // Expected like: "8:30 صبح" or "12:05 شب"
        const m = val.match(/^(\d{1,2}):(\d{1,2})\s+(صبح|شب)$/);
        if (!m) return NaN;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const mer = m[3]; // "صبح" or "شب"
        if (isNaN(h) || isNaN(min) || min < 0 || min > 59 || h < 1 || h > 12)
          return NaN;

        // Convert to 24h minutes
        // 12 صبح -> 00:xx ; 12 شب -> 12:xx
        if (mer === "صبح") {
          if (h === 12) h = 0;
        } else if (mer === "شب") {
          if (h !== 12) h += 12;
        }
        return h * 60 + min;
      }

      function markInputError(input, hasError) {
        if (!input) return;
        input.classList.toggle("border-red-500", hasError);
        input.classList.toggle("border-[#CCCCCC]", !hasError);
      }

      function clearDayErrors(dayEl) {
        qsa(dayEl, ".timepicker-input").forEach((inp) =>
          markInputError(inp, false)
        );
      }

      // Validate a single day block (enabled days only)
      function validateDay(dayEl) {
        const enabledToggle = qs(dayEl, ".workday-toggle");
        const isEnabled = enabledToggle ? enabledToggle.checked : true;
        const errors = [];

        if (!isEnabled) {
          qsa(dayEl, ".timepicker-input").forEach(clearFieldError);
          return { valid: true, errors };
        }

        // Determine active shifts
        const twoShifts = qs(dayEl, ".two-shifts");
        const hasTwoShifts = !!twoShifts && twoShifts.checked;

        const shiftRows = qsa(dayEl, ".shift-row").filter((row) => {
          const idx = row.dataset.shift;
          return idx === "1" || (idx === "2" && hasTwoShifts);
        });

        if (shiftRows.length === 0) {
          errors.push("هیچ شیفت فعالی برای این روز انتخاب نشده است.");
        }

        // Validate each shift
        shiftRows.forEach((row) => {
          const [from, to] = qsa(row, ".timepicker-input");

          const fromVal = from?.value?.trim();
          const toVal = to?.value?.trim();

          const emptyFrom = !fromVal || fromVal === "-- : --";
          const emptyTo = !toVal || toVal === "-- : --";

          // ⛔ ساعت شروع
          if (emptyFrom) {
            showFieldError(from, "ساعت شروع را وارد کنید");
          } else {
            clearFieldError(from);
          }

          // ⛔ ساعت پایان
          if (emptyTo) {
            showFieldError(to, "ساعت پایان را وارد کنید");
          } else {
            clearFieldError(to);
          }

          if (emptyFrom || emptyTo) return;

          const fromMin = parseTimeToMinutes(fromVal);
          const toMin = parseTimeToMinutes(toVal);

          // ⛔ فرمت نامعتبر
          if (isNaN(fromMin)) {
            showFieldError(from, "فرمت ساعت شروع نامعتبر است");
            return;
          }

          if (isNaN(toMin)) {
            showFieldError(to, "فرمت ساعت پایان نامعتبر است");
            return;
          }

          // ⛔ ترتیب اشتباه
          if (fromMin >= toMin) {
            showFieldError(from, "ساعت شروع باید قبل از پایان باشد");
            showFieldError(to, "ساعت پایان باید بعد از شروع باشد");
          } else {
            clearFieldError(from);
            clearFieldError(to);
          }
        });

        return { valid: errors.length === 0, errors };
      }

      // Toggle UI for a day when enabling/disabling
      function applyDayEnabledUI(dayEl, enabled) {
        const content = qs(dayEl, ".workday-fields");
        if (content) {
          content.classList.toggle("opacity-50", !enabled);
          content.classList.toggle("pointer-events-none", !enabled);
        }
        // Optional: clear values when disabled
        if (!enabled) {
          qsa(dayEl, ".timepicker-input").forEach((inp) => {
            inp.value = "";
            markInputError(inp, false);
          });
        }
      }

      // Toggle second shift visibility
      function applyTwoShiftsUI(dayEl, two) {
        const shift2 = qsa(dayEl, ".shift-row").find(
          (r) => r.dataset.shift === "2"
        );
        if (shift2) {
          shift2.classList.toggle("hidden", !two);
          if (!two) {
            qsa(shift2, ".timepicker-input").forEach((inp) => {
              inp.value = "";
              markInputError(inp, false);
            });
          }
        }
      }

      const errorTimeoutMap = new WeakMap();

      function showFieldError(input, message, delay = 3000) {
        if (!input) return;

        // استایل خطا
        input.classList.remove("border-[#CCCCCC]");
        input.classList.add(
          "border-red-500",
          "transition-colors",
          "duration-300"
        );

        let error = input.parentElement.querySelector(".field-error");
        if (!error) {
          error = document.createElement("p");
          error.className =
            "field-error text-xs text-red-500 mt-1 transition-all duration-300";
          input.parentElement.appendChild(error);
        }

        // نمایش خطا (fade in)
        error.textContent = message;
        error.classList.remove("opacity-0", "max-h-0");
        error.classList.add("opacity-100", "max-h-20");

        // تایمر قبلی
        if (errorTimeoutMap.has(input)) {
          clearTimeout(errorTimeoutMap.get(input));
        }

        // حذف نرم (fade out)
        const timer = setTimeout(() => {
          hideFieldErrorSmooth(input);
          errorTimeoutMap.delete(input);
        }, delay);

        errorTimeoutMap.set(input, timer);
      }

      function hideFieldErrorSmooth(input) {
        if (!input) return;

        const error = input.parentElement.querySelector(".field-error");

        if (error) {
          error.classList.remove("opacity-100", "max-h-20");
          error.classList.add("opacity-0", "max-h-0");

          // بعد از انیمیشن مخفی کامل شود
          setTimeout(() => {
            error.textContent = "";
          }, 300);
        }

        // برگشت آرام بوردر
        input.classList.remove("border-red-500");
        input.classList.add(
          "border-[#CCCCCC]",
          "transition-colors",
          "duration-300"
        );
      }

      function clearFieldError(input) {
        if (!input) return;

        input.classList.remove("border-red-500");
        input.classList.add("border-[#CCCCCC]");

        const error = input.parentElement.querySelector(".field-error");
        if (error) {
          error.textContent = "";
          error.classList.add("hidden");
        }
      }

      function clearFieldError(input) {
        if (!input) return;

        input.classList.remove("border-red-500");
        input.classList.add("border-[#CCCCCC]");

        const error = input.parentElement.querySelector(".field-error");
        if (error) {
          error.textContent = "";
          error.classList.add("hidden");
        }
      }
      document.getElementById("tp-save")?.addEventListener("click", () => {
        const hour = parseInt(hourLabel.textContent, 10);
        const errors_time = document.querySelector(".errors_time");
        const minute = parseInt(minLabel.textContent, 10);

        if (!currentInput) return;

        if (!hour || hour < 1 || hour > 12) {
          showFieldError(errors_time, "لطفاً ساعت معتبر انتخاب کنید");
          return;
        }

        if (isNaN(minute) || minute < 0 || minute > 59) {
          showFieldError(errors_time, "لطفاً دقیقه معتبر انتخاب کنید");
          return;
        }

        clearFieldError(errors_time);

        currentInput.value = `${hour}:${String(minute).padStart(
          2,
          "0"
        )} ${meridiem}`;
        tpModal.classList.add("hidden");
      });

      function buildSummary() {
        const dayBlocks = qsa(modalWork, ".workday");
        const parts = [];

        dayBlocks.forEach((day) => {
          const enabled = qs(day, ".workday-toggle")?.checked ?? true;
          if (!enabled) return;

          const title = qs(day, ".workday-title")?.textContent?.trim() || "روز";

          const hasTwoShifts = qs(day, ".two-shifts")?.checked ?? false;

          const shiftRows = qsa(day, ".shift-row").filter((row) => {
            const idx = row.dataset.shift;
            return idx === "1" || (idx === "2" && hasTwoShifts);
          });

          const shiftTexts = [];

          shiftRows.forEach((row) => {
            const shiftIndex = row.dataset.shift;
            const inputs = qsa(row, ".timepicker-input");

            const fromVal = inputs[0]?.value?.trim();
            const toVal = inputs[1]?.value?.trim();

            // ❌ مقادیر خالی یا پیش‌فرض
            if (
              !fromVal ||
              !toVal ||
              fromVal === "-- : --" ||
              toVal === "-- : --"
            )
              return;

            // ❌ زمان نامعتبر
            const fromMin = parseTimeToMinutes(fromVal);
            const toMin = parseTimeToMinutes(toVal);
            if (isNaN(fromMin) || isNaN(toMin) || fromMin >= toMin) return;

            shiftTexts.push(`شیفت ${shiftIndex}: ${fromVal} تا ${toVal}`);
          });

          if (shiftTexts.length) {
            parts.push(`${title} (${shiftTexts.join(" | ")})`);
          }
        });

        return parts.length ? `انتخاب شده: ${parts.join(" ، ")}` : "";
      }

      // -----------------------------
      // Events: day toggles, two-shifts toggles
      // -----------------------------
      qsa(modalWork, ".workday").forEach((day) => {
        const toggle = qs(day, ".workday-toggle");
        const two = qs(day, ".two-shifts");

        if (toggle) {
          applyDayEnabledUI(day, toggle.checked);
          toggle.addEventListener("change", () => {
            applyDayEnabledUI(day, toggle.checked);
          });
        }
        if (two) {
          applyTwoShiftsUI(day, two.checked);
          two.addEventListener("change", () => {
            applyTwoShiftsUI(day, two.checked);
          });
        }
      });

      // -----------------------------
      // Timepicker (single modal reused for all inputs)
      // -----------------------------
      const tpModal = document.getElementById("timepicker-modal");
      let meridiem = "صبح";
      let currentInput = null;

      const hourPicker = document.getElementById("hour-picker");
      const hourLabel = document.getElementById("hour-picker-label");
      const hourDropdown = document.getElementById("hour-dropdown");
      const hourOptions = document.getElementById("hour-options");

      const minPicker = document.getElementById("min-picker");
      const minLabel = document.getElementById("min-picker-label");
      const minDropdown = document.getElementById("min-dropdown");
      const minOptions = document.getElementById("min-options");

      // Build hour options 1..12 once
      if (hourOptions && hourOptions.children.length === 0) {
        for (let h = 1; h <= 12; h++) {
          const li = document.createElement("li");
          li.textContent = h;
          li.className =
            "px-4 py-2 cursor-pointer hover:bg-[#9C4639]/10 hover:text-[#9C4639] transition rounded-lg mx-1";
          li.onclick = () => {
            hourLabel.textContent = h;
            hourDropdown.classList.add("hidden");
          };
          hourOptions.appendChild(li);
        }
      }
      // Build minute options 0..59 once
      if (minOptions && minOptions.children.length === 0) {
        for (let m = 0; m < 60; m++) {
          const li = document.createElement("li");
          li.textContent = m;
          li.className =
            "px-4 py-2 cursor-pointer hover:bg-[#9C4639]/10 hover:text-[#9C4639] transition rounded-lg mx-1";
          li.onclick = () => {
            minLabel.textContent = m;
            minDropdown.classList.add("hidden");
          };
          minOptions.appendChild(li);
        }
      }

      // Dropdown toggles
      hourPicker?.addEventListener("click", () =>
        hourDropdown.classList.toggle("hidden")
      );
      minPicker?.addEventListener("click", () =>
        minDropdown.classList.toggle("hidden")
      );

      // Close dropdowns on outside click
      document.addEventListener("click", (e) => {
        if (
          document.getElementById("min-picker-wrapper") &&
          !document.getElementById("min-picker-wrapper").contains(e.target)
        ) {
          minDropdown.classList.add("hidden");
        }
        if (
          document.getElementById("hour-picker-wrapper") &&
          !document.getElementById("hour-picker-wrapper").contains(e.target)
        ) {
          hourDropdown.classList.add("hidden");
        }
      });

      // Meridiem buttons
      const btnAm = document.getElementById("tp-am");
      const btnPm = document.getElementById("tp-pm");

      function updateMeridiemButtons() {
        const isAm = meridiem === "صبح";
        btnAm.classList.toggle("bg-[#9C4639]", isAm);
        btnAm.classList.toggle("text-white", isAm);
        btnAm.classList.toggle("bg-white", !isAm);
        btnAm.classList.toggle("text-[#262626]", !isAm);

        btnPm.classList.toggle("bg-[#9C4639]", !isAm);
        btnPm.classList.toggle("text-white", !isAm);
        btnPm.classList.toggle("bg-white", isAm);
        btnPm.classList.toggle("text-[#262626]", isAm);
      }
      updateMeridiemButtons();

      btnAm?.addEventListener("click", () => {
        meridiem = "صبح";
        updateMeridiemButtons();
      });
      btnPm?.addEventListener("click", () => {
        meridiem = "شب";
        updateMeridiemButtons();
      });

      // Open timepicker on input click (inside enabled day content)
      qsa(modalWork, ".timepicker-input").forEach((input) => {
        input.addEventListener("click", () => {
          const day = input.closest(".workday");
          const enabled = qs(day, ".workday-toggle")?.checked ?? true;
          if (!enabled) return; // don't open for disabled day

          currentInput = input;
          if (tpModal) {
            tpModal.classList.remove("hidden");
            // reset labels
            hourLabel.textContent = "ساعت";
            minLabel.textContent = "دقیقه";
            meridiem = "صبح";
            updateMeridiemButtons();
          }
        });
      });

      // Timepicker cancel/save
      document.getElementById("tp-cancel")?.addEventListener("click", () => {
        tpModal.classList.add("hidden");
      });

      // -----------------------------
      // Confirm/Cancel in main worktime modal
      // -----------------------------
      function updateWorktimeField() {
        const dayBlocks = qsa(modalWork, ".workday");
        let allValid = true;
        let messages = [];

        dayBlocks.forEach((day) => {
          const res = validateDay(day);
          if (!res.valid) {
            allValid = false;
            messages = messages.concat(res.errors);
          }
        });

        const wrapper = worktimeField.closest(".relative");
        const errorIcon = wrapper.querySelector(".error-icon");
        const errorMsgBox = document.querySelector(".error-msg-box");

        if (!allValid) {
          worktimeField.classList.add("border-red-500");
          errorIcon?.classList.remove("hidden");
          if (errorMsg) {
            errorMsg.textContent =
              messages[0] || "لطفاً خطاهای روزها را اصلاح کنید.";
            errorMsg.classList.remove("hidden");
          }
          return false;
        }

        // Build summary and set field
        const summary = buildSummary();
        if (!summary) {
          worktimeField.classList.add("border-red-500");
          if (errorMsgBox) {
            errorMsgBox.textContent = "ساعت کاری را وارد کنید.";
            errorMsgBox.classList.remove("hidden");
          }
          return false;
        }

        worktimeField.classList.remove("border-red-500");
        errorIcon?.classList.add("hidden");
        errorMsgBox?.classList.add("hidden");

        worktimeField.value = summary; // e.g. "انتخاب شده: شنبه تا چهارشنبه (...) ، پنج‌شنبه (...)"
        closeWorktimeModal();
        return true;
      }

      _on(worktimeField, "click", openWorktimeModal);
      _on(confirmBtn, "click", updateWorktimeField);
      if (cancelBtn) _on(cancelBtn, "click", closeWorktimeModal);
      if (closeBtn) _on(closeBtn, "click", closeWorktimeModal);

      return {
        openWorktimeModal,
        closeWorktimeModal,
        updateWorktimeField,
      };
    }

    // ---------------- Init all ----------------
    function initAll(opts = {}) {
      // allow injection of provinces
      if (opts && Array.isArray(opts.PROVINCES)) PROVINCE_DATA = opts.PROVINCES;

      try {
        initShopFormValidation();
        initCategorySelection();
        initModalFormLogic();
        initProvinceCityModals(opts);
        initSocialAndImages();
        initProfileTabs();
        initWorktimeModule();
        initOptionCards();
      } catch (e) {
        // در صورت خطا، لاگ کن ولی اجرا را متوقف نکن
        console.error("ShopRegistration init error:", e);
      }
    }

    // shutdown / cleanup
    function destroy() {
      _offAll();
      ModalManager.destroy();
    }

    // Exposed API for Blazor / console / HTML inline
    const api = {
      initAll,
      initShopFormValidation,
      initCategorySelection,
      initModalFormLogic,
      initProvinceCityModals,
      initSocialAndImages,
      initProfileTabs,
      initWorktimeModule,
      initOptionCards,
      closeAllModals: ModalManager.closeAll,
      destroy,
      // small helpers for province modals (if needed)
      setProvinces: (arr) => {
        if (Array.isArray(arr)) PROVINCE_DATA = arr;
      },
    };

    return api;
  })();

  // ------------------ Auto init on DOMContentLoaded ------------------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        ShopRegistrationModule.initAll();
      } catch (e) {
        console.error(e);
      }
    });
  } else {
    try {
      ShopRegistrationModule.initAll();
    } catch (e) {
      console.error(e);
    }
  }

  // ------------- expose to window for Blazor/C# and backward compatibility -------------
  // Blazor can call: await JS.InvokeVoidAsync('ShopRegistration.closeAllModals');
  if (!window.ShopRegistration) {
    window.ShopRegistration = ShopRegistrationModule;
  } else {
    // merge without overwriting existing keys
    Object.keys(ShopRegistrationModule).forEach((k) => {
      if (!window.ShopRegistration[k])
        window.ShopRegistration[k] = ShopRegistrationModule[k];
    });
  }

  // support module export if استفاده از type="module" و import نیاز باشه
  try {
    if (typeof exports !== "undefined") {
      Object.assign(exports, window.ShopRegistration);
    }
  } catch (e) {}

  // End of IIFE
})();
