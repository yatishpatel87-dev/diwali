import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import { 
  mantraChanter, 
  MANTRA_TRACKS, 
  MantraTrack,
  AVAILABLE_SPEAKERS
} from '../utils/mantraChanter';
import { 
  Bell, 
  Flower2, 
  Sparkles, 
  Wind, 
  Flame, 
  Sun, 
  Play, 
  Pause, 
  Music, 
  Volume2, 
  VolumeX,
  RotateCcw,
  BookOpen,
  Mic
} from 'lucide-react';

interface LaxmiPujaAartiProps {
  lang: Language;
}

interface PetalParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export const LaxmiPujaAarti: React.FC<LaxmiPujaAartiProps> = ({ lang }) => {
  const currentT = t[lang].pujaGame;

  // Puja state
  const [aartiAngle, setAartiAngle] = useState<number>(0);
  const [bellRinging, setBellRinging] = useState<boolean>(false);
  const [hasTilak, setHasTilak] = useState<boolean>(true);
  const [isDhoopLit, setIsDhoopLit] = useState<boolean>(true);
  const [petals, setPetals] = useState<PetalParticle[]>([]);
  const [aartiRounds, setAartiRounds] = useState<number>(0);

  // Mantra Chanter & Music State
  const [selectedTrack, setSelectedTrack] = useState<MantraTrack>(MANTRA_TRACKS[0]);
  const [currentVerseIdx, setCurrentVerseIdx] = useState<number>(0);
  const [isChanting, setIsChanting] = useState<boolean>(false);
  const [isBgMusicActive, setIsBgMusicActive] = useState<boolean>(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>(mantraChanter.getSpeaker());

  // Subscribe to mantra chanter updates
  useEffect(() => {
    const unsubscribe = mantraChanter.subscribe((idx, playing, spk) => {
      setCurrentVerseIdx(idx);
      setIsChanting(playing);
      setCurrentSpeaker(spk);
      setIsBgMusicActive(sound.isDevotionalMusicActive());
    });
    return () => {
      unsubscribe();
      mantraChanter.stop();
      sound.stopDevotionalMusic();
    };
  }, []);

  // Continuous subtle rotation of Aarti Thaali
  useEffect(() => {
    let anim: number;
    const rotate = () => {
      setAartiAngle((prev) => (prev + 0.6) % 360);
      anim = requestAnimationFrame(rotate);
    };
    anim = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(anim);
  }, []);

  const handleTrackChange = (track: MantraTrack) => {
    setSelectedTrack(track);
    mantraChanter.setTrack(track);
    sound.playDiyaLight();
  };

  const handleToggleChant = () => {
    if (isChanting) {
      mantraChanter.stop();
      setIsChanting(false);
    } else {
      mantraChanter.start();
      setIsChanting(true);
      setIsBgMusicActive(true);
    }
  };

  const handleToggleBgMusic = () => {
    if (sound.isDevotionalMusicActive()) {
      sound.stopDevotionalMusic();
      setIsBgMusicActive(false);
    } else {
      sound.startDevotionalMusic();
      setIsBgMusicActive(true);
      sound.playTempleBell();
    }
  };

  const handleBlowShankh = () => {
    sound.playShankh();
  };

  const handleRingBell = () => {
    sound.playTempleBell();
    setBellRinging(true);
    setTimeout(() => setBellRinging(false), 600);
  };

  const handleOfferFlowers = () => {
    sound.playOilPour();
    const newPetals: PetalParticle[] = [];
    const colors = ['#ea580c', '#f59e0b', '#dc2626', '#fef08a', '#db2777'];
    for (let i = 0; i < 18; i++) {
      newPetals.push({
        id: Date.now() + Math.random(),
        x: Math.random() * 70 + 15,
        y: Math.random() * 25 + 55,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setPetals((prev) => [...prev.slice(-45), ...newPetals]);
  };

  const handleOfferTilak = () => {
    sound.playDiyaLight();
    setHasTilak(true);
  };

  const handleToggleDhoop = () => {
    sound.playDiyaLight();
    setIsDhoopLit(!isDhoopLit);
  };

  const handleAartiRotate = () => {
    sound.playTempleBell();
    setAartiAngle((prev) => (prev + 45) % 360);
    setAartiRounds((r) => r + 1);
  };

  const currentVerse = selectedTrack.verses[currentVerseIdx] || selectedTrack.verses[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-900/30 border border-amber-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-tight flex items-center gap-2">
            <span className="text-amber-400">🪷</span>
            <span>{currentT.title}</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-300/80 mt-1 max-w-2xl">
            {lang === 'gu'
              ? 'ભક્તિમય તાનપુરા અને વાંસળીના સૂર સાથે મા લક્ષ્મીના મંત્રોચ્ચાર સાંભળો, આરતી કરો અને આશીર્વાદ મેળવો.'
              : 'Experience sacred Vedic mantra chanting accompanied by soothing devotional tanpura and flute music.'}
          </p>
        </div>

        {/* Primary Audio Player Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleBgMusic}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isBgMusicActive
                ? 'bg-amber-600/30 border-amber-400 text-amber-100 shadow-sm'
                : 'bg-amber-950/70 border-amber-800/60 text-amber-300 hover:bg-amber-900/40'
            }`}
            title={lang === 'gu' ? 'તાનપુરા અને વાંસળી સંગીત' : 'Tanpura & Flute Music'}
          >
            <Music className={`w-4 h-4 ${isBgMusicActive ? 'text-amber-400 animate-pulse' : 'text-amber-500'}`} />
            <span>{lang === 'gu' ? 'ભક્તિ સંગીત' : 'Music'}</span>
          </button>

          <button
            onClick={handleToggleChant}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
              isChanting
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                : 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-amber-500/20'
            }`}
          >
            {isChanting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-950" />}
            <span>
              {isChanting
                ? (lang === 'gu' ? 'મંત્રોચ્ચાર રોકો' : 'Pause Chanting')
                : (lang === 'gu' ? 'મંત્રોચ્ચાર બોલાવો (Play)' : 'Chant Mantras')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Altar & Sacred Puja Stage */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] min-h-[460px] rounded-3xl overflow-hidden border-2 border-amber-600/60 shadow-2xl bg-gradient-to-b from-amber-950 via-[#261307] to-[#140803] flex flex-col items-center justify-between p-4 md:p-6 select-none">
        {/* Sacred Divine Aura Background */}
        <div className="absolute inset-0 bg-radial from-amber-500/15 via-orange-950/30 to-black/80 pointer-events-none" />

        {/* Decorative Golden Altar Arch (તુરંગ / કમાણ) */}
        <div className="absolute top-0 inset-x-8 h-20 border-t-4 border-amber-500/60 rounded-t-full pointer-events-none flex justify-center items-center">
          <div className="w-16 h-16 rounded-full border-2 border-amber-400/40 flex items-center justify-center -mt-6 bg-amber-950/90 shadow-lg">
            <span className="text-2xl font-serif text-amber-300 font-bold">ॐ</span>
          </div>
        </div>

        {/* Hanging Brass Temple Bells */}
        <div 
          className="absolute top-4 left-6 md:left-14 flex flex-col items-center cursor-pointer group z-20" 
          onClick={handleRingBell}
          title={lang === 'gu' ? 'ઘંટડી રણકાવો' : 'Ring Bell'}
        >
          <div className="w-0.5 h-16 bg-amber-700/80" />
          <div className={`transition-transform duration-300 ${bellRinging ? 'rotate-12 scale-110' : 'group-hover:rotate-6'}`}>
            <Bell className="w-8 h-8 text-amber-400 fill-amber-500 drop-shadow-md" />
          </div>
          <span className="text-[10px] text-amber-300/80 bg-black/70 px-1.5 py-0.5 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {lang === 'gu' ? 'રણકાર' : 'Ring'}
          </span>
        </div>

        <div 
          className="absolute top-4 right-6 md:right-14 flex flex-col items-center cursor-pointer group z-20" 
          onClick={handleRingBell}
          title={lang === 'gu' ? 'ઘંટડી રણકાવો' : 'Ring Bell'}
        >
          <div className="w-0.5 h-16 bg-amber-700/80" />
          <div className={`transition-transform duration-300 ${bellRinging ? '-rotate-12 scale-110' : 'group-hover:-rotate-6'}`}>
            <Bell className="w-8 h-8 text-amber-400 fill-amber-500 drop-shadow-md" />
          </div>
          <span className="text-[10px] text-amber-300/80 bg-black/70 px-1.5 py-0.5 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {lang === 'gu' ? 'રણકાર' : 'Ring'}
          </span>
        </div>

        {/* Center: Divine Lakshmi Mata & Ganeshji Altar Shrine */}
        <div className="relative mt-8 flex flex-col items-center text-center z-10 w-full max-w-2xl">
          {/* Sacred Nimbus Glow */}
          <div className="absolute -inset-10 bg-amber-400/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

          {/* Deity Shrine Card */}
          <div className="relative w-full p-4 md:p-5 rounded-3xl bg-gradient-to-b from-amber-900/60 to-amber-950/90 border-2 border-amber-500/70 shadow-2xl flex flex-col items-center">
            {/* Sacred Auspicious Icons */}
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Shri Ganesh */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-900/50 border border-amber-600/60 flex items-center justify-center text-3xl md:text-4xl shadow-inner">
                  🐘
                </div>
                <span className="text-[11px] md:text-xs font-bold text-amber-300 mt-1">
                  {lang === 'gu' ? 'શ્રી ગણેશ' : 'Shri Ganesha'}
                </span>
              </div>

              {/* Kalash with Coconut */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-900/60 border-2 border-amber-500/80 flex items-center justify-center text-2xl md:text-3xl shadow-lg">
                  🏺
                </div>
                <span className="text-[10px] md:text-[11px] font-medium text-amber-400 mt-1">
                  {lang === 'gu' ? 'મંગલ કળશ' : 'Purna Kalash'}
                </span>
              </div>

              {/* Shri Mahalakshmi */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-900/50 border border-amber-600/60 flex items-center justify-center text-3xl md:text-4xl shadow-inner">
                  🪷
                </div>
                <span className="text-[11px] md:text-xs font-bold text-amber-300 mt-1">
                  {lang === 'gu' ? 'મા લક્ષ્મી' : 'Maa Lakshmi'}
                </span>
              </div>
            </div>

            {/* Live Spoken Mantra & Karaoke Highlighting */}
            <div className="mt-4 w-full bg-amber-950/90 rounded-2xl border border-amber-500/50 p-3.5 md:p-4 text-center transition-all shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-amber-400/90 mb-1 px-1">
                <span className="font-semibold">{lang === 'gu' ? selectedTrack.titleGu : selectedTrack.titleEn}</span>
                <span className="tabular-nums">
                  {currentVerseIdx + 1} / {selectedTrack.verses.length}
                </span>
              </div>

              {/* Sanskrit Mantra with glowing active state */}
              <div className={`text-base md:text-lg font-bold tracking-wide transition-all ${
                isChanting
                  ? 'text-yellow-200 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] scale-[1.01]'
                  : 'text-amber-100'
              }`}>
                {currentVerse.sanskritGu}
              </div>

              {/* Transliteration */}
              <div className="text-xs text-amber-300/80 italic mt-1 font-serif">
                {currentVerse.transliteration}
              </div>

              {/* Meaning */}
              <div className="text-[11px] md:text-xs text-amber-200/90 mt-2 pt-2 border-t border-amber-800/50 leading-relaxed">
                <span className="font-semibold text-amber-400">{lang === 'gu' ? 'અર્થ:' : 'Meaning:'}</span>{' '}
                {lang === 'gu' ? currentVerse.meaningGu : currentVerse.meaningEn}
              </div>
            </div>
          </div>

          {/* Dhoop / Incense smoke stream */}
          {isDhoopLit && (
            <div className="absolute -left-8 md:-left-12 bottom-6 flex flex-col items-center pointer-events-none">
              <div className="w-1 h-12 bg-amber-700 rounded" />
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              <span className="text-[10px] text-amber-300/70 mt-1">{lang === 'gu' ? 'ધૂપ' : 'Dhoop'}</span>
            </div>
          )}
        </div>

        {/* Scattered Offered Flower Petals on altar base */}
        <div className="absolute inset-x-0 bottom-28 h-20 pointer-events-none">
          {petals.map((p) => (
            <div
              key={p.id}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `rotate(${p.rotation}deg)`,
                backgroundColor: p.color,
              }}
              className="absolute w-3.5 h-2 rounded-full opacity-85 shadow-sm transition-all"
            />
          ))}
        </div>

        {/* Bottom: Interactive Rotating Golden Aarti Thaali */}
        <div className="relative z-20 flex flex-col items-center mb-1">
          <div
            onClick={handleAartiRotate}
            className="cursor-pointer group relative flex items-center justify-center transition-transform active:scale-95"
            title={currentT.aartiRotate}
          >
            {/* The Aarti Thaali Body */}
            <div
              style={{
                transform: `rotate(${aartiAngle}deg)`,
              }}
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 shadow-2xl flex items-center justify-center"
            >
              <div className="absolute inset-2.5 rounded-full border-2 border-amber-300/40 border-dashed" />
              <div className="absolute inset-6 rounded-full border border-amber-300/30" />

              {/* Auspicious Center Kumkum & Swastik */}
              <div className="w-9 h-9 rounded-full bg-red-700 border-2 border-amber-300 flex items-center justify-center text-xs font-bold text-amber-100 shadow-md">
                卐
              </div>

              {/* 5 Aarti Camphor / Ghee Flames (પંચમુખી આરતી) */}
              {[0, 72, 144, 216, 288].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 56;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <div
                    key={i}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className="absolute flex flex-col items-center"
                  >
                    <div className="w-3.5 h-5 -mt-2 animate-diya-flicker">
                      <svg viewBox="0 0 16 24" className="w-full h-full drop-shadow-md">
                        <path
                          d="M8 0 C9 6 15 10 15 16 C15 20 12 24 8 24 C4 24 1 20 1 16 C1 10 7 6 8 0 Z"
                          fill="#fef08a"
                        />
                        <path
                          d="M8 8 C8.5 11 12 13 12 17 C12 19 10 21 8 21 C6 21 4 19 4 17 C4 13 7.5 11 8 8 Z"
                          fill="#f97316"
                        />
                      </svg>
                    </div>
                    <div className="w-4 h-2 bg-amber-400 rounded-b-full border border-amber-600" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] font-semibold text-amber-300 mt-2 bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-700/60 shadow flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{currentT.aartiRotate}</span>
          </div>
        </div>
      </div>

      {/* Puja Offering Action Toolbar & Sacred Sound Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Track selector & spoken voice control */}
        <div className="bg-amber-950/70 border border-amber-800/40 p-4 rounded-2xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'મંત્રોચ્ચાર પસંદગી:' : 'Select Mantra:'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MANTRA_TRACKS.map((trk) => {
              const isSelected = selectedTrack.id === trk.id;
              return (
                <button
                  key={trk.id}
                  onClick={() => handleTrackChange(trk)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-amber-600/40 border-amber-400 text-amber-100 font-bold shadow-sm'
                      : 'bg-amber-900/20 border-amber-800/40 text-amber-300 hover:bg-amber-900/40'
                  }`}
                >
                  <div className="truncate">{lang === 'gu' ? trk.titleGu : trk.titleEn}</div>
                  <div className="text-[10px] text-amber-400/70 mt-0.5">
                    {trk.verses.length} {lang === 'gu' ? 'શ્લોક' : 'verses'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Verses Jump Strip */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
            <span className="text-[11px] text-amber-400 shrink-0">
              {lang === 'gu' ? 'શ્લોક:' : 'Verse:'}
            </span>
            {selectedTrack.verses.map((v, i) => (
              <button
                key={v.id}
                onClick={() => mantraChanter.jumpToVerse(i)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentVerseIdx === i
                    ? 'bg-amber-500 text-amber-950 shadow-sm'
                    : 'bg-amber-900/30 text-amber-300 border border-amber-800/50 hover:bg-amber-800/40'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* AI Voice Speaker Selection */}
          <div className="pt-2 border-t border-amber-800/40">
            <div className="text-[11px] font-semibold text-amber-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-amber-400" />
                <span>{lang === 'gu' ? 'મંત્રોચ્ચાર વાણી (AI Voice):' : 'Chanting Voice:'}</span>
              </span>
              <span className="text-[10px] text-amber-300/70">Sarvam AI Bulbul</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SPEAKERS.map((spk) => (
                <button
                  key={spk.id}
                  onClick={() => mantraChanter.setSpeaker(spk.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    currentSpeaker === spk.id
                      ? 'bg-amber-500 text-amber-950 font-bold shadow-sm'
                      : 'bg-amber-900/30 text-amber-200 border border-amber-800/50 hover:bg-amber-900/50'
                  }`}
                >
                  {lang === 'gu' ? spk.nameGu : spk.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sacred Offering Controls */}
        <div className="bg-amber-950/70 border border-amber-800/40 p-4 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2.5">
            {lang === 'gu' ? 'પૂજા સામગ્રી અને પવિત્ર ધ્વનિ:' : 'Sacred Offerings & Sounds:'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Blow Shankh */}
            <button
              onClick={handleBlowShankh}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-900/30 border border-amber-700/50 text-amber-200 hover:text-amber-100 hover:bg-amber-800/40 text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <span className="text-xl mb-1">🐚</span>
              <span>{lang === 'gu' ? 'શંખનાદ' : 'Shankhnaad'}</span>
            </button>

            {/* Ring Bell */}
            <button
              onClick={handleRingBell}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-900/30 border border-amber-700/50 text-amber-200 hover:text-amber-100 hover:bg-amber-800/40 text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <Bell className="w-5 h-5 text-amber-400 mb-1" />
              <span>{currentT.ringBell}</span>
            </button>

            {/* Offer Flowers */}
            <button
              onClick={handleOfferFlowers}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-900/30 border border-amber-700/50 text-amber-200 hover:text-amber-100 hover:bg-amber-800/40 text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <Flower2 className="w-5 h-5 text-amber-400 mb-1" />
              <span>{currentT.offerFlowers}</span>
            </button>

            {/* Aarti Rotate */}
            <button
              onClick={handleAartiRotate}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Flame className="w-5 h-5 fill-amber-950 mb-1" />
              <span>{lang === 'gu' ? 'આરતી કરો' : 'Rotate Aarti'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
