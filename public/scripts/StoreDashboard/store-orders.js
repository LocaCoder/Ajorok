// ============================================================
// store-orders.js - نسخه کامل و نهایی
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) { console.error("[Orders] StoreUI یافت نشد"); return; }

    const { $$, toFa, money, showToast, isMobile, renderPagination, debounce } = UI;

    // ============================================================
    // STATE
    // ============================================================
    const state = {
      activeTab: "all",
      query: "",
      sort: "latest",
      filters: {
        status: new Set(),
        delivery: new Set(),
        category: new Set(),
      },
      range: null,
      rangeFrom: null,
      rangeTo: null,
      currentPage: 1,
      pageSize: 10,
      selectedOrder: null,
    };

    // ============================================================
    // DATA
    // ============================================================
    const IMG = "../../../images/58bebe61a9e25e2c419610b60987928fbe5b3ad4.jpg";

    const orders = [
      {
        id: 1, orderNo: "۱۲۳۳۴۶۵", status: "pending",
        date: "شنبه ۱۴۰۴/۰۴/۰۴", time: "۱۳:۵۲",
        createdAt: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲",
        createdAtRaw: 100, total: 12500000, delivery: "vendor",
        items: [{
          title: "عنوان محصول",
          qty: 1, price: 12500000, unit: "واحد",
          category: "cement", img: IMG,
          tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات", "سیمان تیپ ۱، ۲، ۵"],
        }],
        buyer: { name: "شرکت سازه برتر", phone: "۰۹۱۲۱۲۳۴۵۶۷", address: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ" },
        history: [{ label: "پرداخت موفق و ثبت سفارش", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" }],
      },
      {
        id: 2, orderNo: "۱۲۳۳۴۶۵", status: "pending",
        date: "شنبه ۱۴۰۴/۰۴/۰۴", time: "۱۳:۵۲",
        createdAt: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲",
        createdAtRaw: 99, total: 12500000, delivery: "vendor",
        items: [{
          title: "عنوان محصول عنوان محصول عنوان محصول",
          qty: 1, price: 12500000, unit: "واحد",
          category: "cement", img: IMG,
          tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات", "سیمان تیپ ۱، ۲، ۵"],
        }],
        buyer: { name: "شرکت سازه برتر", phone: "۰۹۱۲۱۲۳۴۵۶۷", address: "لورم ایپسوم" },
        history: [{ label: "پرداخت موفق و ثبت سفارش", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" }],
      },
      {
        id: 3, orderNo: "۱۲۳۳۴۶۵", status: "pending",
        date: "شنبه ۱۴۰۴/۰۴/۰۴", time: "۱۳:۵۲",
        createdAt: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲",
        createdAtRaw: 98, total: 12500000, delivery: "vendor",
        items: [
          { title: "عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول", qty: 1, price: 12500000, unit: "واحد", category: "cement", img: IMG, tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات", "سیمان تیپ ۱، ۲، ۵"] },
          { title: "عنوان محصول عنوان محصول عنوان محصول عنوان محصول", qty: 1, price: 12500000, unit: "واحد", category: "cement", img: IMG, tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات", "سیمان تیپ ۱، ۲، ۵"] },
        ],
        buyer: { name: "شرکت سازه برتر", phone: "۰۹۱۲۱۲۳۴۵۶۷", address: "لورم ایپسوم" },
        history: [{ label: "پرداخت موفق و ثبت سفارش", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" }],
      },
      {
        id: 4, orderNo: "۱۲۳۳۴۶۵", status: "preparing",
        date: "شنبه ۱۴۰۴/۰۴/۰۴", time: "۱۳:۵۲",
        createdAt: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲",
        createdAtRaw: 97, total: 12500000, delivery: "pickup",
        items: [
          { title: "عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول", qty: 1, price: 12500000, unit: "واحد", category: "cement", img: IMG, tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات", "سیمان تیپ ۱، ۲، ۵"] },
          { title: "عنوان محصول عنوان محصول", qty: 1, price: 12500000, unit: "واحد", category: "cement", img: IMG, tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات"] },
        ],
        buyer: { name: "شرکت سازه برتر", phone: "۰۹۱۲۱۲۳۴۵۶۷", address: "لورم ایپسوم" },
        history: [
          { label: "پرداخت موفق و ثبت سفارش", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" },
          { label: "سفارش در حال آماده‌سازی", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" },
        ],
      },
      {
        id: 5, orderNo: "۱۲۳۳۴۶۵", status: "shipped",
        date: "شنبه ۱۴۰۴/۰۴/۰۴", time: "۱۳:۵۲",
        createdAt: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲",
        createdAtRaw: 96, total: 12500000, delivery: "vendor",
        items: [{
          title: "عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول عنوان محصول",
          qty: 1, price: 12500000, unit: "واحد",
          category: "cement", img: IMG,
          tags: ["مصالح و مواد پایه ساختمانی", "سیمان و ملات", "سیمان تیپ ۱، ۲، ۵"],
        }],
        buyer: { name: "شرکت سازه برتر", phone: "۰۹۱۲۱۲۳۴۵۶۷", address: "لورم ایپسوم" },
        history: [
          { label: "پرداخت موفق و ثبت سفارش", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" },
          { label: "سفارش در حال آماده‌سازی", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" },
          { label: "محصول ارسال شد", date: "شنبه ۱۴۰۴/۰۴/۰۴ - ۱۳:۵۲" },
        ],
      },
    ];

    // ============================================================
    // STATUS META
    // ============================================================
    const statusMeta = {
      pending: { label: "در انتظار بررسی", classes: "bg-[#fde9e4] text-[#aa4938]" },
      preparing: { label: "در حال آماده‌سازی", classes: "bg-[#dcecff] text-[#2b78c5]" },
      shipped: { label: "ارسال شد", classes: "bg-[#dcf6e8] text-[#16864a]" },
      completed: { label: "تکمیل شده", classes: "bg-[#dcf6e8] text-[#16864a]" },
      cancelled: { label: "لغو شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
    };

    function badge(status) {
      const m = statusMeta[status] || statusMeta.pending;
      return `<span class="inline-flex rounded-[6px] px-3 py-1.5 text-[11px] font-medium ${m.classes}">${m.label}</span>`;
    }

    // ============================================================
    // FILTER
    // ============================================================
    function getFiltered() {
      let data = [...orders];

      if (state.activeTab !== "all") {
        data = data.filter((o) => o.status === state.activeTab);
      }

      if (state.query) {
        const q = state.query.trim();
        data = data.filter((o) =>
          o.orderNo.includes(q) ||
          o.buyer.name.includes(q) ||
          o.items.some((i) => i.title.includes(q))
        );
      }

      if (state.filters.status.size) data = data.filter((o) => state.filters.status.has(o.status));
      if (state.filters.delivery.size) data = data.filter((o) => state.filters.delivery.has(o.delivery));
      if (state.filters.category.size) {
        data = data.filter((o) => o.items.some((i) => state.filters.category.has(i.category)));
      }

      const sorters = {
        latest: (a, b) => b.createdAtRaw - a.createdAtRaw,
        oldest: (a, b) => a.createdAtRaw - b.createdAtRaw,
        cheap: (a, b) => a.total - b.total,
        expensive: (a, b) => b.total - a.total,
        action: (a, b) => {
          const w = { pending: 0, preparing: 1, shipped: 2, completed: 3, cancelled: 4 };
          return (w[a.status] || 0) - (w[b.status] || 0);
        },
      };
      data.sort(sorters[state.sort] || sorters.latest);

      return data;
    }

    function paginate(data) {
      const start = (state.currentPage - 1) * state.pageSize;
      return data.slice(start, start + state.pageSize);
    }

    // ============================================================
    // RENDER — Desktop Row
    // ============================================================
    function rowTemplate(o) {
      const firstItem = o.items[0] || {};
      const allTitles = o.items.map((i) => i.title).join(" / ");
      const allQty = o.items.map((i) => `${toFa(i.qty)} ${i.unit || "واحد"}`).join(" / ");

      return `
        <tr class="h-[100px] border-b border-[#f0f0f0] last:border-b-0 transition hover:bg-[#fafafa] cursor-pointer" data-order-id="${o.id}">
          <td class="px-4">
            <div class="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[8px] border border-[#eee] bg-[#f4f4f4]">
              <img src="${firstItem.img || ""}" alt="" class="h-full w-full object-cover" />
            </div>
          </td>
          <td class="px-4 text-right">
            <div class="max-w-[320px] text-[13px] leading-6 text-[#333]">${allTitles}</div>
          </td>
          <td class="px-4 text-center text-[12px] leading-6">
            <div>${o.date}</div>
            <div class="text-[#888]">${o.time}</div>
          </td>
          <td class="px-4 text-center text-[13px] font-medium">${o.orderNo}</td>
          <td class="px-4 text-center money-en" dir="ltr">${money(o.total)}</td>
          <td class="px-4 text-center text-[12px]">${allQty}</td>
          <td class="px-4 text-center">${badge(o.status)}</td>
        </tr>
      `;
    }

    // ============================================================
    // RENDER — Mobile Card
    // ============================================================
    function cardTemplate(o) {
      return `
        <article class="overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white cursor-pointer transition active:bg-[#fafafa]" data-order-id="${o.id}">
          <div class="p-4">
            <div class="flex items-center justify-between gap-2">
              <div class="text-[13px]">
                شماره سفارش: <b class="font-medium">${o.orderNo}</b>
              </div>
              ${badge(o.status)}
            </div>

            <div class="mt-3 text-[12px]">
              <span class="text-[#777]">زمان ثبت:</span>
              <b class="mr-1 font-medium">${o.createdAt}</b>
            </div>

            <div class="mt-2 text-[12px]">
              <span class="text-[#777]">مبلغ کل:</span>
              <b class="mr-1 font-medium money-en" dir="ltr">${money(o.total)} تومان</b>
            </div>
          </div>

          <div class="h-px bg-[#f0f0f0]"></div>

          <div class="divide-y divide-[#f0f0f0]">
            ${o.items.map((i) => `
              <div class="flex items-center gap-3 p-4">
                <div class="min-w-0 flex-1 text-right">
                  <div class="text-[12px] font-medium leading-6">${i.title}</div>
                  <div class="mt-1 text-[11px] text-[#888]">مقدار سفارش ثبت شده</div>
                </div>
                <div class="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[8px] border border-[#eee] bg-[#f4f4f4]">
                  <img src="${i.img || ""}" alt="" class="h-full w-full object-cover" />
                </div>
              </div>
            `).join("")}
          </div>
        </article>
      `;
    }

    // ============================================================
    // RENDER LIST
    // ============================================================
    function renderList() {
      const filtered = getFiltered();
      const total = filtered.length;
      const totalPages = Math.ceil(total / state.pageSize) || 1;
      if (state.currentPage > totalPages) state.currentPage = totalPages;

      const paginated = paginate(filtered);

      const body = document.getElementById("ordersBody");
      const mobileList = document.getElementById("ordersMobileList");
      const empty = document.getElementById("ordersEmpty");
      const count = document.getElementById("ordersResultCount");
      const tableWrap = document.querySelector(".orders-table-wrap");

      if (body) body.innerHTML = paginated.map(rowTemplate).join("");
      if (mobileList) mobileList.innerHTML = paginated.map(cardTemplate).join("");

      if (empty) empty.classList.toggle("hidden", paginated.length > 0);
      if (tableWrap) tableWrap.classList.toggle("hidden", paginated.length === 0);
      if (count) count.textContent = toFa(total) || "۰";

      $$("[data-order-id]").forEach((el) => {
        el.addEventListener("click", function () {
          const id = Number(this.dataset.orderId);
          const order = orders.find((o) => o.id === id);
          if (order) showDetail(order);
        });
      });

      renderPagination("ordersPagination", state.currentPage, totalPages, (p) => {
        state.currentPage = p;
        renderList();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // ============================================================
    // DETAIL VIEW
    // ============================================================
    function showDetail(order) {
      state.selectedOrder = order;
      document.getElementById("ordersListView").classList.add("hidden");
      document.getElementById("orderDetailView").classList.remove("hidden");
      const t = document.getElementById("mobileHeaderTitle");
      if (t) t.textContent = "جزئیات سفارش";
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderDetail(order);
    }

    function showList() {
      document.getElementById("orderDetailView").classList.add("hidden");
      document.getElementById("ordersListView").classList.remove("hidden");
      const t = document.getElementById("mobileHeaderTitle");
      if (t) t.textContent = "سفارش‌ها";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderDetail(order) {
      ["detailOrderNumberMobile", "detailOrderNumberDesktop"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = order.orderNo;
      });
      ["detailCreatedAtMobile", "detailCreatedAtDesktop"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = order.createdAt;
      });
      ["detailTotalMobile", "detailTotalDesktop"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = `${money(order.total)} تومان`;
      });

      const sm = document.getElementById("detailStatusMobile");
      if (sm) sm.innerHTML = badge(order.status);
      const sd = document.getElementById("detailStatusDesktop");
      if (sd) sd.innerHTML = badge(order.status);

      const notice = document.getElementById("detailNotice");
      if (notice) {
        if (order.status === "pending") {
          notice.classList.remove("hidden");
          notice.innerHTML = `
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <span class="font-medium text-[#aa4938]">گام ۱: سفارش را بررسی کنید و شروع آماده‌سازی را بزنید.</span>
              <button type="button" id="dismissNotice" class="text-[11px] text-[#aa4938] underline">متوجه شدم</button>
            </div>
          `;
          document.getElementById("dismissNotice")?.addEventListener("click", () => {
            notice.classList.add("hidden");
          });
        } else {
          notice.classList.add("hidden");
        }
      }

      const steps = ["pending", "preparing", "shipped"];
      const idx = steps.indexOf(order.status);
      steps.forEach((key, i) => {
        const el = document.getElementById("step" + key.charAt(0).toUpperCase() + key.slice(1));
        if (!el) return;
        el.className = "order-step-pill";
        if (order.status === "cancelled") el.classList.add("inactive");
        else if (i < idx) el.classList.add("done");
        else if (i === idx) {
          if (key === "pending") el.classList.add("active");
          else el.classList.add("current");
        } else el.classList.add("inactive");
      });

      const itemsEl = document.getElementById("detailItems");
      const itemsCount = document.getElementById("detailItemsCount");
      if (itemsEl) {
        itemsCount.textContent = `${toFa(order.items.length)} آیتم`;
        itemsEl.innerHTML = order.items.map((i) => `
          <div class="flex items-center gap-3 py-4">
            <div class="min-w-0 flex-1 text-right">
              <div class="text-[13px] font-medium leading-6">${i.title}</div>
              <div class="mt-1 text-[11px] text-[#888]">مقدار سفارش ثبت شده</div>
              <div class="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-[#666]">
                ${(i.tags || []).map((tag) => `<span class="rounded bg-[#f4f4f4] px-2 py-0.5">${tag}</span>`).join("")}
              </div>
              <div class="mt-2 text-[11px]">
                <span class="text-[#777]">قیمت پرداخت شده:</span>
                <b class="mr-1 money-en" dir="ltr">${money(i.price)} تومان</b>
              </div>
            </div>
            <div class="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[8px] border border-[#eee] bg-[#f4f4f4]">
              <img src="${i.img || ""}" alt="" class="h-full w-full object-cover" />
            </div>
          </div>
        `).join("");
      }

      const itemsSum = order.items.reduce((s, i) => s + i.qty * i.price, 0);
      const it = document.getElementById("itemsTotal");
      if (it) it.textContent = `${money(itemsSum)} تومان`;
      const pt = document.getElementById("paidTotal");
      if (pt) pt.textContent = `${money(order.total)} تومان`;

      const buyerEl = document.getElementById("buyerInfo");
      if (buyerEl) {
        buyerEl.innerHTML = `
          <div class="space-y-3">
            <div class="flex justify-between gap-4">
              <span class="text-[#777]">نام/شرکت</span>
              <b class="font-medium text-[#333]">${order.buyer.name}</b>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-[#777]">شماره</span>
              <b class="font-medium text-[#333] money-en" dir="ltr">${order.buyer.phone}</b>
            </div>
            <div class="flex justify-between gap-4">
              <span class="text-[#777]">آدرس</span>
              <b class="max-w-[220px] text-left font-medium leading-6 text-[#333]">${order.buyer.address}</b>
            </div>
          </div>
        `;
      }

      const histEl = document.getElementById("eventHistory");
      if (histEl) {
        histEl.innerHTML = order.history.map((h) => `
          <div class="flex items-start gap-3">
            <span class="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#19a956]"></span>
            <div class="min-w-0 flex-1 text-[12px] leading-6 text-[#333]">
              ${h.label} - ${h.date}
            </div>
          </div>
        `).join("");
      }

      const labels = {
        pending: "شروع آماده‌سازی",
        preparing: "ارسال شد",
        shipped: "ارسال شد",
        completed: "دانلود فاکتور",
        cancelled: "مشاهده جزئیات",
      };
      const mb = document.getElementById("mobilePrimaryAction");
      if (mb) mb.textContent = labels[order.status] || "اقدام";
    }

    // ============================================================
    // PRIMARY ACTION
    // ============================================================
    function handlePrimaryAction() {
      const order = state.selectedOrder;
      if (!order) return;

      const nextMap = {
        pending: "preparing",
        preparing: "shipped",
        shipped: "shipped",
        completed: "completed",
        cancelled: "cancelled",
      };
      const next = nextMap[order.status];

      if (next && next !== order.status) {
        order.status = next;
        order.history.push({
          label: next === "preparing" ? "سفارش در حال آماده‌سازی" : "محصول ارسال شد",
          date: "اکنون",
        });
        renderDetail(order);
        renderList();
        showToast(`وضعیت به «${statusMeta[next].label}» تغییر کرد.`, "success");
      }
    }

    // ============================================================
    // MORE MENU — سه نقطه دسکتاپ + موبایل
    // ============================================================
    function setupMoreMenus() {
      const menu = document.getElementById("orderMoreMenu");
      if (!menu) {
        console.warn("[Orders] orderMoreMenu پیدا نشد");
        return;
      }

      ["moreActionBtn", "moreActionBtnMobile"].forEach((id) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener("click", function (e) {
          e.stopPropagation();

          const isOpen = !menu.classList.contains("hidden");
          if (isOpen) {
            menu.classList.add("hidden");
            return;
          }

          const rect = this.getBoundingClientRect();
          const menuWidth = 210;
          const menuHeight = 200;

          let left = rect.right - menuWidth;
          if (left < 10) left = 10;
          if (left + menuWidth > window.innerWidth - 10) {
            left = window.innerWidth - menuWidth - 10;
          }

          let top = rect.bottom + 6;
          if (top + menuHeight > window.innerHeight - 10) {
            top = rect.top - menuHeight - 6;
            if (top < 10) top = 10;
          }

          menu.style.top = `${top}px`;
          menu.style.left = `${left}px`;
          menu.style.right = "auto";
          menu.classList.remove("hidden");
        });
      });

      document.addEventListener("click", function (e) {
        if (
          !e.target.closest("#moreActionBtn") &&
          !e.target.closest("#moreActionBtnMobile") &&
          !e.target.closest("#orderMoreMenu")
        ) {
          menu.classList.add("hidden");
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") menu.classList.add("hidden");
      });

      menu.querySelectorAll("[data-order-action]").forEach((b) => {
        b.addEventListener("click", function () {
          const action = this.dataset.orderAction;
          const order = state.selectedOrder;

          if (!order) {
            menu.classList.add("hidden");
            return;
          }

          if (action === "message") {
            showToast("پیام به خریدار باز شد.", "info");
          } else if (action === "shipping") {
            document.getElementById("carrierInput")?.focus();
            showToast("فیلد شرکت حمل فوکوس شد.", "info");
          } else if (action === "report") {
            showToast("گزارش ثبت شد.", "success");
          } else if (action === "cancel") {
            order.status = "cancelled";
            order.history.push({ label: "لغو شده توسط فروشنده", date: "اکنون" });
            renderDetail(order);
            renderList();
            showToast("سفارش لغو شد.", "success");
          }

          menu.classList.add("hidden");
        });
      });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
      document.getElementById("mobileHeaderBack")?.addEventListener("click", () => {
        const d = document.getElementById("orderDetailView");
        if (d && !d.classList.contains("hidden")) showList();
        else if (window.history.length > 1) window.history.back();
        else window.location.href = "../StoreDashboard.html";
      });

      $$("[data-order-tab]").forEach((tab) => {
        tab.addEventListener("click", function () {
          state.activeTab = this.dataset.orderTab;
          state.currentPage = 1;
          $$("[data-order-tab]").forEach((t) => {
            t.className = "order-tab shrink-0 border-b-[3px] border-transparent px-4 pb-3 text-[13px] text-[#333] md:text-[14px]";
          });
          this.className = "order-tab shrink-0 border-b-[3px] border-[#aa4938] px-4 pb-3 text-[13px] font-medium text-[#aa4938] md:text-[14px]";
          renderList();
        });
      });

      document.getElementById("ordersSearch")?.addEventListener("input", debounce(function () {
        state.query = this.value;
        state.currentPage = 1;
        renderList();
      }, 300));

      $$('input[name="orderSort"]').forEach((input) => {
        input.addEventListener("change", function () {
          state.sort = this.value;
          state.currentPage = 1;
          const labels = {
            latest: "جدیدترین فروش", oldest: "قدیمی‌ترین فروش",
            cheap: "ارزان‌ترین", expensive: "گران‌ترین",
            action: "نیازمند اقدام",
          };
          const el = document.getElementById("orderSortChipLabel");
          if (el) el.textContent = labels[this.value] || "جدیدترین فروش";
          renderList();
          if (isMobile()) UI.closeMobileMenu();
        });
      });

      document.querySelector("[data-clear-order-sort]")?.addEventListener("click", function () {
        state.sort = "latest";
        const r = document.querySelector('input[name="orderSort"][value="latest"]');
        if (r) r.checked = true;
        const el = document.getElementById("orderSortChipLabel");
        if (el) el.textContent = "جدیدترین فروش";
        renderList();
        if (isMobile()) UI.closeMobileMenu();
        else this.closest(".store-popup")?.classList.add("hidden");
      });

      $$(".order-filter-checkbox").forEach((input) => {
        input.addEventListener("change", function () {
          const kind = this.dataset.filter;
          const set = state.filters[kind];
          if (!set) return;
          if (this.checked) set.add(this.value);
          else set.delete(this.value);
          state.currentPage = 1;
          updateChipLabels();
          renderList();
        });
      });

      $$("[data-clear]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const kind = this.dataset.clear;
          if (kind === "range") {
            state.range = null;
            state.rangeFrom = null;
            state.rangeTo = null;
            $$('input[name="orderRange"]').forEach((r) => (r.checked = false));
            const from = document.getElementById("orderRangeFrom");
            const to = document.getElementById("orderRangeTo");
            if (from) from.value = "";
            if (to) to.value = "";
            const label = document.getElementById("orderRangeChipLabel");
            if (label) label.textContent = "بازه زمانی ثبت";
          } else if (state.filters[kind]) {
            state.filters[kind].clear();
            $$(`.order-filter-checkbox[data-filter="${kind}"]`).forEach((cb) => (cb.checked = false));
          }
          state.currentPage = 1;
          updateChipLabels();
          renderList();
          if (isMobile()) UI.closeMobileMenu();
          else this.closest(".store-popup")?.classList.add("hidden");
        });
      });

      document.getElementById("applyOrderRange")?.addEventListener("click", function () {
        const sel = document.querySelector('input[name="orderRange"]:checked');
        state.range = sel?.value || null;
        state.rangeFrom = document.getElementById("orderRangeFrom")?.value || null;
        state.rangeTo = document.getElementById("orderRangeTo")?.value || null;

        const rangeLabels = {
          "24h": "۲۴ ساعت اخیر",
          "7d": "۷ روز اخیر",
          "30d": "۳۰ روز اخیر",
          "custom": "بازه دلخواه",
        };
        const label = document.getElementById("orderRangeChipLabel");
        if (label) label.textContent = state.range ? rangeLabels[state.range] : "بازه زمانی ثبت";

        renderList();
        this.closest(".store-popup")?.classList.add("hidden");
        if (isMobile()) UI.closeMobileMenu();
      });

      $$(".order-drawer-checkbox").forEach((input) => {
        input.addEventListener("change", function () {
          const kind = this.dataset.filter;
          const set = state.filters[kind];
          if (!set) return;
          if (this.checked) set.add(this.value);
          else set.delete(this.value);
          updateChipLabels();
        });
      });

      document.getElementById("applyOrderFilters")?.addEventListener("click", function () {
        state.currentPage = 1;
        renderList();
        UI.closeFilterDrawer();
      });

      document.getElementById("orderPageSize")?.addEventListener("change", function () {
        state.pageSize = parseInt(this.value, 10);
        state.currentPage = 1;
        renderList();
      });

      document.getElementById("mobilePrimaryAction")?.addEventListener("click", handlePrimaryAction);

      setupMoreMenus();

      document.getElementById("printInvoiceBtn")?.addEventListener("click", () => {
        showToast("فاکتور آماده چاپ است.", "info");
      });

      renderList();
    }

    function updateChipLabels() {
      const s = state.filters.status.size;
      const d = state.filters.delivery.size;
      const c = state.filters.category.size;

      const sEl = document.getElementById("orderStatusChipLabel");
      if (sEl) sEl.textContent = s ? `وضعیت سفارش (${toFa(s)})` : "وضعیت سفارش";

      const dEl = document.getElementById("orderDeliveryChipLabel");
      if (dEl) dEl.textContent = d ? `روش تحویل (${toFa(d)})` : "روش تحویل";

      const cEl = document.getElementById("orderCategoryChipLabel");
      if (cEl) cEl.textContent = c ? `دسته (${toFa(c)})` : "دسته";
    }

    UI.init();
    init();
  }
})();