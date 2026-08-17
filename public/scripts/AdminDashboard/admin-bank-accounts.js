// ============================================================
// admin-bank-accounts.js - حساب‌های بانکی فروشنده
// ============================================================

import {
  $,
  $$,
  toFa,
  money,
  showToast,
  isMobile,
  openMobileMenu,
  closeMobileMenu,
  openModal,
  closeModal,
  setupDropdownTriggers,
  setupSellerActions,
  setupMoreMenu,
} from "./admin-common.js";

// ===== Data Store =====
const BankAccountsStore = {
  accounts: [
    {
      id: 1,
      bankName: "بانک پاسارگاد",
      sheba: "IR۱۲۳۴۵۶۷۸۹۴۵۱۲۳۴۵۶۱۲۳۴۵۶۴۵۶",
      cardNumber: "۱۲۳۴ ۱۲۳۴ ۱۲۳۴ ۱۲۳۴",
      ownerName: "نام و نام خانوادگی صاحب حساب",
    },
    {
      id: 2,
      bankName: "بانک صادرات",
      sheba: "IR۱۲۳۴۵۶۷۸۹۴۵۱۲۳۴۵۶۱۲۳۴۵۶۴۵۶",
      cardNumber: "۱۲۳۴ ۱۲۳۴ ۱۲۳۴ ۱۲۳۴",
      ownerName: "نام و نام خانوادگی صاحب حساب",
    },
  ],

  add(account) {
    const newAccount = { id: Date.now(), ...account };
    this.accounts.push(newAccount);
    return newAccount;
  },

  update(id, updatedData) {
    const index = this.accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      this.accounts[index] = { ...this.accounts[index], ...updatedData };
      return this.accounts[index];
    }
    return null;
  },

  delete(id) {
    const index = this.accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      return true;
    }
    return false;
  },

  get(id) {
    return this.accounts.find((acc) => acc.id === id) || null;
  },

  getAll() {
    return [...this.accounts];
  },
};

// ===== UI Renderer =====
const BankAccountsUI = {
  container: document.getElementById("bankAccountsList"),
  wrapper: document.getElementById("bankAccountsContainer"),

  icon() {
    return `
      <span class="grid h-10 w-10 place-items-center rounded-[5px] bg-white/15 text-white">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4 9 8-5 8 5H4Zm1 2h14v8H5v-8Zm-2 8h18M8 11v8m4-8v8m4-8v8"/>
        </svg>
      </span>
    `;
  },

  card(account) {
    return `
      <article class="bank-card overflow-hidden rounded-[8px] px-6 py-5 text-white" data-account-id="${
        account.id
      }">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            ${this.icon()}
            <h3 class="text-[17px] font-semibold">${account.bankName}</h3>
          </div>

          <div class="grid flex-1 gap-5 text-[13px] lg:grid-cols-3">
            <p class="leading-7"><span class="text-white/70">شماره شبا:</span> <strong class="mr-1 font-medium">${
              account.sheba
            }</strong></p>
            <p class="leading-7"><span class="text-white/70">شماره کارت:</span> <strong class="mr-1 font-medium">${
              account.cardNumber
            }</strong></p>
            <p class="leading-7"><span class="text-white/70">صاحب حساب:</span> <strong class="mr-1 font-medium">${
              account.ownerName
            }</strong></p>
          </div>

          <div class="flex items-center gap-3 lg:order-last">
            <button data-edit-id="${
              account.id
            }" class="edit-account-btn grid h-9 w-9 place-items-center rounded-md text-white/90 hover:bg-white/10" aria-label="ویرایش حساب">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14 5 5 5M4 20l4.5-1 10-10a2.12 2.12 0 0 0-3-3l-10 10L4 20Z"/>
              </svg>
            </button>
            <button data-delete-id="${
              account.id
            }" class="delete-account-btn grid h-9 w-9 place-items-center rounded-md text-white/90 hover:bg-white/10" aria-label="حذف حساب">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16m-10 4v6m4-6v6M9 4h6l1 3H8l1-3Zm-2 3 1 13h8l1-13"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  },

  emptyState() {
    return `
      <div class="rounded-xl border border-dashed border-[#c9c9c9] py-16 text-center fade-in">
        <p class="text-[15px] text-[#666]">هنوز حساب بانکی ثبت نشده است.</p>
        <button id="emptyAddBtn" class="mt-4 rounded-lg bg-custom-brown px-5 py-3 text-sm text-white">افزودن اولین حساب</button>
      </div>
    `;
  },

  showLoading() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-custom-brown border-t-transparent"></div>
        </div>
      `;
    }
  },

  render() {
    if (!this.container) return;
    this.showLoading();

    requestAnimationFrame(() => {
      const accounts = BankAccountsStore.getAll();

      if (!accounts.length) {
        this.container.innerHTML = this.emptyState();
        const emptyBtn = document.getElementById("emptyAddBtn");
        if (emptyBtn) {
          emptyBtn.addEventListener("click", () => BankAccountsModal.open());
        }
        if (this.wrapper) this.wrapper.style.opacity = "1";
        return;
      }

      setTimeout(() => {
        this.container.innerHTML = accounts
          .map((acc) => this.card(acc))
          .join("");

        document.querySelectorAll(".edit-account-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const accountId = Number(btn.dataset.editId);
            const account = BankAccountsStore.get(accountId);
            if (account) BankAccountsModal.open(account);
          });
        });

        document.querySelectorAll(".delete-account-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const accountId = Number(btn.dataset.deleteId);
            BankAccountsDelete.open(accountId);
          });
        });

        if (this.wrapper) this.wrapper.style.opacity = "1";
      }, 50);
    });
  },
};

