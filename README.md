# NYANTET

NYANTET (Nyatet Keuangan Teratur) adalah pencatat keuangan pribadi berbasis browser yang berjalan sepenuhnya di perangkat pengguna. Aplikasi tidak memiliki backend, akun, atau koneksi cloud.

## Menjalankan aplikasi

Sajikan folder proyek melalui static web server (atau fitur *Live Server* editor) lalu buka alamat lokalnya di browser. Service worker dan instalasi PWA memerlukan `localhost` atau HTTPS; membuka `index.html` langsung dari file system tidak cukup.

## Fitur V1

- Dashboard dengan saldo saat ini, pemasukan/pengeluaran per periode, dan transaksi terbaru.
- Form pemasukan dan pengeluaran dengan validasi; sumber pemasukan dapat ditulis bebas.
- Riwayat gabungan yang dikelompokkan menurut tanggal serta hapus transaksi.
- Pilihan tema gelap atau terang melalui Pengaturan.
- Penyimpanan IndexedDB, dukungan offline, dan manifest PWA.

## Struktur

```text
css/       Tampilan dan design system
js/        UI, logika bisnis, utilitas tanggal, dan akses IndexedDB
assets/    Aset PWA
docs/      Dokumen produk dan implementasi
```

## Penyimpanan data

Data disimpan di IndexedDB bernama `NYANTET_DB` pada browser perangkat. Menghapus data situs/browser akan menghapus data aplikasi tersebut.
