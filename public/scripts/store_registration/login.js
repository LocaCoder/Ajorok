// login.js - مدیریت فرم ورود

(function () {
  const input = document.getElementById("mobile");
  const wrap = document.getElementById("fieldWrap");
  const msg = document.getElementById("mobile-error");
  const clearBtn = document.getElementById("clearBtn");
  const submitBtn = document.getElementById("submitBtn");

  const BORDER_IDLE = "border-custom-gray";
  const BORDER_SUCCESS = "border-green-500";
  const BORDER_ERROR = "border-red-500";

  function setState(state) {
    input.classList.remove(BORDER_IDLE, BORDER_SUCCESS, BORDER_ERROR);
    if (state === "success") input.classList.add(BORDER_SUCCESS);
    else if (state === "error") input.classList.add(BORDER_ERROR);
    else input.classList.add(BORDER_IDLE);
  }

  function refreshClear() {
    const hasValue = input.value.trim().length > 0;
    clearBtn.classList.toggle("hidden", !hasValue);
    clearBtn.classList.toggle("flex", hasValue);
  }

  function evaluate({ showErrors }) {
    const result = Validator.validateMobile(input.value);
    if (result.valid) {
      setState("success");
      msg.textContent = "";
      submitBtn.disabled = false;
      submitBtn.classList.remove(
        "bg-custom-brown/10",
        "text-custom-brown/40",
        "cursor-not-allowed"
      );
      submitBtn.classList.add(
        "bg-custom-brown",
        "text-white",
        "cursor-pointer",
        "hover:bg-custom-brown/90"
      );
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add(
        "bg-custom-brown/10",
        "text-custom-brown/40",
        "cursor-not-allowed"
      );
      submitBtn.classList.remove(
        "bg-custom-brown",
        "text-white",
        "cursor-pointer",
        "hover:bg-custom-brown/90"
      );
      if (showErrors) {
        setState("error");
        msg.textContent = result.message;
      } else {
        setState("idle");
        msg.textContent = "";
      }
    }
    return result;
  }

  input.addEventListener("input", () => {
    const digits = Validator.digitsOnly(input.value).slice(0, 11);
    input.value = digits;
    refreshClear();
    evaluate({ showErrors: false });
  });

  input.addEventListener("blur", () => {
    evaluate({ showErrors: true });
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    refreshClear();
    evaluate({ showErrors: false });
    input.focus();
  });

  submitBtn.addEventListener("click", () => {
    const result = evaluate({ showErrors: true });
    if (!result.valid) return;
    submitBtn.textContent = "در حال ارسال...";
    submitBtn.disabled = true;
    setTimeout(() => {
      window.location.href = `verify.html?mobile=${result.value}`;
    }, 600);
  });
})();
