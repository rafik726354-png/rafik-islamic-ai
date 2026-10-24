import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { GoogleGenAI } from '@google/genai';
import { BENGALI_SURAH_AUDIO_FILENAMES, TOHA_AUDIO_METADATA } from './src/data/bengaliAudioMap';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health and AI status check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const hasGemini = Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey.trim().length > 5);
  const hasOpenAi = Boolean(openAiKey && openAiKey !== 'MY_OPENAI_API_KEY' && openAiKey.trim().length > 5);
  const hasKey = hasGemini || hasOpenAi;
  res.json({
    status: 'online',
    appName: 'Rafik Islamic AI',
    geminiConfigured: hasGemini,
    openaiConfigured: hasOpenAi,
    aiConfigured: hasKey,
    provider: hasGemini ? 'gemini' : hasOpenAi ? 'openai' : null,
    demoMode: !hasKey,
    time: new Date().toISOString(),
  });
});

// Proxy endpoint for Dr. Abu Bakr Muhammad Zakaria translation from QuranEnc
app.get('/api/quran/zakaria/:surah', async (req: Request, res: Response) => {
  const surah = parseInt(req.params.surah, 10);
  if (isNaN(surah) || surah < 1 || surah > 114) {
    return res.status(400).json({ error: 'INVALID_SURAH', message: 'সূরা নম্বর ১ থেকে ১১৪ এর মধ্যে হতে হবে।' });
  }

  try {
    const quranEncRes = await fetch(`https://quranenc.com/api/v1/translation/sura/bengali_zakaria/${surah}`);
    if (!quranEncRes.ok) {
      throw new Error(`QuranEnc responded with status ${quranEncRes.status}`);
    }
    const data = await quranEncRes.json();
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.json(data);
  } catch (err: any) {
    console.error('QuranEnc proxy error:', err);
    return res.status(502).json({
      error: 'QURANENC_FETCH_FAILED',
      message: 'QuranEnc সার্ভার থেকে ড. আবু বকর মুহাম্মাদ যাকারিয়ার অনুবাদ লোড করা যায়নি।',
    });
  }
});

// Cache directory for high-speed local serving and zero-latency audio playback
const AUDIO_CACHE_DIR = path.resolve(process.cwd(), '.cache', 'audio');
if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  try {
    fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
  } catch (err) {
    console.warn('Failed to initialize audio cache directory:', err);
  }
}

