import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Globe,
  AlertCircle,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { ChatMessage } from '../types/quran';
import { sendChatMessage } from '../services/aiApi';

interface AiAssistantProps {
  demoMode: boolean;
  onRefreshHealth?: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ demoMode, onRefreshHealth }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'bn' | 'en' | 'ar'>('bn');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Speech Recognition State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Synthesis State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rafik_ai_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading chat history:', e);
    }

    // Default welcome message
    setMessages([
      {
        id: 'welcome_msg',
        role: 'assistant',
        content: `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! আমি **রাফিক ইসলামিক এআই** (Rafik Islamic AI)।

আমি পবিত্র কুরআন, সহিহ হাদিস ও প্রামাণ্য ইসলামিক রেফারেন্সের আলোকে আপনার দ্বীনি প্রশ্নের উত্তর দিতে প্রস্তুত।

**আমাদের নীতিমালার মূল স্তম্ভ:**
1. কুরআন ও সহিহ হাদিসের সুস্পষ্ট প্রমাণ ও নম্বর উল্লেখ।
2. কুরআনের আয়াত, হাদিসের উদ্ধৃতি ও আলেমদের মতামতের স্পষ্ট পার্থক্য।
3. চার মাযহাবের বৈধ মতপার্থক্যের প্রতি নিরপেক্ষ সম্মান প্রদর্শন।
4. জটিল ব্যক্তিগত মাসআলার ক্ষেত্রে বিজ্ঞ মুফতির পরামর্শ গ্রহণের তাগিদ।

নিচের প্রস্তাবিত প্রশ্নগুলো থেকে বেছে নিতে পারেন অথবা আপনার প্রশ্ন লিখে বা মুখে বলুন।`,
        timestamp: Date.now(),
        sources: [
          { name: 'Quran.com', url: 'https://quran.com/' },
          { name: 'Sunnah.com', url: 'https://sunnah.com/' },
          { name: 'QuranEnc', url: 'https://quranenc.com/' },
          { name: 'IslamHouse', url: 'https://islamhouse.com/' },
        ],
      },
    ]);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('rafik_ai_chat_history', JSON.stringify(messages));
      } catch (e) {
        console.warn('Chat storage quota error:', e);
      }
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('মাইক্রোফোন ব্যবহারের অনুমতি প্রয়োজন। ব্রাউজার সেটিংসে অনুমতি দিন।');
        } else if (event.error === 'no-speech') {
          setSpeechError('কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।');
        } else {
          setSpeechError('ভয়েস ইনপুট সমর্থিত নয় বা ত্রুটি ঘটেছে।');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Toggle Speech Recognition
  const toggleListening = () => {
    setSpeechError(null);
    if (!recognitionRef.current) {
      setSpeechError('আপনার ব্রাউজার সরাসরি ভয়েস ইনপুট সমর্থন করে না। অনুগ্রহ করে টেক্সট ইনপুট ব্যবহার করুন।');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Set language code
      const langCode = selectedLanguage === 'bn' ? 'bn-BD' : selectedLanguage === 'ar' ? 'ar-SA' : 'en-US';
      recognitionRef.current.lang = langCode;
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech start error:', e);
      }
    }
  };

  // Text-To-Speech Output
  const toggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজার স্পিচ সিন্থেসিস সমর্থন করে না।');
      return;
    }

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage === 'bn' ? 'bn-BD' : selectedLanguage === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Send Chat Message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Filter out error messages so AI receives clean conversation turns
    const historyPayload = newMessages
      .filter((m) => !m.error && m.content && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim() }));

    // Call server AI endpoint
    const response = await sendChatMessage(historyPayload, selectedLanguage);

    if (!response.success && response.demoMode) {
      const demoMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Demo Mode — AI is not connected**
(ডেমো মোড — সার্ভারে GEMINI_API_KEY বা OPENAI_API_KEY সক্রিয় পাওয়া যায়নি।)

AI সহকারীর জীবন্ত উত্তর পেতে:
১. AI Studio সেটিংস / Secrets প্যানেলে যান।
২. \`GEMINI_API_KEY\` অথবা \`OPENAI_API_KEY\` ভ্যারিয়েবলে আপনার সক্রিয় API কী যুক্ত করুন।
৩. কী যুক্ত হওয়ার সাথে সাথে রিয়েল-টাইম কুরআন ও হাদিস ভিত্তিক AI উত্তর সক্রিয় হবে।

নীতিমালা অনুযায়ী, ডেমো মোডে কোনো নকল বা মনগড়া উত্তর প্রদর্শন করা হয় না।`,
        timestamp: Date.now(),
        error: true,
      };
      setMessages([...newMessages, demoMessage]);
    } else if (!response.success) {
      const errorMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: `দুঃখিত, সংযোগে ত্রুটি ঘটেছে: ${response.error || 'সার্ভার থেকে উত্তর পাওয়া যায়নি।'}

অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় পাঠান।`,
        timestamp: Date.now(),
        error: true,
      };
      setMessages([...newMessages, errorMessage]);
    } else {
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        sources: response.sources,
      };
      setMessages([...newMessages, assistantMessage]);
    }

    setLoading(false);
  };

  // Retry sending last user query
  const handleRetry = (queryToRetry?: string) => {
    if (loading) return;
    if (queryToRetry) {
      handleSendMessage(queryToRetry);
      return;
    }
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user' && messages[i].content) {
        handleSendMessage(messages[i].content);
        return;
      }
    }
  };

  // Clear chat history
  const clearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    localStorage.removeItem('rafik_ai_chat_history');
    setMessages([]);
  };

  // Copy message
  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const sampleQuestions = [
    {
      bn: 'কুরআন ও হাদিসের আলোকে ধৈর্য (সবর)-এর ফজিলত ও মর্যাদা কী?',
      en: 'What is the importance of patience (sabr) in the Quran and Sunnah?',
      ar: 'ما فضل الصبر في ضوء القرآن والسنة النبوية؟',
    },
    {
      bn: 'তাহাজ্জুদ নামাজের নিয়ম, সঠিক সময় ও ফজিলত সহিহ হাদিসের আলোকে বুঝিয়ে বলুন।',
      en: 'Explain Tahajjud prayer method, timing, and virtues according to authentic Hadith.',
      ar: 'كيفية صلاة التهجد ووقتها وفضلها في ضوء الأحاديث الصحيحة؟',
    },
    {
      bn: 'চার প্রধান সুন্নি মাযহাবের (হানাফি, শাফেঈ, মালেকি, হাম্বলি) উৎপত্তি ও পারস্পরিক শ্রদ্ধাবোধ।',
      en: 'Origins and mutual respect among the four major Sunni schools of jurisprudence.',
      ar: 'نشأة المذاهب الفقهية الأربعة والاحترام المتبادل بينها.',
    },
    {
      bn: 'হিসনুল মুসলিম থেকে সকাল ও সন্ধ্যার কয়েকটি সর্বাধিক গুরুত্বপূর্ণ দোয়া ও ফজিলত।',
      en: 'Important morning and evening supplications from Hisnul Muslim with virtues.',
      ar: 'أذكار الصباح والمساء من حصن المسلم مع فضائلها.',
    },
    {
      bn: 'যাকাত কাদের ওপর ফরজ এবং সোনা, রুপা ও নগদ টাকার নিসাব কীভাবে হিসাব করতে হয়?',
      en: 'Who is required to pay Zakat and how is Nisab calculated on gold and cash?',
      ar: 'على من تجب الزكاة وكيفية حساب النصاب في الذهب والمال؟',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-36 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/35 card-3d flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#176B50] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#D9A514]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#493719] text-3d-raised font-bengali">
              ইসলামিক AI সহকারী
            </h1>
          </div>
          <p className="text-[#5A4525] text-xs sm:text-sm font-bengali">
            কুরআন ও হাদিসের প্রামাণিক রেফারেন্সভিত্তিক প্রশ্নোত্তর
          </p>
        </div>

        {/* Language Selector & Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 text-xs shadow-xs">
            <button
              onClick={() => setSelectedLanguage('bn')}
              className={`px-2.5 py-1 rounded-lg font-bengali font-bold transition-all ${
                selectedLanguage === 'bn'
                  ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                  : 'text-[#7A6240] hover:text-[#493719]'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setSelectedLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg font-arabic font-bold transition-all ${
                selectedLanguage === 'ar'
                  ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                  : 'text-[#7A6240] hover:text-[#493719]'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-sans font-bold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-[#D9A514]/25 text-[#382507] border border-[#D9A514]/50 shadow-xs'
                  : 'text-[#7A6240] hover:text-[#493719]'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={clearChat}
            title="চ্যাট হিস্ট্রি মুছুন"
            className="p-2 rounded-xl bg-[#FFF7D6] hover:bg-red-50 hover:text-red-700 border border-[#D9A514]/30 text-[#7A6240] text-xs transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Mode Notice if not configured */}
      {demoMode && (
        <div className="p-4 rounded-2xl bg-[#FFFBEA] border border-[#D9A514]/40 text-[#5A4525] text-xs flex items-start gap-3 card-3d shadow-sm">
          <ShieldAlert className="w-5 h-5 text-[#8C6207] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[#8C6207] font-bengali">
              Demo Mode — AI is not connected (ডেমো মোড সক্রিয়)
            </div>
            <p className="text-[#5A4525] font-bengali leading-relaxed">
              সরাসরি AI সহকারী ব্যবহারের জন্য সার্ভারে <code className="bg-[#FFF7D6] px-1.5 py-0.5 rounded text-[#7D5106] border border-[#D9A514]/30 font-mono">GEMINI_API_KEY</code> সংযুক্ত থাকতে হবে। আমাদের সততা নীতি অনুসারে ডেমো মোডে কোনো অবাস্তব বা কৃত্রিম উত্তর পরিবেশন করা হয় না।
            </p>
          </div>
        </div>
      )}

      {/* Voice Input Error Notification if any */}
      {speechError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-[11px] underline text-[#8C6207] font-bold"
          >
            ঠিক আছে
          </button>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="space-y-4 min-h-[350px]">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-3xl p-5 sm:p-6 shadow-sm transition-all ${
                  isAssistant
                    ? msg.error
                      ? 'bg-red-50 border border-red-300 text-red-900'
                      : 'bg-[#FFFBEA] border border-[#D9A514]/30 text-[#493719] card-3d'
                    : 'btn-3d-gold text-[#382507] font-semibold rounded-tr-sm shadow-sm'
                }`}
              >
                {/* Assistant Header Badges */}
                {isAssistant && (
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9A514]/20 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#8C6207]">
                      <Sparkles className="w-3.5 h-3.5 text-[#176B50]" />
                      <span className="font-bengali">রাফিক ইসলামিক এআই</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#7A6240]">
                      <button
                        onClick={() => toggleSpeak(msg.id, msg.content)}
                        title={isSpeaking ? 'শব্দ বন্ধ করুন' : 'উত্তরের অডিও শুনুন'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSpeaking
                            ? 'bg-[#D9A514] text-[#382507] animate-pulse'
                            : 'hover:bg-[#FFF7D6] hover:text-[#493719]'
                        }`}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        title="টেক্সট কপি করুন"
                        className="p-1.5 rounded-lg hover:bg-[#FFF7D6] hover:text-[#493719] transition-colors"
                      >
                        {copiedMessageId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#176B50]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Content Body with Markdown Rendering */}
                <div
                  className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                    isAssistant ? 'font-bengali text-[#493719]' : 'font-bengali font-semibold text-[#382507]'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Retry Button on Error */}
                {isAssistant && msg.error && (
                  <div className="mt-3 pt-2.5 border-t border-red-200/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-red-700 font-bengali">
                      পুনরায় পাঠাতে ডানপাশের বাটনে চাপ দিন:
                    </span>
                    <button
                      onClick={() => handleRetry()}
                      disabled={loading}
                      className="btn-3d-gold px-3 py-1.5 rounded-xl text-xs font-bengali font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>পুনরায় পাঠান</span>
                    </button>
                  </div>
                )}

                {/* Source Citations Badges */}
                {isAssistant && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#D9A514]/20 space-y-2">
                    <div className="text-[11px] font-semibold text-[#8C6207] flex items-center gap-1 font-bengali">
                      <ShieldCheck className="w-3 h-3 text-[#176B50]" />
                      <span>যাচাইকৃত রেফারেন্স ও উৎস:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF7D6] hover:bg-[#FFFBEA] border border-[#D9A514]/30 hover:border-[#D9A514] text-[11px] font-mono text-[#493719] hover:text-[#8C6207] transition-colors shadow-2xs"
                        >
                          <span>{src.name}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#7A6240] mt-1 px-2 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="p-4 rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/30 flex items-center gap-3 card-3d">
              <div className="w-5 h-5 border-2 border-[#D9A514] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#8C6207] font-bengali font-semibold animate-pulse">
                কুরআন ও হাদিসের নির্ভরযোগ্য প্রমাণ যাচাই করে উত্তর তৈরি করা হচ্ছে...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions if only 1 message */}
      {messages.length <= 1 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-[#8C6207] font-bengali flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#176B50]" />
            <span>প্রস্তাবিত দ্বীনি প্রশ্নসমূহ (ক্লিক করুন):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleQuestions.map((q, idx) => {
              const text = selectedLanguage === 'ar' ? q.ar : selectedLanguage === 'en' ? q.en : q.bn;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(text)}
                  className="p-3 rounded-2xl bg-[#FFFBEA] hover:bg-[#FFF7D6] border border-[#D9A514]/30 hover:border-[#D9A514] text-left text-xs font-bengali text-[#493719] hover:text-[#8C6207] transition-all card-3d shadow-xs"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Sticky Input Bar */}
      <div className="sticky bottom-16 md:bottom-2 z-20 backdrop-blur-xl bg-[#FFFBEA]/95 p-3 rounded-3xl border border-[#D9A514]/35 shadow-xl space-y-2 card-3d">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'ভয়েস ইনপুট বন্ধ করুন' : 'মুখে বলে প্রশ্ন করুন'}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse'
                : 'bg-[#FFF7D6] hover:bg-[#FFFBEA] border-[#D9A514]/35 text-[#7A6240] hover:text-[#493719]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#176B50]" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              loading
                ? 'উত্তর তৈরি করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...'
                : isListening
                ? 'কথা বলুন, শোনা হচ্ছে...'
                : selectedLanguage === 'ar'
                ? 'اكتب سؤالك الشرعي هنا...'
                : selectedLanguage === 'en'
                ? 'Ask your question based on Quran & Sunnah...'
                : 'কুরআন ও হাদিসের আলোকে আপনার দ্বীনি প্রশ্নটি লিখুন...'
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/35 text-[#493719] placeholder-[#7A6240]/60 text-sm focus:outline-none focus:border-[#D9A514] transition-colors font-bengali shadow-2xs disabled:opacity-60"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl btn-3d-gold disabled:opacity-40 text-[#382507] font-bold transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[48px] min-h-[48px] cursor-pointer"
            title="বার্তা পাঠান"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#382507] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-[#382507]" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between px-2 text-[11px] text-[#7A6240] font-bengali">
          <span>* ব্যক্তিগত ফতোয়ার জন্য স্থানীয় বিজ্ঞ মুফতির পরামর্শ কাম্য।</span>
          <span className="font-mono text-[10px]">Quran & Sunnah Grounded AI</span>
        </div>
      </div>
    </div>
  );
};
