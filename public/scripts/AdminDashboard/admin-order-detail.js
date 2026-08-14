// ============================================================
// admin-order-detail.js - جزئیات سفارش
// ============================================================

import {
  $,
  $$,
  toFa,
  money,
  showToast,
  isMobile,
  openModal,
  closeModal,
  setupDropdownTriggers,
} from "./admin-common.js";

// ===== Data =====
const orderData = {
  id: 123456,
  items: 6,
  stores: 2,
  date: "شنبه ۱۴۰۴/۰۴/۰۴",
  time: "۱۳:۵۲",
  total: 12500000,
  status: "preparing",
  buyer: {
    name: "شرکت سازه برتر",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    address: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ",
  },
  finance: {
    items: 12500000,
    tax: 12500000,
    discount: 12500000,
    paid: 12500000,
  },
  sellers: [
    {
      id: 1,
      name: "نام کامل فروشگاه",
      items: 123456,
      total: "۵,۰۰۰,۰۰۰,۰۰۰",
      status: "preparing",
      shipmentType: "ارسال توسط فروشنده",
      products: [
        {
          row: 1,
          name: "عنوان محصول",
          price: "۵,۰۰۰,۰۰۰,۰۰۰",
          quantity: "۱۲۳۴۵۶۷۸۹",
          unit: "کیلوگرم",
        },
        {
          row: 2,
          name: "عنوان محصول",
          price: "۵,۰۰۰,۰۰۰,۰۰۰",
          quantity: "۱۲۳۴۵۶۷۸۹",
          unit: "کیلوگرم",
        },
        {
          row: 3,
          name: "عنوان محصول",
          price: "۵,۰۰۰,۰۰۰,۰۰۰",
          quantity: "۱۲۳۴۵۶۷۸۹",
          unit: "کیلوگرم",
        },
      ],
      finance: {
        items: "۱۲,۵۰۰,۰۰۰",
        tax: "۱۲,۵۰۰,۰۰۰",
        discount: "۱۲,۵۰۰,۰۰۰",
        paid: "۱۲,۵۰۰,۰۰۰",
      },
      tracking: "",
      carrier: "",
    },
    {
      id: 2,
      name: "نام کامل فروشگاه",
      items: 123456,
      total: "۵,۰۰۰,۰۰۰,۰۰۰",
      status: "preparing",
      shipmentType: "ارسال توسط فروشنده",
      products: [
        {
          row: 1,
          name: "عنوان محصول",
          price: "۵,۰۰۰,۰۰۰,۰۰۰",
          quantity: "۱۲۳۴۵۶۷۸۹",
          unit: "کیلوگرم",
        },
        {
          row: 2,
          name: "عنوان محصول",
          price: "۵,۰۰۰,۰۰۰,۰۰۰",
          quantity: "۱۲۳۴۵۶۷۸۹",
          unit: "کیلوگرم",
        },
        {
          row: 3,
          name: "عنوان محصول",
          price: "۵,۰۰۰,۰۰۰,۰۰۰",
          quantity: "۱۲۳۴۵۶۷۸۹",
          unit: "کیلوگرم",
        },
      ],
      finance: {
        items: "۱۲,۵۰۰,۰۰۰",
        tax: "۱۲,۵۰۰,۰۰۰",
        discount: "۱۲,۵۰۰,۰۰۰",
        paid: "۱۲,۵۰۰,۰۰۰",
      },
      tracking: "",
      carrier: "",
    },
  ],
};

// ===== Status Badge =====
function getStatusBadge(status) {
  const map = {
    preparing: ["در حال آماده‌سازی", "bg-[#dcecff]", "text-[#2b78c5]"],
    completed: ["تکمیل شده", "bg-[#dcf6e8]", "text-[#16864a]"],
    canceled: ["لغو شده", "bg-[#fde3e3]", "text-[#c53a3a]"],
  };
  const [label, bg, color] = map[status] || [
    "نامشخص",
    "bg-[#eee]",
    "text-[#666]",
  ];
  return `<span class="rounded-[5px] px-3 py-2 text-[12px] font-medium ${bg} ${color}">${label}</span>`;
}

