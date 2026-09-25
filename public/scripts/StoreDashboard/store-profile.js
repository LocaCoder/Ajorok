// ============================================================
// store-profile.js - اطلاعات فروشگاه (ویرایش)
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) {
      console.error("[Profile] StoreUI یافت نشد");
      return;
    }

    const { $, $$, showToast } = UI;

    let editing = false;
    const controls = $$(".form-control");
    const initialValues = new Map(controls.map((el) => [el, el.value]));

    const editBtn = $("#editBtn");
    const cancelBtn = $("#cancelBtn");

    function setEditMode(on) {
      editing = on;

      controls.forEach((el) => {
        el.readOnly = !on;
        el.classList.toggle("bg-[#fafafa]", !on);
        el.classList.toggle("bg-white", on);
        el.classList.toggle("border-[#999]", !on);
        el.classList.toggle("border-[#aa4938]", on);
      });

      if (editBtn) {
        editBtn.textContent = on ? "ذخیره تغییرات" : "ویرایش اطلاعات";
      }

      if (cancelBtn) {
        cancelBtn.classList.toggle("hidden", !on);
      }

      if (on) {
        const firstEditable = controls.find((el) => !el.readOnly);
        firstEditable?.focus();
      }
    }

    editBtn?.addEventListener("click", () => {
      if (!editing) {
        setEditMode(true);
        showToast("حالا می‌توانید اطلاعات را ویرایش کنید.", "info");
        return;
      }

      // ذخیره
      controls.forEach((el) => initialValues.set(el, el.value));
      setEditMode(false);
      showToast("اطلاعات فروشگاه ذخیره شد.", "success");
    });

    cancelBtn?.addEventListener("click", () => {
      controls.forEach((el) => (el.value = initialValues.get(el)));
      setEditMode(false);
      showToast("تغییرات لغو شد.", "warning");
    });

    // دکمه‌های بازگشت
    document.querySelectorAll("[data-store-back]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = "StoreDashboard.html";
      });
    });

    // StoreUI
    UI.init();
  }
})();