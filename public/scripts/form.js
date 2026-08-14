// form validation
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form"); // فرم اصلی
  const inputField = document.querySelector("input[type='text']");
  const errorMessage = document.querySelector("p.text-error");
  const submitButton = document.querySelector(".submit-btn");

  function validateInput(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^09\d{9}$/;

    if (!value) {
      return "لطفا این قسمت را خالی نگذارید.";
    } else if (!emailPattern.test(value) && !phonePattern.test(value)) {
      return "شماره یا ایمیل وارد شده صحیح نمی‌باشد.";
    }
    return "";
  }

  // ولیدیشن هنگام تایپ
  inputField?.addEventListener("input", function () {
    const error = validateInput(inputField.value.trim());

    if (error) {
      errorMessage.textContent = error;
      errorMessage.classList.add("active");
      submitButton.classList.add("submit-btn-invisable");
      inputField.classList.remove("border-green-500");
    } else {
      errorMessage.textContent = "";
      errorMessage.classList.remove("active");
      submitButton.classList.remove("submit-btn-invisable");
      inputField.classList.add("border-green-500");
    }
  });
  // ولیدیشن هنگام submit
  form?.addEventListener("submit", function (e) {
    const error = validateInput(inputField.value.trim());
    if (error) {
      e.preventDefault(); // جلوی ارسال فرم رو می‌گیره
      errorMessage.textContent = error;
      errorMessage.classList.add("active");
      submitButton.classList.add("submit-btn-invisable");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("otp-form");
  if (!form) return;

  const inputs = [...form.querySelectorAll("input[type=text]")];
  const submit = form.querySelector("button[type=submit]");

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputs.indexOf(e.target);
      if (index >= 0) {
        inputs[index].value = "";
        inputs[index].classList.remove("filled"); // حذف border ثابت
        if (index > 0) {
          inputs[index - 1].focus();
        }
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputs.indexOf(target);

    if (target.value) {
      target.classList.add("filled"); // اضافه کردن border ثابت
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        submit.focus();
      }
    } else {
      target.classList.remove("filled");
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${inputs.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    inputs.forEach((input, index) => {
      input.value = digits[index];
      input.classList.add("filled");
    });
    submit.focus();
  };

  inputs.forEach((input) => {
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeyDown);
    input.addEventListener("focus", handleFocus);
    input.addEventListener("paste", handlePaste);
  });
});

// OTP TIMER
document.addEventListener("DOMContentLoaded", function () {
  const timerElement = document.querySelector(".login-timer");
  const timerTextElement = document.querySelector(".login-timer_text");
  const resendButton = document.querySelector(".resend-code");

  if (timerElement && resendButton && timerTextElement) {
    let time = 180;
    let timerInterval;

    function updateTimer() {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      timerElement.textContent = `${padZero(minutes)}:${padZero(seconds)}`;

      if (time <= 0) {
        clearInterval(timerInterval);
        timerTextElement.classList.add("hidden");
        resendButton.classList.add("active");
        resendButton.removeAttribute("disabled");
        return;
      }

      time--;
    }

    function padZero(num) {
      return num < 10 ? "0" + num : num;
    }

    function startTimer() {
      clearInterval(timerInterval);
      time = 180;
      timerTextElement.classList.remove("hidden");
      timerTextElement.classList.add("flex");
      resendButton.classList.remove("active");
      resendButton.setAttribute("disabled", "true");
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }

    startTimer();

    resendButton.addEventListener("click", function () {
      if (resendButton.classList.contains("active")) {
        startTimer();
      }
    });
  }
});