// ===== Render Seller Cards =====
function renderSellerCard(seller) {
  const statusMap = {
    preparing: ["در حال آماده‌سازی", "bg-[#dcecff]", "text-[#2b78c5]"],
    completed: ["تکمیل شده", "bg-[#dcf6e8]", "text-[#16864a]"],
    canceled: ["لغو شده", "bg-[#fde3e3]", "text-[#c53a3a]"],
  };
  const [statusLabel, statusBg, statusColor] = statusMap[seller.status] || [
    "نامشخص",
    "bg-[#eee]",
    "text-[#666]",
  ];

  return `
        <section class="rounded-[14px] bg-white px-5 py-5 shadow-soft lg:px-6" data-seller="${
          seller.id
        }">
            <header class="flex flex-col gap-4 border-b-0 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-center gap-4">
                    <h2 class="text-[16px] font-semibold">${seller.name}</h2>
                </div>
                <div class="flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] text-[#555]">
                    <span>تعداد آیتم: <strong class="mr-1 font-medium text-[#222]">${
                      seller.items
                    }</strong></span>
                    <span>مبلغ کل (تومان): <strong class="mr-1 font-medium text-[#222]">${
                      seller.total
                    }</strong></span>
                    <span class="font-medium text-custom-brown">${
                      seller.shipmentType
                    }</span>
                    <span class="seller-status rounded-[5px] px-3 py-2 text-[12px] font-medium ${statusBg} ${statusColor}">${statusLabel}</span>
                    <div class="relative">
                        <button type="button" class="seller-more-btn grid h-9 w-9 place-items-center rounded-md hover:bg-[#f5f5f5]" data-seller="${
                          seller.id
                        }" aria-label="عملیات فروشگاه">
                            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="5" r="1.6"/>
                                <circle cx="12" cy="12" r="1.6"/>
                                <circle cx="12" cy="19" r="1.6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div class="overflow-x-auto rounded-[8px] border border-[#cfcfcf]">
                <table class="w-full min-w-[850px] border-collapse text-[13px]">
                    <thead class="bg-[#f3f3f3] text-[#444]">
                        <tr class="h-[44px]">
                            <th class="w-[70px] px-4 text-center font-medium">ردیف</th>
                            <th class="px-4 text-right font-medium">نام محصول</th>
                            <th class="w-[180px] px-4 text-center font-medium">قیمت</th>
                            <th class="w-[180px] px-4 text-center font-medium">مقدار سفارش</th>
                            <th class="w-[120px] px-4 text-center font-medium">واحد</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${seller.products
                          .map(
                            (p) => `
                            <tr class="h-[50px] border-b border-[#d6d6d6] last:border-b-0">
                                <td class="px-4 text-center">${p.row}</td>
                                <td class="px-4 text-right">${p.name}</td>
                                <td class="px-4 text-center">${p.price}</td>
                                <td class="px-4 text-center">${p.quantity}</td>
                                <td class="px-4 text-center">${p.unit}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>

            <div class="mt-4 rounded-[8px] border border-[#cfcfcf] px-4 py-4">
                <h3 class="border-b border-[#d8d8d8] pb-3 text-[15px] font-semibold">خلاصه مالی</h3>
                <div class="mt-4 space-y-4 text-[13px]">
                    <div class="flex items-center justify-between"><span class="text-[#777]">جمع اقلام</span><strong class="font-medium">${
                      seller.finance.items
                    } تومان</strong></div>
                    <div class="flex items-center justify-between"><span class="text-[#777]">مالیات</span><strong class="font-medium">${
                      seller.finance.tax
                    } تومان</strong></div>
                    <div class="flex items-center justify-between"><span class="text-[#777]">تخفیف</span><strong class="font-medium">${
                      seller.finance.discount
                    } تومان</strong></div>
                    <div class="flex items-center justify-between border-t border-[#dedede] pt-4"><span class="font-medium">جمع کل پرداخت شده</span><strong class="font-semibold">${
                      seller.finance.paid
                    } تومان</strong></div>
                </div>
            </div>

            <div class="mt-4 rounded-[8px] border border-[#cfcfcf] px-4 py-4">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 class="text-[15px] font-semibold">اطلاعات ارسال/تحویل</h3>
                    <button type="button" class="save-shipment-btn hidden rounded-md bg-custom-brown px-4 py-2 text-[13px] font-medium text-white" data-seller="${
                      seller.id
                    }">ذخیره اطلاعات</button>
                </div>
                <div class="mt-5 grid gap-4 md:grid-cols-2">
                    <label><span class="mb-2 block text-[13px] text-[#555]">کد رهگیری</span>
                        <input data-field="tracking" data-seller="${
                          seller.id
                        }" value="${
    seller.tracking
  }" placeholder="کد رهگیری" class="shipment-input h-[43px] w-full rounded-[6px] border border-[#bcbcbc] px-4 text-[13px] placeholder:text-[#aaa] focus:border-custom-brown" />
                    </label>
                    <label><span class="mb-2 block text-[13px] text-[#555]">شرکت حمل</span>
                        <input data-field="carrier" data-seller="${
                          seller.id
                        }" value="${
    seller.carrier
  }" placeholder="شرکت حمل" class="shipment-input h-[43px] w-full rounded-[6px] border border-[#bcbcbc] px-4 text-[13px] placeholder:text-[#aaa] focus:border-custom-brown" />
                    </label>
                </div>
            </div>
        </section>
    `;
}

// ===== Render All Sellers =====
function renderSellers() {
  const container = document.getElementById("sellerOrders");
  if (container) {
    container.innerHTML = orderData.sellers.map(renderSellerCard).join("");
  }
  bindSellerEvents();
}

// ===== Seller Events =====
function bindSellerEvents() {
  document.querySelectorAll(".seller-more-btn").forEach((btn) => {
    btn.removeEventListener("click", handleSellerMore);
    btn.addEventListener("click", handleSellerMore);
  });

  document.querySelectorAll(".shipment-input").forEach((input) => {
    input.removeEventListener("input", handleShipmentInput);
    input.addEventListener("input", handleShipmentInput);
  });

  document.querySelectorAll(".save-shipment-btn").forEach((btn) => {
    btn.removeEventListener("click", handleSaveShipment);
    btn.addEventListener("click", handleSaveShipment);
  });
}

function closeSellerMenus() {
  document
    .querySelectorAll(".floating-seller-menu")
    .forEach((el) => el.remove());
}

function handleSellerMore(event) {
  event.stopPropagation();
  closeSellerMenus();

  const sellerId = Number(this.dataset.seller);
  const rect = this.getBoundingClientRect();
  const seller = orderData.sellers.find((s) => s.id === sellerId);
  if (!seller) return;

  const menu = document.createElement("div");
  menu.className =
    "floating-seller-menu fixed z-[60] w-48 overflow-hidden rounded-xl border border-[#e2e2e2] bg-white py-1 shadow-menu fade-in";
  menu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - 180)}px`;
  menu.style.left = `${Math.max(10, rect.left - 160)}px`;

  menu.innerHTML = `
        <button data-action="preparing" class="w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">در حال آماده‌سازی</button>
        <button data-action="completed" class="w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">تکمیل شده</button>
        <button data-action="invoice" class="w-full px-4 py-2.5 text-right text-[13px] hover:bg-[#f7f7f7]">مشاهده فاکتور فروشگاه</button>
        <button data-action="cancel" class="w-full px-4 py-2.5 text-right text-[13px] text-[#c93434] hover:bg-[#fff4f4]">لغو سفارش فروشگاه</button>
    `;

  document.body.appendChild(menu);

  menu.querySelectorAll("button").forEach((actionBtn) => {
    actionBtn.addEventListener("click", () => {
      const action = actionBtn.dataset.action;
      if (
        action === "preparing" ||
        action === "completed" ||
        action === "cancel"
      ) {
        const newStatus = action === "cancel" ? "canceled" : action;
        seller.status = newStatus;
        renderSellers();
        showToast("وضعیت سفارش فروشگاه تغییر کرد.");
      } else if (action === "invoice") {
        openModal(
          "order",
          "فاکتور فروشگاه",
          `<div class="space-y-4">
                        <p>جزئیات فاکتور فروشگاه "${seller.name}"</p>
                        <div class="flex justify-between"><span>جمع اقلام</span><strong>${seller.finance.items} تومان</strong></div>
                        <div class="flex justify-between"><span>مالیات</span><strong>${seller.finance.tax} تومان</strong></div>
                        <div class="flex justify-between"><span>تخفیف</span><strong>${seller.finance.discount} تومان</strong></div>
                        <div class="flex justify-between border-t pt-4"><span>مبلغ پرداخت شده</span><strong>${seller.finance.paid} تومان</strong></div>
                    </div>`
        );
      }
      closeSellerMenus();
    });
  });
}

