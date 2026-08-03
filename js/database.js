const DATABASE_NAME = "NYANTET_DB";
const DATABASE_VERSION = 1;

let databasePromise;

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Operasi database gagal."));
  });
}

function transactionToPromise(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Transaksi database gagal."));
    transaction.onabort = () => reject(transaction.error || new Error("Transaksi database dibatalkan."));
  });
}

export function openDatabase() {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Browser ini tidak mendukung penyimpanan lokal yang diperlukan."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("incomes")) {
        database.createObjectStore("incomes", { keyPath: "id", autoIncrement: true });
      }
      if (!database.objectStoreNames.contains("expenses")) {
        database.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
      }
      if (!database.objectStoreNames.contains("settings")) {
        database.createObjectStore("settings", { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Database tidak dapat dibuka."));
    request.onblocked = () => reject(new Error("Tutup tab NYANTET lain agar database dapat diperbarui."));
  }).catch((error) => {
    databasePromise = undefined;
    throw error;
  });

  return databasePromise;
}

async function addRecord(storeName, record) {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readwrite");
  const request = transaction.objectStore(storeName).add(record);
  const [id] = await Promise.all([requestToPromise(request), transactionToPromise(transaction)]);
  return id;
}

async function deleteRecord(storeName, id) {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readwrite");
  const request = transaction.objectStore(storeName).delete(id);
  await Promise.all([requestToPromise(request), transactionToPromise(transaction)]);
}

async function getAllRecords(storeName) {
  const database = await openDatabase();
  const transaction = database.transaction(storeName, "readonly");
  const request = transaction.objectStore(storeName).getAll();
  const [records] = await Promise.all([requestToPromise(request), transactionToPromise(transaction)]);
  return records;
}

export const addIncome = (income) => addRecord("incomes", income);
export const addExpense = (expense) => addRecord("expenses", expense);
export const deleteIncome = (id) => deleteRecord("incomes", id);
export const deleteExpense = (id) => deleteRecord("expenses", id);
export const getAllIncome = () => getAllRecords("incomes");
export const getAllExpense = () => getAllRecords("expenses");

export async function getSettings() {
  const database = await openDatabase();
  const transaction = database.transaction("settings", "readonly");
  const request = transaction.objectStore("settings").get("app");
  const [settings] = await Promise.all([requestToPromise(request), transactionToPromise(transaction)]);
  return settings || { key: "app", initialBalance: 0 };
}

export async function saveSettings(settings) {
  const database = await openDatabase();
  const transaction = database.transaction("settings", "readwrite");
  const request = transaction.objectStore("settings").put({ key: "app", ...settings });
  await Promise.all([requestToPromise(request), transactionToPromise(transaction)]);
}
