const currencyFormatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

export function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

function transactionMarkup(transaction, showDelete = false) {
  const isIncome = transaction.type === "income";
  const typeClass = isIncome ? "income" : "expense";
  const prefix = isIncome ? "+" : "&minus;";
  const deleteMarkup = showDelete
    ? `<button class="delete-button" type="button" data-delete-type="${transaction.type}" data-delete-id="${transaction.id}" aria-label="Hapus ${escapeHtml(transaction.label)}">Hapus</button>`
    : "";

  return `<article class="transaction-row">
    <span class="transaction-icon ${typeClass}-icon" aria-hidden="true">${isIncome ? "&nearr;" : "&searr;"}</span>
    <div><p class="transaction-name">${escapeHtml(transaction.label)}</p><p class="transaction-date">${formatDate(transaction.date)}</p></div>
    <span class="transaction-amount ${typeClass}-value">${prefix}${formatCurrency(transaction.amount)}</span>
    ${deleteMarkup}
  </article>`;
}

function emptyState(message) {
  return `<p class="empty-state">${message}</p>`;
}

export function renderDashboard(data) {
  document.querySelector("#dashboard-summary").innerHTML = `
    <article class="balance-card"><p class="summary-label">Saldo saat ini</p><strong class="summary-value">${formatCurrency(data.balance)}</strong><p class="summary-note">Mencakup seluruh transaksi</p></article>
    <div class="period-summary" aria-label="Ringkasan periode terpilih">
      <article class="period-stat"><p class="summary-label">Pemasukan</p><strong class="summary-value income-value">${formatCurrency(data.periodIncome)}</strong></article>
      <article class="period-stat"><p class="summary-label">Pengeluaran</p><strong class="summary-value expense-value">${formatCurrency(data.periodExpense)}</strong></article>
    </div>`;
  document.querySelector("#recent-transactions").innerHTML = data.recentTransactions.length
    ? data.recentTransactions.map((transaction) => transactionMarkup(transaction)).join("")
    : emptyState("Belum ada transaksi pada periode ini.");
}

export function renderHistory(transactions) {
  const history = document.querySelector("#history-transactions");
  if (!transactions.length) {
    history.innerHTML = emptyState("Belum ada transaksi. Tambahkan pemasukan atau pengeluaran pertama Anda.");
    return;
  }

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    if (!groups.has(transaction.date)) groups.set(transaction.date, []);
    groups.get(transaction.date).push(transaction);
    return groups;
  }, new Map());

  history.innerHTML = [...groupedTransactions].map(([date, items]) => `
    <section><h2 class="history-date">${formatDate(date)}</h2><div class="history-group">${items.map((item) => transactionMarkup(item, true)).join("")}</div></section>`).join("");
}

export function setActivePage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    const isActive = page.id === `${pageName}-page`;
    page.hidden = !isActive;
    page.classList.toggle("is-active", isActive);
  });
  document.querySelectorAll(".nav-item").forEach((item) => {
    const isActive = item.dataset.page === pageName;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-current", isActive ? "page" : "false");
  });
  window.scrollTo(0, 0);
}

export function setFormMessage(formName, message = "", isSuccess = false) {
  const element = document.querySelector(`#${formName}-message`);
  element.textContent = message;
  element.classList.toggle("is-success", Boolean(message && isSuccess));
}

export function setInitialBalance(value) {
  document.querySelector("#initial-balance").value = value;
}

export function setCustomRangeVisible(isVisible) {
  document.querySelector("#custom-date-range").hidden = !isVisible;
}

let toastTimer;
export function showToast(message) {
  const toast = document.querySelector("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3000);
}

export function showAppError(message) {
  const errorBox = document.querySelector("#app-error");
  errorBox.textContent = message;
  errorBox.hidden = false;
}
