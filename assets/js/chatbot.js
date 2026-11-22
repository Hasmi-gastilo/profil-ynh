// ============================================================
// assets/js/chatbot.js — AI Assistant Controller
// Yayasan Pendidikan Islam Nurul Huda Kapedi
// ============================================================

import { generateClientRAGResponse } from './client-rag.js?v=9';

const STORAGE_KEY = 'ynh_ai_chat_history';
const API_ENDPOINT = typeof window !== 'undefined' && window.AI_CHAT_ENDPOINT ? window.AI_CHAT_ENDPOINT : '/api/chat';

let chatHistory = [];
let isOpen = false;
let isThinking = false;

// Format current time (HH:MM)
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// Minimal safe markdown parser for chatbot replies
function parseMarkdown(text) {
  if (!text) return '';

  let html = text
    // Escape raw HTML tags except safe ones
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Markdown links [text](url)
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Raw URLs to clickable links
  html = html.replace(/(^|[^"'])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');

  // Convert lists
  const lines = html.split('\n');
  let inList = false;
  let listType = '';
  const processedLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        inList = true;
        listType = 'ul';
        processedLines.push('<ul>');
      }
      processedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        inList = true;
        listType = 'ol';
        processedLines.push('<ol>');
      }
      const textAfterNum = trimmed.replace(/^\d+\.\s/, '');
      processedLines.push(`<li>${textAfterNum}</li>`);
    } else {
      if (inList) {
        processedLines.push(`</${listType}>`);
        inList = false;
      }
      if (trimmed) {
        processedLines.push(`<p>${line}</p>`);
      }
    }
  }

  if (inList) {
    processedLines.push(`</${listType}>`);
  }

  return processedLines.join('');
}

// Load conversation history from localStorage
function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      chatHistory = JSON.parse(saved);
      if (!Array.isArray(chatHistory)) chatHistory = [];
    }
  } catch (e) {
    chatHistory = [];
  }
}

