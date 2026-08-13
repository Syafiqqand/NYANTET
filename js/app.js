import { getDateRange, toDateInputValue } from "./date-utils.js";
import {
  createExpense,
  createIncome,
  getAllTransactions,
  getDashboardData,
  removeTransaction
} from "./transactions.js";
import { getTheme, saveTheme } from "./settings.js";
import {
  applyTheme,
  hideInsufficientBalanceAlert,
  renderDashboard,
  renderHistory,
  setActiveFilter,
  setActivePage,
  setCustomRangeVisible,
  setFormMessage,
  showAppError,
  showInsufficientBalanceAlert,
  showToast
} from "./ui.js";

const dashboardState = {
  filter: "month",
  customStart: "",
  customEnd: ""
};
let currentTheme = "dark";

function getCurrentRange() {
  return getDateRange(dashboardState.filter, dashboardState.customStart, dashboardState.customEnd);
}

async function refreshDashboard() {
  const data = await getDashboardData(getCurrentRange());
  renderDashboard(data);
}

async function refreshData() {
  const transactions = await getAllTransactions();
  renderHistory(transactions);
  await refreshDashboard();
}

function resetTransactionForm(form) {
  form.reset();
  form.querySelector('input[type="date"]').value = toDateInputValue();
}

function showPage(pageName) {
  setActivePage(pageName);
}

function setDefaultFormDates() {
  document.querySelectorAll('.transaction-form input[type="date"]').forEach((input) => {
    input.value = toDateInputValue();
  });
}

async function handleIncomeSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  setFormMessage("income");
  try {
    const values = new FormData(form);
    const rawAmount = parseAmount(values.get("amount"));
    await createIncome({ amount: rawAmount, source: values.get("source"), date: values.get("date") });
    resetTransactionForm(form);
    await refreshData();
    setFormMessage("income", "Pemasukan berhasil disimpan.", true);
    showToast("Pemasukan berhasil ditambahkan.");
  } catch (error) {
    setFormMessage("income", error.message || "Pemasukan tidak dapat disimpan.");
  }
}

async function handleExpenseSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  setFormMessage("expense");
  try {
    const values = new FormData(form);
    const rawAmount = parseAmount(values.get("amount"));
    await createExpense({ amount: rawAmount, description: values.get("description"), date: values.get("date") });
    resetTransactionForm(form);
    await refreshData();
    setFormMessage("expense", "Pengeluaran berhasil disimpan.", true);
    showToast("Pengeluaran berhasil ditambahkan.");
  } catch (error) {
    if (error.name === "InsufficientBalanceError") {
      showInsufficientBalanceAlert();
      return;
    }
    setFormMessage("expense", error.message || "Pengeluaran tidak dapat disimpan.");
  }
}

async function handleFilterChange(filter) {
  dashboardState.filter = filter;
  setActiveFilter(filter);
  setCustomRangeVisible(dashboardState.filter === "custom");

  if (dashboardState.filter === "custom" && !dashboardState.customStart) {
    const monthRange = getDateRange("month");
    dashboardState.customStart = monthRange.start;
    dashboardState.customEnd = monthRange.end;
    document.querySelector("#filter-start-date").value = monthRange.start;
    document.querySelector("#filter-end-date").value = monthRange.end;
  }

  try {
    await refreshDashboard();
  } catch (error) {
    showToast(error.message || "Filter tidak dapat diterapkan.");
  }
}

async function handleThemeChange(event) {
  const selectedTheme = event.target.value;
  const previousTheme = currentTheme;
  applyTheme(selectedTheme);
  currentTheme = selectedTheme;

  try {
    await saveTheme(selectedTheme);
  } catch (error) {
    currentTheme = previousTheme;
    applyTheme(previousTheme);
    showToast(error.message || "Tema tidak dapat disimpan.");
  }
}

async function handleCustomRange() {
  const customStart = document.querySelector("#filter-start-date").value;
  const customEnd = document.querySelector("#filter-end-date").value;
  try {
    getDateRange("custom", customStart, customEnd);
    dashboardState.customStart = customStart;
    dashboardState.customEnd = customEnd;
    await refreshDashboard();
  } catch (error) {
    showToast(error.message || "Filter tidak dapat diterapkan.");
  }
}

async function handleDelete(event) {
  const button = event.target.closest("[data-delete-id]");
  if (!button) return;
  const approved = window.confirm("Hapus transaksi ini? Tindakan ini tidak dapat dibatalkan.");
  if (!approved) return;

  try {
    await removeTransaction(button.dataset.deleteType, button.dataset.deleteId);
    await refreshData();
    showToast("Transaksi berhasil dihapus.");
  } catch (error) {
    showToast(error.message || "Transaksi tidak dapat dihapus.");
  }
}

function formatAmount(value) {
  // Hapus semua karakter non-digit
  const digits = value.replace(/\D/g, "");
  // Tambahkan titik setiap 3 digit dari kanan
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseAmount(formatted) {
  // Kembalikan string angka murni tanpa titik
  return formatted.replace(/\./g, "");
}

function bindAmountFormatting(inputId) {
  const input = document.querySelector(`#${inputId}`);
  if (!input) return;
  input.addEventListener("input", () => {
    const cursorPos = input.selectionStart;
    const prevLen = input.value.length;
    const formatted = formatAmount(input.value);
    input.value = formatted;
    // Sesuaikan posisi kursor agar tidak loncat ke ujung
    const newLen = input.value.length;
    const diff = newLen - prevLen;
    input.setSelectionRange(cursorPos + diff, cursorPos + diff);
  });
}

function bindEvents() {
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.addEventListener("click", (event) => {
      event.preventDefault();
      showPage("dashboard");
    });
  });
  document.querySelector("#balance-alert-close").addEventListener("click", hideInsufficientBalanceAlert);
  document.querySelector("#balance-alert").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) hideInsufficientBalanceAlert();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideInsufficientBalanceAlert();
  });
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  document.querySelector("#open-history").addEventListener("click", () => showPage("history"));
  document.querySelector("#income-form").addEventListener("submit", handleIncomeSubmit);
  document.querySelector("#expense-form").addEventListener("submit", handleExpenseSubmit);
  document.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => handleFilterChange(button.dataset.filter));
  });
  document.querySelectorAll("#custom-date-range input").forEach((input) => {
    input.addEventListener("change", handleCustomRange);
  });
  document.querySelectorAll('input[name="theme"]').forEach((input) => {
    input.addEventListener("change", handleThemeChange);
  });
  document.querySelector("#history-transactions").addEventListener("click", handleDelete);
  bindAmountFormatting("income-amount");
  bindAmountFormatting("expense-amount");
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app remains usable when service workers are unavailable, such as in private browser modes.
    });
  }
}

async function initializeApp() {
  setDefaultFormDates();
  bindEvents();
  registerServiceWorker();
  try {
    currentTheme = await getTheme();
    applyTheme(currentTheme);
    await refreshData();
  } catch (error) {
    showAppError(error.message || "NYANTET tidak dapat memuat data lokal.");
  }
}

initializeApp();
