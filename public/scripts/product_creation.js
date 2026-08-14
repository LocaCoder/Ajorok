// ========== استفاده ==========
const branches = [
  { name: "شاخه 1" },
  { name: "شاخه 2" },
  { name: "شاخه 3" },
  { name: "شاخه 4" },
];
// ========== استفاده ==========
const categories = [
  { name: "دسته 1" },
  { name: "دسته 2" },
  { name: "دسته 3" },
  { name: "دسته 4" },
];

const subcategories = [
  { name: "زیرمجموعه 1" },
  { name: "زیرمجموعه 2" },
  { name: "زیرمجموعه 3" },
  { name: "زیرمجموعه 4" },
];

const fileInput = document.getElementById("rightInput");
const rightBox = document.getElementById("rightBox");
const rightInitial = document.getElementById("rightInitial");
const rightPreview = document.getElementById("rightPreview");

function handleImageUpload(inputEl, previewEl, initialEl, boxEl) {
  if (!inputEl || !previewEl || !boxEl) return;

  const files = Array.from(inputEl.files || []);
  previewEl.innerHTML = "";

  const maxShow = 3;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  // مخفی/نمایش حالت اولیه
  if (files.length > 0) {
    if (isMobile) {
      initialEl && initialEl.classList.add("hidden");
    } else {
      initialEl && initialEl.classList.remove("hidden");
    }
  } else {
    initialEl && initialEl.classList.remove("hidden");
    return;
  }

  previewEl.classList.remove("hidden");

  // تنظیم مکان و استایل preview در موبایل و دسکتاپ
  if (isMobile) {
    // موبایل: preview داخل باکس
    if (!boxEl.contains(previewEl)) {
      boxEl.appendChild(previewEl);
    }
    previewEl.className = "grid grid-cols-2 gap-2 w-full h-full p-2";
  } else {
    // دسکتاپ: preview بیرون باکس
    if (boxEl.contains(previewEl)) {
      boxEl.parentElement.appendChild(previewEl);
    }
    previewEl.className = "flex items-center gap-2 flex-wrap";
  }

  // نمایش حداکثر ۴ عکس
  const imagesToShow = files.slice(0, maxShow);

  imagesToShow.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");

      if (isMobile) {
        img.className = "w-full h-full rounded-md object-cover";
      } else {
        img.className =
          "w-[105px] h-[105px] sm:w-[115px] sm:h-[115px] md:w-[135px] md:h-[135px] rounded-lg object-cover border border-gray-200";
      }

      img.src = e.target.result;
      previewEl.appendChild(img);
    };
    reader.readAsDataURL(file);
  });

  // اگر بیشتر از ۴ عکس بود، سه نقطه اضافه کن
  if (files.length > maxShow) {
    const dots = document.createElement("div");

    if (isMobile) {
      dots.className =
        "w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-2xl font-bold text-gray-500";
    } else {
      dots.className =
        "w-[105px] h-[105px] sm:w-[115px] sm:h-[115px] md:w-[135px] md:h-[135px] border-custom-brown border rounded-lg flex items-center justify-center text-2xl text-custom-brown cursor-pointer";
    }

    dots.textContent = "...";
    previewEl.appendChild(dots);
  }
}

