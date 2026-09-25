(() => {
    "use strict";

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const productImage = "../../images/UserDashboard/Messages/product-chat.jpg";

    const conversations = [
        {
            id: 1,
            name: "نام کاربر",
            preview: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
            timeAgo: "۱۲ دقیقه پیش",
            unread: 2,
            selected: false,
            mode: "default"
        },
        {
            id: 2,
            name: "نام کاربر",
            preview: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
            timeAgo: "۱۲ دقیقه پیش",
            unread: 2,
            selected: false,
            mode: "product"
        },
        {
            id: 3,
            name: "نام کاربر",
            preview: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
            timeAgo: "۱۲ دقیقه پیش",
            unread: 0,
            selected: false,
            mode: "default"
        },
        {
            id: 4,
            name: "نام کاربر",
            preview: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
            timeAgo: "۱۲ دقیقه پیش",
            unread: 0,
            selected: true,
            mode: "default"
        },
        {
            id: 5,
            name: "نام کاربر",
            preview: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم...",
            timeAgo: "۱۲ دقیقه پیش",
            unread: 0,
            selected: false,
            mode: "default"
        }
    ];

    const threads = {
        default: [
            {
                type: "incoming",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی",
                time: "۱۳:۵۲"
            },
            {
                type: "outgoing",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی",
                time: "۱۳:۵۲",
                status: "seen"
            },
            {
                type: "incoming",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی",
                time: "۱۳:۵۲"
            },
            {
                type: "outgoing",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی",
                time: "۱۳:۵۲",
                status: "sent"
            }
        ],
        product: [
            {
                type: "product",
                title: "عنوان محصول در این قسمت نوشته می‌شود.",
                price: "۱۲.۵۰۰.۰۰۰",
                text: "پیام ارسالی این قسمت نوشته می‌شود.",
                time: "۱۳:۵۲"
            }
        ]
    };

    const reportReasons = [
        "تبلیغات یا پیام‌های ناخواسته (اسپم)",
        "توهین، تهدید، مزاحمت یا محتوای نامناسب",
        "درخواست اطلاعات محرمانه یا جعل هویت",
        "کلاهبرداری یا رفتار مشکوک",
        "درخواست کارت به کارت یا پرداخت خارج از آجرک",
        "دلیل دیگری"
    ];

    let activeTab = "all";
    let selectedConversationId = 4;
    let currentReportReason = "";

    const desktopList = $("#desktopConversationList");
    const mobileList = $("#mobileConversationList");
    const desktopChatMessages = $("#desktopChatMessages");
    const mobileChatMessages = $("#mobileChatMessages");

    const mobileConversationView = $("#mobileConversationView");
    const mobileChatView = $("#mobileChatView");

    const desktopMoreBtn = $("#desktopMoreBtn");
    const desktopMoreMenu = $("#desktopMoreMenu");
    const mobileMoreBtn = $("#mobileMoreBtn");
    const mobileMoreMenu = $("#mobileMoreMenu");

    const reportBackdrop = $("#reportBackdrop");
    const reportReasonModal = $("#reportReasonModal");
    const reportDetailsModal = $("#reportDetailsModal");
    const selectedReportReason = $("#selectedReportReason");

    function avatar(size = "normal") {
        const desktop = size === "small"
            ? "h-[42px] w-[42px]"
            : "h-[80px] w-[80px]";

        const icon = size === "small"
            ? "h-[23px] w-[23px]"
            : "h-[44px] w-[44px]";

        return `
            <div class="relative grid ${desktop} shrink-0 place-items-center rounded-full bg-[#e5e5e5] text-[#263247]">
                <svg class="${icon}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="12" cy="7.2" r="3.5"></circle>
                    <path d="M5.7 19c.8-4 3-6 6.3-6 3.4 0 5.6 2 6.3 6-1.8 1.4-3.9 2-6.3 2s-4.5-.6-6.3-2Z"></path>
                </svg>
            </div>
        `;
    }

    function conversationCard(conversation, mobile = false) {
        const selected = conversation.id === selectedConversationId;

        const cardClasses = mobile
            ? `conversation-card min-h-[176px] rounded-[20px] border px-[31px] py-[30px] ${selected
                ? "border-[#1e1e1e] bg-[#fafafa]"
                : conversation.unread
                    ? "border-[#e3c0ba] bg-[#fbf1ef]"
                    : "border-[#d4d4d4] bg-white"}`
            : `conversation-card min-h-[108px] rounded-[10px] border px-4 py-4 ${selected
                ? "border-[#1e1e1e] bg-[#fafafa]"
                : conversation.unread
                    ? "border-[#e3c0ba] bg-[#fbf1ef]"
                    : "border-[#d4d4d4] bg-white"}`;

        const nameClass = mobile ? "text-[25px]" : "text-[15px]";
        const previewClass = mobile ? "mt-5 text-[20px]" : "mt-3 text-[13px]";
        const timeClass = mobile ? "text-[18px]" : "text-[12px]";

        return `
            <button data-conversation-id="${conversation.id}"
                class="${cardClasses} block w-full text-right">
                <div class="flex items-start">
                    <div class="relative shrink-0">
                        ${avatar(mobile ? "normal" : "small")}
                        ${conversation.unread ? `
                            <span class="${mobile ? "h-7 w-7 text-[15px] -right-1 -top-2" : "h-5 w-5 text-[11px] -right-1 -top-1"} absolute grid place-items-center rounded-full bg-red-600 text-white">
                                ${toFa(conversation.unread)}
                            </span>` : ""}
                    </div>

                    <div class="${mobile ? "mr-5" : "mr-3"} min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-3">
                            <strong class="${nameClass} font-medium text-[#252525]">${conversation.name}</strong>
                            <span class="${timeClass} shrink-0 text-[#5f5f5f]">${conversation.timeAgo}</span>
                        </div>

                        <p class="${previewClass} truncate leading-[1.75] text-[#2e2e2e]">
                            ${conversation.preview}
                        </p>
                    </div>
                </div>
            </button>
        `;
    }

    function renderConversationLists() {
        let filtered = conversations;

        if (activeTab === "unread") {
            filtered = conversations.filter(item => item.unread > 0);
        }

        desktopList.innerHTML = filtered.map(item => conversationCard(item, false)).join("");
        mobileList.innerHTML = filtered.map(item => conversationCard(item, true)).join("");

        bindConversationClicks();
    }

    function deliveryIcon(status) {
        const color = status === "seen" ? "#a94636" : "#a5a5a5";

        return `
            <svg class="h-5 w-7 shrink-0" viewBox="0 0 30 18" fill="none" aria-hidden="true">
                <path d="m2 9 4 4L14 4" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m8 9 4 4L20 4" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }

    function messageBubble(message, mobile = false) {
        const bubbleFont = mobile ? "text-[24px]" : "text-[14px]";
        const timeFont = mobile ? "text-[18px]" : "text-[11px]";

        if (message.type === "product") {
            return `
                <div class="flex justify-end">
                    <div class="${mobile
                        ? "w-[594px] max-w-[92%] rounded-[22px] border border-[#e4c1bb] bg-[#f8efed] px-[24px] py-[24px]"
                        : "w-[315px] rounded-[10px] border border-[#e4c1bb] bg-[#f8efed] px-3 py-3"}">
                        <div class="flex gap-4">
                            <div class="min-w-0 flex-1 text-right">
                                <h3 class="${mobile ? "text-[25px]" : "text-[14px]"} font-medium leading-[1.7] text-[#242424]">
                                    ${message.title}
                                </h3>

                                <p class="${mobile ? "mt-4 text-[20px]" : "mt-2 text-[12px]"}">
                                    هر واحد / ${message.price} تومان
                                </p>
                            </div>

                            <img src="${productImage}" alt="تصویر محصول"
                                class="${mobile ? "h-[145px] w-[178px] rounded-[16px]" : "h-[74px] w-[90px] rounded-[7px]"} shrink-0 object-cover" />
                        </div>

                        <div class="${mobile ? "my-8" : "my-4"} h-px bg-[#dedede]"></div>

                        <p class="${mobile ? "text-[22px]" : "text-[13px]"} leading-[1.8]">
                            ${message.text}
                        </p>

                        <span class="${timeFont} mt-4 block text-left text-[#6f6f6f]">${message.time}</span>
                    </div>
                </div>
            `;
        }

        const incoming = message.type === "incoming";

        return `
            <div class="flex ${incoming ? "justify-end" : "justify-start"}">
                <div class="chat-bubble ${incoming
                    ? "border-[#e4c1bb] bg-[#f8efed]"
                    : "border-[#d6d6d6] bg-white"} ${mobile
                    ? "rounded-[20px] px-[31px] py-[28px]"
                    : "rounded-[10px] px-4 py-4"} border">
                    <p class="${bubbleFont} leading-[1.65] text-[#252525]">${message.text}</p>

                    <div class="${mobile ? "mt-5" : "mt-3"} flex items-center gap-2 text-[#666]">
                        ${!incoming && message.status ? deliveryIcon(message.status) : ""}
                        <span class="${timeFont}">${message.time}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function dateLabel(mobile = false) {
        return `
            <div class="flex justify-center">
                <span class="${mobile
                    ? "px-5 py-2 text-[18px]"
                    : "px-4 py-1 text-[11px]"} bg-[#e9e9e9] text-[#555]">
                    تاریخ
                </span>
            </div>
        `;
    }

    function renderChat() {
        const conversation = conversations.find(item => item.id === selectedConversationId) || conversations[3];

        $("#desktopChatName").textContent = conversation.name;
        $("#mobileChatName").textContent = conversation.name;

        const messages = threads[conversation.mode] || threads.default;

        const desktopContent = [
            dateLabel(false),
            ...messages.map(message => messageBubble(message, false))
        ].join("");

        const mobileContent = [
            ...messages.map(message => messageBubble(message, true))
        ].join("");

        desktopChatMessages.innerHTML = `
            <div class="flex min-h-full w-full flex-col justify-end gap-[30px] pb-3">
                ${desktopContent}
            </div>
        `;

        mobileChatMessages.innerHTML = `
            <div class="flex min-h-full flex-col justify-end gap-[40px] pb-[32px]">
                ${mobileContent}
            </div>
        `;

        desktopChatMessages.scrollTop = desktopChatMessages.scrollHeight;
        mobileChatMessages.scrollTop = mobileChatMessages.scrollHeight;
    }

    function bindConversationClicks() {
        $$("[data-conversation-id]").forEach(button => {
            button.addEventListener("click", () => {
                selectedConversationId = Number(button.dataset.conversationId);

                const selected = conversations.find(item => item.id === selectedConversationId);
                if (selected) selected.unread = 0;

                renderConversationLists();
                renderChat();

                if (window.innerWidth < 768) {
                    mobileConversationView.classList.add("hidden");
                    mobileChatView.classList.remove("hidden");
                    mobileChatView.classList.add("flex");
                }
            });
        });
    }

    function bindTabs() {
        $$(".conversation-tab").forEach(button => {
            button.addEventListener("click", () => {
                activeTab = button.dataset.tab;

                $$(".conversation-tab").forEach(tab => {
                    const active = tab.dataset.tab === activeTab;

                    tab.classList.toggle("border-b-[3px]", active && window.innerWidth >= 768);
                    tab.classList.toggle("border-b-[4px]", active && window.innerWidth < 768);
                    tab.classList.toggle("border-custom-brown", active);
                    tab.classList.toggle("text-custom-brown", active);
                    tab.classList.toggle("text-[#333]", !active);
                });

                renderConversationLists();
            });
        });
    }

    function closeMenus() {
        desktopMoreMenu.classList.add("hidden");
        mobileMoreMenu.classList.add("hidden");
        desktopMoreBtn?.setAttribute("aria-expanded", "false");
        mobileMoreBtn?.setAttribute("aria-expanded", "false");
    }

    function toggleMenu(menu, button) {
        const willOpen = menu.classList.contains("hidden");
        closeMenus();

        if (willOpen) {
            menu.classList.remove("hidden");
            button.setAttribute("aria-expanded", "true");
        }
    }

    desktopMoreBtn?.addEventListener("click", event => {
        event.stopPropagation();
        toggleMenu(desktopMoreMenu, desktopMoreBtn);
    });

    mobileMoreBtn?.addEventListener("click", event => {
        event.stopPropagation();
        toggleMenu(mobileMoreMenu, mobileMoreBtn);
    });

    document.addEventListener("click", event => {
        if (!event.target.closest("#desktopMoreMenu") &&
            !event.target.closest("#desktopMoreBtn") &&
            !event.target.closest("#mobileMoreMenu") &&
            !event.target.closest("#mobileMoreBtn")) {
            closeMenus();
        }
    });

    $("#mobileChatBack")?.addEventListener("click", () => {
        mobileChatView.classList.add("hidden");
        mobileChatView.classList.remove("flex");
        mobileConversationView.classList.remove("hidden");
    });

    function renderReportReasons() {
        $("#reportReasonList").innerHTML = reportReasons.map(reason => `
            <button data-report-reason="${escapeHtml(reason)}"
                class="flex h-[64px] w-full items-center justify-between border-b border-[#dedede] text-right text-[15px] hover:bg-[#fafafa]">
                <span>${reason}</span>
                <svg class="h-5 w-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.7" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m15 5-7 7 7 7" />
                </svg>
            </button>
        `).join("");

        $$("[data-report-reason]").forEach(button => {
            button.addEventListener("click", () => {
                currentReportReason = button.dataset.reportReason;
                selectedReportReason.textContent = currentReportReason;

                reportReasonModal.classList.add("hidden");
                reportDetailsModal.classList.remove("hidden");
            });
        });
    }

    function openReport() {
        closeMenus();
        reportBackdrop.classList.remove("hidden");
        reportReasonModal.classList.remove("hidden");
        reportDetailsModal.classList.add("hidden");
        document.body.style.overflow = "hidden";
    }

    function closeReport() {
        reportBackdrop.classList.add("hidden");
        reportReasonModal.classList.add("hidden");
        reportDetailsModal.classList.add("hidden");
        document.body.style.overflow = "";
        currentReportReason = "";
        $("#reportDetails").value = "";
        $("#blockStoreCheckbox").checked = false;
    }

    $$("[data-open-report]").forEach(button => {
        button.addEventListener("click", openReport);
    });

    $$("[data-close-report]").forEach(button => {
        button.addEventListener("click", closeReport);
    });

    reportBackdrop.addEventListener("click", closeReport);

    $("#submitReport").addEventListener("click", () => {
        closeReport();
        showToast("گزارش شما ثبت شد.");
    });

    function handleMessageSubmit(form, input, mobile = false) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const text = input.value.trim();
            if (!text) return;

            const conversation = conversations.find(item => item.id === selectedConversationId);
            if (conversation) conversation.mode = "default";

            threads.default.push({
                type: "outgoing",
                text,
                time: "۱۳:۵۲",
                status: "sent"
            });

            input.value = "";
            renderChat();

            if (mobile) {
                mobileChatMessages.scrollTop = mobileChatMessages.scrollHeight;
            } else {
                desktopChatMessages.scrollTop = desktopChatMessages.scrollHeight;
            }
        });
    }

    handleMessageSubmit($("#desktopMessageForm"), $("#desktopMessageInput"), false);
    handleMessageSubmit($("#mobileMessageForm"), $("#mobileMessageInput"), true);

    function showToast(text) {
        const toast = $("#messageToast");
        toast.textContent = text;
        toast.classList.remove("hidden");

        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2600);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function toFa(value) {
        return String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
    }

    renderReportReasons();
    renderConversationLists();
    renderChat();
    bindTabs();
})();
