const modal = document.getElementById("modal");
const title = document.getElementById("modal-title");
const list = document.getElementById("list");
const search = document.getElementById("search");
const backBtn = document.getElementById("back-btn");
const locationText = document.getElementById("location-text");

let lastScrollTop = 0;
let step = "province";
let selectedProvince = null;
let isDown = false;
let startY;
let scrollTop;
// تابع برای نمایش collage عکس‌ها (برای چپ)
function previewMultipleImages(input, previewId, initialId) {
  const preview = document.getElementById(previewId);
  const initial = document.getElementById(initialId);
  preview.innerHTML = ""; // پاک کردن قبلی‌ها
  preview.classList.remove("hidden");
  initial.classList.add("hidden");

  const files = input.files;
  const maxImages = 4; // حداکثر 4 عکس مثل تصویر نمونه
  for (let i = 0; i < Math.min(files.length, maxImages); i++) {
    const file = files[i];
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "w-14 h-14 rounded";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }
  // اگر بیشتر از 4 باشه، می‌تونی یک نشانگر اضافه کنی، اما برای سادگی فقط 4 تا نشون می‌دم
}

// تابع برای نمایش تک عکس (برای راست)
function previewSingleImage(input, previewId, initialId) {
  const preview = document.getElementById(previewId);
  const initial = document.getElementById(initialId);
  if (input.files.length > 0) {
    const file = input.files[0];
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.getElementById("rightImg"); // مستقیم به img موجود
        img.src = e.target.result;
        preview.classList.remove("hidden");
        initial.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    }
  }
}

// رویداد برای فیلد چپی (چندگانه)
document.getElementById("leftBox").addEventListener("click", function () {
  document.getElementById("leftInput").click();
});

document.getElementById("leftInput").addEventListener("change", function () {
  previewMultipleImages(this, "leftPreview", "leftInitial");
});

// رویداد برای فیلد راستی (تک)
document.getElementById("rightBox").addEventListener("click", function () {
  document.getElementById("rightInput").click();
});

document.getElementById("rightInput").addEventListener("change", function () {
  previewSingleImage(this, "rightPreview", "rightInitial");
});
// / Utility Functions
const toggleClass = (element, className, condition) => {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};


// shopform validate
document.getElementById("shop-form").addEventListener("submit", function (e) {
  e.preventDefault(); // جلوگیری از ارسال پیش‌فرض

  let isValid = true;

  this.querySelectorAll("input[required], textarea[required]").forEach(
    (input) => {
      const errorMsg = input.parentElement.querySelector(".error-msg");
      if (!input.value.trim()) {
        input.classList.add("error");
        errorMsg.classList.remove("hidden");
        isValid = false;
      } else {
        input.classList.remove("error");
        errorMsg.classList.add("hidden");
      }
    }
  );

  if (isValid) {
    this.submit(); // اگه همه درست بود فرم ارسال بشه
  }
});
// shop form page

// باز کردن modal
document
  .getElementById("openModalSocial")
  .addEventListener("click", function () {
    document.getElementById("socialModal").classList.remove("hidden");
  });

// بستن modal
document
  .getElementById("closeModalSocial")
  .addEventListener("click", function () {
    document.getElementById("socialModal").classList.add("hidden");
  });

// بستن با کلیک روی backdrop
document.getElementById("socialModal").addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.add("hidden");
  }
});

// تابع اضافه کردن فیلد به فرم
function addSocialField(social) {
  const fieldsContainer = document.getElementById("socialFields");
  const fieldDiv = document.createElement("div");
  fieldDiv.className = "mb-4 p-3 border rounded bg-gray-50";

  let labelText, placeholder;
  switch (social) {
    case "instagram":
      labelText = "شناسه اینستاگرام";
      placeholder = "@username";
      break;
    case "facebook":
      labelText = "شناسه فیسبوک";
      placeholder = "facebook.com/username";
      break;
    case "linkedin":
      labelText = "شناسه لینکدین";
      placeholder = "linkedin.com/in/username";
      break;
    case "whatsapp":
      labelText = "شماره واتساپ";
      placeholder = "+98xxxxxxxxxx";
      break;
    default:
      return;
  }

  fieldDiv.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-1">${labelText}</label>
        <input type="text" placeholder="${placeholder}" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button onclick="this.parentElement.remove()" class="mt-2 text-red-500 text-sm hover:text-red-700">حذف</button>
    `;

  fieldsContainer.appendChild(fieldDiv);
  document.getElementById("socialModal").classList.add("hidden"); // بستن modal
}

// برای + : می‌تونی اینجا گزینه‌های بیشتری اضافه کنی، مثلاً prompt برای انتخاب
document.getElementById("addMoreSocial").addEventListener("click", function () {
  const newSocial = prompt("نام شبکه اجتماعی جدید را وارد کنید (مثل: توییتر)");
  if (newSocial) {
    addSocialField(newSocial.toLowerCase());
  }
});
