export type GameTab = 'diyas' | 'rangoli' | 'fireworks' | 'mithai' | 'puja' | 'greetings';

export type Language = 'gu' | 'en';

export interface DiyaItem {
  id: number;
  x: number;
  y: number;
  oilLevel: number; // 0 to 100
  hasWick: boolean;
  isLit: boolean;
  flameSize: number; // 0.8 to 1.3
}

export interface RangoliPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  type: 'color' | 'petal' | 'diya';
}

export interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  gravity: number;
  flicker?: boolean;
}

export interface SkyLantern {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wish: string;
  hue: number;
}

export type FireworkType = 'rocket' | 'chakri' | 'anaar' | 'sparkler' | 'lantern';

export interface MithaiItem {
  id: number;
  name: string;
  nameGu: string;
  emoji: string;
  points: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  isHazard?: boolean;
  isPowerup?: boolean;
  powerupType?: 'slow' | 'double';
}
