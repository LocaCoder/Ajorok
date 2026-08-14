document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // تعریف متغیرها و کلاس‌ها
  // ============================================
  const ACTIVE_CLASS = "active";
  const ROTATE_CLASS = "rotate-90";

  // ============================================
  // 1. مگا منو (Desktop)
  // ============================================
  const toggleBtn = document.getElementById("menuToggle");
  const megamenu = document.getElementById("megamenu");
  const megaOverlay = document.getElementById("mega_overlay");

  if (toggleBtn && megamenu && megaOverlay) {
    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (megamenu.classList.contains("hidden")) {
        megamenu.classList.remove("hidden");
        megamenu.style.display = "flex";
        megaOverlay.classList.remove("invisible");
        megaOverlay.style.opacity = "0.5";
        megaOverlay.style.visibility = "visible";
        megaOverlay.style.pointerEvents = "auto";
      } else {
        megamenu.classList.add("hidden");
        megamenu.style.display = "none";
        megaOverlay.classList.add("invisible");
        megaOverlay.style.opacity = "0";
        megaOverlay.style.visibility = "hidden";
        megaOverlay.style.pointerEvents = "none";
      }
    });

    megaOverlay.addEventListener("click", function () {
      megamenu.classList.add("hidden");
      megamenu.style.display = "none";
      megaOverlay.classList.add("invisible");
      megaOverlay.style.opacity = "0";
      megaOverlay.style.visibility = "hidden";
      megaOverlay.style.pointerEvents = "none";
    });
  }

  // ============================================
  // 2. سوییچ کردن دسته‌بندی‌های مگا منو (هاور)
  // ============================================
  const categoryItems = document.querySelectorAll(".megamenu_category-item");
  const leftMenus = document.querySelectorAll(".megamenu_left-item");

  categoryItems.forEach((item, index) => {
    item.addEventListener("mouseenter", function () {
      document
        .querySelector(".megamenu_category-item.active")
        ?.classList.remove("active");
      document
        .querySelector(".megamenu_left-item.active")
        ?.classList.remove("active");
      item.classList.add("active");
      if (leftMenus[index]) {
        leftMenus[index].classList.add("active");
      }
    });
  });

  // ============================================
  // 3. منوی همبرگری موبایل
  // ============================================
  const openMenuButton = document.querySelector(".open-menu-mobile");
  const closeMenuButton = document.querySelector(".close-menu-mobile");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (openMenuButton && mobileMenu) {
    openMenuButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.add("active");
      document.body.style.overflow = "hidden";
      console.log("✅ منوی موبایل باز شد");
    });
  }

  if (closeMenuButton && mobileMenu) {
    closeMenuButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
      console.log("✅ منوی موبایل بسته شد");
    });
  }

  // ============================================
  // 4. دسته‌بندی موبایل (category-slide)
  // ============================================
  const openCategory = document.querySelector(".open-category");
  const categorySlide = document.querySelector(".category-slide");
  const closeCategorySlide = document.querySelector(".close-category-slide");

  if (openCategory && categorySlide) {
    openCategory.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      categorySlide.classList.add("active");
    });
  }

  if (closeCategorySlide && categorySlide) {
    closeCategorySlide.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      categorySlide.classList.remove("active");
    });
  }

  // ============================================
  // 5. جزئیات دسته‌بندی موبایل (detail-category)
  // ============================================
  document.querySelectorAll(".open-detail-category").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const detailCategory = this.nextElementSibling;
      if (
        detailCategory &&
        detailCategory.classList.contains("detail-category")
      ) {
        detailCategory.classList.add("active");
      }
    });
  });

  document.querySelectorAll(".close-detail-category").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const detailCategory = this.closest(".detail-category");
      if (detailCategory) {
        detailCategory.classList.remove("active");
      }
    });
  });

  // ============================================
  // 6. زیرمنوهای موبایل (submenu)
  // ============================================
  document.querySelectorAll(".open-submenu").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const submenu = this.nextElementSibling;
      const svg = this.querySelector("svg");

      if (submenu && submenu.classList.contains("menu-category-submenu")) {
        document
          .querySelectorAll(".menu-category-submenu")
          .forEach(function (sub) {
            if (sub !== submenu) {
              sub.classList.remove("active");
            }
          });
        submenu.classList.toggle("active");
        if (svg) {
          svg.classList.toggle("rotate-90");
        }
      }
    });
  });

  // ============================================
  // 7. موقعیت (Location) - مودال تمام صفحه در موبایل
  // ============================================
  const locationTriggers = document.querySelectorAll("[data-location-trigger]");
  const locationModal = document.getElementById("location-modal");
  const overlay = document.getElementById("overlay");
  const closeLocationBtn = document.getElementById("close-location-modal");
  const cancelLocationBtn = document.getElementById("cancel-cities");
  const confirmLocationBtn = document.getElementById("confirm-cities");

  if (locationTriggers.length && locationModal && overlay) {
    // باز کردن مودال موقعیت
    locationTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // در موبایل تمام صفحه و در دسکتاپ مودال معمولی
        if (window.innerWidth < 768) {
          locationModal.classList.add("fullscreen");
        } else {
          locationModal.classList.remove("fullscreen");
        }

        locationModal.classList.remove(
          "invisible",
          "opacity-0",
          "translate-y-full"
        );
        locationModal.classList.add("opacity-100", "translate-y-0");
        overlay.classList.remove("invisible", "opacity-0");
        overlay.classList.add("opacity-50");
        document.body.style.overflow = "hidden";

        console.log("✅ مودال موقعیت باز شد");
      });
    });

    // بستن مودال موقعیت
    function closeLocationModal() {
      locationModal.classList.remove("opacity-100", "translate-y-0");
      locationModal.classList.add("opacity-0", "translate-y-full");
      overlay.classList.remove("opacity-50");
      overlay.classList.add("invisible", "opacity-0");
      document.body.style.overflow = "";

      setTimeout(function () {
        locationModal.classList.add("invisible");
      }, 300);

      console.log("✅ مودال موقعیت بسته شد");
    }

    closeLocationBtn?.addEventListener("click", closeLocationModal);
    cancelLocationBtn?.addEventListener("click", closeLocationModal);
    overlay.addEventListener("click", closeLocationModal);

    // تایید موقعیت
    confirmLocationBtn?.addEventListener("click", function () {
      const checked = document.querySelectorAll(".city-checkbox:checked");
      const cities = [];
      checked.forEach(function (cb) {
        cities.push(cb.value);
      });

      if (cities.length > 0) {
        const label = document.querySelector("[data-location-label]");
        if (label) {
          label.textContent =
            cities.length === 1 ? cities[0] : cities.length + " شهر";
        }
        closeLocationModal();
      }
    });
  }

  // ============================================
  // 8. منوی شهر (citylist) - برای دسکتاپ
  // ============================================
  const citylistOpen = document.querySelector(".citylist-open");
  const citylistMenu = document.querySelector(".citylist-menu");

  if (citylistOpen && citylistMenu) {
    citylistOpen.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      citylistMenu.classList.toggle("active");
      if (citylistMenu.classList.contains("active")) {
        overlay?.classList.remove("invisible");
        overlay?.classList.add("opacity-50");
      } else {
        overlay?.classList.add("invisible");
        overlay?.classList.remove("opacity-50");
      }
    });
  }

  // ============================================
  // 9. بستن منوها با کلیک خارج
  // ============================================
  document.addEventListener("click", function (e) {
    // بستن مگا منو
    if (megamenu && !megamenu.classList.contains("hidden")) {
      if (!toggleBtn.contains(e.target) && !megamenu.contains(e.target)) {
        megamenu.classList.add("hidden");
        megamenu.style.display = "none";
        megaOverlay.classList.add("invisible");
        megaOverlay.style.opacity = "0";
        megaOverlay.style.visibility = "hidden";
        megaOverlay.style.pointerEvents = "none";
      }
    }

    // بستن منوی موبایل
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      if (
        !mobileMenu.contains(e.target) &&
        !openMenuButton.contains(e.target)
      ) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    // بستن دسته‌بندی موبایل
    if (categorySlide && categorySlide.classList.contains("active")) {
      if (
        !categorySlide.contains(e.target) &&
        !openCategory.contains(e.target)
      ) {
        categorySlide.classList.remove("active");
      }
    }

    // بستن منوی شهر
    if (citylistMenu && citylistMenu.classList.contains("active")) {
      if (
        !citylistMenu.contains(e.target) &&
        !citylistOpen.contains(e.target)
      ) {
        citylistMenu.classList.remove("active");
        overlay?.classList.add("invisible");
        overlay?.classList.remove("opacity-50");
      }
    }
  });

  // ============================================
  // 10. ریسپانسیو - تغییر اندازه صفحه
  // ============================================
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      locationModal?.classList.remove("fullscreen");
    }
  });

  console.log("✅ همه اسکریپت‌ها با موفقیت اجرا شدند!");
});
