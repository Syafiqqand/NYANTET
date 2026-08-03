import {
  addExpense,
  addIncome,
  deleteExpense,
  deleteIncome,
  getAllExpense,
  getAllIncome,
  getSettings,
  saveSettings
} from "./database.js";
import { isDateInRange, isValidDateString } from "./date-utils.js";

const MAX_AMOUNT = 999_999_999_999;

function validationError(message) {
  return new Error(message);
}

function validateAmount(value, fieldName = "Jumlah") {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount) || amount > MAX_AMOUNT) {
    throw validationError(`${fieldName} harus berupa angka bulat lebih dari 0.`);
  }
  return amount;
}

function validateInitialBalance(value) {
  if (String(value ?? "").trim() === "") {
    throw validationError("Saldo awal wajib diisi.");
  }
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0 || !Number.isInteger(amount) || amount > MAX_AMOUNT) {
    throw validationError("Saldo awal harus berupa angka bulat 0 atau lebih.");
  }
  return amount;
}

function validateText(value, fieldName, maxLength) {
  const text = String(value || "").trim();
  if (!text) throw validationError(`${fieldName} wajib diisi.`);
  if (text.length > maxLength) throw validationError(`${fieldName} terlalu panjang.`);
  return text;
}

function validateDate(value) {
  if (!isValidDateString(value)) throw validationError("Tanggal wajib diisi dengan benar.");
  return value;
}

function sortNewestFirst(transactions) {
  return [...transactions].sort((first, second) => {
    const byDate = second.date.localeCompare(first.date);
    return byDate || String(second.createdAt).localeCompare(String(first.createdAt));
  });
}

function toTransaction(record, type) {
  return {
    id: record.id,
    type,
    amount: Number(record.amount) || 0,
    label: String(type === "income" ? record.source || "Pemasukan" : record.description || "Pengeluaran"),
    date: isValidDateString(record.date) ? record.date : "",
    createdAt: String(record.createdAt || "")
  };
}

export async function createIncome(input) {
  const amount = validateAmount(input.amount);
  const source = validateText(input.source, "Sumber", 80);
  const date = validateDate(input.date);
  return addIncome({ amount, source, date, createdAt: new Date().toISOString() });
}

export async function createExpense(input) {
  const amount = validateAmount(input.amount);
  const description = validateText(input.description, "Keterangan", 160);
  const date = validateDate(input.date);
  return addExpense({ amount, description, date, createdAt: new Date().toISOString() });
}

export async function removeTransaction(type, id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) throw validationError("Transaksi tidak valid.");
  if (type === "income") return deleteIncome(numericId);
  if (type === "expense") return deleteExpense(numericId);
  throw validationError("Jenis transaksi tidak valid.");
}

export async function updateInitialBalance(value) {
  const initialBalance = validateInitialBalance(value);
  await saveSettings({ initialBalance });
}

export async function getInitialBalance() {
  const settings = await getSettings();
  return Number.isFinite(Number(settings.initialBalance)) ? Number(settings.initialBalance) : 0;
}

export async function getAllTransactions() {
  const [incomes, expenses] = await Promise.all([getAllIncome(), getAllExpense()]);
  return sortNewestFirst([
    ...incomes.map((income) => toTransaction(income, "income")),
    ...expenses.map((expense) => toTransaction(expense, "expense"))
  ].filter((transaction) => transaction.date));
}

export async function getDashboardData(range) {
  const [initialBalance, allTransactions] = await Promise.all([getInitialBalance(), getAllTransactions()]);
  const totalIncome = allTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = allTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const filteredTransactions = allTransactions.filter((transaction) => isDateInRange(transaction.date, range));

  return {
    balance: initialBalance + totalIncome - totalExpense,
    periodIncome: filteredTransactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0),
    periodExpense: filteredTransactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0),
    recentTransactions: filteredTransactions.slice(0, 5)
  };
}
