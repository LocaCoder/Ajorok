// companyInfoForm.js - مدیریت فرم اطلاعات شرکت

(function () {
  const form = document.getElementById("companyForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");
  const companyTypeSelect = document.getElementById("companyType");

  const FIELDS = [
    { id: "companyName", validate: (v) => Validator.validateRequiredText(v) },
    {
      id: "companyNationalId",
      validate: (v) => Validator.validateCompanyNationalId(v),
    },
    {
      id: "registrationNumber",
      validate: (v) => Validator.validateRequiredText(v),
    },
    { id: "companyType", validate: (v) => Validator.validateRequiredText(v) },
    {
      id: "sheba",
      validate: (v) =>
        v.trim() === ""
          ? { valid: true, empty: true, value: "", message: "" }
          : Validator.validateSheba(v),
    },
    {
      id: "economicCode",
      validate: (v) => ({
        valid: true,
        empty: v.trim() === "",
        value: v.trim(),
        message: "",
      }),
    },
    { id: "repName", validate: (v) => Validator.validateRequiredText(v) },
    {
      id: "repNationalCode",
      validate: (v) => Validator.validateNationalCode(v),
    },
    { id: "repRole", validate: (v) => Validator.validateRequiredText(v) },
    { id: "mobile", validate: (v) => Validator.validateMobile(v) },
  ];

  function getRow(id) {
    return document.getElementById(id).closest(".field-group");
  }

  function getMsgEl(id) {
    return getRow(id).querySelector(".field-msg");
  }

  function getFieldEl(id) {
    return document.getElementById(id);
  }

  function setFieldState(id, state, message) {
    const fieldEl = getFieldEl(id);
    const msgEl = getMsgEl(id);
    fieldEl.classList.remove("border-custom-gray", "border-red-500");
    fieldEl.classList.add(
      state === "error" ? "border-red-500" : "border-custom-gray"
    );
    if (state === "error" && message) {
      msgEl.textContent = message;
      msgEl.classList.remove("hidden");
    } else {
      msgEl.textContent = "";
      msgEl.classList.add("hidden");
    }
  }

  function validateField(field) {
    const el = getFieldEl(field.id);
    const result = field.validate(el.value || "");
    setFieldState(field.id, result.valid ? "idle" : "error", result.message);
    return result;
  }

  FIELDS.forEach((field) => {
    const el = getFieldEl(field.id);
    const numericIds = [
      "companyNationalId",
      "registrationNumber",
      "economicCode",
      "repNationalCode",
      "mobile",
    ];

    el.addEventListener("input", () => {
      if (numericIds.includes(field.id)) {
        el.value = Validator.digitsOnly(el.value);
      }
      setFieldState(field.id, "idle", "");
    });

    if (el.tagName === "SELECT") {
      el.addEventListener("change", () => {
        el.classList.toggle("text-custom-black/40", el.value === "");
        el.classList.toggle("text-custom-black", el.value !== "");
        setFieldState(field.id, "idle", "");
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstInvalidEl = null;
    let allValid = true;

    FIELDS.forEach((field) => {
      const result = validateField(field);
      if (!result.valid) {
        allValid = false;
        if (!firstInvalidEl) firstInvalidEl = getFieldEl(field.id);
      }
    });

    if (!allValid) {
      firstInvalidEl && firstInvalidEl.focus();
      return;
    }

    confirmBtn.textContent = "در حال ارسال...";
    confirmBtn.disabled = true;
    setTimeout(() => {
      window.location.href = "store_registration_step_1.html";
    }, 700);
  });

  cancelBtn.addEventListener("click", () => {
    form.reset();
    FIELDS.forEach((field) => setFieldState(field.id, "idle", ""));
    companyTypeSelect.classList.add("text-custom-black/40");
    companyTypeSelect.classList.remove("text-custom-black");
  });
})();
