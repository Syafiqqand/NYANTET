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
  renderDashboard,
  renderHistory,
  setActiveFilter,
  setActivePage,
  setCustomRangeVisible,
  setFormMessage,
  showAppError,
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
    await createIncome({ amount: values.get("amount"), source: values.get("source"), date: values.get("date") });
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
    await createExpense({ amount: values.get("amount"), description: values.get("description"), date: values.get("date") });
    resetTransactionForm(form);
    await refreshData();
    setFormMessage("expense", "Pengeluaran berhasil disimpan.", true);
    showToast("Pengeluaran berhasil ditambahkan.");
  } catch (error) {
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

function bindEvents() {
  document.querySelectorAll(".brand").forEach((brand) => {
    brand.addEventListener("click", (event) => {
      event.preventDefault();
      showPage("dashboard");
    });
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
