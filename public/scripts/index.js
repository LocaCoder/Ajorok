  document.addEventListener("DOMContentLoaded", function () {
    // ============================================
    // DOM ELEMENTS
    // ============================================
    const overlay = document.getElementById("overlay");
    const modal = document.getElementById("location-modal");
    const mainSearchInput = document.getElementById("main-search-input");
    const citySearchInput = document.getElementById("city-search-input");
    const searchDropdown = document.getElementById("search-results-dropdown");
    const queryDisplay = document.getElementById("search-query-display");
    const locationTriggers = document.querySelectorAll("[data-location-trigger]");
    const locationLabels = document.querySelectorAll("[data-location-label]");
    const closeButton = document.getElementById("close-location-modal");
    const cancelButton = document.getElementById("cancel-cities");
    const confirmButton = document.getElementById("confirm-cities");
    const clearAllButton = document.getElementById("clear-all-cities");
    const selectedCitiesWrap = document.getElementById("selected-cities-wrap");
    const citiesList = document.getElementById("cities-list");
    const emptyState = document.getElementById("city-empty-state");
    const selectAllButton = document.getElementById("select-all-cities");

    // ============================================
    // VALIDATION
    // ============================================
    if (!overlay || !modal) {
      console.warn("Required elements not found.");
      return;
    }

    // ============================================
    // STATE
    // ============================================
    let confirmedCities = new Set();
    let draftCities = new Set();
    let closeTimer = null;
    let scrollPosition = 0;

    // ============================================
    // HELPERS
    // ============================================
    const getCheckboxes = () =>
      modal ? Array.from(modal.querySelectorAll(".city-checkbox")) : [];
    const getCityItems = () =>
      modal ? Array.from(modal.querySelectorAll("[data-city-item]")) : [];
    const getCityName = (checkbox) =>
      checkbox.dataset.city || checkbox.value.trim();

    const normalizeText = (text) => {
      return String(text || "")
        .trim()
        .toLowerCase()
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, " ")
        .replace(/\s+/g, " ");
    };

    const syncCheckboxes = () => {
      getCheckboxes().forEach((cb) => {
        cb.checked = draftCities.has(getCityName(cb));
      });
    };

    const updateButtons = () => {
      if (confirmButton) confirmButton.disabled = draftCities.size === 0;
      if (clearAllButton)
        clearAllButton.classList.toggle("invisible", draftCities.size === 0);
    };

    const createChip = (cityName) => {
      const chip = document.createElement("div");
      chip.className =
        "inline-flex items-center gap-2 rounded-full border border-[#E5CBC7] bg-[#F8EFED] px-3 py-1.5 text-xs text-[#A74B3F]";
      chip.innerHTML = `
        <span>${cityName}</span>
        <button type="button" class="flex size-4 items-center justify-center rounded-full text-base leading-none transition hover:bg-[#A74B3F]/10" data-remove-city="${cityName}" aria-label="حذف ${cityName}">×</button>
      `;
      return chip;
    };

    const renderSelected = () => {
      if (!selectedCitiesWrap) return;
      selectedCitiesWrap.replaceChildren();
      draftCities.forEach((city) =>
        selectedCitiesWrap.appendChild(createChip(city))
      );
      selectedCitiesWrap.classList.toggle("hidden", draftCities.size === 0);
      selectedCitiesWrap.classList.toggle("flex", draftCities.size > 0);
      updateButtons();
    };

    const renderModal = () => {
      syncCheckboxes();
      renderSelected();
    };

    const resetSearch = () => {
      if (citySearchInput) citySearchInput.value = "";
      getCityItems().forEach((item) => item.classList.remove("hidden"));
      modal
        .querySelectorAll("[data-city-section]")
        .forEach((section) => section.classList.remove("hidden"));
      if (emptyState) emptyState.classList.add("hidden");
      if (citiesList) citiesList.classList.remove("hidden");
    };

    // ============================================
    // SCROLL CONTROL
    // ============================================
    const disableScroll = () => {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollPosition);
    };

    // ============================================
    // SELECT ALL CITIES
    // ============================================
    const selectAllCities = () => {
      const visibleCheckboxes = getCheckboxes().filter((cb) => {
        const item = cb.closest("[data-city-item]");
        return item && !item.classList.contains("hidden");
      });

      visibleCheckboxes.forEach((cb) => {
        draftCities.add(getCityName(cb));
      });

      renderModal();
    };

    // ============================================
    // MODAL CONTROLS
    // ============================================
    const openModal = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      draftCities = new Set(confirmedCities);
      resetSearch();
      renderModal();

      // غیرفعال کردن اسکرول
      disableScroll();

      // حذف کلاس‌های invisible و opacity-0
      overlay.classList.remove("invisible", "opacity-0");
      modal.classList.remove("invisible", "opacity-0");

      // استفاده از requestAnimationFrame برای انیمیشن روان
      requestAnimationFrame(() => {
        modal.classList.add("opacity-100", "translate-y-0");
        // برای دسکتاپ از scale استفاده می‌کنیم
        if (window.innerWidth >= 768) {
          modal.style.transform = "translate(-50%, -50%) scale(1)";
        } else {
          modal.style.transform = "translateY(0)";
        }
      });

      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      setTimeout(() => citySearchInput?.focus(), 350);
    };
    const closeModal = () => {
      // فعال کردن اسکرول
      enableScroll();

      overlay.classList.add("invisible", "opacity-0");
      modal.classList.remove(
        "opacity-100",
        "translate-y-0",
        "md:-translate-y-1/2"
      );
      modal.classList.add(
        "opacity-0",
        "translate-y-full",
        "md:-translate-y-[45%]"
      );
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");

      closeTimer = setTimeout(() => modal.classList.add("invisible"), 300);
    };

    const cancelSelection = () => {
      draftCities = new Set(confirmedCities);
      renderModal();
      closeModal();
    };

    // ============================================
    // FILTER CITIES
    // ============================================
    const filterCities = (searchValue) => {
      const query = normalizeText(searchValue);
      let visible = 0;

      getCityItems().forEach((item) => {
        const cb = item.querySelector(".city-checkbox");
        if (!cb) return;
        const name = normalizeText(getCityName(cb));
        const show = query === "" || name.includes(query);
        item.classList.toggle("hidden", !show);
        if (show) visible++;
      });

      modal.querySelectorAll("[data-city-section]").forEach((section) => {
        const hasVisible = Array.from(
          section.querySelectorAll("[data-city-item]")
        ).some((item) => !item.classList.contains("hidden"));
        section.classList.toggle("hidden", !hasVisible);
      });

      if (emptyState) emptyState.classList.toggle("hidden", visible > 0);
      if (citiesList) citiesList.classList.toggle("hidden", visible === 0);
    };

    // ============================================
    // CITY MANAGEMENT
    // ============================================
    const toggleCity = (cityName, checked) => {
      checked ? draftCities.add(cityName) : draftCities.delete(cityName);
      renderModal();
    };

    const removeCity = (cityName) => {
      draftCities.delete(cityName);
      const cb = getCheckboxes().find((c) => getCityName(c) === cityName);
      if (cb) cb.checked = false;
      renderSelected();
    };

    const clearAll = () => {
      draftCities.clear();
      getCheckboxes().forEach((cb) => (cb.checked = false));
      renderSelected();
    };

    const updateLabels = () => {
      const cities = Array.from(confirmedCities);
      let text = "موقعیت";
      if (cities.length === 1) text = cities[0];
      else if (cities.length === 2) text = cities.join("، ");
      else if (cities.length > 2)
        text = `${cities[0]} و ${cities.length - 1} شهر دیگر`;
      locationLabels.forEach((label) => (label.textContent = text));
    };

    // ============================================
    // EVENT LISTENERS
    // ============================================
    overlay.addEventListener("click", (e) => {
      if (modal.getAttribute("aria-hidden") === "false") cancelSelection();
    });

    locationTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal();
      });
    });

    closeButton?.addEventListener("click", cancelSelection);
    cancelButton?.addEventListener("click", cancelSelection);

    citySearchInput?.addEventListener("input", (e) =>
      filterCities(e.target.value)
    );

    modal.addEventListener("change", (e) => {
      const cb = e.target.closest(".city-checkbox");
      if (cb) toggleCity(getCityName(cb), cb.checked);
    });

    selectedCitiesWrap?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-city]");
      if (btn) removeCity(btn.dataset.removeCity);
    });

    clearAllButton?.addEventListener("click", clearAll);
    selectAllButton?.addEventListener("click", selectAllCities);

    confirmButton?.addEventListener("click", () => {
      if (draftCities.size === 0) return;
      confirmedCities = new Set(draftCities);
      updateLabels();
      document.dispatchEvent(
        new CustomEvent("citiesChanged", {
          detail: { cities: Array.from(confirmedCities) },
        })
      );
      closeModal();
    });

    // ============================================
    // MAIN SEARCH
    // ============================================
    if (mainSearchInput && searchDropdown && queryDisplay) {
      mainSearchInput.addEventListener("input", (e) => {
        const val = e.target.value.trim();
        if (val) {
          searchDropdown.classList.remove("hidden");
          queryDisplay.textContent = `«${val}»`;
        } else {
          searchDropdown.classList.add("hidden");
        }
      });

      document.addEventListener("click", (e) => {
        if (
          !mainSearchInput.contains(e.target) &&
          !searchDropdown.contains(e.target)
        ) {
          searchDropdown.classList.add("hidden");
        }
      });

      mainSearchInput.addEventListener("focus", () => {
        if (mainSearchInput.value.trim())
          searchDropdown.classList.remove("hidden");
      });

      document.querySelectorAll("#search-results-dropdown li").forEach((item) => {
        item.addEventListener("click", () => {
          mainSearchInput.value = item.querySelector("span")?.textContent || "";
          searchDropdown.classList.add("hidden");
        });
      });
    }

    // ============================================
    // INIT
    // ============================================
    getCheckboxes().forEach((cb) => {
      if (cb.checked) confirmedCities.add(getCityName(cb));
    });

    draftCities = new Set(confirmedCities);
    renderModal();
    updateLabels();
    console.log("✅ App initialized.");
  });
