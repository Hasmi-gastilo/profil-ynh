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

    // Requirements Auto-Grid Formatter
    let reqHtml = d.requirements || 'Informasi persyaratan belum tersedia.';
    
    // Auto-format into grid if there are headings
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = reqHtml;
    let htmlGroups = [];
    let currentContent = [];
    
    Array.from(tempDiv.childNodes).forEach(node => {
      let isHeading = false;
      let headingHtml = '';
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'STRONG' || node.tagName === 'B' || /^H[1-6]$/.test(node.tagName)) {
          isHeading = true;
          headingHtml = node.innerHTML;
        } else if (node.tagName === 'P' || node.tagName === 'DIV') {
          // Check if paragraph contains only strong/b or if its entire text is wrapped in strong
          if (node.childNodes.length === 1 && (node.firstChild.tagName === 'STRONG' || node.firstChild.tagName === 'B')) {
            isHeading = true;
            headingHtml = node.firstChild.innerHTML;
          } else if (node.innerHTML.trim().startsWith('<strong') && node.innerHTML.trim().endsWith('</strong>')) {
             isHeading = true;
             headingHtml = node.innerHTML; 
          }
        }
      }
      
      if (isHeading) {
        if (currentContent.length > 0 || htmlGroups.length > 0) {
           htmlGroups.push(currentContent.join(''));
        }
        currentContent = [`<div class="req-card"><h4 class="req-card-title">${headingHtml}</h4><div class="req-card-body">`];
      } else {
        if (currentContent.length === 0 && node.textContent.trim() !== '') {
           currentContent = [`<div class="req-card"><div class="req-card-body">`];
        }
        if (currentContent.length > 0) {
           currentContent.push(node.nodeType === Node.ELEMENT_NODE ? node.outerHTML : node.textContent);
        }
      }
    });
    
    if (currentContent.length > 0) {
       htmlGroups.push(currentContent.join('') + `</div></div>`);
    }
    
    let finalHtml = htmlGroups.map(g => {
       if (g.includes('<div class="req-card">') && !g.endsWith('</div></div>')) {
          return g + '</div></div>';
       }
       return g;
    }).join('');
    
    if (htmlGroups.length > 1) {
       reqHtml = `<div class="req-grid">${finalHtml}</div>`;
    }

    setHtml('ppdbRequirements', reqHtml);

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
