const counterContainer = document.querySelector(
  ".flex.items-center.justify-between.gap-4.mb-4"
);
const counterValue = counterContainer.querySelector("span.font-bold");
const incrementBtn = counterContainer.querySelector("button:first-child");
const decrementBtn = counterContainer.querySelector("button:last-child");
const unitPriceElement = document.querySelector(
  ".text-gray-900.tracking-tight"
);
const totalPriceElement = document.querySelector(
  ".text-gray-900.tracking-tight:last-child"
);

// استخراج قیمت واحد (۵,۰۰۰,۰۰۰)
const unitPrice = parseInt(
  unitPriceElement.textContent.replace(/,/g, "").split(" ")[0]
);

// متغیر مقدار فعلی
let currentValue = 3;

// تابع به‌روزرسانی قیمت کل
function updateTotal() {
  const total = currentValue * unitPrice;
  // به‌روزرسانی متن قیمت کل
  totalPriceElement.innerHTML =
    total.toLocaleString() + ' <span class="text-sm">تومان</span>';
}

// تابع به‌روزرسانی نمایش عدد
function updateCounter() {
  counterValue.textContent = currentValue;
  updateTotal();
}

// رویداد افزایش
incrementBtn.addEventListener("click", function (e) {
  e.preventDefault();
  currentValue++;
  updateCounter();
});

// رویداد کاهش
decrementBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (currentValue > 1) {
    currentValue--;
    updateCounter();
  }
});

// مقداردهی اولیه
updateCounter();