function handleShipmentInput() {
  const sellerId = this.dataset.seller;
  const card = document.querySelector(`[data-seller="${sellerId}"]`);
  const saveBtn = card?.querySelector(".save-shipment-btn");
  if (saveBtn) saveBtn.classList.remove("hidden");
}

function handleSaveShipment() {
  const sellerId = Number(this.dataset.seller);
  const seller = orderData.sellers.find((s) => s.id === sellerId);
  if (!seller) return;

  const card = document.querySelector(`[data-seller="${sellerId}"]`);
  if (card) {
    const tracking = card.querySelector('[data-field="tracking"]');
    const carrier = card.querySelector('[data-field="carrier"]');
    if (tracking) seller.tracking = tracking.value;
    if (carrier) seller.carrier = carrier.value;
  }
  this.classList.add("hidden");
  showToast("اطلاعات ارسال با موفقیت ذخیره شد.");
}

// ===== Order Status =====
function updateOrderStatus(status) {
  const badge = document.getElementById("orderStatusBadge");
  if (!badge) return;

  const map = {
    preparing: ["در حال آماده‌سازی", "bg-[#dcecff]", "text-[#2b78c5]"],
    completed: ["تکمیل شده", "bg-[#dcf6e8]", "text-[#16864a]"],
    canceled: ["لغو شده", "bg-[#fde3e3]", "text-[#c53a3a]"],
  };
  const [label, bg, color] = map[status] || [
    "نامشخص",
    "bg-[#eee]",
    "text-[#666]",
  ];
  badge.textContent = label;
  badge.className = `rounded-[5px] px-3 py-2 text-[12px] font-medium ${bg} ${color}`;
}

