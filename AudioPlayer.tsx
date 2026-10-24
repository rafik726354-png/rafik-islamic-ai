import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  AlertCircle,
  RotateCcw,
  User,
  X,
  Check,
  Globe,
  Headphones,
  Info
} from 'lucide-react';
import { Ayah, Reciter, SurahMeta } from '../types/quran';
import { POPULAR_RECITERS } from '../data/reciters';
import {
  getBengaliSurahAudioUrl,
  getDirectArchiveAudioUrl,
  getBengaliAudioCandidateUrls,
  isTohaAudioAvailable,
  TOHA_AUDIO_METADATA,
} from '../data/bengaliAudioMap';
import { getPlayableAudioUrl } from '../services/audioCache';

export type ExtendedAudioMode = 'ar' | 'en' | 'ar_en' | 'bn_surah';

interface AudioPlayerProps {
  currentSurah: SurahMeta | null;
  ayahs: Ayah[];
  currentAyahIndex: number;
  setCurrentAyahIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeReciter: Reciter;
  setActiveReciter: (reciter: Reciter) => void;
  audioMode?: ExtendedAudioMode;
  setAudioMode?: (mode: ExtendedAudioMode) => void;
  onClose?: () => void;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
  bengaliUnavailableNotice?: string | null;
  setBengaliUnavailableNotice?: (notice: string | null) => void;
}

/**
 * Normalizes relative URLs to canonical absolute URLs for reliable equality checking
 */
function toCanonicalUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSurah,
  ayahs,
  currentAyahIndex,
  setCurrentAyahIndex,
  isPlaying,
  setIsPlaying,
  activeReciter,
  setActiveReciter,
  audioMode: externalAudioMode,
  setAudioMode: externalSetAudioMode,
  onClose,
  onNextSurah,
  onPrevSurah,
  bengaliUnavailableNotice,
  setBengaliUnavailableNotice,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentLoadedCanonicalUrlRef = useRef<string | null>(null);
  const candidateUrlsRef = useRef<string[]>([]);
  const candidateIndexRef = useRef<number>(0);
  const activeSurahNumRef = useRef<number | null>(null);
  const activeModeRef = useRef<ExtendedAudioMode>('ar');

  const [internalMode, setInternalMode] = useState<ExtendedAudioMode>('ar');
  const activeMode = externalAudioMode || internalMode;
  const updateMode = externalSetAudioMode || setInternalMode;

  const [dualPhase, setDualPhase] = useState<'arabic' | 'translation'>('arabic');
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [showReciterModal, setShowReciterModal] = useState<boolean>(false);
  const [showModeModal, setShowModeModal] = useState<boolean>(false);

  const currentAyah = ayahs[currentAyahIndex];

  // Build ordered list of candidate URLs for the current track
  const getCandidateUrls = useCallback((): string[] => {
    if (!currentSurah) return [];

    // Real human recording of full Surah with Syed Ismat Toha Bengali translation
    if (activeMode === 'bn_surah') {
      if (!isTohaAudioAvailable(currentSurah.number)) {
        return [];
      }
      return getBengaliAudioCandidateUrls(currentSurah.number);
    }

    if (!currentAyah) return [];

    // Real human Arabic recitation by selected Qari
    if (activeMode === 'ar') {
      return currentAyah.audio ? [currentAyah.audio] : [];
    }

    // Real human English recitation by Ibrahim Walk
    if (activeMode === 'en') {
      return currentAyah.audioEn ? [currentAyah.audioEn] : [];
    }

    // Dual mode (Arabic + English)
    if (activeMode === 'ar_en') {
      const url = dualPhase === 'arabic' ? currentAyah.audio : currentAyah.audioEn;
      return url ? [url] : [];
    }

    return currentAyah.audio ? [currentAyah.audio] : [];
  }, [currentSurah?.number, activeMode, currentAyah?.audio, currentAyah?.audioEn, dualPhase]);

  // Load and play a specific candidate URL with offline cache checking
  const loadAndPlayCandidate = useCallback(async (candidateIndex: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const candidates = candidateUrlsRef.current;
    if (candidateIndex >= candidates.length) {
      setIsPlaying(false);
      setIsBuffering(false);
      setAudioError('বাস্তব অডিও সার্ভার থেকে লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
      return;
    }

    const rawUrl = candidates[candidateIndex];
    candidateIndexRef.current = candidateIndex;

    // Check offline CacheStorage first for instant offline/online playback
    const playableUrl = await getPlayableAudioUrl(rawUrl);
    const targetCanonical = toCanonicalUrl(playableUrl);

    if (currentLoadedCanonicalUrlRef.current !== targetCanonical) {
      currentLoadedCanonicalUrlRef.current = targetCanonical;
      audio.src = playableUrl;
      // Note: Setting audio.src automatically loads the new media.
      // We do NOT call audio.load() to avoid AbortError race conditions.
    }

    setIsBuffering(true);
    setAudioError(null);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsBuffering(false);
          setAudioError(null);
        })
        .catch((err: any) => {
          // If aborted due to another rapid switch or pause, ignore cleanly
          if (err?.name === 'AbortError') {
            setIsBuffering(false);
            return;
          }

          console.warn(`Playback failed for candidate ${candidateIndex} (${rawUrl}):`, err);
          setIsBuffering(false);

          // Handle browser autoplay policy
          if (err?.name === 'NotAllowedError') {
            setIsPlaying(false);
            setAudioError('ব্রাউজারের সুরক্ষানীতি অনুযায়ী অডিও চালু করতে প্লে (Play) বাটনে ক্লিক করুন।');
            return;
          }

          // Try next fallback candidate if available
          if (candidateIndex + 1 < candidates.length) {
            console.log(`Trying fallback candidate ${candidateIndex + 1}...`);
            loadAndPlayCandidate(candidateIndex + 1);
          } else {
            setIsPlaying(false);
            setAudioError('বাস্তব অডিও সার্ভার থেকে লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
          }
        });
    }
  }, [setIsPlaying]);

  // Main playback coordination effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.pause();
      setIsBuffering(false);
      return;
    }

    // In full-surah Bengali mode, do NOT reload/interrupt playback if only the ayah index changed
    // within the same Surah. Syed Ismat Toha is a continuous full Surah recitation.
    const isSameBengaliSurah =
      activeMode === 'bn_surah' &&
      activeModeRef.current === 'bn_surah' &&
      activeSurahNumRef.current === currentSurah?.number &&
      currentLoadedCanonicalUrlRef.current !== null &&
      audio.src;

    if (isSameBengaliSurah) {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
      return;
    }

    activeModeRef.current = activeMode;
    activeSurahNumRef.current = currentSurah?.number || null;

    const candidates = getCandidateUrls();
    candidateUrlsRef.current = candidates;
    candidateIndexRef.current = 0;

    if (candidates.length === 0) {
      if (activeMode === 'bn_surah') {
        setAudioError('সৈয়দ ইসমত তোহার কণ্ঠে এই সূরার অডিও এখনো উপলব্ধ নয়।');
      } else {
        setAudioError('এই মোডের অডিও এখনো উপলব্ধ নয়।');
      }
      setIsPlaying(false);
      return;
    }

    loadAndPlayCandidate(0);
  }, [
    currentAyahIndex,
    activeMode,
    dualPhase,
    activeReciter.id,
    isPlaying,
    currentSurah?.number,
    getCandidateUrls,
    loadAndPlayCandidate,
    setIsPlaying,
  ]);

  // Handle Audio Ended
  const handleAudioEnded = () => {
    if (activeMode === 'ar_en') {
      if (dualPhase === 'arabic') {
        // Arabic ended, play English translation next
        setDualPhase('translation');
        return;
      } else {
        // English ended, advance to next ayah in Arabic
        setDualPhase('arabic');
        if (currentAyahIndex < ayahs.length - 1) {
          setCurrentAyahIndex(currentAyahIndex + 1);
        } else {
          setIsPlaying(false);
          if (onNextSurah) onNextSurah();
        }
        return;
      }
    }

    // Single mode: next ayah
    if (activeMode !== 'bn_surah') {
      if (currentAyahIndex < ayahs.length - 1) {
        setCurrentAyahIndex(currentAyahIndex + 1);
      } else {
        setIsPlaying(false);
        if (onNextSurah) onNextSurah();
      }
    } else {
      // Full surah Bengali audio finished
      setIsPlaying(false);
      if (onNextSurah) onNextSurah();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      setIsPlaying(true);
    }
  };

  const handleNextAyah = () => {
    if (activeMode === 'bn_surah') {
      if (onNextSurah) onNextSurah();
      return;
    }
    setDualPhase('arabic');
    if (currentAyahIndex < ayahs.length - 1) {
      setCurrentAyahIndex(currentAyahIndex + 1);
    } else if (onNextSurah) {
      onNextSurah();
    }
  };

  const handlePrevAyah = () => {
    if (activeMode === 'bn_surah') {
      if (currentTime > 5) {
        if (audioRef.current) audioRef.current.currentTime = 0;
      } else if (onPrevSurah) {
        onPrevSurah();
      }
      return;
    }
    setDualPhase('arabic');
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else if (currentAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
    } else if (onPrevSurah) {
      onPrevSurah();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTo;
    }
  };

  const toggleSpeed = () => {
    const rates = [1, 1.25, 1.5, 0.75];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        setIsPlaying(true);
      }
    }
  };

  const getModeLabel = () => {
    switch (activeMode) {
      case 'bn_surah':
        return 'বাংলা অর্থ পাঠ (সৈয়দ ইসমত তোহা)';
      case 'en':
        return 'English Audio (Ibrahim Walk)';
      case 'ar_en':
        return `আরবি + English (${dualPhase === 'arabic' ? 'আরবি' : 'English'})`;
      case 'ar':
      default:
        return `আরবি তিলাওয়াত (${activeReciter.banglaName})`;
    }
  };

  if (!currentSurah || ayahs.length === 0) return null;

  const handleRetry = () => {
    setAudioError(null);
    currentLoadedCanonicalUrlRef.current = null;
    candidateIndexRef.current = 0;
    setIsPlaying(true);
    loadAndPlayCandidate(0);
  };

  return (
    <>
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-30 bg-[#FFFBEA]/95 backdrop-blur-2xl border-t border-[#D9A514]/40 px-3 sm:px-6 py-2.5 shadow-2xl transition-all text-[#493719]">
        <audio
          ref={audioRef}
          preload="auto"
          onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
          onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
          onEnded={handleAudioEnded}
          onError={() => {
            const mediaErr = audioRef.current?.error;
            console.warn('Audio tag onError event:', mediaErr);
            setIsBuffering(false);

            // Code 1 is MEDIA_ERR_ABORTED - triggered when a previous fetch is intentionally aborted
            // by setting a new src. It is NOT a playback failure.
            if (mediaErr && mediaErr.code === 1) {
              return;
            }

            // If we have remaining fallback candidates, attempt next candidate
            const nextIdx = candidateIndexRef.current + 1;
            if (nextIdx < candidateUrlsRef.current.length) {
              console.log(`Audio error event: advancing to candidate ${nextIdx}...`);
              loadAndPlayCandidate(nextIdx);
              return;
            }

            setIsPlaying(false);
            setAudioError('বাস্তব অডিও সার্ভার থেকে লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => {
            setIsBuffering(false);
            setAudioError(null);
          }}
          onCanPlay={() => setIsBuffering(false)}
        />

        <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
          {/* Notice when Bengali single-ayah is clicked */}
          {bengaliUnavailableNotice && (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/60 text-[#7D5106] text-xs shadow-md animate-fadeIn">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#176B50] shrink-0" />
                <span className="font-bengali">{bengaliUnavailableNotice}</span>
              </div>
              <button
                onClick={() => setBengaliUnavailableNotice && setBengaliUnavailableNotice(null)}
                className="text-xs text-[#7A6240] hover:text-[#493719] p-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error Banner */}
          {audioError && (
            <div className="flex items-center justify-between gap-2 px-3 py-1 rounded-lg bg-[#FDF2F2] border border-red-300 text-red-800 text-xs shadow-xs">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{audioError}</span>
              </div>
              <button
                onClick={handleRetry}
                className="text-[11px] underline text-[#8C6207] hover:text-[#493719] font-bold font-bengali"
              >
                পুনরায় চেষ্টা
              </button>
            </div>
          )}

          {/* Player Main Controls Row */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Surah & Mode Info */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[170px] sm:max-w-xs">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7D6] border border-[#D9A514]/40 flex items-center justify-center text-[#8C6207] font-bold text-xs shrink-0 shadow-xs">
                {currentSurah.number}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-xs sm:text-sm font-bold text-[#493719] text-3d-raised truncate font-bengali flex items-center gap-1.5">
                  <span>{currentSurah.banglaName}</span>
                </div>
                <div className="text-[11px] text-[#8C6207] font-semibold truncate font-bengali flex items-center gap-1">
                  <span>{getModeLabel()}</span>
                  {activeMode !== 'bn_surah' ? (
                    <span className="text-[#176B50]">
                      • আয়াত {currentAyah?.numberInSurah || 1}
                    </span>
                  ) : (
                    <span className="text-[#176B50] hidden sm:inline">
                      • আল কুরআন একাডেমী লন্ডন
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handlePrevAyah}
                title="পূর্ববর্তী আয়াত বা ট্র্যাক"
                className="p-1.5 sm:p-2 rounded-full text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6] transition-colors"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={togglePlay}
                disabled={isBuffering && !isPlaying}
                title={isPlaying ? 'বিরতি (Pause)' : 'প্লে (Play)'}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full btn-3d-gold flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-[#382507]"
              >
                {isBuffering ? (
                  <div className="w-5 h-5 border-2 border-[#382507] border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-[#382507]" />
                ) : (
                  <Play className="w-5 h-5 fill-[#382507] ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextAyah}
                title="পরবর্তী আয়াত বা ট্র্যাক"
                className="p-1.5 sm:p-2 rounded-full text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6] transition-colors"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={handleRestart}
                title="শুরু থেকে পুনরায় চালানো (Restart)"
                className="p-1.5 sm:p-2 rounded-full text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right: Audio Language Mode & Reciter Switchers */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Mode Button */}
              <button
                onClick={() => setShowModeModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFF7D6] hover:bg-[#FFFBEA] border border-[#D9A514]/40 text-[#8C6207] text-xs font-bold transition-colors btn-3d-subtle"
                title="অডিও ভাষা ও অনুবাদ মোড"
              >
                <Globe className="w-3.5 h-3.5 text-[#176B50]" />
                <span className="hidden sm:inline font-bengali">অডিও মোড</span>
                <span className="sm:hidden text-[10px]">অডিও</span>
              </button>

              {/* Reciter Selector (Real Qaris only) */}
              {activeMode === 'ar' && (
                <button
                  onClick={() => setShowReciterModal(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#FFF7D6] hover:bg-[#FFFBEA] border border-[#D9A514]/30 text-[#493719] text-xs font-medium transition-colors"
                  title="বাস্তব ক্বারী পরিবর্তন করুন"
                >
                  <User className="w-3.5 h-3.5 text-[#176B50]" />
                  <span className="hidden lg:inline font-bengali truncate max-w-[90px]">
                    {activeReciter.banglaName}
                  </span>
                </button>
              )}

              {/* Speed Toggle */}
              <button
                onClick={toggleSpeed}
                title="প্লেব্যাক স্পিড"
                className="px-2 py-1.5 rounded-lg bg-[#FFF7D6] hover:bg-[#FFFBEA] border border-[#D9A514]/30 text-[11px] font-mono text-[#493719] font-semibold shadow-xs"
              >
                {playbackRate}x
              </button>
            </div>
          </div>

          {/* Progress Bar & Timestamps */}
          <div className="flex items-center gap-2 text-[10px] text-[#7A6240] font-mono">
            <span className="w-8 text-right font-medium">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-[#E8DCB8] rounded-lg appearance-none cursor-pointer accent-[#D9A514]"
            />
            <span className="w-8 font-medium">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Audio Language & Real Recording Selection Modal */}
      {showModeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFBEA] border border-[#D9A514]/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp card-3d text-[#493719]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9A514]/30">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#176B50]" />
                <h3 className="text-base font-bold text-[#493719] text-3d-raised font-bengali">
                  বাস্তব অডিও ও রেকর্ডিং নির্বাচন
                </h3>
              </div>
              <button
                onClick={() => setShowModeModal(false)}
                className="p-1.5 rounded-lg text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5A4525] font-bengali">
              প্রকৃত মানুষের কণ্ঠে রেকর্ডকৃত অনুমতিপ্রাপ্ত অডিও নির্বাচন করুন (কোনো কৃত্রিম AI কণ্ঠ ব্যবহার করা হয় না):
            </p>

            <div className="space-y-2">
              {[
                {
                  id: 'ar',
                  titleBn: '🇸🇦 আরবি তিলাওয়াত (বাস্তব ক্বারীর কণ্ঠ)',
                  desc: 'মিশারি আল-আফাসি, আব্দুল বাসেত, আল-হুসারি প্রমুখ নির্ভরযোগ্য ক্বারীদের তিলাওয়াত।',
                },
                {
                  id: 'bn_surah',
                  titleBn: '📻 সৈয়দ ইসমত তোহার কণ্ঠে বাংলা কোরআনের অর্থ পাঠ',
                  desc: 'আল কুরআন একাডেমী লন্ডন কর্তৃক প্রকাশিত: বাচিক শিল্পী সৈয়দ ইসমত তোহার আসল কণ্ঠের সাবলীল বাংলা অর্থ পাঠ (উৎস: Archive.org)।',
                },
                {
                  id: 'en',
                  titleBn: '🇬🇧 ইংরেজি অনুবাদ অডিও (বাস্তব মানব কণ্ঠ - Ibrahim Walk)',
                  desc: 'Saheeh International স্টুডিও-রেকর্ডকৃত ইব্রাহিম ওয়াকের বিশুদ্ধ ইংরেজি অডিও।',
                },
                {
                  id: 'ar_en',
                  titleBn: '🔄 আরবি + English দ্বৈত অডিও (পর্যায়ক্রমিক)',
                  desc: 'প্রথমে ক্বারীর আরবি তিলাওয়াত, তার পরপরই ইব্রাহিম ওয়াকের ইংরেজি অনুবাদ অডিও।',
                },
              ].map((opt) => {
                const isSelected = activeMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      updateMode(opt.id as ExtendedAudioMode);
                      setDualPhase('arabic');
                      setShowModeModal(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#D9A514]/20 border-[#D9A514] text-[#382507] shadow-xs'
                        : 'bg-[#FFF7D6] border-[#D9A514]/30 text-[#493719] hover:bg-[#FFFBEA]'
                    }`}
                  >
                    <div>
                      <div className="font-bengali font-bold text-sm text-[#493719] flex items-center gap-1.5">
                        <span>{opt.titleBn}</span>
                      </div>
                      <div className="text-[11px] text-[#5A4525] font-bengali mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#176B50] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reciter Selection Modal (Real Qaris) */}
      {showReciterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFBEA] border border-[#D9A514]/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp card-3d text-[#493719]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9A514]/30">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#176B50]" />
                <h3 className="text-base font-bold text-[#493719] text-3d-raised font-bengali">
                  বাস্তব ক্বারী নির্বাচন করুন (Authentic Qari)
                </h3>
              </div>
              <button
                onClick={() => setShowReciterModal(false)}
                className="p-1.5 rounded-lg text-[#7A6240] hover:text-[#493719] hover:bg-[#FFF7D6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {POPULAR_RECITERS.map((r) => {
                const isSelected = r.id === activeReciter.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveReciter(r);
                      setShowReciterModal(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#D9A514]/20 border-[#D9A514] text-[#382507] shadow-xs'
                        : 'bg-[#FFF7D6] border-[#D9A514]/30 text-[#493719] hover:bg-[#FFFBEA]'
                    }`}
                  >
                    <div>
                      <div className="font-bengali font-bold text-sm text-[#493719]">
                        {r.banglaName}
                      </div>
                      <div className="font-arabic text-xs text-[#8C6207] mt-0.5">
                        {r.arabicName}
                      </div>
                      <div className="text-[10px] text-[#7A6240] mt-0.5 font-sans">
                        {r.englishName} • {r.quality}
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#176B50]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
