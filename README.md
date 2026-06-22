# 🕌 Website Profil LPI Nurul Huda Kapedi

Website profil sekolah modern untuk **Yayasan Pendidikan Islam Nurul Huda Kapedi** — dibangun dengan HTML, CSS, JavaScript ES6, dan Firebase.

## 🚀 Demo

Setelah deploy: `https://USERNAME.github.io/NAMA-REPO/`

## Fitur

### Website Publik
- 🏠 **Beranda** — Hero slider dinamis, statistik, berita terbaru, prestasi, galeri
- 🏫 **Profil** — Sejarah, visi-misi, pesan kepala yayasan
- 📰 **Berita** — Artikel dengan filter kategori, search, pagination
- 🏆 **Prestasi** — Showcase prestasi siswa
- 🖼️ **Galeri** — Foto kegiatan dengan lightbox
- 📝 **PPDB** — Info pendaftaran, jadwal, persyaratan
- ❓ **FAQ** — Accordion pertanyaan umum
- 📞 **Kontak** — Info kontak, peta Google Maps, media sosial

### Panel Admin (tersembunyi di `/admin/`)
- 🔐 Login dengan Firebase Authentication
- 📊 Dashboard statistik real-time
- ✏️ CRUD lengkap untuk semua konten
- 🖼️ Upload gambar ke Firebase Storage
- 👥 Manajemen user admin
- 🌙 Dark mode support

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | HTML5, CSS3 (Vanilla), JavaScript ES6 Modules |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Hosting | GitHub Pages |
| Icons | Font Awesome 6 |
| Fonts | Plus Jakarta Sans, Amiri |
| Rich Text | Quill.js (Admin only) |

## 📁 Struktur Folder

```
profil-YNH/
├── index.html              ← Halaman Beranda
├── profil.html             ← Profil Sekolah
├── berita.html             ← Daftar Berita
├── berita-detail.html      ← Detail Artikel
├── prestasi.html           ← Prestasi Siswa
├── galeri.html             ← Galeri Foto
├── ppdb.html               ← Info PPDB
├── faq.html                ← FAQ
├── kontak.html             ← Kontak
├── 404.html                ← Halaman 404
├── .nojekyll               ← GitHub Pages config
├── SETUP.md                ← Panduan setup Firebase
├── admin/                  ← Panel Admin (hidden)
│   ├── login.html
│   ├── dashboard.html
│   ├── banner.html
│   ├── profil.html
│   ├── berita.html
│   ├── berita-form.html
│   ├── prestasi.html
│   ├── kegiatan.html
│   ├── galeri.html
│   ├── ppdb.html
│   ├── faq.html
│   ├── kontak.html
│   ├── media-library.html
│   └── pengaturan.html
└── assets/
    ├── css/
    │   ├── style.css       ← Stylesheet publik
    │   └── admin.css       ← Stylesheet admin
    ├── images/
    │   └── logo.png        ← Logo sekolah
    └── js/
        ├── firebase-config.js  ← ⚠️ ISI KONFIGURASI FIREBASE DI SINI
        ├── firebase-init.js
        ├── app.js              ← Shared utilities publik
        ├── home.js
        ├── profil.js
        ├── berita.js
        ├── prestasi.js
        ├── galeri.js
        ├── ppdb.js
        ├── faq.js
        ├── kontak.js
        └── admin/
            ├── admin-app.js    ← Shared utilities admin
            ├── admin-login.js
            ├── dashboard.js
            ├── banner-admin.js
            └── ... (semua modul admin)
```

## ⚡ Quick Start

### 1. Isi Firebase Config

Edit `assets/js/firebase-config.js`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
export default firebaseConfig;
```

### 2. Buat Akun Admin Pertama

Di Firebase Console → Authentication → Add User, lalu tambahkan dokumen di Firestore `users/{uid}` dengan field `role: "superadmin"`.

### 3. Deploy ke GitHub Pages

Upload ke GitHub repo, aktifkan GitHub Pages dari Settings → Pages.

> 📖 Lihat **[SETUP.md](SETUP.md)** untuk panduan lengkap.

## 🔒 Keamanan

- Admin panel tidak tampil di navigasi publik
- Auth guard di setiap halaman admin
- Firestore rules membatasi akses read/write berdasarkan role
- Storage rules: upload hanya untuk user terautentikasi

## 📄 Lisensi

© 2025 Yayasan Pendidikan Islam Nurul Huda Kapedi. Hak Cipta Dilindungi.
