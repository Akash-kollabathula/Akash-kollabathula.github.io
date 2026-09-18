/**
 * Web Audio API Synthesizer for Hacker Terminal SFX & Mechanical Acoustics
 * Synthesizes 100% in-browser audio with zero external asset dependencies.
 * Features: volume scaling, sound on/off control, soft limiter, and non-blocking playback.
 */

class TerminalAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundEnabled: boolean = true;
  private volumeLevel: number = 0.35; // 35% safe, subtle default
  private lastScrollTime: number = 0;

  constructor() {
    try {
      const savedEnabled = localStorage.getItem('kali_sound_enabled');
      if (savedEnabled !== null) {
        this.soundEnabled = savedEnabled === 'true';
      }
      const savedVolume = localStorage.getItem('kali_sound_volume');
      if (savedVolume !== null) {
        const parsed = parseFloat(savedVolume);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volumeLevel = parsed;
        }
      }
    } catch {
      this.soundEnabled = true;
      this.volumeLevel = 0.35;
    }
  }

  private initAudioContext(): AudioContext | null {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.soundEnabled ? this.volumeLevel : 0, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.soundEnabled ? this.volumeLevel : 0, this.audioCtx.currentTime);
    }

    return this.audioCtx;
  }

  public async unlockAudio(): Promise<boolean> {
    const ctx = this.initAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }
    return ctx?.state === 'running';
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public setVolume(volume: number): number {
    const clamped = Math.max(0, Math.min(1, volume));
    this.volumeLevel = clamped;
    try {
      localStorage.setItem('kali_sound_volume', clamped.toString());
    } catch {}

    if (this.audioCtx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.soundEnabled ? clamped : 0, this.audioCtx.currentTime);
    }
    return this.volumeLevel;
  }

  public toggleSound(forceState?: boolean): boolean {
    this.soundEnabled = forceState !== undefined ? forceState : !this.soundEnabled;
    try {
      localStorage.setItem('kali_sound_enabled', String(this.soundEnabled));
    } catch {}

    const ctx = this.initAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    if (this.audioCtx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.soundEnabled ? this.volumeLevel : 0,
        this.audioCtx.currentTime
      );
    }

    if (this.soundEnabled) {
      // Clear audio feedback indicating sound is now on
      setTimeout(() => {
        this.playSuccessChime();
      }, 30);
    }
    return this.soundEnabled;
  }

  private getDestinationNode(): AudioNode | null {
    if (!this.soundEnabled) return null;
    const ctx = this.initAudioContext();
    if (!ctx || !this.masterGain) return null;
    return this.masterGain;
  }

  /**
   * 1. Typing sound: Mechanical switch click with keycap resonance
   */
  public playMechanicalClick(
    type: 'key' | 'enter' | 'space' | 'backspace' | 'tab' | 'delete' = 'key',
    intensity: number = 1.0
  ) {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const baseGain = (type === 'enter' ? 0.35 : type === 'space' ? 0.3 : 0.22) * intensity;

      // Noise click (switch contact)
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.012), ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      const jitter = (Math.random() - 0.5) * 350;
      let centerFreq = 3600 + jitter;
      if (type === 'enter') centerFreq = 2400 + jitter;
      if (type === 'space') centerFreq = 2000 + jitter;
      if (type === 'backspace') centerFreq = 3000 + jitter;

      noiseFilter.frequency.setValueAtTime(centerFreq, now);
      noiseFilter.Q.setValueAtTime(3.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(baseGain, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);

      noiseNode.start(now);
      noiseNode.stop(now + 0.012);

      // Low mechanical thud
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      let baseFreq = 260 + (Math.random() - 0.5) * 30;
      if (type === 'enter') baseFreq = 160;
      if (type === 'space') baseFreq = 140;
      if (type === 'backspace') baseFreq = 200;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.03);

      const duration = type === 'enter' ? 0.04 : 0.028;
      oscGain.gain.setValueAtTime(baseGain * 0.8, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(dest);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  /**
   * 2. Button click: Crisp tactile cyber micro-switch
   */
  public playButtonClick() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.025);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  /**
   * 3. Command executed: High-tech terminal transmission blip
   */
  public playCommandExecuted() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(1450, now + 0.045);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  /**
   * 4. Scrolling sound: Throttled, micro-ratchet click
   */
  public playScrollTick() {
    const now = Date.now();
    // Throttle to max once every 65ms so fast scrolling feels like a silky mechanical wheel
    if (now - this.lastScrollTime < 65) return;
    this.lastScrollTime = now;

    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900 + Math.random() * 80, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.012);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.015);
    } catch {}
  }

  /**
   * 5. Success sound: Harmonious double cyber-chime (tests passed, copied, action confirmed)
   */
  public playSuccessChime() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Note 1 (E6 - 1318 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1318.5, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Note 2 (B6 - 1975 Hz) slightly delayed
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1975.5, now + 0.06);
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.2, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.22);
    } catch {}
  }

  /**
   * 6. Error & Wrong Command Alert: Dual-tone dissonant warning siren / buzzer
   */
  public playWrongCommandAlert() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Pulse 1: Dissonant harsh buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.setValueAtTime(220, now + 0.08);

      osc2.frequency.setValueAtTime(345, now);
      osc2.frequency.setValueAtTime(235, now + 0.08);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(dest);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } catch {}
  }

  public playErrorBeep() {
    this.playWrongCommandAlert();
  }

  /**
   * 7. Open Project / External Link: High-frequency data link chirp
   */
  public playProjectOpen() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.linearRampToValueAtTime(1760, now + 0.07);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  /**
   * 8. Download sound: Futuristic data burst modem-tone sweep followed by completion chime
   */
  public playDownloadBurst() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Rapid 3-tone packet transfer
      const frequencies = [880, 1174, 1567, 2093];
      frequencies.forEach((freq, idx) => {
        const start = now + idx * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.038);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(start);
        osc.stop(start + 0.038);
      });

      // Final resolution tone
      const finalStart = now + 0.2;
      const finalOsc = ctx.createOscillator();
      const finalGain = ctx.createGain();
      finalOsc.type = 'triangle';
      finalOsc.frequency.setValueAtTime(2637, finalStart); // E7
      finalGain.gain.setValueAtTime(0.18, finalStart);
      finalGain.gain.exponentialRampToValueAtTime(0.001, finalStart + 0.2);

      finalOsc.connect(finalGain);
      finalGain.connect(dest);

      finalOsc.start(finalStart);
      finalOsc.stop(finalStart + 0.2);
    } catch {}
  }

  /**
   * 9. Theme / GUI mode switch sound: Harmonic dual sweep transition
   */
  public playThemeSwitch() {
    const dest = this.getDestinationNode();
    if (!dest || !this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }
}

export const terminalAudio = new TerminalAudioEngine();
