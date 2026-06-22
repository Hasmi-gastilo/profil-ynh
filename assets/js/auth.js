// ============================================================
// auth.js — Firebase Authentication Helpers
// ============================================================

import { auth, db } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// ── GET USER ROLE FROM FIRESTORE ───────────────────────────
export async function getUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data().role || 'admin';
  } catch (err) {
    console.error('Error fetching user role:', err);
  }
  return null;
}

// ── LOGIN ──────────────────────────────────────────────────
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole(cred.user.uid);
  if (!role) {
    await signOut(auth);
    throw new Error('Akun ini tidak memiliki akses admin. Hubungi Super Admin.');
  }
  return { user: cred.user, role };
}

// ── LOGOUT ─────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
  window.location.href = '../admin/login.html';
}

// ── AUTH GUARD (for admin pages) ───────────────────────────
// Call this at the top of every admin page script.
// Resolves with { user, role } or redirects to login.
export function requireAuth(redirectPath = '../admin/login.html') {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (!user) {
        window.location.href = redirectPath;
        return;
      }
      const role = await getUserRole(user.uid);
      if (!role) {
        await signOut(auth);
        window.location.href = redirectPath;
        return;
      }
      resolve({ user, role });
    });
  });
}

// ── REQUIRE SUPER ADMIN ────────────────────────────────────
export async function requireSuperAdmin(redirectPath = '../admin/dashboard.html') {
  const { user, role } = await requireAuth();
  if (role !== 'superadmin') {
    alert('Halaman ini hanya untuk Super Admin.');
    window.location.href = redirectPath;
    return null;
  }
  return { user, role };
}

// ── GET CURRENT USER ───────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}

// ── ON AUTH CHANGE ─────────────────────────────────────────
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth };
