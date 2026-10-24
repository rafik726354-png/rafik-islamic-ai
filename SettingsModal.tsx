import React, { useState } from 'react';
import { X, Check, Trash2, Smartphone, ShieldCheck, User, Globe, RotateCcw } from 'lucide-react';
import { Reciter } from '../types/quran';
import { POPULAR_RECITERS } from '../data/reciters';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeReciter: Reciter;
  setActiveReciter: (r: Reciter) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeReciter,
  setActiveReciter,
}) => {
  const [clearedNotice, setClearedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClearCache = () => {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith('rafik_quran_surah_')) {
          localStorage.removeItem(k);
        }
      }
      setClearedNotice('অফলাইন সূরা ক্যাশ সফলভাবে খালি করা হয়েছে।');
      setTimeout(() => setClearedNotice(null), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearBookmarks = () => {
    localStorage.removeItem('rafik_quran_bookmarks');
    localStorage.removeItem('rafik_last_read');
    setClearedNotice('সংরক্ষিত বুকমার্ক ও সর্বশেষ পাঠ মুছে ফেলা হয়েছে।');
    setTimeout(() => setClearedNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FFFBEA] border border-[#D9A514]/40 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto card-3d text-[#493719]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9A514]/30">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#493719] text-3d-raised font-bengali">অ্যাপ সেটিংস ও পছন্দসমূহ</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {clearedNotice && (
          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/50 text-[#7D5106] text-xs font-bengali flex items-center gap-2 shadow-xs">
            <Check className="w-4 h-4 text-[#176B50]" />
            <span>{clearedNotice}</span>
          </div>
        )}

        {/* Section 1: Default Reciter */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#8C6207] font-bengali flex items-center gap-2">
            <User className="w-4 h-4 text-[#176B50]" />
            <span>ডিফল্ট ক্বারী নির্বাচন (Reciter)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_RECITERS.map((r) => {
              const isSelected = r.id === activeReciter.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveReciter(r)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#D9A514]/20 border-[#D9A514] text-[#382507] shadow-xs'
                      : 'bg-[#FFF7D6] border-[#D9A514]/30 text-[#493719] hover:bg-[#FFFBEA]'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bengali text-xs font-bold truncate">{r.banglaName}</div>
                    <div className="text-[10px] text-[#8C6207] truncate font-arabic">{r.arabicName}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#176B50] shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Android & PWA App Guide */}
        <div className="p-4 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/30 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#8C6207] text-xs font-bold font-bengali">
            <Smartphone className="w-4 h-4 text-[#176B50]" />
            <span>Android ফোনে ইনস্টলেশন (PWA Setup)</span>
          </div>
          <p className="text-xs text-[#5A4525] font-bengali leading-relaxed">
            এই অ্যাপ্লিকেশনটি অ্যান্ড্রয়েড ক্রোম ব্রাউজারে ইনস্টলযোগ্য। ব্রাউজারের উপরের ডানদিকের ৩টি ডট (⋮) মেন্যুতে ট্যাপ করে <strong className="text-[#8C6207]">“Add to Home screen”</strong> বা <strong className="text-[#8C6207]">“Install app”</strong> নির্বাচন করুন।
          </p>
        </div>

        {/* Section 3: Data & Cache Maintenance */}
        <div className="space-y-3 pt-2 border-t border-[#D9A514]/20">
          <label className="text-xs font-bold text-[#8C6207] font-bengali flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#176B50]" />
            <span>মেমোরি ও ক্যাশ ম্যানেজমেন্ট</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleClearCache}
              className="flex-1 px-3 py-2 rounded-xl btn-3d-subtle text-xs font-bengali font-bold"
            >
              কুরআন অফলাইন ক্যাশ মুছুন
            </button>
            <button
              onClick={handleClearBookmarks}
              className="flex-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bengali text-red-700 font-semibold transition-colors"
            >
              বুকমার্ক ও ইতিহাস মুছুন
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl btn-3d-gold font-bold font-bengali text-sm shadow-md"
        >
          সম্পন্ন
        </button>
      </div>
    </div>
  );
};