if (fileInput) {
  fileInput.addEventListener("change", function () {
    handleImageUpload(fileInput, rightPreview, rightInitial, rightBox);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submit-form-btn");
  const acceptModal = document.getElementById("accept-modal");

  // تابع بررسی عدد بودن
  function isNumber(value) {
    return /^[0-9]+$/.test(value);
  }

  // تابع بررسی فرم
  function isFormValid() {
    // 1. فیلد دسته
    const categorySpan = document.querySelector(".category-field span");
    const categoryValue = categorySpan ? categorySpan.innerText : "";
    if (
      categoryValue === "نام محصول را وارد کنید تا دسته مناسب پیشنهاد شود" ||
      !categoryValue
    )
      return false;

    // 2. فیلد شاخه
    const branchSpan = document.querySelector(".branch-field span");
    const branchValue = branchSpan ? branchSpan.innerText : "";
    if (branchValue === "یکی از شاخه‌ها را انتخاب کنید" || !branchValue)
      return false;

    // 3. فیلد زیرمجموعه
    const subcategorySpan = document.querySelector(".subcategory-field span");
    const subcategoryValue = subcategorySpan ? subcategorySpan.innerText : "";
    if (
      subcategoryValue === "یکی از زیرمجموعه‌ها را انتخاب کنید" ||
      !subcategoryValue
    )
      return false;

    // 4. فیلد واحد
    const unitSpan = document.querySelector(".unit-field span");
    const unitValue = unitSpan ? unitSpan.innerText : "";
    if (unitValue === "واحد قیمت را انتخاب کنید" || !unitValue) return false;

    // 5. موجودی (عدد)
    const inventoryInput = document.querySelector(
      "input[placeholder='تعداد موجودی براساس واحد را وارد نمایید.']"
    );
    if (!inventoryInput.value.trim()) return false;
    if (!isNumber(inventoryInput.value.trim())) return false;

    // 6. حداقل سفارش (عدد)
    const minOrderInput = document.querySelector(
      "input[placeholder='حداقل سفارش را وارد کنید']"
    );
    if (!minOrderInput.value.trim()) return false;
    if (!isNumber(minOrderInput.value.trim())) return false;

    // 7. حداکثر سفارش (عدد)
    const maxOrderInput = document.querySelector(
      "input[placeholder='حداکثر سفارش را وارد کنید']"
    );
    if (!maxOrderInput.value.trim()) return false;
    if (!isNumber(maxOrderInput.value.trim())) return false;

    // 8. قیمت (عدد)
    const priceInput = document.querySelector(
      "input[placeholder*='قیمت مورد نظر']"
    );
    if (!priceInput.value.trim()) return false;
    if (!isNumber(priceInput.value.trim())) return false;

    // 9. عنوان آگهی
    const titleInput = document.querySelector(
      "input[placeholder='عنوان آگهی را وارد نمایید.']"
    );
    if (!titleInput.value.trim()) return false;

    // 10. آدرس پستی
    const addressTextarea = document.getElementById("address");
    if (!addressTextarea.value.trim()) return false;

    return true;
  }

  // تابع نمایش خطاها
  function showAllErrors() {
    let hasError = false;

    // 1. دسته
    const categorySpan = document.querySelector(".category-field span");
    const categoryValue = categorySpan ? categorySpan.innerText : "";
    if (
      categoryValue === "نام محصول را وارد کنید تا دسته مناسب پیشنهاد شود" ||
      !categoryValue
    ) {
      showFieldError(
        document.querySelector(".category-field"),
        "لطفاً دسته را انتخاب کنید"
      );
      hasError = true;
    } else {
      hideFieldError(document.querySelector(".category-field"));
    }

    // 2. شاخه
    const branchSpan = document.querySelector(".branch-field span");
    const branchValue = branchSpan ? branchSpan.innerText : "";
    if (branchValue === "یکی از شاخه‌ها را انتخاب کنید" || !branchValue) {
      showFieldError(
        document.querySelector(".branch-field"),
        "لطفاً شاخه را انتخاب کنید"
      );
      hasError = true;
    } else {
      hideFieldError(document.querySelector(".branch-field"));
    }

    // 3. زیرمجموعه
    const subcategorySpan = document.querySelector(".subcategory-field span");
    const subcategoryValue = subcategorySpan ? subcategorySpan.innerText : "";
    if (
      subcategoryValue === "یکی از زیرمجموعه‌ها را انتخاب کنید" ||
      !subcategoryValue
    ) {
      showFieldError(
        document.querySelector(".subcategory-field"),
        "لطفاً زیرمجموعه را انتخاب کنید"
      );
      hasError = true;
    } else {
      hideFieldError(document.querySelector(".subcategory-field"));
    }

    // 4. واحد
    const unitSpan = document.querySelector(".unit-field span");
    const unitValue = unitSpan ? unitSpan.innerText : "";
    if (unitValue === "واحد قیمت را انتخاب کنید" || !unitValue) {
      showFieldError(
        document.querySelector(".unit-field"),
        "لطفاً واحد را انتخاب کنید"
      );
      hasError = true;
    } else {
      hideFieldError(document.querySelector(".unit-field"));
    }

    // 5. موجودی
    const inventoryInput = document.querySelector(
      "input[placeholder='تعداد موجودی براساس واحد را وارد نمایید.']"
    );
    if (!inventoryInput.value.trim()) {
      showFieldError(inventoryInput, "لطفاً موجودی را وارد کنید");
      hasError = true;
    } else if (!isNumber(inventoryInput.value.trim())) {
      showFieldError(inventoryInput, "موجودی باید عدد باشد");
      hasError = true;
    } else {
      hideFieldError(inventoryInput);
    }

    // 6. حداقل سفارش
    const minOrderInput = document.querySelector(
      "input[placeholder='حداقل سفارش را وارد کنید']"
    );
    if (!minOrderInput.value.trim()) {
      showFieldError(minOrderInput, "لطفاً حداقل سفارش را وارد کنید");
      hasError = true;
    } else if (!isNumber(minOrderInput.value.trim())) {
      showFieldError(minOrderInput, "حداقل سفارش باید عدد باشد");
      hasError = true;
    } else {
      hideFieldError(minOrderInput);
    }

    // 7. حداکثر سفارش
    const maxOrderInput = document.querySelector(
      "input[placeholder='حداکثر سفارش را وارد کنید']"
    );
    if (!maxOrderInput.value.trim()) {
      showFieldError(maxOrderInput, "لطفاً حداکثر سفارش را وارد کنید");
      hasError = true;
    } else if (!isNumber(maxOrderInput.value.trim())) {
      showFieldError(maxOrderInput, "حداکثر سفارش باید عدد باشد");
      hasError = true;
    } else {
      hideFieldError(maxOrderInput);
    }

    // 8. قیمت
    const priceInput = document.querySelector(
      "input[placeholder*='قیمت مورد نظر']"
    );
    if (!priceInput.value.trim()) {
      showFieldError(priceInput, "لطفاً قیمت را وارد کنید");
      hasError = true;
    } else if (!isNumber(priceInput.value.trim())) {
      showFieldError(priceInput, "قیمت باید عدد باشد");
      hasError = true;
    } else {
      hideFieldError(priceInput);
    }

    // 9. عنوان آگهی
    const titleInput = document.querySelector(
      "input[placeholder='عنوان آگهی را وارد نمایید.']"
    );
    if (!titleInput.value.trim()) {
      showFieldError(titleInput, "لطفاً عنوان آگهی را وارد کنید");
      hasError = true;
    } else {
      hideFieldError(titleInput);
    }

    // 10. آدرس پستی
    const addressTextarea = document.getElementById("address");
    if (!addressTextarea.value.trim()) {
      showFieldError(addressTextarea, "لطفاً آدرس پستی را وارد کنید");
      hasError = true;
    } else {
      hideFieldError(addressTextarea);
    }

    return hasError;
  }

  function showFieldError(element, message) {
    element.classList.add("border-red-500");
    let errorSpan = element.parentElement.querySelector(".error-msg");
    if (errorSpan) {
      errorSpan.classList.remove("hidden");
      errorSpan.textContent = message;
    }
  }

  function hideFieldError(element) {
    element.classList.remove("border-red-500");
    let errorSpan = element.parentElement.querySelector(".error-msg");
    if (errorSpan) {
      errorSpan.classList.add("hidden");
    }
  }

  function scrollToFirstError() {
    const firstError = document.querySelector(".border-red-500");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function showAcceptModal() {
    acceptModal.classList.remove("hidden");
    acceptModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeAcceptModal() {
    acceptModal.classList.add("hidden");
    acceptModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function updateButtonColor() {
    if (isFormValid()) {
      submitBtn.classList.remove("bg-[#F5EDEB]", "text-[#CCCCCC]");
      submitBtn.classList.add("bg-custom-brown", "text-white");
    } else {
      submitBtn.classList.remove("bg-custom-brown", "text-white");
      submitBtn.classList.add("bg-[#F5EDEB]", "text-[#CCCCCC]");
    }
  }

  submitBtn.onclick = function (e) {
    e.preventDefault();

    if (showAllErrors()) {
      scrollToFirstError();
    } else {
      showAcceptModal();
    }
  };

  acceptModal.onclick = function (e) {
    if (e.target === acceptModal) {
      closeAcceptModal();
    }
  };

  document
    .querySelector("#accept-modal a.border-custom-brown")
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      closeAcceptModal();
    });

  // رویدادها برای تغییر رنگ دکمه
  const allInputs = document.querySelectorAll(
    "input, textarea, .category-field, .branch-field, .subcategory-field, .unit-field"
  );
  allInputs.forEach((input) => {
    if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
      input.addEventListener("input", updateButtonColor);
    } else {
      const observer = new MutationObserver(updateButtonColor);
      observer.observe(input.querySelector("span"), {
        childList: true,
        characterData: true,
      });
    }
  });

  updateButtonColor();
});

function initBranchModal(branchesData) {
  // Elements
  const branchField = document.querySelector(".branch-field");
  const branchSpan = document.querySelector(".branch-field span");
  const branchModal = document.getElementById("branch-modal");
  const branchBox = document.getElementById("branch-box");
  const branchSearch = document.getElementById("branch-search");
  const branchList = document.getElementById("branch-list");
  const closeBtn = document.getElementById("branch-close-btn");

  // Elements customModel
  const customModal = document.getElementById("custom-modal");
  const customBranchBox = document.getElementById("custom-branch-box");
  const customBranchInput = document.getElementById("custom-branch-input");
  const saveCustomBranchBtn = document.querySelector(
    "#custom-modal #confirm-btn"
  );
  const backToListBtn = document.querySelector(
    "#custom-modal #back-to-list-btn"
  );
  const closeCustomBranchBtn = document.getElementById(
    "custom-branch-close-btn"
  );

  let selectedBranch = null;
  const staticItem = { name: "دیگر (شاخه شما در لیست نیست)", isStatic: true };

  function openModal() {
    branchModal.classList.add("show");
    document.body.style.overflow = "hidden";
    renderBranches();
  }

  function closeModal() {
    branchModal.classList.remove("show");
    document.body.style.overflow = "";
    branchSearch.value = "";
  }

  function openCustomModal() {
    customModal.classList.add("show");
    customBranchInput.value = "";
    document.body.style.overflow = "hidden";
    if (saveCustomBranchBtn) {
      saveCustomBranchBtn.disabled = true;
      saveCustomBranchBtn.classList.remove("bg-custom-brown", "text-white");
      saveCustomBranchBtn.classList.add("bg-[#F5EDEB]", "text-gray-400");
    }
  }

  function closeCustomModal() {
    customModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function renderBranches(filter = "") {
    branchList.innerHTML = "";
    const keyword = filter.trim().toLowerCase();

    let normalBranches = branchesData.filter(
      (branch) =>
        !branch.isStatic && branch.name.toLowerCase().includes(keyword)
    );

    let showStatic = staticItem.name.toLowerCase().includes(keyword);

    if (normalBranches.length === 0 && !showStatic) {
      branchList.innerHTML =
        '<div class="px-3 py-4 text-center text-gray-400">شاخه‌ای یافت نشد</div>';
      return;
    }

    normalBranches.forEach((branch) => {
      const item = createBranchItem(branch.name, () => {
        selectedBranch = branch;
        branchSpan.textContent = branch.name;
        branchSpan.classList.remove("text-gray-400");
        branchSpan.classList.add("text-gray-800");
        closeModal();
      });
      branchList.appendChild(item);
    });

    if (showStatic) {
      const separator = document.createElement("div");
      separator.className = "border-t border-gray-200 my-2";
      branchList.appendChild(separator);

      const staticItemElement = createBranchItem(staticItem.name, () => {
        closeModal();
        openCustomModal();
      });
      branchList.appendChild(staticItemElement);
    }
  }

  function createBranchItem(name, onClick) {
    const item = document.createElement("div");
    item.className =
      "px-3 py-4 hover:bg-gray-100 cursor-pointer rounded-2xl flex justify-between items-center border-b border-gray-100";
    item.innerHTML = `
      <span class="text-gray-700">${name}</span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    `;
    item.onclick = onClick;
    return item;
  }

  function saveCustomBranch() {
    const customName = customBranchInput.value.trim();
    if (customName === "") return;

    const newBranch = { name: customName };
    branchesData.push(newBranch);
    selectedBranch = newBranch;
    branchSpan.textContent = customName;
    branchSpan.classList.remove("text-gray-400");
    branchSpan.classList.add("text-gray-800");

    closeCustomModal();
  }

  if (customBranchInput) {
    customBranchInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (saveCustomBranchBtn) {
        if (value === "") {
          saveCustomBranchBtn.disabled = true;
          saveCustomBranchBtn.classList.remove("bg-custom-brown", "text-white");
          saveCustomBranchBtn.classList.add("bg-[#F5EDEB]", "text-gray-400");
        } else {
          saveCustomBranchBtn.disabled = false;
          saveCustomBranchBtn.classList.remove("bg-[#F5EDEB]", "text-gray-400");
          saveCustomBranchBtn.classList.add("bg-custom-brown", "text-white");
        }
      }
    });
  }

  function backToBranchList() {
    closeCustomModal();
    openModal();
  }

  if (branchSearch)
    branchSearch.oninput = (e) => renderBranches(e.target.value);
  if (branchField) branchField.onclick = openModal;
  if (closeBtn) closeBtn.onclick = closeModal;
  if (closeCustomBranchBtn) closeCustomBranchBtn.onclick = closeCustomModal;
  if (backToListBtn) backToListBtn.onclick = backToBranchList;
  if (saveCustomBranchBtn) saveCustomBranchBtn.onclick = saveCustomBranch;

  if (branchModal) {
    branchModal.onclick = (e) => {
      if (e.target === branchModal) closeModal();
    };
  }

  if (customModal) {
    customModal.onclick = (e) => {
      if (e.target === customModal) closeCustomModal();
    };
  }

  if (branchBox) branchBox.onclick = (e) => e.stopPropagation();
  if (customBranchBox) customBranchBox.onclick = (e) => e.stopPropagation();
}

