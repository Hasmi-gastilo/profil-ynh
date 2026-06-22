// admin-app.js — Shared Admin Logic: Sidebar, Auth Guard, Toast, Utilities
import { auth, db } from '../firebase-init.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ── AUTH GUARD ─────────────────────────────────────────────
export function requireAdminAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) { window.location.href = 'login.html'; return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!snap.exists() || !snap.data().role) { await signOut(auth); window.location.href = 'login.html'; return; }
        resolve({ user, role: snap.data().role, userData: snap.data() });
      } catch {
        window.location.href = 'login.html';
      }
    });
  });
}

// ── SIDEBAR HTML ───────────────────────────────────────────
export function renderSidebar(activePage = '') {
  const links = [
    { id: 'dashboard', href: 'dashboard.html', icon: 'fas fa-th-large', label: 'Dashboard' },
    { id: 'banner', href: 'banner.html', icon: 'fas fa-image', label: 'Banner Homepage', section: 'Konten' },
    { id: 'profil', href: 'profil.html', icon: 'fas fa-school', label: 'Profil Sekolah' },
    { id: 'berita', href: 'berita.html', icon: 'fas fa-newspaper', label: 'Berita' },
    { id: 'prestasi', href: 'prestasi.html', icon: 'fas fa-trophy', label: 'Prestasi' },
    { id: 'kegiatan', href: 'kegiatan.html', icon: 'fas fa-calendar-alt', label: 'Kegiatan' },
    { id: 'galeri', href: 'galeri.html', icon: 'fas fa-images', label: 'Galeri' },
    { id: 'ppdb', href: 'ppdb.html', icon: 'fas fa-user-plus', label: 'PPDB', section: 'Lainnya' },
    { id: 'faq', href: 'faq.html', icon: 'fas fa-question-circle', label: 'FAQ' },
    { id: 'kontak', href: 'kontak.html', icon: 'fas fa-phone', label: 'Kontak' },
    { id: 'sosmed', href: 'sosmed.html', icon: 'fas fa-share-alt', label: 'Media Sosial', section: 'Pengaturan' },
    { id: 'media', href: 'media-library.html', icon: 'fas fa-folder-open', label: 'Media Library' },
    { id: 'pengaturan', href: 'pengaturan.html', icon: 'fas fa-cog', label: 'Pengaturan' },
  ];

  let html = '';
  let lastSection = '';

  links.forEach(link => {
    if (link.section && link.section !== lastSection) {
      html += `<div class="sidebar-section-label">${link.section}</div>`;
      lastSection = link.section;
    }
    if (!link.section && lastSection === '') {
      html += `<div class="sidebar-section-label">Menu</div>`;
      lastSection = 'Menu';
    }
    html += `
      <a href="${link.href}" class="sidebar-link${activePage === link.id ? ' active' : ''}" id="sidelink-${link.id}">
        <i class="${link.icon}"></i>
        <span class="sidebar-link-text">${link.label}</span>
      </a>`;
  });

  return `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="sidebar-logo">
        <img src="../assets/images/logo.png" alt="Logo" />
        <div class="sidebar-logo-text">
          <div class="sidebar-school-name">LPI Nurul Huda</div>
          <div class="sidebar-tagline">Admin Panel</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-section">${html}</div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-user-avatar" id="sidebarAvatar">A</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name" id="sidebarUserName">Admin</div>
            <div class="sidebar-user-role" id="sidebarUserRole">-</div>
          </div>
        </div>
        <button class="sidebar-logout" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i>
          <span class="sidebar-link-text">Keluar</span>
        </button>
      </div>
    </aside>`;
}

// ── TOPBAR HTML ────────────────────────────────────────────
export function renderTopbar(title = 'Dashboard') {
  return `
    <header class="admin-topbar">
      <button class="topbar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
        <i class="fas fa-bars"></i>
      </button>
      <div class="topbar-breadcrumb">
        <span>Admin</span>
        <i class="fas fa-chevron-right" style="font-size:0.65rem;"></i>
        <strong>${title}</strong>
      </div>
      <div class="topbar-actions">
        <button class="topbar-btn" id="adminDarkToggle" aria-label="Toggle dark mode">
          <i class="fas fa-moon"></i>
        </button>
        <a href="../index.html" target="_blank" class="topbar-view-site">
          <i class="fas fa-external-link-alt"></i> Lihat Website
        </a>
      </div>
    </header>`;
}

