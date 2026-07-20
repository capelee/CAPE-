/**
 * Web Audio API Synthesis Effects
 * Designed to provide immersive, cute, and performant sound experiences without loading heavy assets.
 */

class SharedAudioContextManager {
  private ctx: AudioContext | null = null;
  private suspendTimer: any = null;
  private preventSuspendCount = 0;

  getOrCreateContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        console.log("[AudioContextManager] Created a new shared AudioContext.");
      }
    }

    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      this.resetSuspendTimer();
    }

    return this.ctx;
  }

  resetSuspendTimer() {
    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }

    if (this.preventSuspendCount > 0) return;

    this.suspendTimer = setTimeout(() => {
      this.suspendContext();
    }, 10000); // 10 seconds of inactivity
  }

  incrementPreventSuspend() {
    this.preventSuspendCount++;
    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }
  }

  decrementPreventSuspend() {
    this.preventSuspendCount = Math.max(0, this.preventSuspendCount - 1);
    if (this.preventSuspendCount === 0) {
      this.resetSuspendTimer();
    }
  }

  private suspendContext() {
    if (this.ctx && this.ctx.state === "running") {
      console.log("[AudioContextManager] Suspending AudioContext due to 10s of inactivity.");
      this.ctx.suspend().catch(() => {});
    }
  }

  destroy() {
    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
      this.suspendTimer = null;
    }
    if (this.ctx) {
      console.log("[AudioContextManager] Closing AudioContext and executing garbage collection.");
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const audioContextManager = new SharedAudioContextManager();

// 1. 🐾 肉球按下「啵」水滴聲 (Cute Paw Pop)
export const playPawPopSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(850, now);
    // Rapid exponential drop to create the elastic "pop" bubble/paw pressure sensation
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    // Safety fallback
  }
};

// 2. 🐱 軟萌貓咪叫聲 (Mew / Meow Synthesis)
export const playMeowSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Carrier oscillator (creates the main warm tone)
    const carrier = ctx.createOscillator();
    // Modulator oscillator (vibrates the voice box)
    const modulator = ctx.createOscillator();
    // Modulator gain controls depth of vocal cord vibration
    const modGain = ctx.createGain();
    // Main volume envelope
    const mainGain = ctx.createGain();

    // Triangle wave gives a soft, organic, vocal quality
    carrier.type = "triangle";
    carrier.frequency.setValueAtTime(950, now);
    // Slide frequency from high (1200Hz) to medium (700Hz) in 0.18s to mimic the "me-ow" pitch inflection
    carrier.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
    carrier.frequency.exponentialRampToValueAtTime(720, now + 0.18);

    // Modulator (frequency modulation to simulate the voice crackle/purr resonance of a kitten)
    modulator.type = "sawtooth";
    modulator.frequency.setValueAtTime(180, now); // Vocal cord vibration rate

    // Modulator depth fades with time
    modGain.gain.setValueAtTime(320, now);
    modGain.gain.exponentialRampToValueAtTime(40, now + 0.18);

    // Soft volume envelope (mimicking real breath)
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.1, now + 0.03);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    // FM Connections
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    carrier.connect(mainGain);
    mainGain.connect(ctx.destination);

    modulator.start(now);
    carrier.start(now);
    
    modulator.stop(now + 0.23);
    carrier.stop(now + 0.23);
  } catch (e) {
    // Safety fallback
  }
};

// 3. 💤 溫暖貓咪呼嚕聲 (Cat Purr Vibration)
class CatPurrManager {
  private ctx: AudioContext | null = null;
  private carrier: OscillatorNode | null = null;
  private lfo1: OscillatorNode | null = null;
  private lfo2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  public isPlaying: boolean = false;

  start() {
    if (this.isPlaying) return;
    try {
      const ctx = audioContextManager.getOrCreateContext();
      if (!ctx) return;
      this.ctx = ctx;
      const now = this.ctx.currentTime;

      // Prevent shared context from autosuspending during active purr
      audioContextManager.incrementPreventSuspend();

      // Carrier: Ultra-low frequency sine wave representing the deep chest vibration (36Hz)
      this.carrier = this.ctx.createOscillator();
      this.carrier.type = "sine";
      this.carrier.frequency.setValueAtTime(36, now);

      // LFO 1: Rapid 24Hz rumble representing the vocal fold clicking rate of purring
      this.lfo1 = this.ctx.createOscillator();
      this.lfo1.type = "sine";
      this.lfo1.frequency.setValueAtTime(24, now);

      const lfo1Gain = this.ctx.createGain();
      lfo1Gain.gain.setValueAtTime(5, now); // micro-frequency pitch modulation

      // LFO 2: Soothing 0.35Hz wave representing the slow, rhythmic rising/falling breath
      this.lfo2 = this.ctx.createOscillator();
      this.lfo2.type = "sine";
      this.lfo2.frequency.setValueAtTime(0.35, now);

      const lfo2Gain = this.ctx.createGain();
      lfo2Gain.gain.setValueAtTime(0.05, now); // micro-amplitude volume modulation

      // Base volume control to keep it pleasant and safe
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, now);
      this.gainNode.gain.linearRampToValueAtTime(0.15, now + 0.4); // elegant fade-in

      // Connections:
      this.lfo1.connect(lfo1Gain);
      lfo1Gain.connect(this.carrier.frequency);

      this.lfo2.connect(lfo2Gain);
      lfo2Gain.connect(this.gainNode.gain);

      this.carrier.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      // Play
      this.carrier.start(now);
      this.lfo1.start(now);
      this.lfo2.start(now);

      this.isPlaying = true;
    } catch (e) {
      // Safety fallback
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.gainNode && this.ctx) {
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3); // smooth fade-out
      }
      setTimeout(() => {
        try {
          if (this.carrier) this.carrier.stop();
          if (this.lfo1) this.lfo1.stop();
          if (this.lfo2) this.lfo2.stop();
        } catch (err) {}
        this.carrier = null;
        this.lfo1 = null;
        this.lfo2 = null;
        this.gainNode = null;
        this.ctx = null;
        // Allow shared context to resume autosuspending after purr stops
        audioContextManager.decrementPreventSuspend();
      }, 400);
      this.isPlaying = false;
    } catch (e) {
      this.isPlaying = false;
    }
  }
}

export const catPurr = new CatPurrManager();

// 4. 🥫 罐頭金屬輕微碰撞叮噹聲 (Slight can clink/tinkle synthesis)
export const playCanClinkSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();
    const gainNode2 = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1150, now);
    osc1.frequency.exponentialRampToValueAtTime(750, now + 0.1);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1850, now);
    osc2.frequency.exponentialRampToValueAtTime(1450, now + 0.08);

    gainNode1.gain.setValueAtTime(0.05, now);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    gainNode2.gain.setValueAtTime(0.04, now);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc1.connect(gainNode1);
    gainNode1.connect(ctx.destination);

    osc2.connect(gainNode2);
    gainNode2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 0.12);
    osc2.stop(now + 0.08);
  } catch (e) {
    // Safety fallback
  }
};