function initSubcategoryModal(subcategoryData) {
  // Elements
  const subcategoryField = document.querySelector(".subcategory-field");
  const subcategorySpan = document.querySelector(".subcategory-field span");
  const subcategoryModal = document.getElementById("subcategory-modal");
  const subcategoryBox = document.getElementById("subcategory-box");
  const subcategorySearch = document.getElementById("subcategory-search");
  const subcategoryList = document.getElementById("subcategory-list");
  const closeBtn = document.getElementById("subcategory-close-btn");

  // Elements customModel
  const customSubcategoryModal = document.getElementById(
    "custom-subcategory-modal"
  );
  const customSubcategoryBox = document.getElementById(
    "custom-subcategory-box"
  );
  const customSubcategoryInput = document.getElementById(
    "custom-subcategory-input"
  );
  const saveCustomSubcategoryBtn = document.querySelector(
    "#custom-subcategory-modal #confirm-btn"
  );
  const backToListBtn = document.querySelector(
    "#custom-subcategory-modal #back-to-list-btn"
  );
  const closeCustomSubcategoryBtn = document.getElementById(
    "custom-subcategory-close-btn"
  );

  let selectedSubcategory = null;
  const staticItem = {
    name: "دیگر (زیرمجموعه شما در لیست نیست)",
    isStatic: true,
  };

  function openModal() {
    subcategoryModal.classList.add("show");
    document.body.style.overflow = "hidden";
    renderSubcategories();
  }

  function closeModal() {
    subcategoryModal.classList.remove("show");
    document.body.style.overflow = "";
    if (subcategorySearch) subcategorySearch.value = "";
  }

  function openCustomModal() {
    customSubcategoryModal.classList.add("show");
    if (customSubcategoryInput) customSubcategoryInput.value = "";
    document.body.style.overflow = "hidden";
    if (saveCustomSubcategoryBtn) {
      saveCustomSubcategoryBtn.disabled = true;
      saveCustomSubcategoryBtn.classList.remove(
        "bg-custom-brown",
        "text-white"
      );
      saveCustomSubcategoryBtn.classList.add("bg-[#F5EDEB]", "text-gray-400");
    }
  }

  function closeCustomModal() {
    customSubcategoryModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function renderSubcategories(filter = "") {
    if (!subcategoryList) return;
    subcategoryList.innerHTML = "";
    const keyword = filter.trim().toLowerCase();

    let normalSubcategories = subcategoryData.filter(
      (sub) => !sub.isStatic && sub.name.toLowerCase().includes(keyword)
    );

    let showStatic = staticItem.name.toLowerCase().includes(keyword);

    if (normalSubcategories.length === 0 && !showStatic) {
      subcategoryList.innerHTML =
        '<div class="px-3 py-4 text-center text-gray-400">زیرمجموعه‌ای یافت نشد</div>';
      return;
    }

    normalSubcategories.forEach((sub) => {
      const item = createSubcategoryItem(sub.name, () => {
        selectedSubcategory = sub;
        subcategorySpan.textContent = sub.name;
        subcategorySpan.classList.remove("text-gray-400");
        subcategorySpan.classList.add("text-gray-800");
        closeModal();
      });
      subcategoryList.appendChild(item);
    });

    if (showStatic) {
      const separator = document.createElement("div");
      separator.className = "border-t border-gray-200 my-2";
      subcategoryList.appendChild(separator);

      const staticItemElement = createSubcategoryItem(staticItem.name, () => {
        closeModal();
        openCustomModal();
      });
      subcategoryList.appendChild(staticItemElement);
    }
  }

  function createSubcategoryItem(name, onClick) {
    const item = document.createElement("div");
    item.className =
      "px-3 py-4 hover:bg-gray-100 cursor-pointer rounded-2xl flex justify-between items-center border-b border-gray-100";
    item.innerHTML = `
      <span class="text-gray-700">${name}</span>
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    `;
    item.onclick = onClick;
    return item;
  }

  function saveCustomSubcategory() {
    const customName = customSubcategoryInput.value.trim();
    if (customName === "") return;

    const newSubcategory = { name: customName };
    subcategoryData.push(newSubcategory);
    selectedSubcategory = newSubcategory;
    subcategorySpan.textContent = customName;
    subcategorySpan.classList.remove("text-gray-400");
    subcategorySpan.classList.add("text-gray-800");

    closeCustomModal();
  }

  if (customSubcategoryInput) {
    customSubcategoryInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (saveCustomSubcategoryBtn) {
        if (value === "") {
          saveCustomSubcategoryBtn.disabled = true;
          saveCustomSubcategoryBtn.classList.remove(
            "bg-custom-brown",
            "text-white"
          );
          saveCustomSubcategoryBtn.classList.add(
            "bg-[#F5EDEB]",
            "text-gray-400"
          );
        } else {
          saveCustomSubcategoryBtn.disabled = false;
          saveCustomSubcategoryBtn.classList.remove(
            "bg-[#F5EDEB]",
            "text-gray-400"
          );
          saveCustomSubcategoryBtn.classList.add(
            "bg-custom-brown",
            "text-white"
          );
        }
      }
    });
  }

  function backToSubcategoryList() {
    closeCustomModal();
    openModal();
  }

  if (subcategorySearch)
    subcategorySearch.oninput = (e) => renderSubcategories(e.target.value);
  if (subcategoryField) subcategoryField.onclick = openModal;
  if (closeBtn) closeBtn.onclick = closeModal;
  if (closeCustomSubcategoryBtn)
    closeCustomSubcategoryBtn.onclick = closeCustomModal;
  if (backToListBtn) backToListBtn.onclick = backToSubcategoryList;
  if (saveCustomSubcategoryBtn)
    saveCustomSubcategoryBtn.onclick = saveCustomSubcategory;

  if (subcategoryModal) {
    subcategoryModal.onclick = (e) => {
      if (e.target === subcategoryModal) closeModal();
    };
  }

  if (customSubcategoryModal) {
    customSubcategoryModal.onclick = (e) => {
      if (e.target === customSubcategoryModal) closeCustomModal();
    };
  }

  if (subcategoryBox) subcategoryBox.onclick = (e) => e.stopPropagation();
  if (customSubcategoryBox)
    customSubcategoryBox.onclick = (e) => e.stopPropagation();
}

