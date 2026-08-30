// accountType.js - مدیریت انتخاب نوع حساب فروشنده

(function () {
  const optionCards = document.querySelectorAll(".option-card");
  const confirmBtn = document.getElementById("confirm-btn");

  if (!optionCards.length || !confirmBtn) return;

  optionCards.forEach((card) => {
    card.addEventListener("click", function () {
      // حذف حالت انتخاب از همه کارت‌ها
      optionCards.forEach((c) => {
        c.classList.remove("border-custom-brown", "bg-[#F5EDEB]", "shadow-sm");
        c.classList.add("border-[#CCCCCC]", "bg-[#FCFCFC]");
      });

      // افزودن حالت انتخاب به کارت کلیک‌شده
      this.classList.remove("border-[#CCCCCC]", "bg-[#FCFCFC]");
      this.classList.add("border-custom-brown", "bg-[#F5EDEB]");

      // فعال کردن دکمه تأیید
      confirmBtn.disabled = false;
      confirmBtn.classList.remove(
        "bg-[#F5EDEB]",
        "cursor-not-allowed",
        "text-[#CCCCCC]"
      );
      confirmBtn.classList.add("bg-custom-brown", "text-white");

      // انتخاب رادیو باتن مربوطه
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // اگر کاربر روی رادیو باتن کلیک کند، کارت مربوطه فعال شود
  document.querySelectorAll('input[name="sellerType"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const card = this.closest(".option-card");
      if (card) {
        card.click();
      }
    });
  });
})();
