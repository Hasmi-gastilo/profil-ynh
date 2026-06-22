// admin-login.js
import { auth, db } from '../firebase-init.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

function showToast(msg, type = 'error') {
  const container = document.getElementById('toastContainer');
  const icons = { error: '❌', success: '✅', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `<span class="admin-toast-icon">${icons[type]}</span><span class="admin-toast-text">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '300ms'; setTimeout(() => toast.remove(), 300); }, 4000);
}

function showError(msg) {
  const errBox = document.getElementById('loginError');
  const errMsg = document.getElementById('loginErrorMsg');
  if (errBox && errMsg) { errMsg.textContent = msg; errBox.style.display = 'flex'; }
}

function hideError() {
  const errBox = document.getElementById('loginError');
  if (errBox) errBox.style.display = 'none';
}

// If already logged in, redirect to dashboard
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().role) {
        window.location.href = 'dashboard.html';
      }
    } catch {}
  }
});

// Toggle password visibility
document.getElementById('togglePassword')?.addEventListener('click', () => {
  const input = document.getElementById('loginPassword');
  const icon = document.querySelector('#togglePassword i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
});

// Login form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');

  if (!email || !password) { showError('Mohon isi email dan kata sandi.'); return; }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Memuat...</span>';

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Check role
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (!snap.exists() || !snap.data().role) {
      await auth.signOut();
      showError('Akun ini tidak memiliki akses admin. Hubungi Super Admin.');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Masuk</span>';
      return;
    }

    showToast('Login berhasil! Mengalihkan...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Masuk</span>';

    const errorMessages = {
      'auth/user-not-found': 'Email tidak terdaftar.',
      'auth/wrong-password': 'Kata sandi salah.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
      'auth/network-request-failed': 'Koneksi gagal. Periksa internet Anda.',
      'auth/invalid-credential': 'Email atau kata sandi salah.',
    };
    showError(errorMessages[err.code] || `Error: ${err.message}`);
  }
});
