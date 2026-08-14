const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const moreBtn = $("#moreBtn");
const moreMenu = $("#moreMenu");
moreBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  moreMenu.classList.toggle("hidden");
  moreBtn.setAttribute(
    "aria-expanded",
    String(!moreMenu.classList.contains("hidden"))
  );
});
document.addEventListener("click", (e) => {
  if (!moreMenu.contains(e.target) && e.target !== moreBtn) {
    moreMenu.classList.add("hidden");
    moreBtn.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    moreMenu.classList.add("hidden");
    $("#mapModal").classList.add("hidden");
    $("#mapModal").classList.remove("flex");
  }
});

const setStatus = (type) => {
  const badge = $("#statusBadge");
  const label = $("#completionLabel");
  const states = {
    pending: [
      "در انتظار بررسی",
      "bg-[#dcecff]",
      "text-[#2b78c5]",
      "نیازمند تکمیل اطلاعات",
      "text-custom-brown",
    ],
    approved: [
      "فعال",
      "bg-[#dcf8e8]",
      "text-[#168245]",
      "اطلاعات تکمیل شده",
      "text-[#168245]",
    ],
    rejected: [
      "رد شده",
      "bg-[#fde5e5]",
      "text-[#c93434]",
      "نیازمند اصلاح اطلاعات",
      "text-[#c93434]",
    ],
  };
  const s = states[type];
  badge.className = `rounded-[5px] px-3 py-2 text-[12px] font-medium ${s[1]} ${s[2]}`;
  badge.textContent = s[0];
  label.className = `text-[14px] font-semibold ${s[4]}`;
  label.textContent = s[3];
  showToast(
    type === "approved"
      ? "فروشگاه تأیید شد."
      : "وضعیت فروشگاه به رد شده تغییر کرد."
  );
};
$("#approveBtn").addEventListener("click", () => setStatus("approved"));
$("#rejectBtn").addEventListener("click", () => setStatus("rejected"));

const controls = $$(".form-control");
const initialValues = new Map(controls.map((el) => [el, el.value]));
let editing = false;
const editBtn = $("#editBtn");
const cancelBtn = $("#cancelBtn");
function setEditMode(value) {
  editing = value;
  controls.forEach((el) => {
    el.readOnly = !value;
    el.classList.toggle("editable", value);
  });
  editBtn.textContent = value ? "ذخیره تغییرات" : "ویرایش اطلاعات";
  cancelBtn.classList.toggle("hidden", !value);
  moreMenu.classList.add("hidden");
  if (value) controls[0].focus();
}
editBtn.addEventListener("click", () => {
  if (!editing) {
    setEditMode(true);
    return;
  }
  controls.forEach((el) => initialValues.set(el, el.value));
  setEditMode(false);
  showToast("اطلاعات فروشگاه ذخیره شد.");
});
cancelBtn.addEventListener("click", () => {
  controls.forEach((el) => (el.value = initialValues.get(el)));
  setEditMode(false);
});
$('[data-action="edit"]').addEventListener("click", () => setEditMode(true));

$("#socialBtn").addEventListener("click", () => {
  $("#socialBox").classList.toggle("hidden");
});

const mapModal = $("#mapModal");
$("#mapBtn").addEventListener("click", () => {
  mapModal.classList.remove("hidden");
  mapModal.classList.add("flex");
});
$("#closeMap").addEventListener("click", () => {
  mapModal.classList.add("hidden");
  mapModal.classList.remove("flex");
});
mapModal.addEventListener("click", (e) => {
  if (e.target === mapModal) {
    mapModal.classList.add("hidden");
    mapModal.classList.remove("flex");
  }
});

const tabLabels = {
  overview: "نمای کلی",
  info: "اطلاعات",
  products: "محصولات",
  orders: "سفارش‌ها",
  transactions: "تراکنش‌ها",
  wallet: "موجودی و تسویه",
  bank: "حساب بانکی",
};
$$(".tab-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => {
      b.classList.remove("tab-active");
      b.classList.add("border-transparent");
    });
    btn.classList.add("tab-active");
    btn.classList.remove("border-transparent");
    const tab = btn.dataset.tab;
    $("#infoPanel").classList.toggle("hidden", tab !== "info");
    $("#placeholderPanel").classList.toggle("hidden", tab === "info");
    $("#placeholderPanel").classList.toggle("grid", tab !== "info");
    $("#placeholderTitle").textContent = tabLabels[tab];
  })
);

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2400);
}