// ===== Top Order Menu =====
function setupTopOrderMenu() {
  const topMoreBtn = document.getElementById("topMoreBtn");
  const topMoreMenu = document.getElementById("topMoreMenu");

  if (topMoreBtn && topMoreMenu) {
    topMoreBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      topMoreMenu.classList.toggle("hidden");
      this.setAttribute(
        "aria-expanded",
        String(!topMoreMenu.classList.contains("hidden"))
      );
    });

    document.querySelectorAll("[data-order-action]").forEach((btn) => {
      btn.addEventListener("click", function () {
        const action = this.dataset.orderAction;
        if (action === "completed") {
          orderData.status = "completed";
          updateOrderStatus("completed");
          showToast("سفارش تکمیل شد.");
        } else if (action === "cancel") {
          orderData.status = "canceled";
          updateOrderStatus("canceled");
          showToast("سفارش لغو شد.");
        } else if (action === "invoice") {
          openModal(
            "order",
            "فاکتور سفارش",
            `<div class="space-y-4">
                            <div class="flex justify-between"><span>جمع اقلام</span><strong>${money(
                              orderData.finance.items
                            )} تومان</strong></div>
                            <div class="flex justify-between"><span>مالیات</span><strong>${money(
                              orderData.finance.tax
                            )} تومان</strong></div>
                            <div class="flex justify-between"><span>تخفیف</span><strong>${money(
                              orderData.finance.discount
                            )} تومان</strong></div>
                            <div class="flex justify-between border-t pt-4"><span>مبلغ پرداخت شده</span><strong>${money(
                              orderData.finance.paid
                            )} تومان</strong></div>
                        </div>`
          );
        }
        topMoreMenu.classList.add("hidden");
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest("#topMoreBtn") && !e.target.closest("#topMoreMenu")) {
      if (topMoreMenu) topMoreMenu.classList.add("hidden");
      if (topMoreBtn) topMoreBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== Buyer Profile =====
function setupBuyerProfile() {
  document
    .getElementById("buyerProfileBtn")
    ?.addEventListener("click", function () {
      openModal(
        "order",
        "پروفایل خریدار",
        `
            <div class="space-y-3">
                <p><strong class="text-[#222]">نام/شرکت:</strong> ${orderData.buyer.name}</p>
                <p><strong class="text-[#222]">شماره تماس:</strong> ${orderData.buyer.phone}</p>
                <p><strong class="text-[#222]">آدرس:</strong> ${orderData.buyer.address}</p>
            </div>
        `
      );
    });
}

// ===== Invoice =====
function setupInvoice() {
  document.getElementById("invoiceBtn")?.addEventListener("click", function () {
    openModal(
      "order",
      "فاکتور سفارش",
      `
            <div class="space-y-4">
                <div class="flex justify-between"><span>جمع اقلام</span><strong>${money(
                  orderData.finance.items
                )} تومان</strong></div>
                <div class="flex justify-between"><span>مالیات</span><strong>${money(
                  orderData.finance.tax
                )} تومان</strong></div>
                <div class="flex justify-between"><span>تخفیف</span><strong>${money(
                  orderData.finance.discount
                )} تومان</strong></div>
                <div class="flex justify-between border-t pt-4"><span>مبلغ پرداخت شده</span><strong>${money(
                  orderData.finance.paid
                )} تومان</strong></div>
            </div>
        `
    );
  });
}

// ===== Init =====
function init() {
  setupDropdownTriggers();
  setupTopOrderMenu();
  setupBuyerProfile();
  setupInvoice();

  renderSellers();

  document
    .getElementById("closeModal")
    ?.addEventListener("click", () => closeModal("order"));
  document
    .getElementById("modalBackdrop")
    ?.addEventListener("click", () => closeModal("order"));

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal("order");
      closeSellerMenus();
      const topMoreMenu = document.getElementById("topMoreMenu");
      if (topMoreMenu) topMoreMenu.classList.add("hidden");
    }
  });

  updateOrderStatus(orderData.status);
}

document.addEventListener("DOMContentLoaded", init);
