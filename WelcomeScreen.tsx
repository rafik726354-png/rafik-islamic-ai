import React from 'react';
import { BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onOpenQuran: () => void;
  onEnterDashboard: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenQuran,
  onEnterDashboard,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 sm:p-10 overflow-hidden bg-[#FFF7D6] bg-islamic-pattern select-none text-[#493719]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D9A514]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#176B50]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Quran Cover Borders */}
      <div className="absolute inset-4 sm:inset-8 border border-[#D9A514]/30 rounded-3xl pointer-events-none flex flex-col justify-between p-3 sm:p-6">
        <div className="flex justify-between items-center text-[#8C6207]/60 text-xs sm:text-sm font-arabic font-semibold">
          <span>﷽</span>
          <span className="tracking-widest">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
          <span>﷽</span>
        </div>
        <div className="flex justify-between items-center text-[#8C6207]/40 text-xs">
          <span>۞</span>
          <div className="w-16 h-px bg-[#D9A514]/30"></div>
          <span>۞</span>
        </div>
      </div>

      {/* Top Header Badge */}
      <div className="relative z-10 pt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFBEA] border border-[#D9A514]/40 text-[#493719] text-xs sm:text-sm font-semibold card-3d shadow-md backdrop-blur-md">
        <ShieldCheck className="w-4 h-4 text-[#176B50]" />
        <span>প্রামাণিক ও নির্ভরযোগ্য ইসলামিক প্ল্যাটফর্ম</span>
      </div>

      {/* Center Sacred Quran Cover Medallion */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg my-auto py-8">
        {/* Glowing Rub-el-Hizb Sacred Emblem */}
        <div className="relative mb-8 group cursor-pointer" onClick={onOpenQuran}>
          <div className="absolute inset-0 bg-[#D9A514]/20 rounded-full blur-xl group-hover:bg-[#D9A514]/35 transition-all duration-700 animate-pulse" />
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl flex items-center justify-center p-2">
            {/* Outer Rotating Islamic Star Ornament */}
            <div className="absolute inset-0 border-2 border-[#D9A514]/50 rounded-2xl rotate-45 transform transition-transform duration-1000 group-hover:rotate-90 bg-[#FFFBEA] shadow-xl card-3d" />
            <div className="absolute inset-0 border-2 border-[#D9A514]/60 rounded-2xl rotate-0 bg-[#FFF7D6] shadow-inner" />
            
            {/* Inner Sacred Calligraphy / Quran Emblem */}
            <div className="relative z-10 flex flex-col items-center justify-center text-[#493719]">
              <span className="font-arabic text-3xl sm:text-4xl text-3d-raised font-bold drop-shadow">
                القرآن
              </span>
              <span className="text-[10px] tracking-widest text-[#8C6207] uppercase mt-0.5 font-cinzel font-semibold">
                Al-Quran Al-Kareem
              </span>
            </div>
          </div>
        </div>

        {/* Titles */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#493719] text-3d-raised font-bengali tracking-tight mb-2 drop-shadow-sm">
          রাফিক ইসলামিক এআই
        </h1>
        <h2 className="text-lg sm:text-xl font-bold text-[#8C6207] tracking-wide font-cinzel mb-4">
          Rafik Islamic AI
        </h2>

        {/* Welcome Text */}
        <p className="text-[#493719] text-sm sm:text-base font-bengali font-medium leading-relaxed max-w-md px-4">
          কুরআন, হাদিস ও নির্ভরযোগ্য ইসলামিক জ্ঞানের বিশ্বস্ত সঙ্গী।
        </p>
        <p className="text-xs text-[#7A6240] mt-1 font-sans">
          Authentic Quran, Recitation, Sunnah & Source-Grounded AI
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-md justify-center px-4">
          {/* Main Glowing Open Quran Button */}
          <button
            onClick={onOpenQuran}
            className="btn-3d-gold flex-1 group relative px-6 py-3.5 rounded-xl font-bold text-[#493719] flex items-center justify-center gap-2.5 transition-all duration-300"
          >
            <BookOpen className="w-5 h-5 text-[#176B50] transition-transform group-hover:scale-110" />
            <span className="font-bengali text-base tracking-wide">আল-কুরআন ওপেন</span>
          </button>

          {/* Enter Dashboard Button */}
          <button
            onClick={onEnterDashboard}
            className="btn-3d-subtle flex-1 px-6 py-3.5 rounded-xl font-bold text-[#493719] flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Compass className="w-5 h-5 text-[#8C6207]" />
            <span className="font-bengali text-base">মূল ড্যাশবোর্ড</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="relative z-10 pb-4 text-center text-xs text-[#7A6240]">
        <span className="font-bengali">সকল প্রশংসা মহান আল্লাহ রাব্বুল আলামিনের</span>
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C6207] mt-1 font-mono font-medium">
          <span>v1.0.0</span>
          <span>•</span>
          <span>Pure Web & PWA Applet</span>
        </div>
      </div>
    </div>
  );
};
