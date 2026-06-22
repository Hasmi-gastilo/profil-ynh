// ppdb.js
import { db } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { initApp } from './app.js';

async function loadPpdb() {
  try {
    const snap = await getDoc(doc(db, 'ppdb', 'info'));
    if (!snap.exists()) return;
    const d = snap.data();
    const setHtml = (id, val) => { const el = document.getElementById(id); if (el && val) el.innerHTML = val; };
    const setText = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };

    setText('ppdbDesc', d.description || '');

    // Announcement
    if (d.announcement) {
      document.getElementById('ppdbAnnouncementWrap').style.display = '';
      setText('ppdbAnnouncement', d.announcement);
    }

    // Registration link
    if (d.registrationLink) {
      const link = document.getElementById('ppdbRegLink');
      link.href = d.registrationLink;
      link.style.display = '';
    }

    // Brochure
    if (d.brochureUrl) {
      const br = document.getElementById('ppdbBrochure');
      br.href = d.brochureUrl;
      br.style.display = '';
    }

    // Schedule
    if (d.schedule) {
      setHtml('ppdbSchedule', d.schedule);
    } else if (Array.isArray(d.scheduleItems)) {
      document.getElementById('ppdbSchedule').innerHTML = d.scheduleItems.map(s => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-date">${s.date || ''}</div>
          <div class="timeline-title">${s.title || ''}</div>
          ${s.desc ? `<div class="timeline-desc">${s.desc}</div>` : ''}
        </div>
      `).join('');
    }

    // Requirements
    setHtml('ppdbRequirements', d.requirements || 'Informasi persyaratan belum tersedia.');

    // Fees
    setHtml('ppdbFees', d.fees || 'Informasi biaya belum tersedia.');

  } catch (err) {
    console.warn('PPDB load error:', err.message);
  }
}

async function init() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  await initApp();
  await loadPpdb();
}

document.addEventListener('DOMContentLoaded', init);
