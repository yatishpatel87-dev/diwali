class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.6, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Diya lighting: warm melodic chime
  public playDiyaLight() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.15); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.35); // C6

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.7);
  }

  // Oil pouring: bubbling droplet
  public playOilPour() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Temple Brass Bell (ઘંટડી રણકાર) with rich realistic harmonic overtones
  public playTempleBell() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const fundamental = 880; // A5
    const partials = [1, 2.01, 3.03, 4.2, 5.6];
    const weights = [0.4, 0.25, 0.15, 0.08, 0.04];

    partials.forEach((mult, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(fundamental * mult, t);

      const decay = 2.2 / (index * 0.4 + 1);
      gain.gain.setValueAtTime(weights[index] * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + decay);
    });
  }

  // Firecracker Rocket Whistle
  public playRocketWhistle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.45);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.48);
  }

  // Firecracker Burst / Boom
  public playBoom(intensity: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.exponentialRampToValueAtTime(60, t + 0.35);

    const gain = this.ctx.createGain();
    const vol = Math.min(0.5, 0.3 * intensity);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
  }

  // Sparkler crackle (ઝળહળતી ફૂલઝડી)
  public playSparklerCrackle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200 + Math.random() * 800, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Chakri spinning whirr (ચકરી)
  public playChakriSpin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(640, t + 0.2);
    osc.frequency.linearRampToValueAtTime(480, t + 0.5);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Mithai catch sound: happy sweet arpeggio
  public playMithaiCatch(isBonus: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = isBonus ? [659.25, 830.61, 987.77, 1318.51] : [523.25, 659.25, 783.99];

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.05);

      gain.gain.setValueAtTime(0, t + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.2, t + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.25);
    });
  }

  // Hazard splash sound
  public playHazardHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.2);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Sky lantern floating: soothing pentatonic chime
  public playLanternLaunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.8);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.2);
  }

  // Sacred Shankhnaad (શંખનાદ / Conch Shell Horn)
  public playShankh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const carrier = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    carrier.type = 'sawtooth';
    carrier.frequency.setValueAtTime(220, t);
    carrier.frequency.linearRampToValueAtTime(329.63, t + 0.5); // E4
    carrier.frequency.setValueAtTime(329.63, t + 2.5);
    carrier.frequency.exponentialRampToValueAtTime(220, t + 3.2);

    mod.type = 'sine';
    mod.frequency.setValueAtTime(5, t);
    modGain.gain.setValueAtTime(20, t);
    mod.connect(carrier.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.linearRampToValueAtTime(1400, t + 0.5);
    filter.frequency.exponentialRampToValueAtTime(400, t + 3.2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.5);
    gain.gain.setValueAtTime(0.38, t + 2.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3.2);

    carrier.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    carrier.start(t);
    mod.start(t);
    carrier.stop(t + 3.2);
    mod.stop(t + 3.2);
  }

  // Background Spiritual Tanpura & Flute / Harmonium Music loop
  private musicInterval: NodeJS.Timeout | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicOn: boolean = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;

  public startDevotionalMusic() {
    if (this.isMusicOn) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isMusicOn = true;
    const t = this.ctx.currentTime;

    this.musicGainNode = this.ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.22, t);
    this.musicGainNode.connect(this.masterGain!);

    // Tanpura Drone: Root Sa (C3: 130.81Hz) and Pa (G3: 196Hz)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, t);
    filter.connect(this.musicGainNode);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'triangle';
    this.droneOsc1.frequency.setValueAtTime(130.81, t); // Sa
    this.droneOsc1.connect(filter);
    this.droneOsc1.start();

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(196.00, t); // Pa
    this.droneOsc2.connect(filter);
    this.droneOsc2.start();

    // Gentle Raag Yaman / Bhupali meditative flute notes (Sa, Re, Ga, Pa, Dha, Sa')
    const swaras = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63];
    let step = 0;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.isMusicOn || !this.musicGainNode) return;
      const now = this.ctx.currentTime;
      const freq = swaras[step % swaras.length];
      step++;

      const flute = this.ctx.createOscillator();
      const fluteGain = this.ctx.createGain();

      flute.type = 'sine';
      flute.frequency.setValueAtTime(freq, now);
      // Soft vibrato
      flute.frequency.linearRampToValueAtTime(freq * 1.008, now + 1.2);
      flute.frequency.linearRampToValueAtTime(freq, now + 2.0);

      fluteGain.gain.setValueAtTime(0, now);
      fluteGain.gain.linearRampToValueAtTime(0.08, now + 0.4);
      fluteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      flute.connect(fluteGain);
      fluteGain.connect(this.musicGainNode);

      flute.start(now);
      flute.stop(now + 2.4);
    }, 2400);
  }

  public stopDevotionalMusic() {
    this.isMusicOn = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); this.droneOsc1.disconnect(); } catch {}
      this.droneOsc1 = null;
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); this.droneOsc2.disconnect(); } catch {}
      this.droneOsc2 = null;
    }
    if (this.musicGainNode) {
      try { this.musicGainNode.disconnect(); } catch {}
      this.musicGainNode = null;
    }
  }

  public isDevotionalMusicActive(): boolean {
    return this.isMusicOn;
  }
}

export const sound = new SoundController();
