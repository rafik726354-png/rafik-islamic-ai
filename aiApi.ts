export interface AiStatus {
  online: boolean;
  geminiConfigured: boolean;
  openaiConfigured?: boolean;
  aiConfigured?: boolean;
  provider?: 'gemini' | 'openai' | null;
  demoMode: boolean;
  message?: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  provider?: string;
  model?: string;
  sources?: { name: string; url: string }[];
  demoMode?: boolean;
  error?: string;
}

export async function checkAiStatus(): Promise<AiStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { online: false, geminiConfigured: false, demoMode: true };
    }
    const data = await res.json();
    return {
      online: true,
      geminiConfigured: Boolean(data.geminiConfigured),
      openaiConfigured: Boolean(data.openaiConfigured),
      aiConfigured: Boolean(data.aiConfigured),
      provider: data.provider,
      demoMode: Boolean(data.demoMode),
    };
  } catch (err) {
    console.warn('Health check failed:', err);
    return { online: false, geminiConfigured: false, demoMode: true };
  }
}

export async function sendChatMessage(
  messages: { role: 'user' | 'assistant'; content: string }[],
  language: 'bn' | 'en' | 'ar' = 'bn'
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        language,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = { message: `সার্ভারের সাথে সংযোগে ত্রুটি ঘটেছে (HTTP ${response.status})` };
    }

    if (response.status === 503 || data.demoMode) {
      return {
        success: false,
        demoMode: true,
        reply: '',
        error: data.message || 'Demo Mode — AI is not connected. (AI সহকারী সক্রিয় করতে সার্ভার সেটিংসে একটি বৈধ API Key যুক্ত করুন।)',
      };
    }

    if (!response.ok) {
      throw new Error(data.message || 'AI সহকারী থেকে উত্তর পাওয়া যায়নি।');
    }

    return {
      success: true,
      demoMode: false,
      provider: data.provider,
      model: data.model,
      reply: data.reply,
      sources: data.sources || [],
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        reply: '',
        error: 'সার্ভার থেকে উত্তরে সময়সীমা অতিক্রম করেছে (Request Timeout)। পুনরায় চেষ্টা করুন।',
      };
    }
    return {
      success: false,
      reply: '',
      error: err.message || 'সার্ভার সংযোগে ত্রুটি ঘটেছে। পুনরায় চেষ্টা করুন।',
    };
  }
}