function initCategoryModal(categoriesData) {
  // المنت‌ها
  const categoryField = document.querySelector(".category-field");
  const categorySpan = document.querySelector(".category-field span");
  const categoryModal = document.getElementById("category-modal");
  const categoryBox = document.getElementById("category-box");
  const categorySearch = document.getElementById("category-search");
  const categoryList = document.getElementById("category-list");
  const closeBtn = document.getElementById("category-close-btn");

  let selectedCategory = null;

  // باز و بسته کردن مودال
  function openModal() {
    categoryModal.classList.add("show"); // به جای remove hidden
    document.body.style.overflow = "hidden";
    renderCategories();
  }

  function closeModal() {
    categoryModal.classList.remove("show");
    document.body.style.overflow = "";
    categorySearch.value = "";
  }

  // رندر کردن دسته‌بندی‌ها
  function renderCategories(filter = "") {
    categoryList.innerHTML = "";
    const keyword = filter.trim().toLowerCase();

    const filtered = categoriesData.filter((category) =>
      category.name.toLowerCase().includes(keyword)
    );

    if (filtered.length === 0) {
      categoryList.innerHTML =
        '<div class="px-3 py-4 text-center text-gray-400">دسته‌بندی یافت نشد</div>';
      return;
    }

    filtered.forEach((category) => {
      const item = document.createElement("div");
      item.className =
        "px-3 py-4 hover:bg-gray-100 cursor-pointer rounded-2xl flex justify-between items-center border-b border-gray-100";
      item.innerHTML = `
        <span class="text-gray-700">${category.name}</span>
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      `;

      item.onclick = () => {
        selectedCategory = category;
        categorySpan.textContent = category.name;
        categorySpan.classList.remove("text-gray-400");
        categorySpan.classList.add("text-gray-800");
        closeModal();
      };

      categoryList.appendChild(item);
    });
  }

  // جستجو
  categorySearch.oninput = (e) => renderCategories(e.target.value);

  // باز کردن مودال با کلیک روی فیلد
  categoryField.onclick = openModal;

  // بستن مودال
  closeBtn.onclick = closeModal;

  // بستن با کلیک روی پس‌زمینه
  categoryModal.onclick = (e) => {
    if (e.target === categoryModal) closeModal();
  };

  // جلوگیری از بسته شدن وقتی داخل باکس کلیک می‌شه
  categoryBox.onclick = (e) => e.stopPropagation();
}

