/**
 * Animalese-style (動物森友會) Web Audio Synthesizer
 * Generates dynamic, cute, retro synth blips synced with speech dialogue
 */

export class AnimaleseSynth {
  private ctx: AudioContext | null = null;
  private activeInterval: any = null;

  constructor() {}

  private init() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Play dynamic synth speech sounds based on input text
   * @param text The dialog text to translate into synthesized sounds
   * @param durationMs Maximum duration of speech playback
   */
  play(text: string, durationMs: number = 2200) {
    this.stop();
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const cleanText = text.trim().replace(/[，。！？\s\w]/g, ""); // Filter out punctuation
    const textLength = cleanText.length > 0 ? cleanText.length : 15;

    // Speeds and intervals
    const blipInterval = 95; // Time between speech blips (ms)
    const totalBlips = Math.min(Math.ceil(durationMs / blipInterval), textLength, 30);

    let blipIndex = 0;

    const playBlip = () => {
      if (!this.ctx || this.ctx.state === "suspended") return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Cute warm retro sound: triangle wave
      osc.type = "triangle";

      // Seed pitch based on characters to make each sentence have a unique recognizable "voice footprint"
      const char = cleanText[blipIndex % cleanText.length] || "貓";
      const charCode = char.charCodeAt(0);

      // Pitch settings: high-pitched, cute cat voice range (550Hz to 850Hz)
      const baseFreq = 580 + (charCode % 12) * 18; 
      
      // Sloped pitch sweep to simulate vowels (e.g. rising "mew", falling "boop")
      const isRising = (charCode % 2) === 0;
      const glideTarget = isRising 
        ? baseFreq * (1.1 + (charCode % 5) * 0.05) // Rising
        : baseFreq * (0.85 - (charCode % 5) * 0.04); // Falling

      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(baseFreq, t);
      // Fast sweep over the blip duration
      osc.frequency.exponentialRampToValueAtTime(glideTarget, t + 0.09);

      // Dynamic short volume envelope
      gainNode.gain.setValueAtTime(0, t);
      // Soft fast attack (avoid clicking)
      gainNode.gain.linearRampToValueAtTime(0.08, t + 0.012);
      // Exponential decay to silence
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.085);

      osc.start(t);
      osc.stop(t + 0.09);

      blipIndex++;
    };

    // Trigger the first blip immediately
    playBlip();

    this.activeInterval = setInterval(() => {
      if (blipIndex >= totalBlips) {
        this.stop();
      } else {
        playBlip();
      }
    }, blipInterval);
  }

  stop() {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null;
    }
  }
}

// Single export instance for global app usage
export const animaleseSynth = new AnimaleseSynth();