// ── TOAST ──────────────────────────────────────────────────
export function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('adminToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
    container.id = 'adminToastContainer';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `<span class="admin-toast-icon">${icons[type] || icons.info}</span><span class="admin-toast-text">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '300ms'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── CONFIRM DIALOG ─────────────────────────────────────────
export function confirmDelete(title = 'Hapus item ini?', desc = 'Tindakan ini tidak dapat dibatalkan.') {
  return new Promise((resolve) => {
    let overlay = document.getElementById('confirmOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'confirmOverlay';
      overlay.className = 'admin-modal-overlay';
      overlay.innerHTML = `
        <div class="admin-modal" style="max-width:420px;">
          <div class="confirm-dialog">
            <div class="confirm-icon"><i class="fas fa-trash"></i></div>
            <div class="confirm-title" id="confirmTitle"></div>
            <div class="confirm-desc" id="confirmDesc"></div>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;">
              <button class="btn-admin btn-admin-outline" id="confirmCancel">Batal</button>
              <button class="btn-admin btn-admin-danger" id="confirmOk">Ya, Hapus</button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmDesc').textContent = desc;
    overlay.classList.add('open');

    const ok = document.getElementById('confirmOk');
    const cancel = document.getElementById('confirmCancel');
    const close = () => { overlay.classList.remove('open'); };

    ok.onclick = () => { close(); resolve(true); };
    cancel.onclick = () => { close(); resolve(false); };
    overlay.onclick = (e) => { if (e.target === overlay) { close(); resolve(false); } };
  });
}

// ── FORMAT DATE ────────────────────────────────────────────
export function formatDate(date) {
  if (!date) return '-';
  let d = date;
  if (date?.toDate) d = date.toDate();
  if (typeof date === 'string') d = new Date(date);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── DARK MODE ──────────────────────────────────────────────
function initDarkMode() {
  const btn = document.getElementById('adminDarkToggle');
  const pref = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let dark = pref;
  const apply = (d) => {
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
    if (btn) btn.querySelector('i').className = d ? 'fas fa-sun' : 'fas fa-moon';
  };
  apply(dark);
  btn?.addEventListener('click', () => { dark = !dark; apply(dark); });
}

// ── SIDEBAR TOGGLE ─────────────────────────────────────────
function initSidebar() {
  const sidebar = document.getElementById('adminSidebar');
  const toggle = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');
  if (!toggle || !sidebar) return;

  let isCollapsed = window.innerWidth < 1200;
  
  const apply = () => {
    if (window.innerWidth >= 768) {
      sidebar.classList.toggle('collapsed', isCollapsed);
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('show');
    } else {
      sidebar.classList.toggle('mobile-open', !isCollapsed);
      if (overlay) overlay.classList.toggle('show', !isCollapsed);
    }
  };

  apply();

  toggle.addEventListener('click', () => { 
    isCollapsed = !isCollapsed; 
    apply(); 
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      isCollapsed = true;
      apply();
    });
  }

  // Mobile: close on link click
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        isCollapsed = true;
        apply();
      }
    });
  });

  // Mobile overlay toggle on resize
  window.addEventListener('resize', () => {
    const wasMobile = window.innerWidth < 768;
    apply();
  });
}

// ── LOGOUT ─────────────────────────────────────────────────
function initLogout() {
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try { await signOut(auth); window.location.href = 'login.html'; } catch (err) { showToast('Gagal logout: ' + err.message, 'error'); }
  });
}

