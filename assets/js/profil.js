// profil.js
import { db } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp } from './app.js';

async function loadProfil() {
  try {
    const snap = await getDoc(doc(db, 'profil', 'sekolah'));
    if (!snap.exists()) return;
    const d = snap.data();

    const setHtml = (id, html) => {
      const el = document.getElementById(id);
      if (el && html) el.innerHTML = html;
    };
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.textContent = val;
    };

    setHtml('historyContent',   d.history     || 'Data sejarah belum tersedia.');
    setHtml('deskripsiContent', d.description || 'Data deskripsi belum tersedia.');
    setHtml('visiContent',      d.vision      || 'Data visi belum tersedia.');
    setHtml('misiContent',      d.mission     || 'Data misi belum tersedia.');
    setHtml('tujuanContent',    d.goals       || 'Data tujuan belum tersedia.');
    setHtml('nilaiContent',     d.values      || 'Data nilai belum tersedia.');
    setHtml('programContent',   d.programs    || 'Data program belum tersedia.');

    setText('foundedYear',   d.foundedYear ? `Berdiri Tahun ${d.foundedYear}` : '');
    setText('principalName', d.principalName || '-');
    setText('principalRole', d.principalRole || 'Kepala Yayasan');
    setHtml('principalQuote', `"${d.principalMessage || 'Pesan kepala yayasan belum tersedia.'}"`);

    if (d.principalPhoto) {
      const wrap = document.getElementById('principalImgWrap');
      if (wrap) {
        const img = document.createElement('img');
        img.className = 'principal-img';
        img.src = d.principalPhoto;
        img.alt = d.principalName || 'Kepala Yayasan';
        wrap.replaceWith(img);
      }
    }
  } catch (err) {
    console.warn('Could not load profil:', err.message);
  }
}

async function init() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  await initApp();
  await loadProfil();
}

document.addEventListener('DOMContentLoaded', init);
