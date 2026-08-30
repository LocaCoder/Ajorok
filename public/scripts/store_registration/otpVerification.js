// otpVerification.js - مدیریت تأیید کد تایید

(function () {
  const boxes = Array.from(document.querySelectorAll(".otp-box"));
  const otpMsg = document.getElementById("otpMsg");
  const verifyBtn = document.getElementById("verifyBtn");
  const resendTimer = document.getElementById("resendTimer");
  const resendLink = document.getElementById("resendLink");
  const mobileShown = document.getElementById("mobileShown");
  const params = new URLSearchParams(window.location.search);
  const mobileFromQuery = params.get("mobile");
  const DEMO_CORRECT_CODE = "1234";

  if (mobileFromQuery) {
    mobileShown.textContent = Validator.toPersianDigits(mobileFromQuery);
  }

  const BORDER_IDLE = "border-custom-gray";
  const BORDER_TYPING = "border-red-500";
  const BORDER_SUCCESS = "border-green-500";
  const TEXT_SUCCESS = "text-green-600";
  const BORDER_ERROR = "border-red-500";

  function clearStates() {
    boxes.forEach((b) => {
      b.classList.remove(
        BORDER_TYPING,
        BORDER_SUCCESS,
        TEXT_SUCCESS,
        BORDER_ERROR
      );
      b.classList.add(BORDER_IDLE);
    });
  }

  function getDigits() {
    return boxes.map((b) => Validator.digitsOnly(b.value));
  }

  function setVerifyBtnState(active) {
    if (active) {
      verifyBtn.disabled = false;
      verifyBtn.classList.remove(
        "bg-custom-brown/10",
        "text-custom-brown/40",
        "cursor-not-allowed"
      );
      verifyBtn.classList.add(
        "bg-custom-brown",
        "text-white",
        "cursor-pointer",
        "hover:bg-custom-brown/90"
      );
    } else {
      verifyBtn.disabled = true;
      verifyBtn.classList.add(
        "bg-custom-brown/10",
        "text-custom-brown/40",
        "cursor-not-allowed"
      );
      verifyBtn.classList.remove(
        "bg-custom-brown",
        "text-white",
        "cursor-pointer",
        "hover:bg-custom-brown/90"
      );
    }
  }

  function evaluate() {
    const digits = getDigits();
    const result = Validator.validateOtp(digits, boxes.length);
    clearStates();
    otpMsg.textContent = "";
    setVerifyBtnState(false);

    if (!result.complete) {
      boxes.forEach((b) => {
        if (b.value) {
          b.classList.remove(BORDER_IDLE);
          b.classList.add(BORDER_TYPING);
        }
      });
      return result;
    }

    if (result.value === DEMO_CORRECT_CODE) {
      boxes.forEach((b) => {
        b.classList.remove(BORDER_IDLE);
        b.classList.add(BORDER_SUCCESS, TEXT_SUCCESS);
      });
      setVerifyBtnState(true);
    } else {
      boxes.forEach((b) => {
        b.classList.remove(BORDER_IDLE);
        b.classList.add(BORDER_ERROR);
      });
      otpMsg.textContent = "کد وارد شده صحیح نمی‌باشد.";
    }
    return result;
  }

  boxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      box.value = Validator.digitsOnly(box.value).slice(0, 1);
      if (box.value && i < boxes.length - 1) {
        boxes[i + 1].focus();
      }
      evaluate();
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && i > 0) {
        boxes[i - 1].focus();
      }
    });

    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasted = Validator.digitsOnly(
        (e.clipboardData || window.clipboardData).getData("text")
      ).slice(0, boxes.length);
      pasted.split("").forEach((d, idx) => {
        if (boxes[idx]) boxes[idx].value = d;
      });
      const next = Math.min(pasted.length, boxes.length - 1);
      boxes[next].focus();
      evaluate();
    });
  });

  verifyBtn.addEventListener("click", () => {
    const result = evaluate();
    if (!result.complete || result.value !== DEMO_CORRECT_CODE) return;
    verifyBtn.textContent = "در حال بررسی...";
    verifyBtn.disabled = true;
    setTimeout(() => {
      window.location.href = "StoreRegistration_AccountType_Default.html";
    }, 500);
  });

  function startResendTimer() {
    resendLink.classList.add(
      "pointer-events-none",
      "cursor-default",
      "text-custom-black/40"
    );
    resendLink.classList.remove("text-custom-brown", "cursor-pointer");
    resendTimer.classList.remove("hidden");
    const countdown = new Validator.Countdown(
      148,
      (text) => {
        resendTimer.textContent = text;
      },
      () => {
        resendTimer.classList.add("hidden");
        resendLink.classList.remove(
          "pointer-events-none",
          "cursor-default",
          "text-custom-black/40"
        );
        resendLink.classList.add("text-custom-brown", "cursor-pointer");
      }
    );
    countdown.start();
    return countdown;
  }

  let activeCountdown = startResendTimer();

  resendLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (resendLink.classList.contains("pointer-events-none")) return;
    boxes.forEach((b) => {
      b.value = "";
    });
    clearStates();
    otpMsg.textContent = "";
    setVerifyBtnState(false);
    boxes[0].focus();
    activeCountdown.stop();
    activeCountdown = startResendTimer();
  });

  boxes[0].focus();
})();