// ===== Add/Edit Modal =====
const BankAccountsModal = {
  open(account = null) {
    const isEdit = !!account;
    const title = isEdit ? "ویرایش حساب بانکی" : "افزودن حساب بانکی";
    const banks = [
      "بانک پاسارگاد",
      "بانک صادرات",
      "بانک ملت",
      "بانک ملی",
      "بانک تجارت",
      "بانک سامان",
    ];
    const options = banks
      .map(
        (name) =>
          `<option ${
            account?.bankName === name ? "selected" : ""
          }>${name}</option>`
      )
      .join("");

    const formHTML = `
      <form id="bankAccountForm" class="space-y-4">
        <label class="block">
          <span class="mb-2 block text-[13px] text-[#555]">نام بانک</span>
          <select id="bankNameInput" class="h-11 w-full rounded-lg border border-[#c9c9c9] bg-white px-3 text-[14px]">${options}</select>
        </label>
        <label class="block">
          <span class="mb-2 block text-[13px] text-[#555]">شماره شبا</span>
          <input id="shebaInput" value="${
            account?.sheba || ""
          }" placeholder="IRxxxxxxxxxxxxxxxxxxxxxxxx" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
        </label>
        <label class="block">
          <span class="mb-2 block text-[13px] text-[#555]">شماره کارت</span>
          <input id="cardNumberInput" value="${
            account?.cardNumber || ""
          }" placeholder="xxxx xxxx xxxx xxxx" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
        </label>
        <label class="block">
          <span class="mb-2 block text-[13px] text-[#555]">نام صاحب حساب</span>
          <input id="ownerNameInput" value="${
            account?.ownerName || ""
          }" placeholder="نام و نام خانوادگی صاحب حساب" class="h-11 w-full rounded-lg border border-[#c9c9c9] px-3 text-[14px]" />
        </label>
        <button type="submit" class="h-11 w-full rounded-lg bg-custom-brown text-white">${
          isEdit ? "ذخیره تغییرات" : "افزودن حساب بانکی"
        }</button>
      </form>
    `;

    openModal(title, formHTML);

    const form = document.getElementById("bankAccountForm");
    if (form) {
      const newForm = form.cloneNode(true);
      form.parentNode.replaceChild(newForm, form);

      newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const bankName = document.getElementById("bankNameInput").value.trim();
        const sheba = document.getElementById("shebaInput").value.trim();
        const cardNumber = document
          .getElementById("cardNumberInput")
          .value.trim();
        const ownerName = document
          .getElementById("ownerNameInput")
          .value.trim();

        if (!sheba || !cardNumber || !ownerName) {
          showToast("لطفاً همه اطلاعات حساب را وارد کنید.");
          return;
        }

        const payload = { bankName, sheba, cardNumber, ownerName };

        if (isEdit && account) {
          BankAccountsStore.update(account.id, payload);
          showToast("اطلاعات حساب بانکی ویرایش شد.");
        } else {
          BankAccountsStore.add(payload);
          showToast("حساب بانکی جدید اضافه شد.");
        }

        closeModal();
        BankAccountsUI.render();
      });
    }
  },
};

// ===== Delete Confirmation =====
const BankAccountsDelete = {
  _pendingId: null,

  open(accountId) {
    this._pendingId = accountId;

    openModal(
      "حذف حساب بانکی",
      `
      <div class="space-y-4">
        <p class="text-[14px] leading-7 text-[#666]">آیا از حذف این حساب بانکی مطمئن هستید؟ این عملیات قابل بازگشت نیست.</p>
        <div class="flex gap-3">
          <button id="confirmDeleteBtn" class="h-11 flex-1 rounded-lg bg-[#d63b3b] text-white hover:bg-[#bd3030]">حذف حساب</button>
          <button id="cancelDeleteBtn" class="h-11 flex-1 rounded-lg border border-[#c9c9c9] text-[#555] hover:bg-[#f7f7f7]">انصراف</button>
        </div>
      </div>
    `,
      "confirm"
    );

    document
      .getElementById("confirmDeleteBtn")
      ?.addEventListener("click", () => {
        if (this._pendingId !== null) {
          const deleted = BankAccountsStore.delete(this._pendingId);
          if (deleted) {
            showToast("حساب بانکی حذف شد.");
            BankAccountsUI.render();
          }
          closeModal("confirm");
          this._pendingId = null;
        }
      });

    document
      .getElementById("cancelDeleteBtn")
      ?.addEventListener("click", () => {
        closeModal("confirm");
        this._pendingId = null;
      });
  },
};

// ===== Init =====
function init() {
  setupSellerActions(
    "approveBtn",
    "rejectBtn",
    "statusBadge",
    "completionLabel"
  );
  setupMoreMenu("moreBtn", "moreMenu");
  setupDropdownTriggers();

  const addBtn = document.getElementById("addBankAccountBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => BankAccountsModal.open());
  }

  const closeBtn = document.getElementById("closeModalBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal());
  }
  const overlay = document.getElementById("modalOverlay");
  if (overlay) {
    overlay.addEventListener("click", () => closeModal());
  }

  const container = document.getElementById("bankAccountsContainer");
  if (container) container.style.opacity = "0";
  BankAccountsUI.render();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeModal("confirm");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
