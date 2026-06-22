// profil-admin.js
import { db } from '../firebase-init.js';
import { doc, getDoc, setDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initAdmin, renderSidebar, renderTopbar, showToast, uploadImageWithProgress } from './admin-app.js';

// Quill instances
const quills = {};

function initQuill(id) {
  quills[id] = new Quill(`#${id}`, {
    theme: 'snow',
    modules: { toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [2, 3, false] }],
      ['clean']
    ]}
  });
  return quills[id];
}

// Tabs
function initTabs() {
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).style.display = '';
    });
  });
}

async function loadProfil() {
  try {
    const snap = await getDoc(doc(db, 'profil', 'sekolah'));
    if (!snap.exists()) return;
    const d = snap.data();
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };

    set('schoolName', d.schoolName);
    set('foundedYear', d.foundedYear);
    set('principalName', d.principalName);
    set('principalRole', d.principalRole);
    set('principalMessage', d.principalMessage);
    set('principalPhotoUrl', d.principalPhoto);

    if (d.principalPhoto) {
      const prev = document.getElementById('principalPhotoPreview');
      prev.src = d.principalPhoto; 
      document.getElementById('principalPhotoPreviewWrap').style.display = 'block';
    }

    if (quills.historyEditor && d.history) quills.historyEditor.root.innerHTML = d.history;
    if (quills.visionEditor && d.vision) quills.visionEditor.root.innerHTML = d.vision;
    if (quills.missionEditor && d.mission) quills.missionEditor.root.innerHTML = d.mission;
    if (quills.goalsEditor && d.goals) quills.goalsEditor.root.innerHTML = d.goals;
    if (quills.programsEditor && d.programs) quills.programsEditor.root.innerHTML = d.programs;
    if (quills.valuesEditor && d.values) quills.valuesEditor.root.innerHTML = d.values;
    if (quills.descriptionEditor && d.description) quills.descriptionEditor.root.innerHTML = d.description;
  } catch (err) { showToast('Gagal memuat profil: ' + err.message, 'error'); }
}

async function saveProfil() {
  const btn = document.getElementById('saveProfil');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

  try {
    let principalPhoto = document.getElementById('principalPhotoUrl').value;
    const photoFile = document.getElementById('principalPhotoFile').files[0];
    if (photoFile) {
      document.getElementById('principalPhotoProgress').style.display = '';
      principalPhoto = await uploadImageWithProgress(photoFile, 'profile', pct => {
        document.getElementById('principalPhotoBar').style.width = pct + '%';
      });
    }

    const data = {
      schoolName: document.getElementById('schoolName').value.trim(),
      foundedYear: document.getElementById('foundedYear').value.trim(),
      principalName: document.getElementById('principalName').value.trim(),
      principalRole: document.getElementById('principalRole').value.trim(),
      principalMessage: document.getElementById('principalMessage').value.trim(),
      principalPhoto,
      history:     quills.historyEditor?.root.innerHTML || '',
      vision:      quills.visionEditor?.root.innerHTML || '',
      mission:     quills.missionEditor?.root.innerHTML || '',
      goals:       quills.goalsEditor?.root.innerHTML || '',
      programs:    quills.programsEditor?.root.innerHTML || '',
      values:      quills.valuesEditor?.root.innerHTML || '',
      description: quills.descriptionEditor?.root.innerHTML || '',
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'profil', 'sekolah'), data, { merge: true });
    showToast('Profil berhasil disimpan!');
  } catch (err) {
    showToast('Gagal menyimpan: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('adminSidebarSlot').innerHTML = renderSidebar('profil');
  document.getElementById('adminTopbarSlot').innerHTML = renderTopbar('Profil Sekolah');
  await initAdmin('profil');

  initTabs();
  initQuill('historyEditor');
  initQuill('visionEditor');
  initQuill('missionEditor');
  initQuill('goalsEditor');
  initQuill('programsEditor');
  initQuill('valuesEditor');
  initQuill('descriptionEditor');

  document.getElementById('principalPhotoFile').addEventListener('change', e => {
    const f = e.target.files[0];
    if (f) { 
      const r = new FileReader(); 
      r.onload = ev => { 
        const p = document.getElementById('principalPhotoPreview'); 
        p.src = ev.target.result; 
        document.getElementById('principalPhotoPreviewWrap').style.display = 'block'; 
      }; 
      r.readAsDataURL(f); 
    }
  });

  document.getElementById('removePrincipalPhoto').addEventListener('click', () => {
    document.getElementById('principalPhotoPreview').src = '';
    document.getElementById('principalPhotoPreviewWrap').style.display = 'none';
    document.getElementById('principalPhotoFile').value = '';
    document.getElementById('principalPhotoUrl').value = '';
  });

  document.getElementById('saveProfil').addEventListener('click', saveProfil);
  await loadProfil();
});
