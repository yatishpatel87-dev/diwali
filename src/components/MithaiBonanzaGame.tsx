import React, { useState, useEffect, useRef } from 'react';
import { Language, MithaiItem } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Heart, Play, RotateCcw, Zap, Sparkles } from 'lucide-react';

interface MithaiBonanzaGameProps {
  lang: Language;
}

const SWEET_TEMPLATES = [
  { name: 'Kaju Katli', nameGu: 'કાજુ કતરી', emoji: '💎', points: 25, color: '#e2e8f0' },
  { name: 'Motichoor Ladoo', nameGu: 'મોતીચૂર લાડુ', emoji: '🟡', points: 10, color: '#f59e0b' },
  { name: 'Surati Ghari', nameGu: 'સુરતી ઘારી', emoji: '⚪', points: 30, color: '#fef08a' },
  { name: 'Mohanthal', nameGu: 'મોહનથાળ', emoji: '🟤', points: 20, color: '#b45309' },
  { name: 'Jalebi', nameGu: 'જલેબી', emoji: '🥨', points: 15, color: '#ea580c' },
];

export const MithaiBonanzaGame: React.FC<MithaiBonanzaGameProps> = ({ lang }) => {
  const currentT = t[lang].mithaiGame;
  const arenaRef = useRef<HTMLDivElement | null>(null);

  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('diwali_mithai_highscore') || '0');
    }
    return 0;
  });
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(1);
  const [thaliX, setThaliX] = useState<number>(50); // percentage 0 to 100
  const [activePowerup, setActivePowerup] = useState<string | null>(null);

  const itemsRef = useRef<MithaiItem[]>([]);
  const [renderItems, setRenderItems] = useState<MithaiItem[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Sync ref
  useEffect(() => {
    isPlayingRef.current = gameState === 'PLAYING';
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setThaliX((x) => Math.max(8, x - 5));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setThaliX((x) => Math.min(92, x + 5));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Mouse / Touch controls on arena
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'PLAYING' || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setThaliX(Math.max(8, Math.min(92, percent)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== 'PLAYING' || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const percent = ((touch.clientX - rect.left) / rect.width) * 100;
    setThaliX(Math.max(8, Math.min(92, percent)));
  };

  // Main game loop
  const startGame = () => {
    sound.playDiyaLight();
    setScore(0);
    setLives(3);
    setCombo(1);
    setGameState('PLAYING');
    itemsRef.current = [];
    setRenderItems([]);
    lastSpawnTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let localScore = score;
    let localLives = lives;
    let localCombo = combo;

    let lastFrame = performance.now();

    const loop = (time: number) => {
      if (!isPlayingRef.current) return;

      const delta = (time - lastFrame) / 1000;
      lastFrame = time;

      const now = Date.now();
      // Spawn items
      const spawnInterval = Math.max(450, 950 - Math.min(450, localScore * 1.5));
      if (now - lastSpawnTimeRef.current > spawnInterval) {
        lastSpawnTimeRef.current = now;

        const isHazard = Math.random() < 0.22;
        const isPowerup = !isHazard && Math.random() < 0.08;

        if (isHazard) {
          itemsRef.current.push({
            id: now + Math.random(),
            name: 'Water Splash',
            nameGu: 'પાણીનો છાંટો',
            emoji: '💧',
            points: -1,
            x: Math.random() * 80 + 10,
            y: 0,
            speed: Math.random() * 25 + 35,
            size: 32,
            isHazard: true,
          });
        } else if (isPowerup) {
          itemsRef.current.push({
            id: now + Math.random(),
            name: 'Golden Kalash',
            nameGu: 'સુવર્ણ કળશ',
            emoji: '🏺',
            points: 50,
            x: Math.random() * 80 + 10,
            y: 0,
            speed: 30,
            size: 34,
            isPowerup: true,
            powerupType: 'double',
          });
        } else {
          const tpl = SWEET_TEMPLATES[Math.floor(Math.random() * SWEET_TEMPLATES.length)];
          itemsRef.current.push({
            id: now + Math.random(),
            name: tpl.name,
            nameGu: tpl.nameGu,
            emoji: tpl.emoji,
            points: tpl.points,
            x: Math.random() * 80 + 10,
            y: 0,
            speed: Math.random() * 20 + 30 + Math.min(25, localScore * 0.05),
            size: 36,
          });
        }
      }

      // Update positions & check collisions with Thali
      const remaining: MithaiItem[] = [];
      const thaliHitboxLeft = thaliX - 8;
      const thaliHitboxRight = thaliX + 8;
      const thaliY = 88; // % from top

      for (const item of itemsRef.current) {
        item.y += item.speed * delta;

        // Check if caught in Thali
        if (item.y >= thaliY - 5 && item.y <= thaliY + 6) {
          if (item.x >= thaliHitboxLeft && item.x <= thaliHitboxRight) {
            // Collision caught!
            if (item.isHazard) {
              sound.playHazardHit();
              localLives -= 1;
              localCombo = 1;
              setLives(localLives);
              setCombo(1);
              if (localLives <= 0) {
                gameOver(localScore);
                return;
              }
            } else if (item.isPowerup) {
              sound.playMithaiCatch(true);
              localScore += 50 * localCombo;
              setScore(localScore);
              setActivePowerup('2x Bonus Active!');
              setTimeout(() => setActivePowerup(null), 5000);
            } else {
              sound.playMithaiCatch(localCombo > 2);
              const earned = item.points * localCombo;
              localScore += earned;
              localCombo = Math.min(5, localCombo + 1);
              setScore(localScore);
              setCombo(localCombo);
            }
            continue; // Caught, don't keep in list
          }
        }

        // Check if fell off screen
        if (item.y > 105) {
          if (!item.isHazard && !item.isPowerup) {
            // Missed a sweet: reset combo
            localCombo = 1;
            setCombo(1);
          }
          continue;
        }

        remaining.push(item);
      }

      itemsRef.current = remaining;
      setRenderItems([...remaining]);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, thaliX]);

  const gameOver = (finalScore: number) => {
    sound.playBoom(0.8);
    setGameState('GAME_OVER');
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('diwali_mithai_highscore', String(finalScore));
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & HUD */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-900/30 border border-amber-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-tight flex items-center gap-2">
            <span className="text-amber-400">🍬</span>
            <span>{currentT.title}</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-300/80 mt-1">
            {currentT.desc}
          </p>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-4 bg-amber-950/70 border border-amber-800/50 rounded-xl px-4 py-2.5">
          {/* Score */}
          <div>
            <div className="text-[10px] text-amber-400 font-semibold uppercase">{currentT.score}</div>
            <div className="text-xl font-bold text-amber-100 tabular-nums">{score}</div>
          </div>
          <div className="w-px h-7 bg-amber-800/60" />
          {/* High Score */}
          <div>
            <div className="text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1">
              <Trophy className="w-3 h-3 text-yellow-400" />
              <span>{currentT.highScore}</span>
            </div>
            <div className="text-xl font-bold text-yellow-300 tabular-nums">{highScore}</div>
          </div>
          <div className="w-px h-7 bg-amber-800/60" />
          {/* Lives */}
          <div>
            <div className="text-[10px] text-amber-400 font-semibold uppercase">{currentT.lives}</div>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-4 h-4 ${
                    heart <= lives ? 'text-red-500 fill-red-500' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Play Arena */}
      <div
        ref={arenaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[500px] rounded-2xl overflow-hidden border-2 border-amber-700/50 bg-gradient-to-b from-amber-950 via-amber-900/60 to-amber-950 shadow-2xl select-none cursor-ew-resize touch-none"
      >
        {/* Festive Toran Garland across top */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-repeat-x flex justify-around items-center px-4 border-b border-amber-600/30 bg-amber-950/80 pointer-events-none">
          {['🌿', '🌼', '🪔', '🌼', '🌿', '🌼', '🪔', '🌼', '🌿', '🌼', '🪔', '🌼', '🌿'].map((icon, idx) => (
            <span key={idx} className="text-lg opacity-85">{icon}</span>
          ))}
        </div>

        {/* Combo Indicator Badge */}
        {combo > 1 && (
          <div className="absolute top-12 right-4 bg-amber-500 text-amber-950 px-3 py-1 rounded-full text-xs font-black shadow-lg animate-bounce">
            ⚡ {combo}x COMBO!
          </div>
        )}

        {/* Powerup message */}
        {activePowerup && (
          <div className="absolute top-12 left-4 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ✨ {activePowerup}
          </div>
        )}

        {/* Falling Sweets & Hazards */}
        {renderItems.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute flex flex-col items-center pointer-events-none transition-transform"
          >
            <span className="text-3xl md:text-4xl filter drop-shadow-md">{item.emoji}</span>
            <span className="text-[10px] font-medium text-amber-200 bg-black/60 px-1 rounded mt-0.5 whitespace-nowrap">
              {lang === 'gu' ? item.nameGu : item.name}
            </span>
          </div>
        ))}

        {/* Player's Festive Silver Thali (Catcher) */}
        <div
          style={{
            left: `${thaliX}%`,
            top: '88%',
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex flex-col items-center pointer-events-none transition-all duration-75"
        >
          {/* Ornate Brass/Silver Puja Thali SVG */}
          <div className="relative">
            <svg width="110" height="42" viewBox="0 0 110 42">
              {/* Outer rim */}
              <ellipse cx="55" cy="20" rx="52" ry="16" fill="url(#silverPlateGrad)" stroke="#fef08a" strokeWidth="2" />
              {/* Inner depression */}
              <ellipse cx="55" cy="20" rx="42" ry="11" fill="url(#silverPlateInner)" />
              {/* Decorative scalloped dots */}
              {[15, 30, 45, 55, 65, 80, 95].map((cx, i) => (
                <circle key={i} cx={cx} cy="10" r="1.5" fill="#facc15" />
              ))}
              {/* Small Diya in center of thali */}
              <ellipse cx="55" cy="20" rx="8" ry="4" fill="#c2410c" />
              <circle cx="55" cy="18" r="3" fill="#f59e0b" className="animate-pulse" />

              <defs>
                <linearGradient id="silverPlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="25%" stopColor="#f8fafc" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="75%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="silverPlateInner" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-[11px] font-bold text-amber-300 mt-1 whitespace-nowrap bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60 shadow">
            {lang === 'gu' ? '✨ મિઠાઈ થાળી' : '✨ Sweet Thali'}
          </div>
        </div>

        {/* Start Game Overlay */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-amber-900/95 to-amber-950/95 border-2 border-amber-500/80 p-6 md:p-8 rounded-2xl max-w-sm text-center shadow-2xl">
              <span className="text-4xl block mb-2">🎁🪔</span>
              <h3 className="text-xl md:text-2xl font-bold text-amber-200">
                {currentT.title}
              </h3>
              <p className="text-xs text-amber-300/90 mt-2 mb-5">
                {currentT.tip}
              </p>
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Play className="w-4 h-4 fill-amber-950" />
                <span>{currentT.startGame}</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-amber-900/95 to-amber-950/95 border-2 border-amber-500/80 p-6 md:p-8 rounded-2xl max-w-sm text-center shadow-2xl">
              <span className="text-4xl block mb-2">🏆</span>
              <h3 className="text-xl md:text-2xl font-bold text-amber-200">
                {currentT.gameOver}
              </h3>
              <p className="text-xs text-amber-300/90 mt-1">
                {currentT.congrats}
              </p>
              <div className="text-3xl font-extrabold text-amber-300 my-3 tabular-nums">
                {score}
              </div>
              {score >= highScore && score > 0 && (
                <div className="text-xs text-yellow-300 font-bold bg-yellow-950/80 py-1 px-3 rounded-full border border-yellow-500/40 mb-4 inline-block">
                  🎉 {lang === 'gu' ? 'નવો સર્વોચ્ચ સ્કોર!' : 'New High Score!'}
                </div>
              )}
              <button
                onClick={startGame}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{currentT.playAgain}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sweet Legend */}
      <div className="bg-amber-950/60 border border-amber-800/40 p-4 rounded-xl">
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2.5">
          {lang === 'gu' ? 'સ્વાદિષ્ટ મિઠાઈઓ અને પોઈન્ટ્સ:' : 'Festive Sweets & Points:'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SWEET_TEMPLATES.map((sw) => (
            <div
              key={sw.name}
              className="flex items-center gap-2 p-2 rounded-lg bg-amber-900/30 border border-amber-800/50 text-xs"
            >
              <span className="text-xl">{sw.emoji}</span>
              <div className="truncate">
                <div className="font-semibold text-amber-200 truncate">
                  {lang === 'gu' ? sw.nameGu : sw.name}
                </div>
                <div className="text-[10px] text-amber-400">+{sw.points} pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
