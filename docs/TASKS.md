
# TASKS.md

> Project: **NYANTET - Nyatet Keuangan Teratur**

Dokumen ini berisi daftar tugas implementasi untuk pengembangan aplikasi. Kerjakan secara bertahap dan selesaikan setiap fase sebelum melanjutkan ke fase berikutnya.

---

# Phase 1 — Project Setup

## Task 1.1
- Inisialisasi struktur folder project.
- Pastikan project dapat dijalankan sebagai website statis.

## Task 1.2
- Konfigurasi Progressive Web App (PWA).
- Tambahkan `manifest.json`.
- Tambahkan `sw.js` (Service Worker) dasar.
- Pastikan aplikasi dapat di-install.

## Task 1.3
- Siapkan Design System.
- Variabel warna.
- Typography.
- Border radius.
- Shadow.
- Spacing.

---

# Phase 2 — Local Database

## Task 2.1
Implementasikan IndexedDB.

Database:
- NYANTET_DB

Object Store:
- incomes
- expenses
- settings

## Task 2.2

Buat helper database untuk:

- addIncome()
- addExpense()
- deleteIncome()
- deleteExpense()
- getAllIncome()
- getAllExpense()
- getSettings()
- saveSettings()

Semua operasi harus menggunakan async/await.

---

# Phase 3 — Dashboard

## Task 3.1

Buat halaman Dashboard.

Menampilkan:

- Current Balance
- Total Income
- Total Expense
- Recent Transactions

## Task 3.2

Implementasikan filter:

- Today
- This Week
- This Month (default)
- This Year
- Custom Date Range

Dashboard harus otomatis diperbarui ketika data berubah.

---

# Phase 4 — Income

## Task 4.1

Buat halaman Tambah Pemasukan.

Field:

- Amount
- Source
- Date

Default Source:

- Salary
- Freelance
- Bonus
- THR
- Parents
- Other

## Task 4.2

Validasi:

- Amount wajib > 0
- Source wajib dipilih
- Date wajib ada

---

# Phase 5 — Expense

## Task 5.1

Buat halaman Tambah Pengeluaran.

Field:

- Amount
- Description
- Date

## Task 5.2

Validasi:

- Amount wajib > 0
- Description wajib diisi
- Date wajib ada

---

# Phase 6 — Transaction History

## Task 6.1

Gabungkan income dan expense menjadi satu daftar transaksi.

Urutan:

- Terbaru ke terlama.

## Task 6.2

Group transaksi berdasarkan tanggal.

## Task 6.3

Implementasikan Delete Transaction.

Catatan:
Edit transaction akan dikerjakan pada versi berikutnya.

---

# Phase 7 — Settings

## Task 7.1

Buat halaman Settings.

Hanya berisi:

- Initial Balance

Saldo awal hanya dapat diubah melalui halaman ini.

---

# Phase 8 — Calculation

Implementasikan perhitungan:

Current Balance

=

Initial Balance

+

Total Income

-

Total Expense

Semua nilai dashboard harus dihitung otomatis.

---

# Phase 9 — Responsive UI

Pastikan tampilan berjalan baik pada:

- Android
- Tablet
- Desktop

---

# Phase 10 — PWA Testing

Pastikan:

- Installable.
- Offline.
- Reload tanpa internet tetap berjalan.
- Data tetap tersimpan.

---

# Definition of Done

Sebuah task dianggap selesai apabila:

- Tidak ada error pada browser console.
- Mengikuti PRD.md.
- Mengikuti ARCHITECTURE.md.
- Responsive.
- Bersih dan mudah dipelihara.
- Menggunakan JavaScript modern (ES6+).
- Tidak menggunakan library atau framework tanpa kebutuhan yang jelas.

---

# Notes for Codex

- Ikuti PRD.md sebagai sumber kebutuhan produk.
- Ikuti ARCHITECTURE.md sebagai acuan struktur project.
- Kerjakan task secara berurutan.
- Jangan mengimplementasikan fitur di luar ruang lingkup V1 kecuali benar-benar diperlukan.
- Utamakan clean code, modularity, dan maintainability.

---

# Status Implementasi V1

Semua task Phase 1 sampai Phase 10 telah diimplementasikan pada aplikasi ini, termasuk struktur static site, PWA offline, IndexedDB, seluruh modul transaksi, filter tanggal dashboard, perhitungan saldo, dan tampilan responsif.
