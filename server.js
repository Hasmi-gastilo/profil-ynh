// server.js — Local Server with Static Hosting & AI Chatbot API
// Yayasan Pendidikan Islam Nurul Huda Kapedi

const http = require('http');
const fs = require('fs');
const path = require('path');
const chatHandler = require('./api/chat.js');

// Simple .env parser to avoid mandatory npm dependencies
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.substring(0, idx).trim();
            const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
      console.log('✓ File .env berhasil dimuat.');
    } catch (e) {
      console.warn('Gagal membaca .env:', e.message);
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  // Set global CORS and embedding permissions
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 1. API: /api/chat
  if (pathname === '/api/chat') {
    await chatHandler(req, res);
    return;
  }

  // 2. API: /api/health
  if (pathname === '/api/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      aiConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
      provider: process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'smart-rag-engine')
    }));
    return;
  }

  // 3. Static Files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  // Check if directory
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (_) {}

  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    // Cache control & Security Policy
    if (ext === '.html' || ext === '.js' || ext === '.css' || ext === '.json') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    if (ext === '.html') {
      res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' blob: https: http:; frame-ancestors *;");
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return;
  }

  // 404 Fallback
  const notFoundPath = path.join(PUBLIC_DIR, '404.html');
  if (fs.existsSync(notFoundPath)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    fs.createReadStream(notFoundPath).pipe(res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Server LPI Nurul Huda Kapedi berjalan!`);
  console.log(`🌐 Website Publik : http://localhost:${PORT}/`);
  console.log(`🔐 Panel Admin     : http://localhost:${PORT}/admin/`);
  console.log(`🤖 Chatbot API    : http://localhost:${PORT}/api/chat`);
  console.log(`📡 Status API     : ${process.env.GEMINI_API_KEY ? 'Google Gemini Aktif' : (process.env.OPENAI_API_KEY ? 'OpenAI Aktif' : 'Smart RAG Engine (Built-in)')}`);
  console.log(`======================================================\n`);
});
