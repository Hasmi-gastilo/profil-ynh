// kontak-admin.js
import { db } from '../firebase-init.js';
import { doc, getDoc, setDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast } from './admin-app.js';

async function load() {
  try {
    const snap = await getDoc(doc(db, 'kontak', 'info'));
    if (!snap.exists()) return;
    const d = snap.data();
    const set = (id, val) => { const el = document.getElementById(id); if(el&&val) el.value=val; };
    set('kAddress', d.address); set('kPhone', d.phone); set('kWhatsapp', d.whatsapp);
    set('kEmail', d.email); set('kMapsEmbed', d.googleMapsEmbed || d.googleMapsUrl);
    set('smFacebook', d.facebook); set('smInstagram', d.instagram); set('smTiktok', d.tiktok);
    set('smYoutube', d.youtube); set('smTwitter', d.twitter);
  } catch (err) { showToast('Gagal memuat: '+err.message, 'error'); }
}

async function save() {
  const btn = document.getElementById('saveKontak');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
  try {
    await setDoc(doc(db, 'kontak', 'info'), {
      address: document.getElementById('kAddress').value.trim(),
      phone: document.getElementById('kPhone').value.trim(),
      whatsapp: document.getElementById('kWhatsapp').value.trim(),
      email: document.getElementById('kEmail').value.trim(),
      googleMapsEmbed: document.getElementById('kMapsEmbed').value.trim(),
      facebook: document.getElementById('smFacebook').value.trim(),
      instagram: document.getElementById('smInstagram').value.trim(),
      tiktok: document.getElementById('smTiktok').value.trim(),
      youtube: document.getElementById('smYoutube').value.trim(),
      twitter: document.getElementById('smTwitter').value.trim(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    showToast('Kontak & media sosial disimpan!');
  } catch (err) { showToast('Gagal: '+err.message, 'error'); }
  finally { btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> Simpan Perubahan'; }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('kontak');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Kontak & Sosmed');
  await initAdmin('kontak');
  document.getElementById('saveKontak').onclick = save;
  await load();
});
