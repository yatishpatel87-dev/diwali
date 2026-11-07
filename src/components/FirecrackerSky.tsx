import React, { useRef, useState, useEffect } from 'react';
import { Language, FireworkType, FireworkParticle, SkyLantern } from '../types/game';
import { t } from '../utils/translations';
import { sound } from '../utils/audio';
import { Sparkles, Play, Pause, Flame, HeartHandshake, ShieldCheck } from 'lucide-react';

interface FirecrackerSkyProps {
  lang: Language;
}

export const FirecrackerSky: React.FC<FirecrackerSkyProps> = ({ lang }) => {
  const currentT = t[lang].fireworksGame;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [selectedType, setSelectedType] = useState<FireworkType>('rocket');
  const [isAutoShow, setIsAutoShow] = useState<boolean>(false);
  const [totalBurstCount, setTotalBurstCount] = useState<number>(0);

  // References to keep animation loop clean
  const particlesRef = useRef<FireworkParticle[]>([]);
  const lanternsRef = useRef<SkyLantern[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);

  const WISHES = lang === 'gu'
    ? ['સુખ-સમૃદ્ધિ', 'ઉત્તમ આરોગ્ય', 'શાંતિ', 'સાલ મુબારક', 'વિજય', 'દિવ્ય પ્રકાશ', 'પ્રેમ']
    : ['Prosperity', 'Good Health', 'Peace', 'Saal Mubarak', 'Joy', 'Divine Light', 'Love'];

  // Initialize and run Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial festive burst
    setTimeout(() => {
      launchRocket(canvas.width * 0.5, canvas.height * 0.35);
      launchRocket(canvas.width * 0.3, canvas.height * 0.4);
      launchRocket(canvas.width * 0.7, canvas.height * 0.38);
    }, 400);

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Semi-transparent clear creates motion blur / light trails
        ctx.fillStyle = 'rgba(10, 6, 18, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw sky lanterns
        updateLanterns(ctx, canvas.width, canvas.height);

        // Update and draw firework particles
        updateParticles(ctx);

        // Sparkler follows mouse if active
        if (selectedType === 'sparkler' && mousePosRef.current) {
          spawnSparklerSparks(mousePosRef.current.x, mousePosRef.current.y);
          if (Math.random() < 0.2) sound.playSparklerCrackle();
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [selectedType]);

  // Auto show interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoShow) {
      interval = setInterval(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const types: FireworkType[] = ['rocket', 'anaar', 'chakri', 'lantern'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        const rx = canvas.width * (0.2 + Math.random() * 0.6);
        const ry = canvas.height * (0.2 + Math.random() * 0.45);

        if (chosen === 'rocket') launchRocket(rx, ry);
        else if (chosen === 'anaar') launchAnaar(rx, canvas.height * 0.85);
        else if (chosen === 'chakri') launchChakri(rx, canvas.height * 0.78);
        else if (chosen === 'lantern') launchLantern(rx, canvas.height * 0.9);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isAutoShow]);

  const updateLanterns = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    lanternsRef.current = lanternsRef.current.filter((lantern) => {
      lantern.x += lantern.vx;
      lantern.y += lantern.vy;
      lantern.vx += (Math.random() - 0.5) * 0.1; // Gentle sway

      // Draw lantern body
      ctx.save();
      ctx.translate(lantern.x, lantern.y);

      // Warm glow
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, lantern.size * 2);
      glow.addColorStop(0, `hsla(${lantern.hue}, 90%, 65%, 0.8)`);
      glow.addColorStop(0.5, `hsla(${lantern.hue}, 85%, 55%, 0.3)`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, lantern.size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Paper lantern shape
      ctx.fillStyle = `hsl(${lantern.hue}, 80%, 60%)`;
      ctx.beginPath();
      ctx.roundRect(-lantern.size * 0.7, -lantern.size, lantern.size * 1.4, lantern.size * 1.8, 6);
      ctx.fill();

      // Golden base burner
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-lantern.size * 0.4, lantern.size * 0.8, lantern.size * 0.8, 3);

      // Auspicious written prayer/wish
      ctx.fillStyle = '#fff7ed';
      ctx.font = `bold ${Math.max(10, Math.round(lantern.size * 0.45))}px 'Noto Sans Gujarati', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lantern.wish, 0, 0);

      ctx.restore();

      return lantern.y > -50 && lantern.x > -50 && lantern.x < w + 50;
    });
  };

  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.alpha -= p.decay;

      if (p.alpha <= 0) return false;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.size * 2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      return true;
    });
  };

  const launchRocket = (targetX: number, targetY: number) => {
    sound.playRocketWhistle();
    setTotalBurstCount((c) => c + 1);

    setTimeout(() => {
      sound.playBoom(1.2);
      const colors = ['#f59e0b', '#ef4444', '#38bdf8', '#ec4899', '#10b981', '#facc15', '#a855f7'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      const secondaryColor = '#fef08a';

      // 60-80 sparkling willow particles
      for (let i = 0; i < 75; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() < 0.7 ? chosenColor : secondaryColor,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.012,
          size: Math.random() * 2.5 + 1.5,
          gravity: 0.07,
        });
      }
    }, 450);
  };

  const launchAnaar = (x: number, groundY: number) => {
    sound.playBoom(0.6);
    setTotalBurstCount((c) => c + 1);

    // Continuous fountain of golden/silver sparks shooting up for ~1.5s
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > 1200) {
        clearInterval(interval);
        return;
      }
      sound.playSparklerCrackle();
      for (let i = 0; i < 8; i++) {
        const spread = (Math.random() - 0.5) * 3.5;
        const speed = -(Math.random() * 9 + 5);
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 10,
          y: groundY,
          vx: spread,
          vy: speed,
          color: Math.random() < 0.6 ? '#facc15' : '#fb923c',
          alpha: 1,
          decay: 0.035,
          size: Math.random() * 2 + 1,
          gravity: 0.22,
        });
      }
    }, 60);
  };

  const launchChakri = (x: number, y: number) => {
    sound.playChakriSpin();
    setTotalBurstCount((c) => c + 1);

    let angle = 0;
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startTime > 1400) {
        clearInterval(interval);
        return;
      }
      angle += 0.45;
      for (let i = 0; i < 4; i++) {
        const armAngle = angle + (i * Math.PI) / 2;
        const speed = Math.random() * 4 + 3;
        particlesRef.current.push({
          x: x,
          y: y,
          vx: Math.cos(armAngle) * speed,
          vy: Math.sin(armAngle) * speed,
          color: i % 2 === 0 ? '#10b981' : '#f59e0b',
          alpha: 1,
          decay: 0.03,
          size: 2.2,
          gravity: 0.05,
        });
      }
    }, 45);
  };

  const spawnSparklerSparks = (x: number, y: number) => {
    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() < 0.5 ? '#fef08a' : '#f97316',
        alpha: 1,
        decay: 0.04,
        size: Math.random() * 2 + 1,
        gravity: 0.08,
      });
    }
  };

  const launchLantern = (x: number, startY: number) => {
    sound.playLanternLaunch();
    const wish = WISHES[Math.floor(Math.random() * WISHES.length)];
    lanternsRef.current.push({
      id: Date.now() + Math.random(),
      x: x,
      y: startY,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.2 + 0.9),
      size: Math.random() * 10 + 24,
      wish: wish,
      hue: Math.floor(Math.random() * 40) + 15, // Golden/orange hues
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedType === 'rocket') {
      launchRocket(x, y);
    } else if (selectedType === 'anaar') {
      launchAnaar(x, canvas.height * 0.85);
    } else if (selectedType === 'chakri') {
      launchChakri(x, y);
    } else if (selectedType === 'lantern') {
      launchLantern(x, canvas.height * 0.9);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Controller */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-900/30 border border-amber-700/40 rounded-2xl p-5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>{currentT.title}</span>
          </h2>
          <p className="text-xs md:text-sm text-amber-300/80 mt-1 max-w-2xl">
            {currentT.desc}
          </p>
        </div>

        {/* Eco message badge & Auto button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'gu' ? '૧૦૦% ઇકો-ફ્રેન્ડલી' : '100% Eco-Friendly'}</span>
          </div>

          <button
            onClick={() => {
              setIsAutoShow(!isAutoShow);
              sound.playDiyaLight();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isAutoShow
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-950/70 border border-amber-800/60 text-amber-200 hover:bg-amber-900/40'
            }`}
          >
            {isAutoShow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{currentT.autoCelebration}</span>
          </button>
        </div>
      </div>

      {/* Main Sky Arena */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[460px] rounded-2xl overflow-hidden border border-amber-700/50 shadow-2xl bg-slate-950 select-none">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mousePosRef.current = null; }}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Gentle Haveli Silhouette at bottom for realistic skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-40 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-between px-6">
          <div className="w-12 h-8 bg-amber-950 rounded-t-lg" />
          <div className="w-24 h-12 bg-amber-950 rounded-t-xl" />
          <div className="w-16 h-10 bg-amber-950 rounded-t-lg" />
          <div className="w-32 h-14 bg-amber-950 rounded-t-2xl" />
          <div className="w-20 h-9 bg-amber-950 rounded-t-lg" />
        </div>

        {/* Instructions pill overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-amber-600/40 px-3 py-1.5 rounded-lg text-xs text-amber-200 pointer-events-none">
          ✨ {currentT.clickSky}
        </div>
      </div>

      {/* Firework Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-950/60 border border-amber-800/40 p-3.5 rounded-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSelectedType('rocket'); sound.playRocketWhistle(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'rocket'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/30 text-amber-200 border border-amber-800/40 hover:bg-amber-800/40'
            }`}
          >
            <span>🚀</span>
            <span>{currentT.rocket}</span>
          </button>

          <button
            onClick={() => { setSelectedType('anaar'); sound.playSparklerCrackle(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'anaar'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/30 text-amber-200 border border-amber-800/40 hover:bg-amber-800/40'
            }`}
          >
            <span>🌋</span>
            <span>{currentT.anaar}</span>
          </button>

          <button
            onClick={() => { setSelectedType('chakri'); sound.playChakriSpin(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'chakri'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/30 text-amber-200 border border-amber-800/40 hover:bg-amber-800/40'
            }`}
          >
            <span>🌀</span>
            <span>{currentT.chakri}</span>
          </button>

          <button
            onClick={() => { setSelectedType('sparkler'); sound.playSparklerCrackle(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'sparkler'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/30 text-amber-200 border border-amber-800/40 hover:bg-amber-800/40'
            }`}
          >
            <span>✨</span>
            <span>{currentT.sparkler}</span>
          </button>

          <button
            onClick={() => { setSelectedType('lantern'); sound.playLanternLaunch(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedType === 'lantern'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-900/30 text-amber-200 border border-amber-800/40 hover:bg-amber-800/40'
            }`}
          >
            <span>🏮</span>
            <span>{currentT.lantern}</span>
          </button>
        </div>

        {/* Counter */}
        <div className="text-xs text-amber-300 font-medium">
          {lang === 'gu' ? 'કુલ ઉજવણી વિસ્ફોટો:' : 'Total Celebrations:'}{' '}
          <span className="font-bold tabular-nums text-amber-100">{totalBurstCount}</span>
        </div>
      </div>
    </div>
  );
};