// Streaming proxy for Syed Ismat Toha authentic Bengali Quran audio from Archive.org
// Handles Local Disk Cache, Range requests (HTTP 206), HEAD requests, and CORS
const handleBengaliAudio = async (req: Request, res: Response) => {
  const surah = parseInt(req.params.surah, 10);
  if (isNaN(surah) || surah < 1 || surah > 114) {
    return res.status(400).json({
      error: 'INVALID_SURAH',
      message: 'সূরা নম্বর ১ থেকে ১১৪ এর মধ্যে হতে হবে।',
    });
  }

  const filename = BENGALI_SURAH_AUDIO_FILENAMES[surah];
  if (!filename) {
    return res.status(404).json({
      error: 'AUDIO_NOT_FOUND',
      message: 'সৈয়দ ইসমত তোহার কণ্ঠে এই সূরার অডিও ফাইল তালিকাভুক্ত নেই।',
    });
  }

  // Set global CORS and media headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Accept-Ranges, Content-Type');
  res.setHeader('Accept-Ranges', 'bytes');

  const cachedFilePath = path.join(AUDIO_CACHE_DIR, `${surah}.mp3`);

  // 1. FAST PATH: Serve directly from local disk cache if already downloaded
  if (fs.existsSync(cachedFilePath)) {
    try {
      const stats = fs.statSync(cachedFilePath);
      if (stats.size > 1000) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
        return res.sendFile(cachedFilePath, {
          acceptRanges: true,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (cacheErr) {
      console.warn(`Cache read error for Surah ${surah}, falling back to network:`, cacheErr);
    }
  }

  // 2. NETWORK PATH: Stream from Archive.org
  const archiveUrl = `${TOHA_AUDIO_METADATA.baseUrl}${encodeURIComponent(filename)}`;

  // Handle HEAD requests gracefully without fetching full body
  if (req.method === 'HEAD') {
    try {
      const headRes = await fetch(archiveUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RafikIslamicAI/1.0',
        },
        redirect: 'follow',
      });
      res.status(headRes.status === 200 ? 200 : headRes.status);
      res.setHeader('Content-Type', headRes.headers.get('content-type') || 'audio/mpeg');
      const cl = headRes.headers.get('content-length');
      if (cl) res.setHeader('Content-Length', cl);
      return res.end();
    } catch {
      return res.status(200).setHeader('Content-Type', 'audio/mpeg').end();
    }
  }

  try {
    const rangeHeader = req.headers.range;
    const fetchHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RafikIslamicAI/1.0',
      'Accept': '*/*',
    };
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const archiveRes = await fetch(archiveUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!archiveRes.ok && archiveRes.status !== 206) {
      console.warn(`Archive.org audio fetch returned status ${archiveRes.status} for Surah ${surah}`);
      return res.status(archiveRes.status || 502).json({
        error: 'ARCHIVE_AUDIO_FETCH_FAILED',
        status: archiveRes.status,
        archiveUrl,
        message: 'সৈয়দ ইসমত তোহার কণ্ঠে এই সূরার অডিও সার্ভার থেকে লোড করা যায়নি।',
      });
    }

    res.status(archiveRes.status);
    res.setHeader('Content-Type', archiveRes.headers.get('content-type') || 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');

    const contentLength = archiveRes.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    const contentRange = archiveRes.headers.get('content-range');
    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
    }

    if (!archiveRes.body) {
      return res.end();
    }

    const nodeStream = Readable.fromWeb(archiveRes.body as any);

    nodeStream.on('error', (streamErr) => {
      console.error('Audio stream pipe error:', streamErr);
      if (!res.headersSent) {
        res.status(500).end();
      }
    });

    req.on('close', () => {
      nodeStream.destroy();
    });

    // If client requested full file without range, write to cache asynchronously
    if (!rangeHeader && archiveRes.status === 200) {
      try {
        const tmpPath = path.join(AUDIO_CACHE_DIR, `${surah}.mp3.tmp`);
        const fileStream = fs.createWriteStream(tmpPath);
        nodeStream.pipe(fileStream);
        fileStream.on('finish', () => {
          try {
            if (fs.existsSync(tmpPath) && fs.statSync(tmpPath).size > 1000) {
              fs.renameSync(tmpPath, cachedFilePath);
              console.log(`Successfully cached Bengali audio for Surah ${surah}`);
            }
          } catch (e) {
            console.warn('Cache file rename error:', e);
          }
        });
        fileStream.on('error', (err) => {
          console.warn('Cache write stream error:', err);
          try { if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); } catch {}
        });
      } catch (e) {
        console.warn('Cache write stream setup error:', e);
      }
    }

    nodeStream.pipe(res);
  } catch (err: any) {
    console.error(`Bengali audio proxy error for Surah ${surah}:`, err);
    return res.status(502).json({
      error: 'PROXY_STREAM_FAILED',
      message: 'সৈয়দ ইসমত তোহার কণ্ঠে এই সূরার অডিও সার্ভার থেকে লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।',
      archiveUrl,
    });
  }
};

app.get('/api/audio/bengali/:surah', handleBengaliAudio);
app.head('/api/audio/bengali/:surah', handleBengaliAudio);

