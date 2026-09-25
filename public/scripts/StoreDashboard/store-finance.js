// ============================================================
// store-finance.js - مالی و تسویه‌حساب (نسخه تست‌شده)
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) { console.error("[Finance] StoreUI یافت نشد"); return; }

    const {
      $, $$, toFa, money, parseNumber, showToast, isMobile,
      openModal, closeModal, renderPagination, debounce,
    } = UI;

    // ============================================================
    // STATE
    // ============================================================
    const state = {
      activeTab: "transactions",
      tx: { query: "", sort: "latest", currentPage: 1, pageSize: 10, _len: 0 },
      st: { sort: "latest", statuses: new Set(), currentPage: 1, pageSize: 10, _len: 0 },
      editingBankId: null,
      deletingBankId: null,
      selectedBankId: null,
    };

    // ============================================================
    // DATA
    // ============================================================
    const transactions = [
      { id: 1, type: "sale", label: "فروش سفارش", orderNo: "۱۲۳۳۴۵۶۷", date: "۱۴۰۵/۱۲/۱۲", time: "۱۴:۳۲",
        sale: 120000000, fee: 12000000, net: 108000000, createdAtRaw: 100 },
      { id: 2, type: "sale", label: "فروش سفارش", orderNo: "۱۲۳۳۴۵۶۸", date: "۱۴۰۵/۱۲/۱۱", time: "۱۰:۱۵",
        sale: 85000000, fee: 8500000, net: 76500000, createdAtRaw: 99 },
      { id: 3, type: "refund", label: "بازگشت وجه", orderNo: "۱۲۳۳۴۵۶۹", date: "۱۴۰۵/۱۲/۱۰", time: "۱۶:۰۰",
        sale: 25000000, fee: 0, net: -25000000, createdAtRaw: 98 },
      { id: 4, type: "adjustment", label: "اصلاح مالی", orderNo: "—", date: "۱۴۰۵/۱۲/۰۹", time: "۰۹:۰۰",
        sale: 5000000, fee: 0, net: 5000000, createdAtRaw: 97 },
      { id: 5, type: "sale", label: "فروش سفارش", orderNo: "۱۲۳۳۴۵۷۰", date: "۱۴۰۵/۱۲/۰۸", time: "۱۳:۲۰",
        sale: 200000000, fee: 20000000, net: 180000000, createdAtRaw: 96 },
      { id: 6, type: "sale", label: "فروش سفارش", orderNo: "۱۲۳۳۴۵۷۱", date: "۱۴۰۵/۱۲/۰۷", time: "۱۱:۴۵",
        sale: 45000000, fee: 4500000, net: 40500000, createdAtRaw: 95 },
      { id: 7, type: "sale", label: "فروش سفارش", orderNo: "۱۲۳۳۴۵۷۲", date: "۱۴۰۵/۱۲/۰۶", time: "۱۴:۰۰",
        sale: 32000000, fee: 3200000, net: 28800000, createdAtRaw: 94 },
      { id: 8, type: "sale", label: "فروش سفارش", orderNo: "۱۲۳۳۴۵۷۳", date: "۱۴۰۵/۱۲/۰۵", time: "۰۹:۳۰",
        sale: 18000000, fee: 1800000, net: 16200000, createdAtRaw: 93 },
    ];

    const settlements = [
      { id: 1, code: "۱۲۳۴۵۶۷۸۹", requestDate: "۱۴۰۵/۱۲/۱۲", amount: 120000000,
        bank: "بانک ملی ۷۸۱۴", status: "paid", depositDate: "۱۴۰۵/۱۲/۱۲", createdAtRaw: 100 },
      { id: 2, code: "۱۲۳۴۵۶۷۸۹", requestDate: "۱۴۰۵/۱۲/۱۰", amount: 85000000,
        bank: "بانک ملی ۷۸۱۴", status: "paid", depositDate: "۱۴۰۵/۱۲/۱۰", createdAtRaw: 95 },
      { id: 3, code: "۱۲۳۴۵۶۷۸۹", requestDate: "۱۴۰۵/۱۲/۰۸", amount: 120000000,
        bank: "بانک ملی ۷۸۱۴", status: "pending", depositDate: "—", createdAtRaw: 90 },
      { id: 4, code: "۱۲۳۴۵۶۷۸۹", requestDate: "۱۴۰۵/۱۲/۰۵", amount: 45000000,
        bank: "بانک ملی ۷۸۱۴", status: "paid", depositDate: "۱۴۰۵/۱۲/۰۵", createdAtRaw: 85 },
      { id: 5, code: "۱۲۳۴۵۶۷۸۹", requestDate: "۱۴۰۵/۱۲/۰۲", amount: 32000000,
        bank: "بانک ملی ۷۸۱۴", status: "rejected", depositDate: "—", createdAtRaw: 80 },
    ];

    const banks = [
      { id: 1, bankName: "بانک پاسارگاد", ownerName: "نام و نام خانوادگی صاحب حساب",
        iban: "IR1234567894512316513518613165165", cardNumber: "1234 1234 1234 1234", last4: "5165" },
      { id: 2, bankName: "بانک صادرات", ownerName: "نام و نام خانوادگی صاحب حساب",
        iban: "IR1234567894512316513518613165165", cardNumber: "1234 1234 1234 1234", last4: "5165" },
    ];

    const stStatusMeta = {
      paid: { label: "موفق", classes: "bg-[#dcf6e8] text-[#16864a]" },
      pending: { label: "در انتظار", classes: "bg-[#fff2d7] text-[#d98b15]" },
      rejected: { label: "رد شده", classes: "bg-[#fde3e3] text-[#c53a3a]" },
    };

    // ============================================================
    // TAB SWITCHING
    // ============================================================
    function switchTab(key) {
      state.activeTab = key;

      $$("[data-finance-tab]").forEach((btn) => {
        const isActive = btn.dataset.financeTab === key;
        btn.className = `finance-tab shrink-0 border-b-[3px] px-6 py-4 text-[14px] md:py-3 ${
          isActive
            ? "border-[#aa4938] font-medium text-[#aa4938]"
            : "border-transparent text-[#333] hover:text-[#aa4938]"
        }`;
      });

      $$(".finance-panel").forEach((panel) => panel.classList.add("hidden"));
      const panel = document.getElementById(`finance-${key}`);
      if (panel) panel.classList.remove("hidden");

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ============================================================
    // TRANSACTIONS
    // ============================================================
    function getFilteredTx() {
      let data = [...transactions];
      if (state.tx.query) {
        const q = state.tx.query.trim();
        data = data.filter((t) => t.label.includes(q) || t.orderNo.includes(q));
      }
      const sorters = {
        latest: (a, b) => b.createdAtRaw - a.createdAtRaw,
        oldest: (a, b) => a.createdAtRaw - b.createdAtRaw,
        highest: (a, b) => b.sale - a.sale,
        lowest: (a, b) => a.sale - b.sale,
        netHighest: (a, b) => b.net - a.net,
        netLowest: (a, b) => a.net - b.net,
      };
      data.sort(sorters[state.tx.sort] || sorters.latest);
      state.tx._len = data.length;
      return data;
    }

    function txRowTemplate(t) {
      const isNeg = t.net < 0;
      return `
        <tr class="h-[68px] border-b border-[#f0f0f0] last:border-b-0">
          <td class="px-5 text-right">
            <div class="font-medium text-[#333]">${t.label}</div>
            <div class="mt-0.5 text-[11px] text-[#999]">${t.orderNo}</div>
          </td>
          <td class="px-5 text-right">
            <div class="text-[#333]">${t.date}</div>
            <div class="text-[11px] text-[#999]">${t.time}</div>
          </td>
          <td class="money-en px-5 text-right" dir="ltr">${money(t.sale)}</td>
          <td class="money-en px-5 text-right" dir="ltr">${money(t.fee)}</td>
          <td class="money-en px-5 text-right font-medium ${isNeg ? "text-red-500" : "text-[#16864a]"}" dir="ltr">
            ${isNeg ? "−" : ""}${money(Math.abs(t.net))}
          </td>
        </tr>
      `;
    }

    function txCardTemplate(t) {
      const isNeg = t.net < 0;
      return `
        <div class="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
          <div class="mb-3 flex items-center justify-between">
            <div class="text-[13px] font-medium">تراکنش: ${t.label}</div>
            <div class="text-[11px] text-[#999]">تاریخ: ${t.date}</div>
          </div>
          <div class="space-y-2 text-[12px]">
            <div class="flex items-center justify-between">
              <span class="text-[#777]">مبلغ فروش:</span>
              <b class="money-en" dir="ltr">${money(t.sale)} تومان</b>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#777]">مبلغ کسرشده:</span>
              <b class="money-en" dir="ltr">${money(t.fee)} تومان</b>
            </div>
            <div class="flex items-center justify-between border-t border-[#f0f0f0] pt-2">
              <span class="text-[#777]">سهم خالص فروشگاه:</span>
              <b class="money-en ${isNeg ? "text-red-500" : "text-[#16864a]"}" dir="ltr">
                ${isNeg ? "−" : ""}${money(Math.abs(t.net))} تومان
              </b>
            </div>
          </div>
        </div>
      `;
    }

    function renderTx() {
      const filtered = getFilteredTx();
      const total = filtered.length;
      const totalPages = Math.ceil(total / state.tx.pageSize) || 1;
      if (state.tx.currentPage > totalPages) state.tx.currentPage = totalPages;
      const start = (state.tx.currentPage - 1) * state.tx.pageSize;
      const paginated = filtered.slice(start, start + state.tx.pageSize);

      const rowsEl = document.getElementById("txRows");
      const cardsEl = document.getElementById("txCards");
      const emptyEl = document.getElementById("txEmpty");
      const countEl = document.getElementById("txCount");

      if (rowsEl) rowsEl.innerHTML = paginated.map(txRowTemplate).join("");
      if (cardsEl) cardsEl.innerHTML = paginated.map(txCardTemplate).join("");
      if (emptyEl) emptyEl.classList.toggle("hidden", paginated.length > 0);
      if (countEl) countEl.textContent = toFa(total);

      renderPagination("txPagination", state.tx.currentPage, totalPages, (p) => {
        state.tx.currentPage = p;
        renderTx();
      });
    }

    // ============================================================
    // SETTLEMENTS
    // ============================================================
    function getFilteredSt() {
      let data = [...settlements];
      if (state.st.statuses.size) data = data.filter((s) => state.st.statuses.has(s.status));
      if (state.st.sort === "oldest") data.sort((a, b) => a.createdAtRaw - b.createdAtRaw);
      else data.sort((a, b) => b.createdAtRaw - a.createdAtRaw);
      state.st._len = data.length;
      return data;
    }

    function stRowTemplate(s) {
      const meta = stStatusMeta[s.status] || stStatusMeta.pending;
      return `
        <tr class="h-[72px] border-b border-[#f0f0f0] last:border-b-0">
          <td class="px-5 text-right">
            <div class="text-[11px] text-[#999]">شناسه تسویه:</div>
            <div class="mt-0.5 text-[13px] font-medium">${s.code}</div>
          </td>
          <td class="px-5 text-right">
            <div class="text-[11px] text-[#999]">تاریخ درخواست:</div>
            <div class="mt-0.5">${s.requestDate}</div>
          </td>
          <td class="money-en px-5 text-right" dir="ltr">${money(s.amount)}</td>
          <td class="px-5 text-right">${s.bank}</td>
          <td class="px-5 text-right">
            <div class="text-[11px] text-[#999]">تاریخ واریز:</div>
            <div class="mt-0.5">${s.depositDate}</div>
          </td>
          <td class="px-5 text-right">
            <span class="inline-flex rounded-[5px] px-3 py-1.5 text-[11px] font-medium ${meta.classes}">${meta.label}</span>
          </td>
        </tr>
      `;
    }

    function stCardTemplate(s) {
      const meta = stStatusMeta[s.status] || stStatusMeta.pending;
      return `
        <div class="rounded-[12px] border border-[#e5e5e5] bg-white p-4">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="text-[11px] text-[#999]">شناسه تسویه:</div>
              <div class="mt-0.5 text-[13px] font-medium">${s.code}</div>
            </div>
            <span class="inline-flex rounded-[5px] px-3 py-1.5 text-[11px] font-medium ${meta.classes}">${meta.label}</span>
          </div>
          <div class="space-y-2 text-[12px]">
            <div class="flex justify-between"><span class="text-[#777]">تاریخ درخواست:</span><b>${s.requestDate}</b></div>
            <div class="flex justify-between"><span class="text-[#777]">مبلغ:</span><b class="money-en" dir="ltr">${money(s.amount)} تومان</b></div>
            <div class="flex justify-between"><span class="text-[#777]">حساب مقصد:</span><b>${s.bank}</b></div>
            <div class="flex justify-between"><span class="text-[#777]">تاریخ واریز:</span><b>${s.depositDate}</b></div>
          </div>
        </div>
      `;
    }

    function renderSt() {
      const filtered = getFilteredSt();
      const total = filtered.length;
      const totalPages = Math.ceil(total / state.st.pageSize) || 1;
      if (state.st.currentPage > totalPages) state.st.currentPage = totalPages;
      const start = (state.st.currentPage - 1) * state.st.pageSize;
      const paginated = filtered.slice(start, start + state.st.pageSize);

      const rowsEl = document.getElementById("stRows");
      const cardsEl = document.getElementById("stCards");
      const emptyEl = document.getElementById("stEmpty");
      const countEl = document.getElementById("stCount");

      if (rowsEl) rowsEl.innerHTML = paginated.map(stRowTemplate).join("");
      if (cardsEl) cardsEl.innerHTML = paginated.map(stCardTemplate).join("");
      if (emptyEl) emptyEl.classList.toggle("hidden", paginated.length > 0);
      if (countEl) countEl.textContent = toFa(total);

      renderPagination("stPagination", state.st.currentPage, totalPages, (p) => {
        state.st.currentPage = p;
        renderSt();
      });
    }

    // ============================================================
    // OVERVIEW
    // ============================================================
    function renderOverview() {
      const txEl = document.getElementById("overviewTransactions");
      const stEl = document.getElementById("overviewSettlements");

      if (txEl) {
        txEl.innerHTML = transactions.slice(0, 4).map((t) => `
          <div class="flex items-center justify-between rounded-[10px] border border-[#f0f0f0] px-3 py-2.5">
            <div class="flex items-center gap-2">
              <span class="rounded-[4px] bg-[#dcf6e8] px-2 py-0.5 text-[10px] text-[#16864a]">${t.label}</span>
              <span class="text-[11px] text-[#666]">${t.orderNo}</span>
            </div>
            <div class="money-en text-[12px] font-medium" dir="ltr">${money(t.sale)}</div>
          </div>
        `).join("");
      }

      if (stEl) {
        stEl.innerHTML = settlements.slice(0, 4).map((s) => {
          const meta = stStatusMeta[s.status] || stStatusMeta.pending;
          return `
            <div class="flex items-center justify-between rounded-[10px] border border-[#f0f0f0] px-3 py-2.5">
              <div class="flex items-center gap-2">
                <span class="rounded-[4px] px-2 py-0.5 text-[10px] font-medium ${meta.classes}">${meta.label}</span>
                <span class="text-[11px] text-[#666]">${s.code}</span>
              </div>
              <div class="money-en text-[12px] font-medium" dir="ltr">${money(s.amount)}</div>
            </div>
          `;
        }).join("");
      }
    }

    // ============================================================
    // BANKS
    // ============================================================
    function renderBanks() {
      const list = document.getElementById("bankList");
      const empty = document.getElementById("bankEmpty");
      if (!list) return;

      if (!banks.length) {
        list.innerHTML = "";
        empty?.classList.remove("hidden");
        return;
      }
      empty?.classList.add("hidden");

      list.innerHTML = banks.map((b) => `
        <article class="bank-card-dark rounded-[10px] p-5 text-white" data-bank-id="${b.id}">
          <div class="relative z-10">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button type="button" data-edit-bank="${b.id}"
                  class="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10" aria-label="ویرایش">
                  <svg class="h-4 w-4"><use href="#icon-edit"></use></svg>
                </button>
                <button type="button" data-delete-bank="${b.id}"
                  class="grid h-8 w-8 place-items-center rounded-md text-white/80 hover:bg-white/10" aria-label="حذف">
                  <svg class="h-4 w-4"><use href="#icon-trash"></use></svg>
                </button>
              </div>
              <div class="flex items-center gap-3">
                <h3 class="text-[15px] font-semibold">${b.bankName}</h3>
                <span class="grid h-10 w-10 place-items-center rounded-[6px] bg-white/10 text-white/90">
                  <svg class="h-5 w-5"><use href="#icon-bank"></use></svg>
                </span>
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-3 text-[12px] md:grid-cols-3">
              <div>
                <div class="text-white/60">صاحب حساب:</div>
                <div class="mt-1">${b.ownerName}</div>
              </div>
              <div>
                <div class="text-white/60">شماره کارت:</div>
                <div class="mt-1 money-en" dir="ltr">${b.cardNumber}</div>
              </div>
              <div>
                <div class="text-white/60">شماره شبا:</div>
                <div class="mt-1 money-en" dir="ltr">${b.iban}</div>
              </div>
            </div>
          </div>
        </article>
      `).join("");

      $$("[data-edit-bank]").forEach((btn) => {
        btn.addEventListener("click", function () {
          openBankModal(Number(this.dataset.editBank));
        });
      });
      $$("[data-delete-bank]").forEach((btn) => {
        btn.addEventListener("click", function () {
          state.deletingBankId = Number(this.dataset.deleteBank);
          openModal("deleteBankModal", "deleteBankBackdrop");
        });
      });
    }

    function openBankModal(id = null) {
      state.editingBankId = id;
      const bank = id ? banks.find((b) => b.id === id) : null;
      const titleEl = document.getElementById("bankModalTitle");
      if (titleEl) titleEl.textContent = id ? "ویرایش حساب بانکی" : "افزودن حساب بانکی";
      document.getElementById("bankName").value = bank?.bankName || "";
      document.getElementById("bankOwner").value = bank?.ownerName || "";
      document.getElementById("bankIban").value = bank?.iban || "";
      document.getElementById("bankCard").value = bank?.cardNumber || "";
      openModal("bankModal", "bankModalBackdrop");
    }

    // ============================================================
    // FEEDBACK MODAL
    // ============================================================
    function showFeedback({ type = "success", title, text }) {
      const iconEl = document.getElementById("feedbackIcon");
      const titleEl = document.getElementById("feedbackTitle");
      const textEl = document.getElementById("feedbackText");
      if (!iconEl || !titleEl || !textEl) return;

      if (type === "success") {
        iconEl.className = "mx-auto grid h-[70px] w-[70px] place-items-center rounded-full bg-green-500 text-white";
        iconEl.innerHTML = `<svg class="h-10 w-10"><use href="#icon-check"></use></svg>`;
      } else {
        iconEl.className = "mx-auto grid h-[70px] w-[70px] place-items-center rounded-full bg-red-500 text-white";
        iconEl.innerHTML = `<svg class="h-10 w-10" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
      }
      titleEl.textContent = title || "";
      textEl.textContent = text || "";
      openModal("feedbackModal", "feedbackBackdrop");
    }

    // ============================================================
    // SETTLEMENT MODAL
    // ============================================================
    function renderBankSelector() {
      const list = document.getElementById("bankSelectorList");
      if (!list) return;

      if (!banks.length) {
        list.innerHTML = `<div class="px-4 py-3 text-center text-[12px] text-[#999]">حساب بانکی ثبت نشده است</div>`;
        return;
      }

      list.innerHTML = banks.map((b) => {
        const selected = state.selectedBankId === b.id;
        return `
          <button type="button" data-select-bank="${b.id}"
            class="flex w-full items-center justify-between px-4 py-3 text-right text-[13px] hover:bg-[#fafafa]">
            <div class="flex items-center gap-3">
              <span class="grid h-5 w-5 place-items-center rounded-full border ${selected ? "border-[#aa4938]" : "border-[#ccc]"}">
                ${selected ? '<span class="h-2.5 w-2.5 rounded-full bg-[#aa4938]"></span>' : ""}
              </span>
              <span class="font-medium">${b.bankName}</span>
              <span class="money-en text-[11px] text-[#999]" dir="ltr">****${b.last4}</span>
            </div>
          </button>
        `;
      }).join("");

      list.querySelectorAll("[data-select-bank]").forEach((btn) => {
        btn.addEventListener("click", function () {
          state.selectedBankId = Number(this.dataset.selectBank);
          const bank = banks.find((b) => b.id === state.selectedBankId);
          const labelEl = document.getElementById("bankSelectorLabel");
          if (labelEl && bank) {
            labelEl.textContent = `${bank.bankName} ****${bank.last4}`;
            labelEl.className = "text-[#333] font-medium";
          }
          document.getElementById("bankSelectorDropdown")?.classList.add("hidden");
          renderBankSelector();
        });
      });
    }

    function updateSettlementSummary() {
      const amountInput = document.getElementById("settlementAmount");
      const amount = parseNumber(amountInput?.value);
      const fee = 0;
      const final = amount - fee;
      const fmt = (v) => v ? `${money(v)} تومان` : "۰ تومان";

      const req = document.getElementById("summaryRequested");
      const f = document.getElementById("summaryFee");
      const fin = document.getElementById("summaryFinal");
      if (req) req.textContent = fmt(amount);
      if (f) f.textContent = fmt(fee);
      if (fin) fin.textContent = fmt(final);
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
      // دکمه‌های بازگشت
      document.querySelectorAll("[data-store-back]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.history.length > 1) window.history.back();
          else window.location.href = "StoreDashboard.html";
        });
      });

      // تب‌ها
      $$("[data-finance-tab]").forEach((btn) => {
        btn.addEventListener("click", () => switchTab(btn.dataset.financeTab));
      });
      $$("[data-switch-tab]").forEach((btn) => {
        btn.addEventListener("click", () => switchTab(btn.dataset.switchTab));
      });

      // رندر اولیه
      renderOverview();
      renderTx();
      renderSt();
      renderBanks();
      renderBankSelector();

      // Search
      document.getElementById("txSearch")?.addEventListener("input", debounce(function () {
        state.tx.query = this.value;
        state.tx.currentPage = 1;
        renderTx();
      }, 300));

      // TX Sort radios
      $$('input[name="txSort"]').forEach((input) => {
        input.addEventListener("change", function () {
          state.tx.sort = this.value;
          state.tx.currentPage = 1;
          const labels = {
            latest: "جدیدترین فروش", oldest: "قدیمی‌ترین فروش",
            highest: "بیشترین مبلغ فروش", lowest: "کمترین مبلغ فروش",
            netHighest: "بیشترین سهم خالص", netLowest: "کمترین سهم خالص",
          };
          const el = document.getElementById("txSortChipLabel");
          if (el) el.textContent = labels[this.value] || "جدیدترین";
          renderTx();
          if (isMobile()) UI.closeMobileMenu();
        });
      });

      document.querySelector("[data-clear-tx-sort]")?.addEventListener("click", function () {
        state.tx.sort = "latest";
        const r = document.querySelector('input[name="txSort"][value="latest"]');
        if (r) r.checked = true;
        const el = document.getElementById("txSortChipLabel");
        if (el) el.textContent = "جدیدترین";
        state.tx.currentPage = 1;
        renderTx();
        if (isMobile()) UI.closeMobileMenu();
        else this.closest(".store-popup")?.classList.add("hidden");
        showToast("مرتب‌سازی بازنشانی شد.");
      });

      // ST Sort
      $$('input[name="stSort"]').forEach((input) => {
        input.addEventListener("change", function () {
          state.st.sort = this.value;
          state.st.currentPage = 1;
          const el = document.getElementById("stSortChipLabel");
          if (el) el.textContent = this.value === "oldest" ? "قدیمی‌ترین" : "جدیدترین فروش";
          renderSt();
          if (isMobile()) UI.closeMobileMenu();
        });
      });

      // ST Status
      $$(".st-status-check").forEach((input) => {
        input.addEventListener("change", function () {
          if (this.checked) state.st.statuses.add(this.value);
          else state.st.statuses.delete(this.value);
          state.st.currentPage = 1;
          renderSt();
        });
      });

      // Page size
      document.getElementById("txPageSize")?.addEventListener("change", function () {
        state.tx.pageSize = parseInt(this.value, 10);
        state.tx.currentPage = 1;
        renderTx();
      });
      document.getElementById("stPageSize")?.addEventListener("change", function () {
        state.st.pageSize = parseInt(this.value, 10);
        state.st.currentPage = 1;
        renderSt();
      });

      // Open bank modal
      document.getElementById("openBankModal")?.addEventListener("click", () => openBankModal());
      $$("[data-open-bank-modal]").forEach((btn) => {
        btn.addEventListener("click", () => {
          closeModal("settlementModal");
          openBankModal();
        });
      });

      // Close bank modal
      document.getElementById("closeBankModal")?.addEventListener("click", () => closeModal("bankModal"));
      document.getElementById("bankModalBackdrop")?.addEventListener("click", () => closeModal("bankModal"));

      // Bank form
      document.getElementById("bankForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const bankName = document.getElementById("bankName").value.trim();
        const ownerName = document.getElementById("bankOwner").value.trim();
        const iban = document.getElementById("bankIban").value.trim();
        const cardNumber = document.getElementById("bankCard").value.trim();

        if (!bankName || !ownerName || !iban || !cardNumber) {
          showToast("همه فیلدها الزامی هستند.", "error");
          return;
        }

        if (state.editingBankId) {
          const b = banks.find((x) => x.id === state.editingBankId);
          if (b) Object.assign(b, {
            bankName, ownerName, iban, cardNumber,
            last4: cardNumber.replace(/\s/g, "").slice(-4),
          });
          showToast("حساب ویرایش شد.", "success");
        } else {
          const newId = Math.max(0, ...banks.map((b) => b.id)) + 1;
          banks.push({
            id: newId, bankName, ownerName, iban, cardNumber,
            last4: cardNumber.replace(/\s/g, "").slice(-4),
          });
          showToast("حساب بانکی اضافه شد.", "success");
        }
        closeModal("bankModal");
        renderBanks();
        renderBankSelector();
      });

      // Delete bank
      document.getElementById("cancelDeleteBank")?.addEventListener("click", () => {
        closeModal("deleteBankModal");
        state.deletingBankId = null;
      });
      document.getElementById("deleteBankBackdrop")?.addEventListener("click", () => {
        closeModal("deleteBankModal");
        state.deletingBankId = null;
      });
      document.getElementById("confirmDeleteBank")?.addEventListener("click", () => {
        if (state.deletingBankId) {
          const idx = banks.findIndex((b) => b.id === state.deletingBankId);
          if (idx > -1) banks.splice(idx, 1);
          renderBanks();
          renderBankSelector();
          showToast("حساب بانکی حذف شد.", "success");
        }
        closeModal("deleteBankModal");
        state.deletingBankId = null;
      });

      // Settlement modal open
      document.getElementById("openSettlementModal")?.addEventListener("click", () => {
        state.selectedBankId = null;
        const amt = document.getElementById("settlementAmount");
        if (amt) amt.value = "";
        const lbl = document.getElementById("bankSelectorLabel");
        if (lbl) {
          lbl.textContent = "انتخاب حساب بانکی";
          lbl.className = "text-[#777]";
        }
        document.getElementById("bankSelectorDropdown")?.classList.add("hidden");
        renderBankSelector();
        updateSettlementSummary();
        openModal("settlementModal", "settlementBackdrop");
      });

      // Close settlement
      document.getElementById("closeSettlementModal")?.addEventListener("click", () => closeModal("settlementModal"));
      document.getElementById("cancelSettlementModal")?.addEventListener("click", () => closeModal("settlementModal"));
      document.getElementById("settlementBackdrop")?.addEventListener("click", () => closeModal("settlementModal"));

      // Select all amount
      document.getElementById("selectAllAmount")?.addEventListener("click", function () {
        const amountInput = document.getElementById("settlementAmount");
        if (amountInput) {
          amountInput.value = money(120000000);
          updateSettlementSummary();
        }
      });

      // Amount input
      document.getElementById("settlementAmount")?.addEventListener("input", updateSettlementSummary);

      // Bank selector toggle
      document.getElementById("bankSelectorBtn")?.addEventListener("click", function (e) {
        e.stopPropagation();
        const dd = document.getElementById("bankSelectorDropdown");
        if (dd) dd.classList.toggle("hidden");
      });

      document.addEventListener("click", function (e) {
        if (!e.target.closest("#bankSelectorWrap")) {
          document.getElementById("bankSelectorDropdown")?.classList.add("hidden");
        }
      });

      // Settlement submit
      document.getElementById("settlementForm")?.addEventListener("submit", function (e) {
        e.preventDefault();
        const amount = parseNumber(document.getElementById("settlementAmount").value);
        if (!amount || amount < 10000) {
          showToast("حداقل مبلغ درخواست ۱۰,۰۰۰ تومان است.", "error");
          return;
        }
        if (!state.selectedBankId) {
          showToast("حساب مقصد را انتخاب کنید.", "error");
          return;
        }

        closeModal("settlementModal");
        setTimeout(() => {
          showFeedback({
            type: "success",
            title: "درخواست تسویه شما ثبت شد.",
            text: `درخواست تسویه به مبلغ ${money(amount)} تومان ثبت شد. وضعیت آن را می‌توانید از بخش تاریخچه تسویه‌حساب‌ها پیگیری کنید.`,
          });
        }, 250);
      });

      // Feedback modal
      document.getElementById("closeFeedback")?.addEventListener("click", () => closeModal("feedbackModal"));
      document.getElementById("feedbackBackdrop")?.addEventListener("click", () => closeModal("feedbackModal"));

      // Month button (فقط toast)
      document.getElementById("txMonthBtn")?.addEventListener("click", function () {
        showToast("انتخاب بازه زمانی به زودی...", "info");
      });
    }

    UI.init();
    init();
  }
})();