function initUnitModal() {
  // المنت‌ها
  const unitField = document.querySelector(".unit-field");
  const unitSpan = document.querySelector(".unit-field span");
  const unitModal = document.getElementById("unit-modal");
  const unitBox = document.getElementById("unit-box");
  const closeBtn = document.getElementById("unit-close-btn");
  const confirmBtn = document.querySelector("#unit-modal .bg-custom-brown");
  const radioInputs = document.querySelectorAll(
    '#unit-modal input[name="unit"]'
  );
  const textSpans = document.querySelectorAll(
    "#unit-modal .border-b:last-child p span"
  );

  let selectedUnit = null;

  // باز و بسته کردن مودال
  function openModal() {
    unitModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    unitModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  // تابع ذخیره واحد انتخاب شده
  function saveUnit() {
    // پیدا کردن واحد انتخاب شده
    radioInputs.forEach((radio) => {
      if (radio.checked) {
        selectedUnit = radio.nextElementSibling.innerText;
      }
    });

    if (selectedUnit) {
      // نمایش در فیلد اصلی
      unitSpan.textContent = selectedUnit;
      unitSpan.classList.remove("text-gray-400");
      unitSpan.classList.add("text-gray-800");

      // به‌روزرسانی متن پایین مودال
      textSpans.forEach((span) => {
        span.textContent = selectedUnit;
      });
    }

    closeModal();
  }

  // باز کردن مودال با کلیک روی فیلد
  unitField.onclick = openModal;

  // بستن مودال
  closeBtn.onclick = closeModal;

  // دکمه تایید و ذخیره
  if (confirmBtn) {
    confirmBtn.onclick = (e) => {
      e.preventDefault();
      saveUnit();
    };
  }

  // بستن با کلیک روی پس‌زمینه
  unitModal.onclick = (e) => {
    if (e.target === unitModal) closeModal();
  };

  // جلوگیری از بسته شدن وقتی داخل باکس کلیک می‌شه
  unitBox.onclick = (e) => e.stopPropagation();
}

initUnitModal();
initBranchModal(branches);
initCategoryModal(categories);
initSubcategoryModal(subcategories);

