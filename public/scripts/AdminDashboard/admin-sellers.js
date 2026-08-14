(function () {
  "use strict";

  // ======================== ابزارهای کمکی ========================
  const toFa = (value) => String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const money = (value) => {
    if (typeof value !== "number" || isNaN(value)) return "۰";
    return toFa(value.toLocaleString("en-US"));
  };

  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
  }

  // ======================== داده‌های نمونه ========================
  const statusOptions = [
    { value: "active", label: "فعال" },
    { value: "pending", label: "در انتظار تایید" },
    { value: "incomplete", label: "نیازمند تکمیل اطلاعات" },
    { value: "rejected", label: "رد شده" },
    { value: "suspended", label: "تعلیق شده" },
  ];
  const typeOptions = ["حقیقی", "حقوقی"];
  const cities = [
    "تهران",
    "یزد",
    "اصفهان",
    "شیراز",
    "تبریز",
    "کرج",
    "مشهد",
    "قم",
    "اهواز",
    "رشت",
  ];
  const statusMeta = {
    pending: {
      label: "در انتظار بررسی",
      tab: "pending",
      className: "bg-[#dbeafe] text-[#2f80d9]",
    },
    active: {
      label: "فعال",
      tab: "active",
      className: "bg-[#dcfce7] text-[#16803c]",
    },
    incomplete: {
      label: "تکمیل اطلاعات",
      tab: "pending",
      className: "bg-[#fff4d6] text-[#9a6a00]",
    },
    rejected: {
      label: "رد شده",
      tab: "rejected",
      className: "bg-[#fee2e2] text-[#c43d3d]",
    },
    suspended: {
      label: "تعلیق شده",
      tab: "suspended",
      className: "bg-[#ececec] text-[#5d5d5d]",
    },
  };

  const sellers = Array.from({ length: 18 }, (_, index) => {
    const laterStatuses = ["active", "rejected", "suspended", "incomplete"];
    const isFirst = index < 8;
    const statusKey = isFirst
      ? "pending"
      : laterStatuses[index % laterStatuses.length];
    const city = isFirst ? "تهران" : cities[index % cities.length];
    const type = isFirst ? "حقیقی" : typeOptions[index % 2];
    return {
      id: index + 1,
      store: "نام کامل فروشگاه",
      manager: "نام مدیر فروشگاه",
      type,
      city,
      products: 123456789 + index * 31,
      orders: 123456789 + index * 17,
      balance: 5000000000 + index * 25000000,
      statusKey,
      tab: statusMeta[statusKey].tab,
      created: 100 - index,
    };
  });

  // ======================== حالت (State) ========================
  const state = {
    activeTab: "all",
    search: "",
    sort: "latest",
    types: new Set(),
    statuses: new Set(),
    cities: new Set(),
    currentPage: 1,
    pageSize: 10,
    openPopup: null,
  };
  const draft = {
    types: new Set(),
    statuses: new Set(),
    cities: new Set(),
  };

  // ======================== ارجاع به DOM ========================
  const sellerRows = document.getElementById("sellerRows");
  const sellerCardsContainer = document.getElementById("sellerCardsContainer");
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");
  const paginationNumbers = document.getElementById("paginationNumbers");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageSizeSelect = document.getElementById("pageSize");

  // ======================== توابع کمکی ========================
  const pluralKey = (kind) => {
    if (kind === "city") return "cities";
    if (kind === "status") return "statuses";
    return `${kind}s`;
  };

  function checkboxRow(label, value, kind, scope = "quick") {
    const key = pluralKey(kind);
    const checkedSet = scope === "drawer" ? draft[key] : state[key];
    const isChecked = checkedSet ? checkedSet.has(value) : false;
    return `<label class="flex cursor-pointer items-center justify-between gap-4"><span>${label}</span><span class="flex"><input class="sr-only ${scope}-filter" type="checkbox" data-kind="${kind}" value="${value}" ${
      isChecked ? "checked" : ""
    }><span class="check-ui"></span></span></label>`;
  }

  function cityRow(city, scope = "quick") {
    return checkboxRow(city, city, "city", scope);
  }

  function renderCityLists() {
    const quickQuery = (
      document.getElementById("citySearchInput")?.value || ""
    ).trim();
    document.getElementById("cityList").innerHTML = cities
      .filter((c) => c.includes(quickQuery))
      .map((c) => cityRow(c))
      .join("");

    const drawerQuery = (
      document.getElementById("drawerCitySearch")?.value || ""
    ).trim();
    document.getElementById("drawerCityResults").innerHTML = cities
      .filter((c) => c.includes(drawerQuery))
      .map((c) => cityRow(c, "drawer"))
      .join("");
  }

  function syncOptionLists() {
    document.getElementById("statusQuickList").innerHTML = statusOptions
      .map((o) => checkboxRow(o.label, o.value, "status"))
      .join("");
    document.getElementById("drawerTypeList").innerHTML = typeOptions
      .map((o) => checkboxRow(o, o, "type", "drawer"))
      .join("");
    document.getElementById("drawerStatusList").innerHTML = statusOptions
      .filter((o) => o.value !== "incomplete")
      .map((o) => checkboxRow(o.label, o.value, "status", "drawer"))
      .join("");
    renderCityLists();
  }

  // ===== ردیف جدول (فقط برای دسکتاپ) =====
  function rowTemplate(seller, index) {
    const meta = statusMeta[seller.statusKey];
    return `<tr class="seller-row h-[102px] border-t border-[#d5d5d5] ${
      index % 2 ? "bg-[#f5f5f5]" : "bg-white"
    }" data-id="${seller.id}">
                    <td class="px-8"><div class="flex items-center gap-4"><div class="h-[52px] w-[52px] shrink-0 rounded-full bg-custom-brown" role="img" aria-label="آواتار فروشنده"></div><div class="leading-[1.7]"><div class="text-[14px] font-medium">${
                      seller.store
                    }</div><div class="text-[12px] font-light text-[#6f6f6f]">${
      seller.manager
    }</div></div></div></td>
                    <td class="px-3">${seller.type}</td><td class="px-3">${
      seller.city
    }</td><td class="persian-num px-3">${money(
      seller.products
    )}</td><td class="persian-num px-3">${money(
      seller.orders
    )}</td><td class="persian-num px-3">${money(seller.balance)}</td>
                    <td class="px-3"><span class="inline-flex h-9 items-center rounded-[5px] px-3.5 text-[12px] font-medium ${
                      meta.className
                    }">${meta.label}</span></td>
                    <td class="px-3 text-center"><button class="grid h-9 w-9 place-items-center rounded-lg text-[22px] leading-none hover:bg-[#eaeaea]" aria-label="عملیات">⋮</button></td>
                </tr>`;
  }

  // ===== کارت‌های HTML (فقط برای موبایل) =====
  function cardTemplate(seller) {
    const meta = statusMeta[seller.statusKey];
    return `
    <div class="seller-card" data-id="${seller.id}">
        <div class="card-header" dir="ltr">
            <div class="card-status">
                <span class="${meta.className}">${meta.label}</span>
            </div>
            <div class="card-store">
                
                <div>
                    <div class="store-name">${seller.store}</div>
                    <div class="manager-name">${seller.manager}</div>
                </div>
                <div class="avatar"></div>
            </div>
        </div>
        <div class="card-divider"></div>
        <div dir="rtl" class="grid grid-cols-2 gap-3 text-sm ">
            <div><span class="">نوع: </span>${seller.type}</div>
            <div><span class="">شهر: </span>${seller.city}</div>
            <div><span class="">محصولات: </span>${money(seller.products)}</div>
            <div><span class="">سفارش‌ها: </span>${money(seller.orders)}</div>
            <div class="card-balance col-span-2 flex justify-start">
                <span class="">قابل تسویه: </span>${money(seller.balance)} تومان
            </div>
        </div>
    </div>`;
  }

  // ======================== منطق فیلتر و صفحه‌بندی ========================
  function getFilteredSellers() {
    const query = state.search.trim().toLowerCase();
    let result = sellers.filter((s) => {
      const byTab = state.activeTab === "all" || s.tab === state.activeTab;
      const bySearch = `${s.store} ${s.manager} ${s.city} ${s.type}`
        .toLowerCase()
        .includes(query);
      const byType = !state.types.size || state.types.has(s.type);
      const byStatus = !state.statuses.size || state.statuses.has(s.statusKey);
      const byCity = !state.cities.size || state.cities.has(s.city);
      return byTab && bySearch && byType && byStatus && byCity;
    });
    result.sort((a, b) => {
      if (state.sort === "orders") return b.orders - a.orders;
      if (state.sort === "products") return b.products - a.products;
      if (state.sort === "balance") return b.balance - a.balance;
      return b.created - a.created;
    });
    return result;
  }

  function getPaginatedData(data) {
    const start = (state.currentPage - 1) * state.pageSize;
    const end = start + state.pageSize;
    return data.slice(start, end);
  }

  function updateChipLabels() {
    const sortLabels = {
      latest: "آخرین ثبت نام",
      orders: "بیشترین سفارش",
      products: "بیشترین محصول",
      balance: "بیشترین مبلغ تسویه",
    };
    document.getElementById("sortChipLabel").textContent = `مرتب‌سازی: ${
      sortLabels[state.sort] || "آخرین ثبت نام"
    }`;
    document.getElementById("typeChipLabel").textContent = state.types.size
      ? `نوع فروشنده (${toFa(state.types.size)})`
      : "نوع فروشنده";
    document.getElementById("cityChipLabel").textContent = state.cities.size
      ? `شهر (${toFa(state.cities.size)})`
      : "شهر";
    document.getElementById("statusChipLabel").textContent = state.statuses.size
      ? `وضعیت (${toFa(state.statuses.size)})`
      : "وضعیت";
  }

  function render() {
    const filtered = getFilteredSellers();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const paginated = getPaginatedData(filtered);

    if (paginated.length) {
      sellerRows.innerHTML = paginated.map(rowTemplate).join("");
      sellerCardsContainer.innerHTML = paginated.map(cardTemplate).join("");
      emptyState.classList.add("hidden");
    } else {
      sellerRows.innerHTML = "";
      sellerCardsContainer.innerHTML = "";
      emptyState.classList.remove("hidden");
    }

    const isDefault =
      !state.search &&
      state.activeTab === "all" &&
      !state.types.size &&
      !state.statuses.size &&
      !state.cities.size;
    resultCount.textContent = isDefault ? "۱۳۳" : toFa(totalItems);

    renderPagination(totalPages);
    updateChipLabels();

    prevPageBtn.disabled = state.currentPage <= 1;
    nextPageBtn.disabled = state.currentPage >= totalPages;
    prevPageBtn.classList.toggle("opacity-60", prevPageBtn.disabled);
    nextPageBtn.classList.toggle("opacity-60", nextPageBtn.disabled);
  }

  function renderPagination(totalPages) {
    let html = "";
    const current = state.currentPage;
    const maxVisible = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    if (startPage > 1) {
      html += `<button class="page-num h-7 w-7" data-page="1">1</button>`;
      if (startPage > 2) html += `<span class="h-7 w-7 text-center">...</span>`;
    }
    for (let i = startPage; i <= endPage; i++) {
      const active =
        i === current
          ? "bg-custom-brown text-white"
          : "text-[#333] hover:bg-gray-100";
      html += `<button class="page-num h-7 w-7 rounded-full ${active}" data-page="${i}">${toFa(
        i
      )}</button>`;
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        html += `<span class="h-7 w-7 text-center">...</span>`;
      html += `<button class="page-num h-7 w-7" data-page="${totalPages}">${toFa(
        totalPages
      )}</button>`;
    }
    paginationNumbers.innerHTML =
      html || `<span class="text-sm text-gray-400">صفحه ۱</span>`;
  }

  // ======================== مدیریت پاپ‌آپ‌ها ========================
  function closePopups() {
    document.querySelectorAll("[data-popup]").forEach((p) => {
      p.classList.remove("open", "mobile");
      p.classList.add("hidden");
    });
    document.getElementById("popupOverlay").classList.add("hidden");
    document.querySelectorAll("[data-popup-trigger]").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
    });
    state.openPopup = null;
  }

  function openPopup(name) {
    const target = document.querySelector(`[data-popup="${name}"]`);
    if (!target) return;
    const wasOpen =
      state.openPopup === name && !target.classList.contains("hidden");
    closePopups();
    if (!wasOpen) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        target.classList.add("mobile");
        document.getElementById("popupOverlay").classList.remove("hidden");
        requestAnimationFrame(() => {
          target.classList.add("open");
        });
      } else {
        target.classList.remove("mobile");
      }
      target.classList.remove("hidden");
      const trigger = document.querySelector(`[data-popup-trigger="${name}"]`);
      if (trigger) trigger.setAttribute("aria-expanded", "true");
      state.openPopup = name;
    }
  }

  // ======================== دراور ========================
  const drawer = document.getElementById("filterDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");

  function openDrawer() {
    draft.types = new Set(state.types);
    draft.statuses = new Set(state.statuses);
    draft.cities = new Set(state.cities);
    syncOptionLists();
    drawer.classList.remove("translate-x-full");
    drawerBackdrop.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    drawer.classList.add("translate-x-full");
    drawerBackdrop.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    drawer.setAttribute("aria-hidden", "true");
  }

  // ======================== رویدادها ========================

  document.addEventListener("change", function (e) {
    const quickInput = e.target.closest(".quick-filter");
    if (quickInput) {
      const kind = quickInput.dataset.kind;
      const key = pluralKey(kind);
      const set = state[key];
      if (quickInput.checked) set.add(quickInput.value);
      else set.delete(quickInput.value);
      state.currentPage = 1;
      syncOptionLists();
      render();
      return;
    }

    const drawerInput = e.target.closest(".drawer-filter");
    if (drawerInput) {
      const kind = drawerInput.dataset.kind;
      const key = pluralKey(kind);
      const set = draft[key];
      if (drawerInput.checked) set.add(drawerInput.value);
      else set.delete(drawerInput.value);
      syncOptionLists();
    }
  });

  document.addEventListener("click", function (e) {
    // ===== مدیریت دکمه‌های فیلتر (هم دسکتاپ و هم موبایل) =====
    const drawerBtn = e.target.closest(".openDrawerBtn");
    if (drawerBtn) {
      e.preventDefault();
      openDrawer();
      return;
    }

    const trigger = e.target.closest("[data-popup-trigger]");
    if (trigger) {
      e.stopPropagation();
      openPopup(trigger.dataset.popupTrigger);
      return;
    }

    if (
      e.target.closest("[data-close-popup]") ||
      e.target.closest("#popupOverlay")
    ) {
      closePopups();
      return;
    }

    const clearBtn = e.target.closest("[data-clear-kind]");
    if (clearBtn) {
      const kind = clearBtn.dataset.kind;
      const key = pluralKey(kind);
      state[key].clear();
      state.currentPage = 1;
      syncOptionLists();
      render();
      closePopups();
      const label = { type: "نوع", city: "شهر", status: "وضعیت" }[kind] || kind;
      showToast(`فیلتر ${label} پاک شد.`);
      return;
    }
    const clearSort = e.target.closest("[data-clear-sort]");
    if (clearSort) {
      state.sort = "latest";
      document
        .querySelectorAll('input[name="sort"]')
        .forEach((r) => (r.checked = r.value === "latest"));
      state.currentPage = 1;
      render();
      closePopups();
      showToast("مرتب‌سازی به حالت پیش‌فرض بازگشت.");
      return;
    }

    if (!e.target.closest("[data-popup-wrap]")) {
      closePopups();
    }

    const pageBtn = e.target.closest(".page-num");
    if (pageBtn) {
      const page = parseInt(pageBtn.dataset.page, 10);
      if (!isNaN(page) && page !== state.currentPage) {
        state.currentPage = page;
        render();
      }
    }

    // کلیک روی ردیف جدول یا کارت موبایل
    const row =
      e.target.closest(".seller-row") || e.target.closest(".seller-card");
    if (row) {
      const sellerId = row.dataset.id;
      if (sellerId) {
        window.location.href = `AdminDashboard_SellerDetail_Overview.html?id=${sellerId}`;
      }
    }

    // بستن دراور با کلیک روی backdrop
    if (e.target.closest("#drawerBackdrop")) {
      closeDrawer();
      return;
    }

    // بستن دراور با کلیک روی دکمه بستن
    if (e.target.closest("#closeDrawer")) {
      closeDrawer();
      return;
    }
  });

  document.querySelectorAll('input[name="sort"]').forEach((input) => {
    input.addEventListener("change", function () {
      state.sort = this.value;
      state.currentPage = 1;
      render();
    });
  });

  let searchTimeout = null;
  document.getElementById("searchInput").addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.search = this.value;
      state.currentPage = 1;
      render();
    }, 300);
  });

  document
    .getElementById("citySearchInput")
    .addEventListener("input", renderCityLists);
  document
    .getElementById("drawerCitySearch")
    .addEventListener("input", renderCityLists);

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      state.activeTab = this.dataset.tab;
      state.currentPage = 1;
      document.querySelectorAll(".tab-btn").forEach((tab) => {
        tab.className = "tab-btn shrink-0 pb-2 px-4 text-[#333]";
        tab.setAttribute("aria-selected", "false");
      });
      this.className =
        "tab-btn relative shrink-0 pb-2 px-4 text-custom-brown border-b-[3px] border-custom-brown";
      this.setAttribute("aria-selected", "true");
      render();
    });
  });

  // ===== حذف event listener قدیمی و استفاده از روش جدید =====
  // دیگر نیازی به این خط نیست چون در event delegation بالا مدیریت شده
  // document.querySelector(".openDrawerBtn").addEventListener("click", openDrawer);

  document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);

  document.getElementById("clearDrawer").addEventListener("click", function () {
    draft.types.clear();
    draft.statuses.clear();
    draft.cities.clear();
    document.getElementById("drawerCitySearch").value = "";
    syncOptionLists();
    showToast("همهٔ فیلترهای دراور پاک شدند.");
  });

  document.getElementById("applyDrawer").addEventListener("click", function () {
    state.types = new Set(draft.types);
    state.statuses = new Set(draft.statuses);
    state.cities = new Set(draft.cities);
    state.currentPage = 1;
    syncOptionLists();
    render();
    closeDrawer();
    showToast("فیلترها اعمال شدند.");
  });

  prevPageBtn.addEventListener("click", function () {
    if (state.currentPage > 1) {
      state.currentPage--;
      render();
    }
  });
  nextPageBtn.addEventListener("click", function () {
    const totalItems = getFilteredSellers().length;
    const totalPages = Math.ceil(totalItems / state.pageSize) || 1;
    if (state.currentPage < totalPages) {
      state.currentPage++;
      render();
    }
  });

  pageSizeSelect.addEventListener("change", function () {
    state.pageSize = parseInt(this.value, 10);
    state.currentPage = 1;
    render();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePopups();
      if (!drawer.classList.contains("translate-x-full")) {
        closeDrawer();
      }
    }
  });

  // ======================== مقداردهی اولیه ========================
  syncOptionLists();
  state.currentPage = 1;
  render();

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "داشبورد",
        item: "https://example.com/admin",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "فروشندگان",
        item: "https://example.com/admin/sellers",
      },
    ],
  });
  document.head.appendChild(script);
})();
