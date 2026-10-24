import React, { useEffect, useState } from 'react';
import { BookOpen, Library, Sparkles, ArrowRight, Bookmark, Volume2, ShieldCheck, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { ALL_SURAHS } from '../data/surahs';
import { Bookmark as BookmarkType } from '../types/quran';

interface DashboardProps {
  onNavigate: (tab: string, surahNumber?: number) => void;
  demoMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, demoMode }) => {
  const [lastRead, setLastRead] = useState<BookmarkType | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rafik_last_read');
      if (stored) {
        setLastRead(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error reading last read:', e);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn pb-36 md:pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/35 p-6 sm:p-10 card-3d shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A514]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7D6] border border-[#D9A514]/40 text-[#7D5106] text-xs font-semibold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B50]" />
              <span>সহিহ ও নির্ভরযোগ্য ইসলামিক রিসোর্স</span>
            </div>
            {/* User requirement: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ" single line on mobile via responsive fluid typography */}
            <div className="overflow-hidden">
              <h1 className="text-[clamp(1.15rem,4.2vw,2.25rem)] font-extrabold text-[#493719] text-3d-raised font-bengali tracking-tight whitespace-nowrap">
                আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ
              </h1>
            </div>
            <p className="text-[#5A4525] text-sm sm:text-base font-bengali leading-relaxed">
              পবিত্র কুরআনের নূর, সহিহ সুন্নাহ ও নির্ভরযোগ্য ইসলামিক জ্ঞানের আলোয় জীবনকে সমৃদ্ধ করুন। রাফিক ইসলামিক এআই আপনার প্রাত্যহিক দ্বীনি সহচর।
            </p>
          </div>

          {/* Quick Stats or Last Read Widget */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {lastRead ? (
              <button
                onClick={() => onNavigate('quran', lastRead.surahNumber)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/40 hover:border-[#D9A514] text-left transition-all hover:scale-[1.02] shadow-sm group btn-3d-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEA] border border-[#D9A514]/30 flex items-center justify-center text-[#8C6207] group-hover:scale-110 transition-transform shadow-xs">
                  <Bookmark className="w-5 h-5 fill-[#D9A514]/40" />
                </div>
                <div>
                  <div className="text-[11px] text-[#7D5106] font-semibold">সর্বশেষ পাঠ (Last Read)</div>
                  <div className="text-sm font-bold text-[#493719]">
                    {lastRead.surahName} : আয়াত {lastRead.ayahNumber}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C6207] ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('quran', 1)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/40 hover:border-[#D9A514] text-left transition-all hover:scale-[1.02] shadow-sm group btn-3d-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEA] border border-[#D9A514]/30 flex items-center justify-center text-[#176B50] shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#7D5106] font-semibold">কুরআন তিলাওয়াত শুরু করুন</div>
                  <div className="text-sm font-bold text-[#493719] font-bengali">
                    সূরা আল-ফাতিহা (সূচনা)
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C6207] ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {/* AI Status Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 text-xs shadow-xs">
              {demoMode ? (
                <>
                  <AlertCircle className="w-4 h-4 text-[#8C6207] shrink-0" />
                  <span className="text-[#5A4525] font-bengali">
                    AI স্ট্যাটাস: <strong className="text-[#8C6207]">ডেমো মোড</strong> (API Key যুক্ত করুন)
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#176B50] shrink-0" />
                  <span className="text-[#5A4525] font-bengali">
                    AI স্ট্যাটাস: <strong className="text-[#176B50]">সক্রিয় ও প্রস্তুত</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Main Core Feature Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#493719] text-3d-raised font-bengali flex items-center gap-2">
            <span className="text-[#176B50]">❖</span>
            প্রধান ফিচারসমূহ
          </h2>
          <span className="text-xs text-[#7A6240] font-cinzel font-semibold">Core Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Al-Quran */}
          <div
            onClick={() => onNavigate('quran')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/30 hover:border-[#D9A514] p-6 sm:p-8 card-3d card-3d-hover flex flex-col justify-between min-h-[290px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A514]/8 rounded-full blur-2xl group-hover:bg-[#D9A514]/15 transition-all" />
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#176B50] group-hover:scale-110 group-hover:border-[#D9A514] transition-all shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#8C6207] uppercase tracking-widest font-cinzel">
                  Module 01
                </span>
                <h3 className="text-2xl font-bold text-[#493719] text-3d-raised font-bengali mt-1 group-hover:text-[#8C6207] transition-colors">
                  আল-কুরআন (Al-Quran)
                </h3>
              </div>
              <p className="text-[#5A4525] text-sm font-bengali leading-relaxed">
                পবিত্র কুরআনের মূল আরবি তিলাওয়াত, ড. আবূ বকর মুহাম্মাদ যাকারিয়ার বিশুদ্ধ বাংলা অনুবাদ এবং সৈয়দ ইসমত তোহার কণ্ঠের মূল অর্থ পাঠ শুনুন ও অধ্যয়ন করুন।
              </p>
            </div>

            <div className="pt-4 border-t border-[#D9A514]/25 flex items-center justify-between text-[#8C6207] text-sm font-bold relative z-10">
              <span className="font-bengali">কুরআন পড়ুন ও শুনুন</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF7D6] border border-[#D9A514]/30 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#8C6207]" />
              </div>
            </div>
          </div>

          {/* Card 2: Islamic Library */}
          <div
            onClick={() => onNavigate('library')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/30 hover:border-[#D9A514] p-6 sm:p-8 card-3d card-3d-hover flex flex-col justify-between min-h-[290px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#176B50]/6 rounded-full blur-2xl group-hover:bg-[#176B50]/12 transition-all" />
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#176B50] group-hover:scale-110 group-hover:border-[#D9A514] transition-all shadow-sm">
                <Library className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#8C6207] uppercase tracking-widest font-cinzel">
                  Module 02
                </span>
                <h3 className="text-2xl font-bold text-[#493719] text-3d-raised font-bengali mt-1 group-hover:text-[#8C6207] transition-colors">
                  ইসলামিক লাইব্রেরি (Library)
                </h3>
              </div>
              <p className="text-[#5A4525] text-sm font-bengali leading-relaxed">
                তাফসির, সহিহ হাদিস সংকলন (বুখারি, মুসলিম), হিসনুল মুসলিমের প্রামাণিক দোয়া-জিকির, সিরাত, আকিদা ও ফিকহের প্রামাণ্য গ্রন্থ ও নির্দেশিকা।
              </p>
            </div>

            <div className="pt-4 border-t border-[#D9A514]/25 flex items-center justify-between text-[#8C6207] text-sm font-bold relative z-10">
              <span className="font-bengali">লাইব্রেরি অন্বেষণ করুন</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF7D6] border border-[#D9A514]/30 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#8C6207]" />
              </div>
            </div>
          </div>

          {/* Card 3: Islamic AI Assistant */}
          <div
            onClick={() => onNavigate('ai')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/30 hover:border-[#D9A514] p-6 sm:p-8 card-3d card-3d-hover flex flex-col justify-between min-h-[290px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A514]/8 rounded-full blur-2xl group-hover:bg-[#D9A514]/15 transition-all" />
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#8C6207] group-hover:scale-110 group-hover:border-[#D9A514] transition-all shadow-sm">
                <Sparkles className="w-7 h-7 text-[#D9A514]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#8C6207] uppercase tracking-widest font-cinzel">
                  Module 03
                </span>
                <h3 className="text-2xl font-bold text-[#493719] text-3d-raised font-bengali mt-1 group-hover:text-[#8C6207] transition-colors">
                  ইসলামিক AI সহকারী
                </h3>
              </div>
              <p className="text-[#5A4525] text-sm font-bengali leading-relaxed">
                কুরআন ও হাদিসের সুস্পষ্ট প্রমাণসহ দ্বীনি প্রশ্নের উত্তর জানুন। বাংলা, আরবি ও ইংরেজিতে প্রশ্ন করুন এবং প্রামাণিক রেফারেন্স যাচাই করুন।
              </p>
            </div>

            <div className="pt-4 border-t border-[#D9A514]/25 flex items-center justify-between text-[#8C6207] text-sm font-bold relative z-10">
              <span className="font-bengali">AI-কে প্রশ্ন করুন</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF7D6] border border-[#D9A514]/30 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 text-[#8C6207]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Spiritual Guidance Ayah of the Day */}
      <div className="rounded-3xl bg-[#FFFBEA] border border-[#D9A514]/35 p-6 sm:p-8 relative overflow-hidden card-3d shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#8C6207] font-bengali text-sm font-bold">
            <span className="text-[#176B50]">۞</span>
            <span>আজকের নির্বাচিত আয়াত (Ayah of the Day)</span>
          </div>
          <span className="text-xs text-[#7A6240] font-cinzel font-semibold">Surah Al-Baqarah 2:286</span>
        </div>

        <div className="space-y-4 text-center my-2">
          <p className="font-arabic text-xl sm:text-3xl text-[#382507] text-3d-arabic leading-loose py-2 select-all">
            لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا
          </p>
          <p className="text-[#493719] text-base sm:text-lg font-bengali font-semibold max-w-2xl mx-auto">
            “আল্লাহ্ কারো উপর এমন কোন কষ্টদায়ক দায়িত্ব অর্পণ করেন না যা তার সাধ্যাতীত...”
          </p>
          <p className="text-xs text-[#7A6240] font-bengali">
            [সূরা আল-বাকারা ২:২৮৬ • অনুবাদ: ড. আবূ বকর মুহাম্মাদ যাকারিয়া (উৎস: QuranEnc)]
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onNavigate('quran', 2)}
            className="btn-3d-gold px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bengali font-bold flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#176B50]" />
            <span>সূরা আল-বাকারা পূর্ণাঙ্গ পাঠ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
