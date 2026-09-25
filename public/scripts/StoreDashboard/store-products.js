// ============================================================
// store-products.js - مدیریت محصولات فروشگاه
// ============================================================

(function () {
  "use strict";

  // ---------- Import from StoreUI ----------
  const {
    $,
    $$,
    toFa,
    money,
    parseNumber,
    showToast,
    isMobile,
    debounce,
    openModal,
    closeModal,
    openMobileMenu,
    closeMobileMenu,
    renderPagination,
    openFloatingMenu,
    closeFloatingMenus,
    getStatusBadge,
  } = window.StoreUI;

  // ============================================================
  // 1. DATA
  // ============================================================
  const products = [
    {
      id: 1,
      title: "سیمان تیپ ۱ - پاکتی ۵۰ کیلوگرمی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات"],
      category: "cement",
      price: 5000000,
      priceType: "amount",
      stock: 12,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 100,
      createdAt: 100,
      orders: 45,
    },
    {
      id: 2,
      title: "گچ سفیدکاری کیسه ۳۰ کیلوگرمی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["مصالح و مواد پایه ساختمانی", "گچ و فرآورده‌های گچی"],
      category: "chalk",
      price: 3500000,
      priceType: "amount",
      stock: 5,
      stockStatus: "limited",
      publishStatus: "draft",
      updatedAt: 98,
      createdAt: 98,
      orders: 12,
    },
    {
      id: 3,
      title: "بلوک بتنی سبک - ابعاد ۴۰x۲۰x۲۰",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["بتن و فرآورده‌های بتنی"],
      category: "concrete",
      price: 0,
      priceType: "agreement",
      stock: 0,
      stockStatus: "unavailable",
      publishStatus: "published",
      updatedAt: 95,
      createdAt: 95,
      orders: 8,
    },
    {
      id: 4,
      title: "میلگرد آجدار A3 سایز ۱۲",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 85000000,
      priceType: "amount",
      stock: 120,
      stockStatus: "available",
      publishStatus: "pending",
      updatedAt: 90,
      createdAt: 90,
      orders: 32,
    },
    {
      id: 5,
      title: "تیرچه پیش‌تنیده بتنی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["بتن و فرآورده‌های بتنی"],
      category: "concrete",
      price: 12000000,
      priceType: "amount",
      stock: 45,
      stockStatus: "available",
      publishStatus: "stopped",
      updatedAt: 85,
      createdAt: 85,
      orders: 4,
    },
    {
      id: 6,
      title: "سیمان تیپ ۲ - پاکتی ۵۰ کیلوگرمی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["سیمان و ملات"],
      category: "cement",
      price: 4800000,
      priceType: "amount",
      stock: 200,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 80,
      createdAt: 80,
      orders: 78,
    },
    {
      id: 7,
      title: "پودر سنگ جوشقان - کیسه ۲۵ کیلو",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["مصالح و مواد پایه ساختمانی"],
      category: "cement",
      price: 2000000,
      priceType: "amount",
      stock: 3,
      stockStatus: "limited",
      publishStatus: "rejected",
      updatedAt: 75,
      createdAt: 75,
      orders: 2,
    },
    {
      id: 8,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 9,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 10,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 11,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },{
      id: 12,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 13,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 14,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 15,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
    {
      id: 16,
      title: "ورق گالوانیزه رنگی",
      image: "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
      categories: ["فلزات ساختمانی"],
      category: "metal",
      price: 95000000,
      priceType: "amount",
      stock: 60,
      stockStatus: "available",
      publishStatus: "published",
      updatedAt: 70,
      createdAt: 70,
      orders: 15,
    },
  ];

  // ============================================================
  // 2. STATE
  // ============================================================
  const state = {
    query: "",
    sort: "latest",
    filters: {
      status: new Set(),
      stock: new Set(),
      priceType: new Set(),
      category: new Set(),
    },
    minPrice: null,
    maxPrice: null,
    currentPage: 1,
    pageSize: 10,
    _filteredLength: 0,
    editingId: null,
  };

  // ============================================================
  // 3. BADGE HELPERS
  // ============================================================
  const stockMeta = {
    available: { label: "موجود", classes: "bg-[#dcf6e8] text-[#16864a]" },
    limited: { label: "موجودی محدود", classes: "bg-[#eee8ff] text-[#7142d6]" },
    unavailable: { label: "ناموجود", classes: "bg-[#fde3e3] text-[#c53a3a]" },
  };

  const publishMeta = {
    published: { label: "منتشر شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
    pending: { label: "در انتظار تأیید", classes: "bg-[#fff2d7] text-[#d98b15]" },
    draft: { label: "پیش‌نویس", classes: "bg-[#eeeeee] text-[#666]" },
    stopped: { label: "متوقف", classes: "bg-[#eeeeee] text-[#666]" },
    rejected: { label: "رد شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
  };

  function badge(meta) {
    if (!meta) return "";
    return `<span class="inline-flex rounded-[4px] px-2.5 py-1 text-[11px] font-medium ${meta.classes}">${meta.label}</span>`;
  }

  // ============================================================
  // 4. FILTER & SORT
  // ============================================================
  function getFilteredProducts() {
    let data = [...products];

    // جستجو
    const q = state.query.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          String(p.stock).includes(q)
      );
    }

    // فیلترها
    if (state.filters.status.size) {
      data = data.filter((p) => state.filters.status.has(p.publishStatus));
    }
    if (state.filters.stock.size) {
      data = data.filter((p) => state.filters.stock.has(p.stockStatus));
    }
    if (state.filters.priceType.size) {
      data = data.filter((p) => state.filters.priceType.has(p.priceType));
    }
    if (state.filters.category.size) {
      data = data.filter((p) => state.filters.category.has(p.category));
    }

    // بازه قیمت
    if (state.minPrice !== null) {
      data = data.filter((p) => p.price >= state.minPrice);
    }
    if (state.maxPrice !== null) {
      data = data.filter((p) => p.price <= state.maxPrice);
    }

    // مرتب‌سازی
    const sorters = {
      latest: (a, b) => b.createdAt - a.createdAt,
      updated: (a, b) => b.updatedAt - a.updatedAt,
      cheap: (a, b) => a.price - b.price,
      expensive: (a, b) => b.price - a.price,
      orders: (a, b) => b.orders - a.orders,
    };
    data.sort(sorters[state.sort] || sorters.latest);

    state._filteredLength = data.length;
    return data;
  }

  function getPaginated(data) {
    const start = (state.currentPage - 1) * state.pageSize;
    return data.slice(start, start + state.pageSize);
  }

  // ============================================================
  // 5. RENDER
  // ============================================================
  function productCardTemplate(product) {
    const stock = stockMeta[product.stockStatus];
    const publish = publishMeta[product.publishStatus];
    const isAgreement = product.priceType === "agreement";

    const priceHTML = isAgreement
      ? `<span class="text-[15px] font-bold text-[#aa4938]">قیمت توافقی</span>`
      : `<span class="text-[15px] font-bold text-gray-900">${money(
          product.price
        )} <span class="text-[11px] font-normal text-gray-500">تومان / واحد</span></span>`;

    return `
      <article class="product-card rounded-[12px] border border-[#ececec] bg-white p-4 shadow-sm transition hover:shadow-md"
        data-product-id="${product.id}">
        <div class="flex flex-col gap-4 md:flex-row md:items-center">

          <!-- تصویر -->
          <div class="h-32 w-full shrink-0 overflow-hidden rounded-[10px] bg-gray-100 md:h-24 md:w-32">
            <img src="${product.image}" alt="" class="h-full w-full object-cover" />
          </div>

          <!-- اطلاعات -->
          <div class="flex min-w-0 flex-1 flex-col justify-between gap-2">

            <!-- عنوان + بج‌ها -->
            <div class="flex flex-wrap items-start justify-between gap-2">
              <h3 class="max-w-[400px] text-sm font-bold leading-6 text-gray-800 md:text-[15px]">
                ${product.title}
              </h3>
              <div class="flex flex-wrap items-center gap-1.5">
                ${badge(publish)}
                ${badge(stock)}
              </div>
            </div>

            <!-- دسته‌ها -->
            <div class="flex flex-wrap gap-1.5 text-[11px]">
              ${product.categories
                .map(
                  (c) =>
                    `<span class="rounded-md bg-[#f4f4f4] px-2.5 py-1 text-[#666]">${c}</span>`
                )
                .join("")}
            </div>

            <!-- قیمت + موجودی + عملیات -->
            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#f4f4f4] pt-2">
              <div class="flex flex-wrap items-center gap-4">
                <span class="text-xs text-gray-500">
                  موجودی:
                  <strong class="text-gray-800">${toFa(product.stock)} واحد</strong>
                </span>
                ${priceHTML}
              </div>

              <div class="flex items-center gap-2">
                <a href="StoreDashboard_ProductDetail_Info.html"
                  class="flex items-center gap-1 text-[12px] font-bold text-[#aa4938] hover:text-[#934033]">
                  <svg class="h-4 w-4" aria-hidden="true"><use href="#icon-edit"></use></svg>
                  ویرایش
                </a>
                <button type="button"
                  class="product-menu-btn grid h-8 w-8 place-items-center rounded-md text-[#555] hover:bg-[#f1f1f1]"
                  data-product-menu="${product.id}"
                  aria-label="عملیات محصول">
                  <svg class="h-5 w-5" aria-hidden="true"><use href="#icon-more"></use></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const listEl = $("#productList");
    const emptyEl = $("#emptyState");
    const countEl = $("#resultCount");
    if (!listEl) return;

    const filtered = getFilteredProducts();
    const total = filtered.length;
    const totalPages = Math.ceil(total / state.pageSize) || 1;

    if (state.currentPage > totalPages) state.currentPage = totalPages;

    const paginated = getPaginated(filtered);

    // رندر لیست
    if (paginated.length) {
      listEl.innerHTML = paginated.map(productCardTemplate).join("");
      listEl.classList.remove("hidden");
      if (emptyEl) emptyEl.classList.add("hidden");
    } else {
      listEl.innerHTML = "";
      listEl.classList.add("hidden");
      if (emptyEl) emptyEl.classList.remove("hidden");
    }

    // تعداد
    if (countEl) {
      const hasFilter =
        state.query ||
        state.filters.status.size ||
        state.filters.stock.size ||
        state.filters.priceType.size ||
        state.filters.category.size ||
        state.minPrice !== null ||
        state.maxPrice !== null;
      countEl.textContent = hasFilter ? toFa(total) : "۱۲۳";
    }

    // Pagination
    renderPagination("paginationNumbers", state.currentPage, totalPages, (p) => {
      state.currentPage = p;
      renderProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // بایند رویدادها
    bindProductMenus();
  }

  // ============================================================
  // 6. PRODUCT MENUS (سه نقطه)
  // ============================================================
  function bindProductMenus() {
    $$(".product-menu-btn").forEach((btn) => {
      btn.removeEventListener("click", handleProductMenu);
      btn.addEventListener("click", handleProductMenu);
    });
  }

  function handleProductMenu(e) {
    e.stopPropagation();
    const id = Number(this.dataset.productMenu);
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const menuHTML = `
      <a href="StoreDashboard_ProductDetail_Info.html" class="block w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">
        مشاهده جزئیات
      </a>
      <button type="button" data-action="edit" class="block w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">
        ویرایش محصول
      </button>
      <button type="button" data-action="publish" class="block w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">
        تغییر وضعیت انتشار
      </button>
      <button type="button" data-action="stock" class="block w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">
        تغییر موجودی
      </button>
      <button type="button" data-action="delete" class="block w-full px-4 py-2.5 text-right text-[13px] text-[#c93434] hover:bg-[#fff4f4]">
        حذف محصول
      </button>
    `;

    const menu = openFloatingMenu(this, menuHTML, {
      width: "190px",
      height: 260,
      offsetX: 150,
    });

    menu.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        const action = b.dataset.action;
        if (action === "edit") {
          openProductModal(product);
        } else if (action === "publish") {
          cyclePublishStatus(product);
        } else if (action === "stock") {
          showToast("برای تغییر موجودی به صفحه ویرایش محصول بروید.", "warning");
        } else if (action === "delete") {
          if (confirm(`حذف محصول «${product.title}»؟`)) {
            const idx = products.findIndex((p) => p.id === product.id);
            if (idx > -1) products.splice(idx, 1);
            renderProducts();
            showToast("محصول حذف شد.", "success");
          }
        }
        closeFloatingMenus();
      });
    });
  }

  // ============================================================
  // 7. PUBLISH STATUS CYCLING (برای تست)
  // ============================================================
  function cyclePublishStatus(product) {
    const order = ["published", "pending", "draft", "stopped", "rejected"];
    const idx = order.indexOf(product.publishStatus);
    product.publishStatus = order[(idx + 1) % order.length];
    renderProducts();
    showToast("وضعیت انتشار تغییر کرد.", "success");
  }

  // ============================================================
  // 8. MODAL (افزودن / ویرایش)
  // ============================================================
  function openProductModal(product = null) {
    state.editingId = product ? product.id : null;

    $("#productModalTitle").textContent = product
      ? "ویرایش محصول"
      : "افزودن محصول جدید";
    $("#productTitle").value = product ? product.title : "";
    $("#productPrice").value = product && product.price ? money(product.price) : "";
    $("#productStock").value = product ? toFa(product.stock) : "";
    $("#productCategory").value = product ? product.category : "";
    $("#productDescription").value = "";

    openModal("productModal", "productModalBackdrop");
  }

  function closeProductModal() {
    closeModal("productModal");
    state.editingId = null;
  }

  // ============================================================
  // 9. FILTER SYNC (Sync checkboxes with state)
  // ============================================================
  function syncFilterCheckboxes() {
    // popup ها
    $$(".store-filter-checkbox").forEach((input) => {
      const kind = input.dataset.filter;
      input.checked = state.filters[kind]?.has(input.value) || false;
    });

    // drawer
    $$(".store-drawer-checkbox").forEach((input) => {
      const kind = input.dataset.filter;
      input.checked = state.filters[kind]?.has(input.value) || false;
    });
  }

  // ============================================================
  // 10. INIT EVENTS
  // ============================================================
  function init() {
    // --- Search ---
    const searchInput = $("#searchInput");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        debounce(function () {
          state.query = this.value;
          state.currentPage = 1;
          renderProducts();
        }, 300)
      );
    }

    // --- Sort ---
    $$('input[name="sort"]').forEach((input) => {
      input.addEventListener("change", function () {
        state.sort = this.value;
        state.currentPage = 1;
        const labels = {
          latest: "جدیدترین",
          updated: "آخرین به‌روزرسانی",
          cheap: "ارزان‌ترین",
          expensive: "گران‌ترین",
          orders: "بیشترین سفارش",
        };
        const label = $("#sortChipLabel");
        if (label) label.textContent = `مرتب‌سازی: ${labels[state.sort]}`;
        renderProducts();
        if (isMobile()) closeMobileMenu();
      });
    });

    document.querySelector("[data-clear-sort]")?.addEventListener("click", function () {
      state.sort = "latest";
      const radio = document.querySelector('input[name="sort"][value="latest"]');
      if (radio) radio.checked = true;
      const label = $("#sortChipLabel");
      if (label) label.textContent = "مرتب‌سازی: جدیدترین";
      state.currentPage = 1;
      renderProducts();
      if (isMobile()) closeMobileMenu();
      else this.closest(".store-popup")?.classList.add("hidden");
      showToast("مرتب‌سازی بازنشانی شد.");
    });

    // --- Filter checkboxes (popup) ---
    $$(".store-filter-checkbox").forEach((input) => {
      input.addEventListener("change", function () {
        const kind = this.dataset.filter;
        const set = state.filters[kind];
        if (!set) return;
        if (this.checked) set.add(this.value);
        else set.delete(this.value);
        updateChipLabels();
        state.currentPage = 1;
        renderProducts();
      });
    });

    // --- Clear individual filter (popup) ---
    $$("[data-clear]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const kind = this.dataset.clear;
        if (state.filters[kind]) state.filters[kind].clear();
        syncFilterCheckboxes();
        updateChipLabels();
        state.currentPage = 1;
        renderProducts();
        if (isMobile()) closeMobileMenu();
        else this.closest(".store-popup")?.classList.add("hidden");
        showToast("فیلتر پاک شد.");
      });
    });

    // --- Drawer filters ---
    $$(".store-drawer-checkbox").forEach((input) => {
      input.addEventListener("change", function () {
        // فقط draft رو آپدیت می‌کنیم؛ در apply اعمال می‌شه
        // (برای سادگی همون لحظه اعمال می‌کنیم)
        const kind = this.dataset.filter;
        const set = state.filters[kind];
        if (!set) return;
        if (this.checked) set.add(this.value);
        else set.delete(this.value);
        updateChipLabels();
      });
    });

    // --- Clear all ---
    $("#clearAllFilters")?.addEventListener("click", function () {
      Object.values(state.filters).forEach((s) => s.clear());
      state.minPrice = null;
      state.maxPrice = null;
      const minEl = $("#minPriceFilter");
      const maxEl = $("#maxPriceFilter");
      if (minEl) minEl.value = "";
      if (maxEl) maxEl.value = "";
      syncFilterCheckboxes();
      updateChipLabels();
      state.currentPage = 1;
      renderProducts();
      showToast("همه فیلترها پاک شدند.");
    });

    // --- Apply drawer ---
    $("#applyDrawerFilters")?.addEventListener("click", function () {
      const min = parseNumber($("#minPriceFilter")?.value);
      const max = parseNumber($("#maxPriceFilter")?.value);
      state.minPrice = min || null;
      state.maxPrice = max || null;
      state.currentPage = 1;
      renderProducts();
      if (window.StoreUI.closeFilterDrawer) window.StoreUI.closeFilterDrawer();
      showToast("فیلترها اعمال شدند.", "success");
    });

    // --- Open product modal ---
    $("#addProductBtn")?.addEventListener("click", () => openProductModal());

    // --- Close product modal ---
    $("#closeProductModal")?.addEventListener("click", closeProductModal);
    $("#cancelProductBtn")?.addEventListener("click", closeProductModal);
    $("#productModalBackdrop")?.addEventListener("click", closeProductModal);

    // --- Product form submit ---
    $("#productForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = $("#productTitle").value.trim();
      const price = parseNumber($("#productPrice").value);
      const stock = parseNumber($("#productStock").value);
      const category = $("#productCategory").value;

      if (!title) {
        showToast("عنوان محصول را وارد کنید.", "error");
        return;
      }

      if (state.editingId) {
        const p = products.find((x) => x.id === state.editingId);
        if (p) {
          p.title = title;
          p.price = price;
          p.stock = stock;
          p.category = category || p.category;
          p.stockStatus =
            stock === 0 ? "unavailable" : stock < 10 ? "limited" : "available";
          p.updatedAt = 200;
        }
        showToast("محصول ویرایش شد.", "success");
      } else {
        const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
        products.unshift({
          id: newId,
          title,
          image:
            "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg",
          categories: ["دسته‌بندی نشده"],
          category: category || "cement",
          price,
          priceType: "amount",
          stock,
          stockStatus:
            stock === 0 ? "unavailable" : stock < 10 ? "limited" : "available",
          publishStatus: "draft",
          updatedAt: 200,
          createdAt: 200,
          orders: 0,
        });
        showToast("محصول جدید ثبت شد.", "success");
      }

      closeProductModal();
      state.currentPage = 1;
      renderProducts();
    });

    // --- Page size ---
    $("#pageSize")?.addEventListener("change", function () {
      state.pageSize = parseInt(this.value, 10);
      state.currentPage = 1;
      renderProducts();
    });

    // --- Prev / Next page ---
    $("#prevPage")?.addEventListener("click", () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderProducts();
      }
    });
    $("#nextPage")?.addEventListener("click", () => {
      const totalPages = Math.ceil(state._filteredLength / state.pageSize) || 1;
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderProducts();
      }
    });
  }

  // ============================================================
  // 11. CHIP LABELS (نمایش تعداد فیلترهای فعال)
  // ============================================================
  function updateChipLabels() {
    const labels = {
      status: "وضعیت انتشار",
      stock: "موجودی",
      priceType: "نوع قیمت",
      category: "دسته",
    };

    for (const [kind, baseLabel] of Object.entries(labels)) {
      const chip = document.getElementById(`${kind}ChipLabel`);
      if (!chip) continue;
      const count = state.filters[kind].size;
      chip.textContent = count ? `${baseLabel} (${toFa(count)})` : baseLabel;
    }
  }

  // ============================================================
  // 12. BOOT
  // ============================================================
  document.addEventListener("DOMContentLoaded", function () {
    // راه‌اندازی StoreUI
    window.StoreUI.init({
      bottomNav: "products",
      prefix: "../../",
    });

    // دکمه‌های بازگشت
    document.querySelectorAll("[data-store-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = "../StoreDashboard.html";
      });
    });

    init();
    renderProducts();
  });
})();