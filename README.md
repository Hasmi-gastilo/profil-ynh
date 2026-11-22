# 🕌 Website Profil LPI Nurul Huda Kapedi

Website profil sekolah modern untuk **Yayasan Pendidikan Islam Nurul Huda Kapedi** — dibangun dengan HTML, CSS, JavaScript ES6, dan Firebase.

## 🚀 Demo

Setelah deploy: `https://USERNAME.github.io/NAMA-REPO/`

## Fitur

### Website Publik
- 🤖 **AI Assistant (Chatbot RAG)** — Asisten informasi digital interaktif di pojok kanan bawah yang ditenagai Retrieval-Augmented Generation (RAG) berbasis data resmi lembaga dan Firebase.
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
| AI / LLM | Google Gemini 2.0 Flash / OpenAI (RAG Engine) |
| Backend Server | Node.js (HTTP / Serverless API) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Hosting | GitHub Pages / Vercel / Node Server |
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
├── server.js               ← Server lokal & backend AI endpoint
├── package.json            ← Skrip npm start & info proyek
├── .env.example            ← Template API Key AI
├── api/
│   ├── chat.js             ← API endpoint /api/chat
│   └── rag.js              ← Retrieval-Augmented Generation engine
├── data/
│   └── knowledge-base.json ← Basis pengetahuan terstruktur LPI Nurul Huda
├── admin/                  ← Panel Admin (hidden)
│   ├── login.html
│   ├── dashboard.html
│   └── ...
└── assets/
    ├── css/
    │   ├── style.css       ← Stylesheet publik
    │   ├── chatbot.css     ← Stylesheet AI Assistant
    │   └── admin.css       ← Stylesheet admin
    └── js/
        ├── chatbot.js      ← Controller AI Assistant
        ├── app.js          ← Shared utilities publik
        └── ...
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