// ── UPLOAD AREA UI HANDLER ─────────────────────────────────
function initUploadAreas() {
  document.querySelectorAll('.upload-area').forEach(area => {
    const input = area.querySelector('input[type="file"]');
    const textEl = area.querySelector('.upload-text');
    const defaultText = textEl ? textEl.textContent : 'Klik atau seret foto ke sini';

    if (!input) return;

    // Visual feedback on drag
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      area.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      area.addEventListener(eventName, () => area.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      area.addEventListener(eventName, () => area.classList.remove('dragover'), false);
    });

    // Handle file drop & change
    area.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length) {
        input.files = files; // Assign files to input
        input.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
      }
    }, false);

    input.addEventListener('change', (e) => {
      if (input.files.length && textEl) {
        textEl.textContent = input.files[0].name;
      } else if (textEl) {
        textEl.textContent = defaultText;
      }
    });
  });
}

// ── INIT ADMIN ─────────────────────────────────────────────
export async function initAdmin(pageName = '') {
  const { user, role, userData } = await requireAdminAuth();

  // Update sidebar user info
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarAvatar');

  const displayName = userData?.displayName || user.email?.split('@')[0] || 'Admin';
  if (nameEl) nameEl.textContent = displayName;
  if (roleEl) roleEl.textContent = role === 'superadmin' ? 'Super Admin' : 'Website Admin';
  if (avatarEl) avatarEl.textContent = displayName[0].toUpperCase();

  initDarkMode();
  initSidebar();
  initLogout();
  initUploadAreas();

  return { user, role };
}


// ── IMAGE UPLOAD — ImgBB (Gratis, tanpa Firebase Storage) ──
// ImgBB API Key — daftar gratis di https://api.imgbb.com/
// Ganti nilai di bawah ini dengan API key Anda setelah daftar
const IMGBB_API_KEY = 'e51d9af75f1beb8c2d2581d964e9bdd9';

/**
 * Upload gambar ke ImgBB
 * @param {File} file - File gambar
 * @param {string} folder - Tidak dipakai (untuk kompatibilitas)
 * @param {Function|null} progressCallback - Callback progress (0-100)
 * @returns {Promise<string>} URL gambar yang di-upload
 */
export async function uploadImageWithProgress(file, folder = 'general', progressCallback = null) {
  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    throw new Error('File harus berupa gambar (JPG, PNG, WEBP, GIF)');
  }
  // Validasi ukuran file (maks 32MB untuk ImgBB)
  if (file.size > 32 * 1024 * 1024) {
    throw new Error('Ukuran gambar maksimal 32MB');
  }

  if (progressCallback) progressCallback(10);

  // Konversi ke base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  if (progressCallback) progressCallback(40);

  // Upload ke ImgBB
  const formData = new FormData();
  formData.append('image', base64);
  formData.append('name', `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (progressCallback) progressCallback(90);

  if (!response.ok) {
    throw new Error(`Upload gagal: HTTP ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    // Jika API key belum diisi, berikan pesan yang jelas
    if (IMGBB_API_KEY === 'GANTI_DENGAN_IMGBB_API_KEY') {
      throw new Error('ImgBB API Key belum diisi! Buka file admin-app.js dan isi IMGBB_API_KEY dengan key dari https://api.imgbb.com/');
    }
    throw new Error(`ImgBB error: ${result.error?.message || 'Upload gagal'}`);
  }

  if (progressCallback) progressCallback(100);

  // Kembalikan URL display (permanent)
  return result.data.display_url || result.data.url;
}

/**
 * Upload gambar (alias tanpa progress)
 */
export async function uploadImage(file, folder = 'general') {
  return uploadImageWithProgress(file, folder, null);
}

/**
 * Hapus gambar dari ImgBB — ImgBB gratis tidak support delete via API
 * Fungsi ini hanya no-op untuk kompatibilitas
 */
export async function deleteImageFromStorage(url) {
  // ImgBB free plan tidak support delete via API
  // Gambar akan tetap ada di ImgBB — tidak masalah untuk website sekolah
  console.info('deleteImageFromStorage: ImgBB tidak support delete via API, diabaikan.');
}

// ── SLUGIFY ────────────────────────────────────────────────
export function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}