// Save conversation history to localStorage
function saveHistory() {
  try {
    // Keep last 30 messages
    const trimmed = chatHistory.slice(-30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {}
}

// Render message into DOM
function appendMessage(role, content, time = getCurrentTime(), sources = [], animate = false) {
  const body = document.getElementById('aiChatBody');
  if (!body) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-message ${role}`;

  const isUser = role === 'user';
  const avatarHtml = isUser
    ? `<div class="ai-msg-avatar"><i class="fas fa-user"></i></div>`
    : `<div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>`;

  let sourcesHtml = '';
  if (!isUser && Array.isArray(sources) && sources.length > 0) {
    const sourceNames = sources.slice(0, 2).join(', ');
    sourcesHtml = `<div class="ai-sources-pill"><i class="fas fa-check-circle" style="color:#10B981;font-size:0.65rem;"></i> Terverifikasi: ${sourceNames}</div>`;
  }

  const formattedContent = isUser
    ? `<p>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`
    : parseMarkdown(content);

  msgDiv.innerHTML = `
    ${avatarHtml}
    <div class="ai-msg-content">
      <div class="ai-msg-bubble">
        ${formattedContent}
        ${sourcesHtml}
      </div>
      <span class="ai-msg-time">${time}</span>
    </div>
  `;

  body.appendChild(msgDiv);
  body.scrollTop = body.scrollHeight;
}

// Render the entire chat list (welcome card or history)
function renderChat() {
  const body = document.getElementById('aiChatBody');
  if (!body) return;

  body.innerHTML = '';

  if (chatHistory.length === 0) {
    // Show Welcome Card & Suggested Question Chips
    const welcomeHtml = `
      <div class="ai-welcome-card" id="aiWelcomeCard">
        <img src="assets/images/logo.png" alt="Logo LPI Nurul Huda" onerror="this.style.display='none'" />
        <div class="ai-welcome-title">Ahlan wa Sahlan! 👋</div>
        <div class="ai-welcome-desc">
          Saya <strong>Asisten AI LPI Nurul Huda Kapedi</strong>. Anda dapat menanyakan info lengkap profil sekolah, PPDB, prestasi, maupun berdiskusi tentang wawasan keislaman, sains, teknologi, dan tips belajar.
        </div>
        <div class="ai-chips-wrap">
          <button class="ai-chip" data-question="Bagaimana visi dan misi Yayasan Nurul Huda Kapedi?">Visi &amp; Misi Yayasan</button>
          <button class="ai-chip" data-question="Bagaimana info dan syarat pendaftaran PPDB siswa baru?">Syarat &amp; Alur PPDB</button>
          <button class="ai-chip" data-question="Unit pendidikan apa saja yang dikelola oleh yayasan?">Unit Pendidikan</button>
          <button class="ai-chip" data-question="Apa saja prestasi terbaru yang diraih oleh siswa?">Prestasi Siswa &amp; Santri</button>
          <button class="ai-chip" data-question="Apa itu Artificial Intelligence dan bagaimana cara kerjanya?">Apa itu AI &amp; Cara Kerjanya?</button>
          <button class="ai-chip" data-question="Bagaimana tips efektif menghafal Al-Qur'an dan belajar fokus?">Tips Tahfidz &amp; Belajar Fokus</button>
        </div>
      </div>
    `;
    body.innerHTML = welcomeHtml;

    // Attach click listeners to chips
    body.querySelectorAll('.ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-question');
        if (q) handleSendMessage(q);
      });
    });
  } else {
    // Render existing history
    chatHistory.forEach(msg => {
      appendMessage(msg.role, msg.content, msg.time, msg.sources);
    });
  }

  body.scrollTop = body.scrollHeight;
}

// Claude-style Searching / Thinking Indicator
let searchingInterval = null;

function showSearching() {
  const body = document.getElementById('aiChatBody');
  if (!body || document.getElementById('aiSearchingIndicator')) return;

  const searchDiv = document.createElement('div');
  searchDiv.className = 'ai-message assistant';
  searchDiv.id = 'aiSearchingIndicator';
  searchDiv.innerHTML = `
    <div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>
    <div class="ai-msg-content">
      <div class="ai-searching-box">
        <div class="ai-searching-header">
          <div class="ai-searching-spinner"></div>
          <span class="ai-searching-status" id="aiSearchingStatus">Menelusuri data resmi lembaga...</span>
        </div>
        <div class="ai-searching-shimmer-bar"></div>
      </div>
    </div>
  `;
  body.appendChild(searchDiv);
  body.scrollTop = body.scrollHeight;

  const steps = [
    'Menelusuri data resmi lembaga...',
    'Memeriksa dokumen & arsip terkait...',
    'Menyusun jawaban untuk Anda...'
  ];
  let stepIndex = 0;
  searchingInterval = setInterval(() => {
    stepIndex = (stepIndex + 1) % steps.length;
    const statusEl = document.getElementById('aiSearchingStatus');
    if (statusEl) {
      statusEl.style.opacity = '0';
      setTimeout(() => {
        statusEl.textContent = steps[stepIndex];
        statusEl.style.opacity = '1';
      }, 150);
    }
  }, 1200);
}

function hideSearching() {
  if (searchingInterval) {
    clearInterval(searchingInterval);
    searchingInterval = null;
  }
  const searchEl = document.getElementById('aiSearchingIndicator');
  if (searchEl) searchEl.remove();
}

// Clear conversation history
function clearHistory() {
  if (chatHistory.length === 0) return;
  if (confirm('Apakah Anda ingin menghapus seluruh riwayat percakapan AI?')) {
    chatHistory = [];
    localStorage.removeItem(STORAGE_KEY);
    renderChat();
  }
}

// Handle sending a message
async function handleSendMessage(customText = null) {
  if (isThinking) return;

  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiBtnSend');
  const text = (customText || (input ? input.value : '')).trim();

  if (!text) return;

  if (input) {
    input.value = '';
    input.focus();
  }

  // Remove welcome card if it's the first message
  const welcome = document.getElementById('aiWelcomeCard');
  if (welcome) welcome.remove();

  const userTime = getCurrentTime();

  // Add user message to state & UI
  chatHistory.push({ role: 'user', content: text, time: userTime });
  appendMessage('user', text, userTime);
  saveHistory();

  // Set thinking state
  isThinking = true;
  if (sendBtn) sendBtn.disabled = true;
  showSearching();

  let replyText = '';
  let sources = [];

  try {
    const payload = {
      message: text,
      history: chatHistory.slice(-6).map(m => ({ role: m.role, content: m.content }))
    };

    // 1. Coba hubungi backend API (jika berjalan di server Node.js atau Vercel)
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          replyText = data.reply;
          sources = data.sources || [];
        }
      }
    } catch (apiErr) {
      // Backend offline atau di GitHub Pages static hosting
      console.log('[AI Assistant] Backend offline, beralih ke Client-Side Smart RAG Engine.');
    }

    // 2. Jika backend tidak tersedia (misal di GitHub Pages), jalankan Client-Side Smart RAG Engine!
    if (!replyText) {
      // Sedikit jeda agar animasi pencarian ala Claude tampil natural
      await new Promise(r => setTimeout(r, 600));
      const clientResult = generateClientRAGResponse(text, chatHistory);
      replyText = clientResult.reply;
      sources = clientResult.sources || ['Basis Data Resmi Lembaga'];
    }

    hideSearching();

    const aiTime = getCurrentTime();
    chatHistory.push({ role: 'assistant', content: replyText, time: aiTime, sources: sources });
    appendMessage('assistant', replyText, aiTime, sources, true);
    saveHistory();

  } catch (err) {
    hideSearching();
    console.error('[Chatbot Error]', err);

    // Fallback terakhir jika terjadi error runtime tak terduga
    const clientResult = generateClientRAGResponse(text, chatHistory);
    const fallbackReply = clientResult.reply || 'Mohon maaf atas ketidaknyamanannya, silakan hubungi WhatsApp kami di +62 815-5400-8683. 🙏';
    const fallbackSources = clientResult.sources || ['Sekretariat Yayasan'];
    const errTime = getCurrentTime();
    chatHistory.push({ role: 'assistant', content: fallbackReply, time: errTime, sources: fallbackSources });
    appendMessage('assistant', fallbackReply, errTime, fallbackSources);
    saveHistory();
  } finally {
    isThinking = false;
    if (sendBtn) sendBtn.disabled = false;
  }
}

// Toggle chat window open / close
export function toggleChat(forceState = null) {
  let win = document.getElementById('aiChatWindow');
  const trigger = document.getElementById('aiChatTrigger');
  const badge = document.getElementById('aiTriggerBadge');
  if (!win) {
    injectChatbotMarkup();
    win = document.getElementById('aiChatWindow');
  }
  if (!win) return;

  isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

  if (isOpen) {
    win.classList.add('open');
    win.style.setProperty('display', 'flex', 'important');
    win.style.setProperty('visibility', 'visible', 'important');
    win.style.setProperty('opacity', '1', 'important');
    win.style.setProperty('pointer-events', 'auto', 'important');
    win.style.setProperty('z-index', '999999', 'important');
    if (badge) badge.style.display = 'none';
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    renderChat();
    setTimeout(() => {
      const input = document.getElementById('aiChatInput');
      if (input) input.focus();
    }, 150);
  } else {
    win.classList.remove('open');
    win.style.setProperty('display', 'none', 'important');
    win.style.setProperty('visibility', 'hidden', 'important');
    win.style.setProperty('opacity', '0', 'important');
    win.style.setProperty('pointer-events', 'none', 'important');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
}

// Global expose
if (typeof window !== 'undefined') {
  window.toggleAiChat = toggleChat;
  window.renderAiChat = renderChat;
}

// Bind Event Listeners
function bindChatbotEvents() {
  const trigger = document.getElementById('aiChatTrigger');
  const closeBtn = document.getElementById('aiBtnClose');
  const clearBtn = document.getElementById('aiBtnClear');
  const form = document.getElementById('aiChatForm');

  if (trigger && !trigger._bound) {
    trigger._bound = true;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat();
    });
  }
  if (closeBtn && !closeBtn._bound) {
    closeBtn._bound = true;
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleChat(false);
    });
  }
  if (clearBtn && !clearBtn._bound) {
    clearBtn._bound = true;
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearHistory();
    });
  }
  if (form && !form._bound) {
    form._bound = true;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });
  }
}

// Document-level delegated click listener as 100% fail-safe
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#aiChatTrigger') || e.target.closest('#aiTriggerBadge');
    if (trigger) {
      e.preventDefault();
      toggleChat();
      return;
    }
    const closeBtn = e.target.closest('#aiBtnClose');
    if (closeBtn) {
      e.preventDefault();
      toggleChat(false);
      return;
    }
    const clearBtn = e.target.closest('#aiBtnClear');
    if (clearBtn) {
      e.preventDefault();
      clearHistory();
      return;
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChat(false);
    }
  });
}

// Dynamically Inject Chatbot HTML and CSS
function injectChatbotMarkup() {
  // 1. Inject CSS if not present
  if (!document.getElementById('aiChatbotStyles')) {
    const link = document.createElement('link');
    link.id = 'aiChatbotStyles';
    link.rel = 'stylesheet';
    link.href = 'assets/css/chatbot.css?v=3';
    document.head.appendChild(link);
  }

  // 2. Inject Trigger Button & Chat Window if not in HTML
  if (!document.getElementById('aiChatTriggerWrap')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'aiChatTriggerWrap';
    wrapper.className = 'ai-chat-trigger-wrap';
    wrapper.innerHTML = `
      <button class="ai-chat-trigger" id="aiChatTrigger" aria-label="Buka Chatbot AI Nurul Huda" aria-expanded="false" onclick="window.toggleAiChat && window.toggleAiChat()">
        <div class="ai-trigger-pulse"></div>
        <i class="fas fa-robot"></i>
      </button>
      <div class="ai-trigger-badge" id="aiTriggerBadge" onclick="window.toggleAiChat && window.toggleAiChat()" style="cursor:pointer;" title="Tanya Asisten AI">
        Tanya AI
      </div>
    `;
    document.body.appendChild(wrapper);
  }

  if (!document.getElementById('aiChatWindow')) {
    const windowModal = document.createElement('div');
    windowModal.id = 'aiChatWindow';
    windowModal.className = 'ai-chat-window';
    windowModal.setAttribute('role', 'dialog');
    windowModal.setAttribute('aria-label', 'AI Assistant LPI Nurul Huda');
    windowModal.style.display = 'none';
    windowModal.innerHTML = `
      <!-- Header -->
      <div class="ai-chat-header">
        <div class="ai-header-profile">
          <div class="ai-header-avatar-wrap">
            <img src="assets/images/logo.png" alt="Logo LPI" onerror="this.style.display='none'" />
            <span class="ai-online-indicator"></span>
          </div>
          <div class="ai-header-info">
            <span class="ai-header-title">AI Asisten Nurul Huda</span>
            <span class="ai-header-sub"><i class="fas fa-circle" style="font-size:0.4rem;color:#10B981;"></i> Asisten Cerdas &amp; Informasi Resmi</span>
          </div>
        </div>
        <div class="ai-header-actions">
          <button class="ai-btn-action" id="aiBtnClear" title="Hapus riwayat percakapan" aria-label="Hapus percakapan">
            <i class="fas fa-trash-alt"></i>
          </button>
          <button class="ai-btn-action" id="aiBtnClose" title="Tutup" aria-label="Tutup jendela chat" onclick="window.toggleAiChat && window.toggleAiChat(false)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Message Body -->
      <div class="ai-chat-body" id="aiChatBody"></div>

      <!-- Input Footer -->
      <div class="ai-chat-footer">
        <form class="ai-input-form" id="aiChatForm" onsubmit="return false;">
          <input
            type="text"
            id="aiChatInput"
            class="ai-chat-input"
            placeholder="Tanyakan info sekolah, sains, agama, teknologi..."
            autocomplete="off"
            maxlength="500"
          />
          <button type="submit" class="ai-btn-send" id="aiBtnSend" aria-label="Kirim pertanyaan">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
        <p class="ai-footer-note">Asisten Cerdas &amp; Pengetahuan Terpadu LPI Nurul Huda Kapedi</p>
      </div>
    `;
    document.body.appendChild(windowModal);
  }

  bindChatbotEvents();

  // Automatically fade out badge after 9 seconds if not opened
  setTimeout(() => {
    const badge = document.getElementById('aiTriggerBadge');
    if (badge && !isOpen) {
      badge.style.opacity = '0';
      badge.style.transition = 'opacity 0.6s ease';
      setTimeout(() => badge.style.display = 'none', 600);
    }
  }, 9000);
}

// Main initializer
export function initChatbot() {
  loadHistory();
  injectChatbotMarkup();
  bindChatbotEvents();
}
