import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { QuranReader } from './components/QuranReader';
import { IslamicLibrary } from './components/IslamicLibrary';
import { AiAssistant } from './components/AiAssistant';
import { AudioPlayer } from './components/AudioPlayer';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { POPULAR_RECITERS } from './data/reciters';
import { Ayah, Reciter, SurahMeta } from './types/quran';
import { checkAiStatus } from './services/aiApi';

export default function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    // Show welcome screen initially
    return true;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'quran' | 'library' | 'ai'>('home');
  const [targetSurahNumber, setTargetSurahNumber] = useState<number>(1);

  // Reciter & Audio state
  const [activeReciter, setActiveReciter] = useState<Reciter>(() => {
    try {
      const stored = localStorage.getItem('rafik_preferred_reciter');
      if (stored) {
        const found = POPULAR_RECITERS.find((r) => r.id === stored);
        if (found) return found;
      }
    } catch (e) {
      console.warn(e);
    }
    return POPULAR_RECITERS[0]; // Mishary Alafasy
  });

  const [currentSurah, setCurrentSurah] = useState<SurahMeta | null>(null);
  const [currentAyahs, setCurrentAyahs] = useState<Ayah[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<'ar' | 'en' | 'ar_en' | 'bn_surah'>('ar');
  const [bengaliNotice, setBengaliNotice] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // AI Status
  const [demoMode, setDemoMode] = useState<boolean>(true);

  // Check backend health & AI status on mount
  useEffect(() => {
    checkAiStatus().then((status) => {
      setDemoMode(status.demoMode);
    });
  }, []);

  // Save reciter preference
  const handleReciterChange = (r: Reciter) => {
    setActiveReciter(r);
    try {
      localStorage.setItem('rafik_preferred_reciter', r.id);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleOpenQuranFromWelcome = () => {
    setTargetSurahNumber(1);
    setActiveTab('quran');
    setShowWelcome(false);
  };

  const handleEnterDashboardFromWelcome = () => {
    setActiveTab('home');
    setShowWelcome(false);
  };

  const handleNavigate = (tab: string, surahNum?: number) => {
    if (surahNum) {
      setTargetSurahNumber(surahNum);
    }
    setActiveTab(tab as any);
  };

  const handleSurahDataLoaded = (surah: SurahMeta, ayahs: Ayah[]) => {
    setCurrentSurah(surah);
    setCurrentAyahs(ayahs);
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        onOpenQuran={handleOpenQuranFromWelcome}
        onEnterDashboard={handleEnterDashboardFromWelcome}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-islamic-pattern text-[#493719] flex flex-col selection:bg-[#D9A514]/30 selection:text-[#493719]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isPlayingAudio={isPlaying}
        demoMode={demoMode}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <Dashboard onNavigate={handleNavigate} demoMode={demoMode} />
        )}

        {activeTab === 'quran' && (
          <QuranReader
            initialSurahNumber={targetSurahNumber}
            activeReciter={activeReciter}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentAyahIndex={currentAyahIndex}
            setCurrentAyahIndex={setCurrentAyahIndex}
            onSurahChange={handleSurahDataLoaded}
            audioMode={audioMode}
            setAudioMode={setAudioMode}
            setBengaliNotice={setBengaliNotice}
          />
        )}

        {activeTab === 'library' && <IslamicLibrary />}

        {activeTab === 'ai' && (
          <AiAssistant
            demoMode={demoMode}
            onRefreshHealth={() => checkAiStatus().then((s) => setDemoMode(s.demoMode))}
          />
        )}
      </main>

      {/* Persistent Audio Player Bar */}
      <AudioPlayer
        currentSurah={currentSurah}
        ayahs={currentAyahs}
        currentAyahIndex={currentAyahIndex}
        setCurrentAyahIndex={setCurrentAyahIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        activeReciter={activeReciter}
        setActiveReciter={handleReciterChange}
        audioMode={audioMode}
        setAudioMode={setAudioMode}
        bengaliUnavailableNotice={bengaliNotice}
        setBengaliUnavailableNotice={setBengaliNotice}
        onClose={() => {
          setIsPlaying(false);
          setCurrentSurah(null);
        }}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={(t) => setActiveTab(t as any)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeReciter={activeReciter}
        setActiveReciter={handleReciterChange}
      />

      {/* About & Sources Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
