// pengaturan-admin.js
import { auth, db } from '../firebase-init.js';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { createUserWithEmailAndPassword, updateProfile }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, confirmDelete, uploadImageWithProgress } from './admin-app.js';

let currentRole = '';

// General settings
async function loadSettings() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'general'));
    if (!snap.exists()) return;
    const d = snap.data();
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    set('siteName', d.siteName); set('siteShortName', d.siteShortName);
    set('siteTagline', d.tagline); set('siteMetaDesc', d.metaDescription);
    if (d.primaryColor) {
      document.getElementById('primaryColor').value = d.primaryColor;
      document.getElementById('primaryColorHex').value = d.primaryColor;
    }
    if (d.logoUrl) { document.getElementById('logoUrl').value = d.logoUrl; document.getElementById('currentLogoPreview').src = d.logoUrl; }
  } catch (err) { console.warn(err.message); }
}

async function saveSettings() {
  const btn = document.getElementById('saveSetting');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
  try {
    let logoUrl = document.getElementById('logoUrl').value;
    const logoFile = document.getElementById('logoFile').files[0];
    if (logoFile) {
      document.getElementById('logoProgress').style.display = '';
      logoUrl = await uploadImageWithProgress(logoFile, 'settings', pct => {
        document.getElementById('logoProgressBar').style.width = pct + '%';
      });
    }

    await setDoc(doc(db, 'settings', 'general'), {
      siteName: document.getElementById('siteName').value.trim(),
      siteShortName: document.getElementById('siteShortName').value.trim(),
      tagline: document.getElementById('siteTagline').value.trim(),
      metaDescription: document.getElementById('siteMetaDesc').value.trim(),
      primaryColor: document.getElementById('primaryColorHex').value.trim() || document.getElementById('primaryColor').value,
      logoUrl,
      updatedAt: serverTimestamp()
    }, { merge: true });
    showToast('Pengaturan berhasil disimpan!');
  } catch (err) { showToast('Gagal: ' + err.message, 'error'); }
  finally { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Simpan Pengaturan'; }
}

// Users
async function loadUsers() {
  const tbody = document.getElementById('usersTable');
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;">Belum ada data admin.</td></tr>`; return; }
    tbody.innerHTML = snap.docs.map(d => {
      const u = d.data();
      return `<tr>
        <td style="font-size:0.85rem;">${u.email || '-'}</td>
        <td style="font-size:0.85rem;">${u.displayName || '-'}</td>
        <td><span class="badge ${u.role==='superadmin'?'badge-danger':'badge-primary'}">${u.role==='superadmin'?'Super Admin':'Website Admin'}</span></td>
        <td><div class="action-btns">
          ${currentRole === 'superadmin' ? `<button class="action-btn delete" onclick="delUser('${d.id}')" title="Hapus"><i class="fas fa-trash"></i></button>` : '-'}
        </div></td>
      </tr>`;
    }).join('');
  } catch (err) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Gagal: ${err.message}</td></tr>`; }
}

window.delUser = async (uid) => {
  const ok = await confirmDelete('Hapus akun admin ini?', 'Akun tidak akan bisa login lagi.');
  if (!ok) return;
  try { await deleteDoc(doc(db, 'users', uid)); showToast('Akun dihapus dari database'); await loadUsers(); }
  catch (err) { showToast(err.message, 'error'); }
};

async function createNewUser() {
  const name = document.getElementById('newUserName').value.trim();
  const email = document.getElementById('newUserEmail').value.trim();
  const pwd = document.getElementById('newUserPwd').value;
  const role = document.getElementById('newUserRole').value;
  if (!email || !pwd) { showToast('Email dan password wajib diisi', 'error'); return; }
  if (pwd.length < 6) { showToast('Password minimal 6 karakter', 'error'); return; }
  const btn = document.getElementById('createUser'); btn.disabled = true;
  try {
    // Create user in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, pwd);
    if (name) await updateProfile(cred.user, { displayName: name });
    // Save user data in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      email, displayName: name, role, createdAt: serverTimestamp()
    });
    showToast('Admin berhasil dibuat!');
    document.getElementById('userModal').classList.remove('open');
    await loadUsers();
  } catch (err) {
    const msgs = { 'auth/email-already-in-use': 'Email sudah digunakan.', 'auth/weak-password': 'Password terlalu lemah.' };
    showToast(msgs[err.code] || err.message, 'error');
  }
  finally { btn.disabled = false; }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('pengaturan');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Pengaturan Website');
  const { role } = await initAdmin('pengaturan');
  currentRole = role;

  // Hide user management for non-super admin
  if (role !== 'superadmin') {
    document.getElementById('userManagementCard').style.display = 'none';
  }

  document.getElementById('saveSetting').onclick = saveSettings;
  document.getElementById('primaryColor').oninput = e => { document.getElementById('primaryColorHex').value = e.target.value; };
  document.getElementById('primaryColorHex').oninput = e => {
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) document.getElementById('primaryColor').value = e.target.value;
  };
  document.getElementById('logoFile').onchange = e => {
    const f = e.target.files[0];
    if (f) { const r = new FileReader(); r.onload = ev => { document.getElementById('currentLogoPreview').src = ev.target.result; }; r.readAsDataURL(f); }
  };
  document.getElementById('btnAddUser').onclick = () => document.getElementById('userModal').classList.add('open');
  document.getElementById('closeUserModal').onclick = () => document.getElementById('userModal').classList.remove('open');
  document.getElementById('cancelUserModal').onclick = () => document.getElementById('userModal').classList.remove('open');
  document.getElementById('createUser').onclick = createNewUser;

  await loadSettings();
  if (role === 'superadmin') await loadUsers();
});
