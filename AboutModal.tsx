import React from 'react';
import { X, ExternalLink, ShieldCheck, Info } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#302719]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFBEA] border border-[#D9A514]/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl card-3d max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5D6B3]">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#176B50]" />
            <h2 className="text-lg font-bold text-[#493719] text-3d-raised font-bengali">
              পরিচিতি ও তথ্যসূত্র (About & Sources)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Info Banner */}
        <div className="text-center py-2 space-y-1">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#176B50] text-2xl font-arabic font-bold mx-auto shadow-inner">
            قرآن
          </div>
          <h3 className="text-xl font-extrabold text-[#493719] text-3d-raised font-bengali">
            রাফিক ইসলামিক এআই
          </h3>
          <div className="text-xs text-[#8C6207] font-cinzel font-semibold">Rafik Islamic AI — Prototype v1.0</div>
          <p className="text-xs text-[#5D4A2F] font-bengali max-w-sm mx-auto pt-1 font-medium">
            কুরআন, হাদিস ও নির্ভরযোগ্য ইসলামিক জ্ঞানের বিশ্বস্ত সঙ্গী।
          </p>
        </div>

        {/* Verified Data Sources & Attribution */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-[#493719] font-bengali flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#176B50]" />
            <span>যাচাইকৃত ডেটা প্রোভাইডার ও উৎসসমূহ:</span>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 card-3d flex items-center justify-between">
            <div>
              <div className="font-bold text-[#493719] text-xs font-sans">QuranEnc.com (কিং ফাহাদ কমপ্লেক্স অনুমোদিত)</div>
              <div className="text-[#7A6240] text-[11px] font-bengali">
                ড. আবূ বকর মুহাম্মাদ যাকারিয়ার হুবহু প্রকাশিত প্রামাণিক বাংলা অনুবাদ ও টীকা (Verbatim Original)
              </div>
            </div>
            <a
              href="https://quranenc.com/bn/browse/bengali_zakaria"
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6207] hover:text-[#493719] flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>quranenc.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 card-3d flex items-center justify-between">
            <div>
              <div className="font-bold text-[#493719] text-xs font-sans">AlQuran Cloud & Islamic Network CDN</div>
              <div className="text-[#7A6240] text-[11px] font-bengali">
                মূল উসমানি আরবি পাঠ, বিশ্বসেরা বাস্তব কারীদের তিলাওয়াত ও ইব্রাহিম ওয়াকের ইংরেজি অডিও
              </div>
            </div>
            <a
              href="https://api.alquran.cloud/"
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6207] hover:text-[#493719] flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>api.alquran.cloud</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 card-3d flex items-center justify-between">
            <div>
              <div className="font-bold text-[#493719] text-xs font-sans">আল কুরআন একাডেমী লন্ডন & সৈয়দ ইসমত তোহা</div>
              <div className="text-[#7A6240] text-[11px] font-bengali">
                বাচিক শিল্পী সৈয়দ ইসমত তোহার মূল কণ্ঠের বাংলা অর্থ পাঠ (Al-QuranArabicToBanglaAudio, Archive.org)
              </div>
            </div>
            <a
              href="https://archive.org/details/Al-QuranArabicToBanglaAudio"
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6207] hover:text-[#493719] flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>archive.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 card-3d flex items-center justify-between">
            <div>
              <div className="font-bold text-[#493719] text-xs font-sans">Quran.com & King Fahd Complex</div>
              <div className="text-[#7A6240] text-[11px] font-bengali">
                শব্দে শব্দে অর্থ ও তাফসির ইবনে কাসির
              </div>
            </div>
            <a
              href="https://quran.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6207] hover:text-[#493719] flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>quran.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 card-3d flex items-center justify-between">
            <div>
              <div className="font-bold text-[#493719] text-xs font-sans">Sunnah.com</div>
              <div className="text-[#7A6240] text-[11px] font-bengali">
                সিহাহ সিত্তাহ সহিহ হাদিস সংকলন ও হিসনুল মুসলিম
              </div>
            </div>
            <a
              href="https://sunnah.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6207] hover:text-[#493719] flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>sunnah.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/30 card-3d flex items-center justify-between">
            <div>
              <div className="font-bold text-[#493719] text-xs font-sans">IslamHouse.com</div>
              <div className="text-[#7A6240] text-[11px] font-bengali">
                বাংলা ইসলামিক বই, সীরাত, আকিদা ও ফিকহ রিসোর্স
              </div>
            </div>
            <a
              href="https://islamhouse.com/bn/"
              target="_blank"
              rel="noreferrer"
              className="text-[#8C6207] hover:text-[#493719] flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>islamhouse.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Fatwa & Islamic Religious Disclaimer */}
        <div className="p-4 rounded-2xl bg-[#FFF3C4]/80 border border-[#D9A514]/40 space-y-2">
          <div className="text-xs font-bold text-[#8C6207] font-bengali flex items-center gap-1.5">
            <span>⚠️</span>
            <span>শরয়ী ও ফতোয়া বিষয়ক সতর্কবার্তা:</span>
          </div>
          <p className="text-xs text-[#5D4A2F] font-bengali leading-relaxed font-medium">
            রাফিক ইসলামিক এআই একটি গবেষণা ও ইসলামিক তথ্য সহায়ক প্ল্যাটফর্ম। এটি কোনো মানব মুফতি বা ফতোয়া প্রদানকারী প্রতিষ্ঠান নয়। ব্যক্তিগত জটিল সমস্যা, পারিবারিক মাসআলা বা নির্দিষ্ট ফতোয়ার ক্ষেত্রে সর্বদা স্থানীয় প্রাজ্ঞ ও বিজ্ঞ আলেম/মুফতির শরণাপন্ন হওয়ার পরামর্শ দেওয়া হচ্ছে।
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn-3d-subtle w-full py-2.5 rounded-xl font-bengali text-sm font-semibold transition-colors"
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
};
