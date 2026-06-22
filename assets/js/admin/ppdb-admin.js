// ppdb-admin.js
import { db } from '../firebase-init.js';
import { doc, getDoc, setDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast } from './admin-app.js';

const quillOpts = { theme:'snow', modules:{ toolbar:[['bold','italic','underline'],[{list:'ordered'},{list:'bullet'}],[{header:[2,3,false]}],['clean']] } };
let schedQ, reqQ, feesQ;

async function load() {
  try {
    const snap = await getDoc(doc(db, 'ppdb', 'info'));
    if (!snap.exists()) return;
    const d = snap.data();
    const set = (id, val) => { const el = document.getElementById(id); if(el&&val) el.value=val; };
    set('ppdbBannerTitle', d.bannerTitle);
    set('ppdbStatus', d.status);
    set('ppdbAnnouncement', d.announcement);
    set('ppdbDesc', d.description);
    set('ppdbRegLink', d.registrationLink);
    set('ppdbBrochure', d.brochureUrl);
    if (schedQ && d.schedule) schedQ.root.innerHTML = d.schedule;
    if (reqQ   && d.requirements) reqQ.root.innerHTML = d.requirements;
    if (feesQ  && d.fees) feesQ.root.innerHTML = d.fees;
  } catch (err) { showToast('Gagal memuat: '+err.message, 'error'); }
}

async function save() {
  const btn = document.getElementById('savePpdb');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
  try {
    await setDoc(doc(db, 'ppdb', 'info'), {
      bannerTitle: document.getElementById('ppdbBannerTitle').value.trim(),
      status: document.getElementById('ppdbStatus').value,
      announcement: document.getElementById('ppdbAnnouncement').value.trim(),
      description: document.getElementById('ppdbDesc').value.trim(),
      registrationLink: document.getElementById('ppdbRegLink').value.trim(),
      brochureUrl: document.getElementById('ppdbBrochure').value.trim(),
      schedule: schedQ?.root.innerHTML || '',
      requirements: reqQ?.root.innerHTML || '',
      fees: feesQ?.root.innerHTML || '',
      updatedAt: serverTimestamp()
    }, { merge: true });
    showToast('PPDB berhasil disimpan!');
  } catch (err) { showToast('Gagal: '+err.message, 'error'); }
  finally { btn.disabled=false; btn.innerHTML='<i class="fas fa-save"></i> Simpan Perubahan'; }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('ppdb');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Manajemen PPDB');
  await initAdmin('ppdb');
  schedQ = new Quill('#scheduleEditor', quillOpts);
  reqQ   = new Quill('#requirementsEditor', quillOpts);
  feesQ  = new Quill('#feesEditor', quillOpts);
  document.getElementById('savePpdb').onclick = save;
  await load();
});
