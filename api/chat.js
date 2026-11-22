// api/chat.js — AI Assistant Chat Handler with RAG & Web Search
// Yayasan Pendidikan Islam Nurul Huda Kapedi

const { retrieveRelevantChunks, buildSystemPrompt, smartFallbackAnswer, detectIntent } = require('./rag.js');

// Call Google Gemini API (with Google Search Grounding for live web queries)
async function callGemini(apiKey, systemPrompt, history, userMessage) {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastErr = null;

  for (const model of models) {
    // Try with Google Search grounding first, then fallback without tools if tier doesn't support it
    const toolModes = [{ tools: [{ googleSearch: {} }] }, { tools: [] }];

    for (const toolMode of toolModes) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Multi-turn conversation history
        const contents = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-8)) {
            if (item.content && (item.role === 'user' || item.role === 'assistant')) {
              contents.push({
                role: item.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: String(item.content) }]
              });
            }
          }
        }

        // Add current user prompt
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });

        const body = {
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 1200
          }
        };

        if (toolMode.tools.length > 0) {
          body.tools = toolMode.tools;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(18000)
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (toolMode.tools.length > 0) {
            console.warn(`[Chat] Gemini with search returned ${response.status}, retrying standard mode...`);
            continue;
          }
          throw new Error(`Gemini API [${model}] status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            reply: text,
            model: model + (toolMode.tools.length > 0 ? '+search' : '')
          };
        }
      } catch (err) {
        lastErr = err;
        if (toolMode.tools.length === 0) {
          console.warn(`[Chat] Gemini ${model} failed:`, err.message);
        }
      }
    }
  }

  throw lastErr || new Error('Gagal menghubungi layanan Gemini.');
}

// Call OpenAI API (if configured)
async function callOpenAI(apiKey, systemPrompt, history, userMessage) {
  const messages = [{ role: 'system', content: systemPrompt }];

  if (Array.isArray(history)) {
    for (const item of history.slice(-8)) {
      if (item.content && (item.role === 'user' || item.role === 'assistant')) {
        messages.push({
          role: item.role,
          content: String(item.content)
        });
      }
    }
  }

  messages.push({ role: 'user', content: userMessage });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.6,
      max_tokens: 1200
    }),
    signal: AbortSignal.timeout(18000)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Respon OpenAI kosong.');
  return { reply: text, model: 'gpt-4o-mini' };
}

// Universal Chat Request Handler
async function handleChat(reqBody) {
  const { message, history = [] } = reqBody || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return {
      status: 400,
      data: { error: 'Pesan tidak boleh kosong.' }
    };
  }

  const cleanMessage = message.trim();

  // 1. Dual-Core RAG Retrieval Step
  const { chunks, institution, intent, maxScore } = await retrieveRelevantChunks(cleanMessage, 4);
  const systemPrompt = buildSystemPrompt(chunks, institution);

  let sourceTitles = [];
  if (intent === 'INSTITUTIONAL' && maxScore >= 6) {
    sourceTitles = chunks.filter(c => c.score >= 5).map(c => c.title);
  } else if (maxScore >= 8) {
    sourceTitles = chunks.filter(c => c.score >= 6).map(c => c.title);
  } else if (intent === 'GENERAL_KNOWLEDGE') {
    sourceTitles = ['Wawasan Umum & Ensiklopedia Digital'];
  } else {
    sourceTitles = ['Khazanah Pengetahuan Terpadu & Sains'];
  }

  // 2. Identify configured LLM
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  let result = null;

  if (geminiKey) {
    try {
      result = await callGemini(geminiKey, systemPrompt, history, cleanMessage);
    } catch (err) {
      console.warn('[Chat] Gemini call error, falling back to smart RAG engine:', err.message);
    }
  } else if (openAiKey) {
    try {
      result = await callOpenAI(openAiKey, systemPrompt, history, cleanMessage);
    } catch (err) {
      console.warn('[Chat] OpenAI call error, falling back to smart RAG engine:', err.message);
    }
  }

  // 3. Fallback to built-in smart RAG engine if no key or error
  if (!result || !result.reply) {
    const fallbackText = smartFallbackAnswer(cleanMessage, chunks, institution);
    result = {
      reply: fallbackText,
      model: 'smart-rag-engine'
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      reply: result.reply,
      sources: sourceTitles,
      intent: intent,
      model: result.model
    }
  };
}

// Export for Node HTTP Server or Vercel Serverless Function
module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Metode tidak diizinkan. Gunakan POST.' }));
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }

    if (!body && typeof req.on === 'function') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(raw);
      } catch (e) {
        body = {};
      }
    }

    const outcome = await handleChat(body);
    res.statusCode = outcome.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(outcome.data));
  } catch (err) {
    console.error('[Chat Handler Error]', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Terjadi kesalahan sistem saat memproses pesan.',
      details: err.message
    }));
  }
};
