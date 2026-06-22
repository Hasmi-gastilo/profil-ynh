# 🔧 Panduan Setup & Deploy — LPI Nurul Huda Kapedi

## 1. Setup Firebase

### Langkah 1: Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"** → Masukkan nama: `LPI Nurul Huda Kapedi`
3. Ikuti wizard setup → Klik **"Create project"**

### Langkah 2: Aktifkan Layanan Firebase

#### Authentication
1. Sidebar → **Build → Authentication** → **Get started**
2. Tab **Sign-in method** → Aktifkan **Email/Password**

#### Firestore Database
1. Sidebar → **Build → Firestore Database** → **Create database**
2. Pilih **"Start in test mode"** (akan diatur rules-nya nanti)
3. Pilih region terdekat: `asia-southeast2 (Jakarta)`

#### Storage
1. Sidebar → **Build → Storage** → **Get started**
2. Pilih **"Start in test mode"**

### Langkah 3: Ambil Konfigurasi Firebase

1. Sidebar → ⚙️ **Project Settings** → Tab **"Your apps"**
2. Klik ikon `</>` (Web app)
3. Masukkan nama app: `LPI Nurul Huda Web`
4. **Salin konfigurasi** yang muncul

### Langkah 4: Isi `assets/js/firebase-config.js`

```js
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "NAMA-PROJECT.firebaseapp.com",
  projectId: "NAMA-PROJECT",
  storageBucket: "NAMA-PROJECT.appspot.com",
  messagingSenderId: "NOMOR_SENDER",
  appId: "APP_ID_ANDA"
};

export default firebaseConfig;
```

---

## 2. Buat Akun Super Admin Pertama

### Di Firebase Console → Authentication:
1. Tab **"Users"** → **"Add user"**
2. Masukkan email dan password admin pertama
3. Salin **UID** user tersebut

### Di Firestore → Collections → `users`:
1. Klik **"Add document"**
2. **Document ID**: paste UID dari langkah di atas
3. Tambahkan fields:
   - `email` (string): email admin
   - `displayName` (string): nama admin
   - `role` (string): `superadmin`
   - `createdAt` (timestamp): waktu sekarang

---

## 3. Atur Firestore Security Rules

Di **Firestore → Rules**, ganti dengan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Fungsi helper: cek apakah user sudah login
    function isLoggedIn() {
      return request.auth != null;
    }

    // Fungsi helper: cek role admin
    function isAdmin() {
      return isLoggedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
    }

    function isSuperAdmin() {
      return isLoggedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin';
    }

    // Koleksi publik: bisa dibaca siapa saja
    match /banners/{id}   { allow read: if true; allow write: if isAdmin(); }
    match /berita/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /prestasi/{id}  { allow read: if true; allow write: if isAdmin(); }
    match /kegiatan/{id}  { allow read: if true; allow write: if isAdmin(); }
    match /galeri/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /faq/{id}       { allow read: if true; allow write: if isAdmin(); }
    match /ppdb/{id}      { allow read: if true; allow write: if isAdmin(); }
    match /profil/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /kontak/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /settings/{id}  { allow read: if true; allow write: if isAdmin(); }

    // Users: hanya super admin bisa baca/tulis
    match /users/{userId} {
      allow read: if isSuperAdmin() || request.auth.uid == userId;
      allow write: if isSuperAdmin();
    }
  }
}
```

---

## 4. Atur Storage Rules

Di **Storage → Rules**, ganti dengan:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read untuk semua file
    match /{allPaths=**} {
      allow read: if true;
      // Hanya user yang login sebagai admin yang bisa upload/hapus
      allow write: if request.auth != null;
    }
  }
}
```

---

## 5. Deploy ke GitHub Pages

### Langkah 1: Upload ke GitHub

```bash
# Di terminal / Git Bash, arahkan ke folder project
cd "d:/Doc. Hasmi/CobaWebsite/profil-YNH"

# Inisialisasi Git (jika belum)
git init
git add .
git commit -m "Initial commit: LPI Nurul Huda website"

# Push ke GitHub
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git branch -M main
git push -u origin main
```

### Langkah 2: Aktifkan GitHub Pages

1. Buka repository di GitHub
2. **Settings** → **Pages** (di sidebar kiri)
3. Source: pilih **"Deploy from a branch"**
4. Branch: **main** / folder: **/ (root)**
5. Klik **Save**

### Langkah 3: Tambahkan Domain GitHub ke Firebase Auth

1. Firebase Console → **Authentication** → **Settings**
2. Tab **"Authorized domains"**
3. Klik **"Add domain"**
4. Masukkan: `USERNAME.github.io`

### Langkah 4: Akses Website & Admin

- **Website Publik**: `https://USERNAME.github.io/NAMA-REPO/`
- **Panel Admin**: `https://USERNAME.github.io/NAMA-REPO/admin/`

---

## 6. Struktur Koleksi Firestore

| Koleksi | Keterangan |
|---------|-----------|
| `banners` | Slide banner homepage |
| `berita` | Artikel berita/informasi |
| `prestasi` | Data prestasi siswa |
| `kegiatan` | Agenda kegiatan sekolah |
| `galeri` | Foto galeri |
| `faq` | FAQ publik |
| `ppdb` → doc `info` | Informasi PPDB |
| `profil` → doc `sekolah` | Profil sekolah |
| `kontak` → doc `info` | Info kontak + sosmed |
| `settings` → doc `general` | Pengaturan website |
| `users` | Data akun admin |

---

## 7. Menambah Admin Baru

Setelah login sebagai **Super Admin**:
1. Buka Panel Admin → **Pengaturan** → Section **Manajemen Admin**
2. Klik **"Tambah Admin"**
3. Isi email, password, nama, dan role
4. Klik **"Buat Akun"**

---

## 8. Checklist Setelah Setup

- [ ] `firebase-config.js` sudah diisi dengan konfigurasi yang benar
- [ ] Akun super admin sudah dibuat di Firebase Auth + Firestore
- [ ] Firestore Rules sudah diatur dengan benar
- [ ] Storage Rules sudah diatur
- [ ] Domain GitHub Pages sudah ditambahkan di Firebase Auth
- [ ] Login berhasil di `/admin/login.html`
- [ ] Upload gambar banner berhasil
- [ ] Data tampil di halaman publik

---

*Dokumentasi ini dibuat otomatis. Versi: 1.0.0*
