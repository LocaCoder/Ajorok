// ============================================================
// store-messages.js - گفت‌وگوهای فروشگاه
// ============================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    const UI = window.StoreUI;
    if (!UI) {
      console.error("[Messages] StoreUI یافت نشد");
      return;
    }

    const { $, $$, showToast, isMobile, openModal, closeModal, openMobileMenu, closeMobileMenu, debounce } = UI;

    // ============================================================
    // DATA
    // ============================================================
    const conversations = [
      {
        id: 1,
        user: "نام کاربر",
        avatar: "👤",
        lastMessage: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
        lastTime: "۱۲ دقیقه پیش",
        unread: 2,
        messages: [
          { from: "user", text: "لورم ایپسوم متن ساختگی با تولید سادگی", time: "۱۳:۵۲" },
          { from: "shop", text: "لورم ایپسوم متن ساختگی با تولید سادگی", time: "۱۳:۵۳" },
          { from: "user", text: "سلام، قیمت این محصول چقدره؟", time: "۱۴:۰۰" },
          { from: "shop", text: "سلام، این محصول موجوده. قیمت هر واحد ۱۲,۵۰۰,۰۰۰ تومان هست.", time: "۱۴:۰۲" },
          { from: "user", text: "لورم ایپسوم متن ساختگی با تولید سادگی", time: "۱۴:۰۵" },
        ],
      },
      {
        id: 2,
        user: "نام کاربر",
        avatar: "👤",
        lastMessage: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
        lastTime: "۱۲ دقیقه پیش",
        unread: 0,
        messages: [
          { from: "user", text: "سلام", time: "۱۰:۲۰" },
          { from: "shop", text: "سلام، چطور می‌تونم کمکتون کنم؟", time: "۱۰:۲۱" },
        ],
      },
      {
        id: 3,
        user: "نام کاربر",
        avatar: "👤",
        lastMessage: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
        lastTime: "۱ ساعت پیش",
        unread: 0,
        messages: [
          { from: "user", text: "ممنون از ارسال سریعتون", time: "دیروز" },
        ],
      },
      {
        id: 4,
        user: "نام کاربر",
        avatar: "👤",
        lastMessage: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
        lastTime: "دیروز",
        unread: 1,
        messages: [
          { from: "user", text: "سلام، سفارشم چی شد؟", time: "دیروز" },
        ],
      },
    ];

    const reportReasons = [
      "تبلیغات یا پیام‌های ناخواسته (اسپم)",
      "توهین، تهدید، مزاحمت یا محتوای نامناسب",
      "درخواست اطلاعات محرمانه یا جعل هویت",
      "کلاهبرداری یا رفتار مشکوک",
      "درخواست کارت به کارت یا پرداخت خارج از جورک",
      "دلیل دیگری",
    ];

    // ============================================================
    // STATE
    // ============================================================
    const state = {
      selectedConversation: conversations[0],
      activeTab: "all",
      pendingReportReason: null,
    };

    // ============================================================
    // RENDER CONVERSATION LIST
    // ============================================================
    function conversationItemTemplate(conv, isMobile = false) {
      const isActive = state.selectedConversation.id === conv.id;
      const activeClass = isActive
        ? "border-[#aa4938] bg-[#fff9f8]"
        : "border-[#e5e5e5] bg-white hover:border-[#cfcfcf]";

      const unreadBadge = conv.unread > 0
        ? `<span class="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">${conv.unread}</span>`
        : "";

      return `
        <div class="conversation-item cursor-pointer rounded-[12px] border p-3.5 transition ${activeClass}"
          data-conv-id="${conv.id}">
          <div class="mb-1.5 flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="relative shrink-0">
                <div class="grid h-10 w-10 place-items-center rounded-full bg-[#e6e6e6] text-[18px]">
                  ${conv.avatar}
                </div>
                ${unreadBadge}
              </div>
              <span class="truncate text-[13px] font-bold text-[#252525]">${conv.user}</span>
            </div>
            <span class="shrink-0 text-[10px] text-[#999]">${conv.lastTime}</span>
          </div>
          <p class="truncate pr-12 text-[11px] text-[#777]">${conv.lastMessage}</p>
        </div>
      `;
    }

    function renderConversationLists() {
      const desktopEl = document.getElementById("desktopConversationList");
      const mobileEl = document.getElementById("mobileConversationList");

      let filtered = conversations;
      if (state.activeTab === "unread") {
        filtered = conversations.filter((c) => c.unread > 0);
      }

      const html = filtered.length
        ? filtered.map((c) => conversationItemTemplate(c)).join("")
        : `<p class="py-8 text-center text-[12px] text-[#888]">گفت‌وگویی یافت نشد.</p>`;

      if (desktopEl) desktopEl.innerHTML = html;
      if (mobileEl) mobileEl.innerHTML = html;

      $$(".conversation-item").forEach((item) => {
        item.addEventListener("click", () => {
          const id = Number(item.dataset.convId);
          const conv = conversations.find((c) => c.id === id);
          if (conv) selectConversation(conv);
        });
      });
    }

    // ============================================================
    // SELECT CONVERSATION
    // ============================================================
    function selectConversation(conv) {
      state.selectedConversation = conv;
      conv.unread = 0;

      // به‌روزرسانی نام
      document.getElementById("desktopChatName").textContent = conv.user;
      document.getElementById("mobileChatName").textContent = conv.user;

      // رندر پیام‌ها
      renderMessages("desktopChatMessages");
      renderMessages("mobileChatMessages");

      // رندر لیست (برای حذف بج خوانده نشده)
      renderConversationLists();

      // اگر موبایل بود، برو به صفحه چت
      if (isMobile()) {
        document.getElementById("mobileConvView")?.classList.add("hidden");
        document.getElementById("mobileChatView")?.classList.remove("hidden");
      }
    }

    // ============================================================
    // RENDER MESSAGES
    // ============================================================
    function messageTemplate(msg) {
      const isUser = msg.from === "user";
      if (isUser) {
        return `
          <div class="flex justify-start">
            <div class="chat-bubble rounded-[14px] rounded-tr-none border border-[#e4c1bb] bg-[#f8efed] px-4 py-3">
              <p class="text-[12px] leading-6 text-[#333]">${msg.text}</p>
              <div class="mt-1 text-left text-[9px] text-[#999]">${msg.time}</div>
            </div>
          </div>
        `;
      }
      return `
        <div class="flex justify-end">
          <div class="chat-bubble rounded-[14px] rounded-tl-none border border-[#e5e5e5] bg-white px-4 py-3 shadow-sm">
            <p class="text-[12px] leading-6 text-[#333]">${msg.text}</p>
            <div class="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#999]">
              <span>${msg.time}</span>
              <svg class="h-3.5 w-3.5 text-blue-500" aria-hidden="true"><use href="#icon-double-check"></use></svg>
            </div>
          </div>
        </div>
      `;
    }

    function renderMessages(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const msgs = state.selectedConversation.messages;
      container.innerHTML = msgs.length
        ? msgs.map(messageTemplate).join("")
        : `<p class="py-12 text-center text-[12px] text-[#888]">هنوز پیامی در این گفتگو ثبت نشده است.</p>`;

      // اسکرول به پایین
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }

    // ============================================================
    // SEND MESSAGE
    // ============================================================
    function sendMessage(inputEl) {
      const text = inputEl.value.trim();
      if (!text) return;

      state.selectedConversation.messages.push({
        from: "shop",
        text,
        time: "اکنون",
      });

      state.selectedConversation.lastMessage = text;
      state.selectedConversation.lastTime = "اکنون";

      inputEl.value = "";

      renderMessages("desktopChatMessages");
      renderMessages("mobileChatMessages");
      renderConversationLists();

      showToast("پیام ارسال شد.", "success", 1500);
    }

    // ============================================================
    // REPORT MODAL
    // ============================================================
    function renderReportReasons() {
      const el = document.getElementById("reportReasonList");
      if (!el) return;

      el.innerHTML = reportReasons
        .map(
          (reason) => `
        <button type="button" data-report-reason="${reason}"
          class="flex w-full items-center justify-between rounded-[8px] px-3 py-3.5 text-right text-[13px] text-[#333] hover:bg-[#f7f7f7] transition">
          <span>${reason}</span>
          <svg class="h-4 w-4 text-[#999]" aria-hidden="true"><use href="#icon-arrow-left"></use></svg>
        </button>
      `
        )
        .join("");

      el.querySelectorAll("[data-report-reason]").forEach((btn) => {
        btn.addEventListener("click", function () {
          const reason = this.dataset.reportReason;
          state.pendingReportReason = reason;
          document.getElementById("selectedReportReason").textContent = reason;
          closeModal("reportReasonModal");
          setTimeout(() => {
            openModal("reportDetailsModal", "reportBackdrop");
          }, 220);
        });
      });
    }

    function openReportModal() {
      state.pendingReportReason = null;
      document.getElementById("reportDetails").value = "";
      document.getElementById("blockStoreCheckbox").checked = false;
      closeMobileMenu();
      openModal("reportReasonModal", "reportBackdrop");
    }

    function closeReportModals() {
      closeModal("reportReasonModal");
      closeModal("reportDetailsModal");
    }

    function submitReport() {
      const details = document.getElementById("reportDetails").value.trim();
      const reason = state.pendingReportReason;

      if (!reason) {
        showToast("دلیل گزارش را انتخاب کنید.", "error");
        return;
      }

      closeReportModals();
      setTimeout(() => {
        showToast("گزارش شما با موفقیت ثبت شد.", "success");
      }, 220);
    }

    // ============================================================
    // MOBILE VIEW SWITCH
    // ============================================================
    function showMobileChat() {
      document.getElementById("mobileConvView")?.classList.add("hidden");
      document.getElementById("mobileChatView")?.classList.remove("hidden");
    }

    function showMobileList() {
      document.getElementById("mobileChatView")?.classList.add("hidden");
      document.getElementById("mobileConvView")?.classList.remove("hidden");
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
      // دکمه‌های بازگشت
      document.querySelectorAll("[data-store-back]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (window.history.length > 1) window.history.back();
          else window.location.href = "StoreDashboard.html";
        });
      });

      // رندر اولیه
      renderConversationLists();
      renderMessages("desktopChatMessages");
      renderMessages("mobileChatMessages");
      document.getElementById("desktopChatName").textContent =
        state.selectedConversation.user;
      document.getElementById("mobileChatName").textContent =
        state.selectedConversation.user;

      renderReportReasons();

      // ---- Tab دسکتاپ ----
      $$("[data-conv-tab]").forEach((tab) => {
        tab.addEventListener("click", function () {
          const key = this.dataset.convTab;
          state.activeTab = key;

          $$("[data-conv-tab]").forEach((t) => {
            t.className =
              "conversation-tab h-[42px] text-[14px] text-[#333]";
          });
          this.className =
            "conversation-tab h-[42px] border-b-[3px] border-[#aa4938] text-[14px] font-medium text-[#aa4938]";

          renderConversationLists();
        });
      });

      // ---- Tab موبایل ----
      $$("[data-conv-tab-mobile]").forEach((tab) => {
        tab.addEventListener("click", function () {
          const key = this.dataset.convTabMobile;
          state.activeTab = key;

          $$("[data-conv-tab-mobile]").forEach((t) => {
            t.className =
              "conversation-tab-mobile text-[15px] text-[#333]";
          });
          this.className =
            "conversation-tab-mobile border-b-[3px] border-[#aa4938] text-[15px] font-medium text-[#aa4938]";

          renderConversationLists();
        });
      });

      // ---- ارسال پیام دسکتاپ ----
      document.getElementById("desktopMessageForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage(document.getElementById("desktopMessageInput"));
      });

      // ---- ارسال پیام موبایل ----
      document.getElementById("mobileMessageForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage(document.getElementById("mobileMessageInput"));
      });

      // ---- دکمه بازگشت موبایل ----
      document.getElementById("mobileChatBack")?.addEventListener("click", showMobileList);

      // ---- منوی More دسکتاپ ----
      const desktopMoreBtn = document.getElementById("desktopMoreBtn");
      const desktopMoreMenu = document.getElementById("desktopMoreMenu");
      if (desktopMoreBtn && desktopMoreMenu) {
        desktopMoreBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          desktopMoreMenu.classList.toggle("hidden");
          this.setAttribute("aria-expanded", String(!desktopMoreMenu.classList.contains("hidden")));
        });

        document.addEventListener("click", (e) => {
          if (
            !e.target.closest("#desktopMoreBtn") &&
            !e.target.closest("#desktopMoreMenu")
          ) {
            desktopMoreMenu.classList.add("hidden");
            desktopMoreBtn.setAttribute("aria-expanded", "false");
          }
        });
      }

      // ---- منوی More موبایل ----
      const mobileMoreBtn = document.getElementById("mobileMoreBtn");
      const mobileMoreMenu = document.getElementById("mobileMoreMenu");
      if (mobileMoreBtn && mobileMoreMenu) {
        mobileMoreBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          mobileMoreMenu.classList.toggle("hidden");
          this.setAttribute("aria-expanded", String(!mobileMoreMenu.classList.contains("hidden")));
        });

        document.addEventListener("click", (e) => {
          if (
            !e.target.closest("#mobileMoreBtn") &&
            !e.target.closest("#mobileMoreMenu")
          ) {
            mobileMoreMenu.classList.add("hidden");
            mobileMoreBtn.setAttribute("aria-expanded", "false");
          }
        });
      }

      // ---- باز کردن گزارش ----
      $$("[data-open-report]").forEach((btn) => {
        btn.addEventListener("click", () => {
          desktopMoreMenu?.classList.add("hidden");
          mobileMoreMenu?.classList.add("hidden");
          openReportModal();
        });
      });

      // ---- بستن گزارش ----
      $$("[data-close-report]").forEach((btn) => {
        btn.addEventListener("click", closeReportModals);
      });

      document.getElementById("reportBackdrop")?.addEventListener("click", closeReportModals);

      // ---- ثبت گزارش ----
      document.getElementById("submitReport")?.addEventListener("click", submitReport);

      // ---- Escape برای بستن همه ----
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeReportModals();
          desktopMoreMenu?.classList.add("hidden");
          mobileMoreMenu?.classList.add("hidden");
        }
      });

      // در موبایل، اگر ابتدا بارگذاری شده، view چت مخفی باشه
      if (isMobile()) {
        showMobileList();
      }
    }

    // اجرا
    UI.init();
    init();
  }
})();