// AI Chat Endpoint with strict Source Grounding & Multi-Provider Support (Gemini & OpenAI)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { messages, prompt, language = 'bn' } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const hasGemini = Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY' && geminiKey.trim().length > 5);
  const hasOpenAi = Boolean(openAiKey && openAiKey !== 'MY_OPENAI_API_KEY' && openAiKey.trim().length > 5);

  if (!hasGemini && !hasOpenAi) {
    return res.status(503).json({
      success: false,
      error: 'AI_NOT_CONFIGURED',
      demoMode: true,
      message: 'সার্ভারে কোনো সক্রিয় AI API Key (GEMINI_API_KEY বা OPENAI_API_KEY) পাওয়া যায়নি। AI সহকারী সক্রিয় করতে সার্ভার সেটিংসে একটি বৈধ API কী যুক্ত করুন।',
      answer: null,
    });
  }

  // Language instructions
  const langInstruction =
    language === 'ar'
      ? 'Please answer in classical Arabic (العربية).'
      : language === 'en'
      ? 'Please answer in clear, polite English.'
      : 'Please answer primarily in natural, polite Bengali (বাংলা), providing Arabic for verses/hadith texts alongside Bengali meaning.';

  const systemInstruction = `You are Rafik Islamic AI (রাফিক ইসলামিক এআই), an authoritative, respectful, and strictly source-grounded Islamic knowledge assistant.
User requested language: ${language}.
${langInstruction}

MANDATORY ISLAMIC ANSWER POLICY & RIGOROUS RULES:
1. WARM ISLAMIC GREETING & GENERAL INQUIRIES:
   - If the user greets (e.g. "হ্যালো", "হাই", "Hello", "কেমন আছেন", "সালাম", "আসসালামু আলাইকুম"), warmly respond with the Islamic greeting: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু" (বা "ওয়ালাইকুম আসসালাম..."), welcome them to Rafik Islamic AI, and ask how you can help them with Quran, Hadith, prayers, or daily Islamic life.
   - You can also answer general everyday inquiries (ethics, science, etiquette, productivity) respectfully while adhering to Islamic values.
2. PREFER VERIFIED SOURCES:
   - Rely strictly on the Holy Quran, Sahih and Hasan Hadith from canonical collections (Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami at-Tirmidhi, Sunan an-Nasa'i, Sunan Ibn Majah, Muwatta Malik), and consensus of recognized orthodox Islamic scholarship.
3. PRECISE CITATIONS:
   - For Quranic evidence, always state Surah name, Surah number, and Verse number (e.g., সূরা আল-বাকারা, ২:২৫৫ / Surah Al-Baqarah 2:255).
   - For Hadith evidence, cite the exact collection name and Hadith number or book reference (e.g., সহিহ বুখারি, হাদিস নং ১ / Sahih al-Bukhari #1).
4. STRUCTURAL DISTINCTION:
   - Clearly delineate:
     a) Quranic Verse (কুরআনের আয়াত ও অর্থ)
     b) Hadith (হাদিসের পাঠ ও সনদ/গ্রন্থ)
     c) Scholarly Interpretation / Fiqh viewpoints (আলেমগণের বিশ্লেষণ ও মাযহাব)
     d) General explanation and practical takeaway
5. RESPECT DIVERGENT SCHOLARLY VIEWS (মাযহাবগত মতপার্থক্য): Explain legitimate differences among the major Sunni schools of jurisprudence (Hanafi, Shafi'i, Maliki, Hanbali) with fairness, nuance, and mutual respect.
6. ZERO FABRICATION: Never invent verses, fabricated (Mawdu) hadith, false scholarly quotes, or fake URLs. If a specific hadith or ruling cannot be verified with certainty, state clearly: "উৎসটি নিশ্চিতভাবে যাচাই করা সম্ভব হয়নি।" / "The source could not be verified."
7. LIMITS & FATWA DISCLAIMER: You are an educational research companion, NOT a Mufti or an authorized fatwa-issuing institution. For complex personal legal/marital/inheritance/talaq matters, explicitly advise consulting a trusted, qualified local Islamic scholar (মুফতি বা বিজ্ঞ আলেম).
8. REPUTABLE REFERENCES: Include authentic source references where applicable (Quran.com, Sunnah.com, QuranEnc.com, IslamHouse.com).

Format your response clearly using markdown with clean sections, bold headers, and bullet points.`;

  // Standardize message history
  const rawHistory: { role: 'user' | 'assistant'; content: string }[] = [];
  if (Array.isArray(messages) && messages.length > 0) {
    for (const m of messages) {
      if (m && typeof m.content === 'string' && m.content.trim()) {
        rawHistory.push({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content.trim(),
        });
      }
    }
  } else if (typeof prompt === 'string' && prompt.trim()) {
    rawHistory.push({ role: 'user', content: prompt.trim() });
  }

  if (rawHistory.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'EMPTY_MESSAGE',
      message: 'অনুগ্রহ করে একটি প্রশ্ন বা বার্তা লিখুন।',
    });
  }

  // Helper for timeout race
  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
      ),
    ]);
  };

  let finalReply = '';
  let providerUsed = '';
  let modelUsed = '';
  let lastError: any = null;

  // 1. Try Gemini first if configured (native SDK with fast gemini-3.1-flash-lite)
  if (hasGemini) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey!,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare alternating contents for Gemini
      const geminiContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      for (const m of rawHistory) {
        const role = m.role === 'assistant' ? 'model' : 'user';
        if (geminiContents.length === 0 && role === 'model') continue;
        if (geminiContents.length > 0 && geminiContents[geminiContents.length - 1].role === role) {
          geminiContents[geminiContents.length - 1].parts[0].text += `\n\n${m.content}`;
        } else {
          geminiContents.push({ role, parts: [{ text: m.content }] });
        }
      }

      if (geminiContents.length === 0) {
        geminiContents.push({ role: 'user', parts: [{ text: 'আসসালামু আলাইকুম' }] });
      }

      // Fast models in priority order
      const geminiModels = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

      for (const model of geminiModels) {
        try {
          const result = await withTimeout(
            ai.models.generateContent({
              model,
              contents: geminiContents,
              config: {
                systemInstruction,
                temperature: 0.3,
              },
            }),
            15000,
            `Gemini model ${model} timed out after 15s`
          );

          if (result && result.text && result.text.trim()) {
            finalReply = result.text.trim();
            providerUsed = 'gemini';
            modelUsed = model;
            break;
          }
        } catch (mErr: any) {
          console.warn(`Gemini model ${model} failed:`, mErr?.message || mErr);
          lastError = mErr;
        }
      }
    } catch (gErr: any) {
      console.warn('Gemini overall client error:', gErr?.message || gErr);
      lastError = gErr;
    }
  }

  // 2. Try OpenAI if Gemini didn't produce an answer or if OpenAI is configured
  if (!finalReply && hasOpenAi) {
    try {
      const openAiMessages = [
        { role: 'system', content: systemInstruction },
        ...rawHistory.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ];

      const openAiModels = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];
      for (const model of openAiModels) {
        try {
          const fetchPromise = fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: openAiMessages,
              temperature: 0.3,
            }),
          });

          const openAiRes = await withTimeout(fetchPromise, 15000, `OpenAI model ${model} timed out`);
          if (openAiRes.ok) {
            const openAiData = await openAiRes.json();
            const text = openAiData.choices?.[0]?.message?.content;
            if (text && text.trim()) {
              finalReply = text.trim();
              providerUsed = 'openai';
              modelUsed = model;
              break;
            }
          } else {
            const errData = await openAiRes.json().catch(() => ({}));
            console.warn(`OpenAI model ${model} HTTP ${openAiRes.status}:`, errData);
            lastError = new Error(errData?.error?.message || `OpenAI returned status ${openAiRes.status}`);
          }
        } catch (oErr: any) {
          console.warn(`OpenAI model ${model} error:`, oErr?.message || oErr);
          lastError = oErr;
        }
      }
    } catch (oAllErr: any) {
      console.warn('OpenAI overall error:', oAllErr?.message || oAllErr);
      lastError = oAllErr;
    }
  }

  if (finalReply) {
    return res.json({
      success: true,
      demoMode: false,
      provider: providerUsed,
      model: modelUsed,
      reply: finalReply,
      sources: [
        { name: 'Quran.com', url: 'https://quran.com/' },
        { name: 'Sunnah.com', url: 'https://sunnah.com/' },
        { name: 'QuranEnc', url: 'https://quranenc.com/' },
        { name: 'IslamHouse', url: 'https://islamhouse.com/' },
      ],
    });
  }

  // If no reply could be generated, formulate clear, transparent user error
  console.error('All AI providers failed. Last error:', lastError);
  let friendlyMessage = 'ইসলামিক AI সহকারীর সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
  if (lastError?.message?.includes('timed out')) {
    friendlyMessage = 'সার্ভার থেকে উত্তরে সময়সীমা অতিক্রম করেছে (Timeout)। পুনরায় চেষ্টা করুন।';
  } else if (lastError?.message?.includes('API key') || lastError?.message?.includes('401')) {
    friendlyMessage = 'প্রদত্ত API কী অনুমোদিত নয় বা ত্রুটিপূর্ণ। অনুগ্রহ করে সঠিক API Key যাচাই করুন।';
  } else if (lastError?.message?.includes('quota') || lastError?.message?.includes('429')) {
    friendlyMessage = 'API কোটা সাময়িকভাবে শেষ হয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।';
  }

  return res.status(500).json({
    success: false,
    error: 'AI_PROCESSING_ERROR',
    message: friendlyMessage,
    details: lastError?.message,
  });
});

// Setup dev server with Vite or production static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Rafik Islamic AI] Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
