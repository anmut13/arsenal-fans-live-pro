/**
 * Web Audio API synthesizer for broadcast television sounds.
 * Generates instant crisp audio without relying on external MP3 assets.
 */
class BroadcastAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Goal Stadium Horn & Fanfare chime
   */
  public playGoalFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Low stadium air horn pulse
    const hornOsc = ctx.createOscillator();
    const hornGain = ctx.createGain();
    hornOsc.type = 'sawtooth';
    hornOsc.frequency.setValueAtTime(130, now);
    hornOsc.frequency.linearRampToValueAtTime(145, now + 0.8);
    hornGain.gain.setValueAtTime(0.2, now);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    hornOsc.connect(hornGain);
    hornGain.connect(ctx.destination);
    hornOsc.start(now);
    hornOsc.stop(now + 1.2);

    // Chime chords: C - E - G - High C
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.18, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.9);
    });
  }

  /**
   * Referee Whistle
   */
  public playWhistle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(2600, now);
    osc2.frequency.setValueAtTime(2850, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  /**
   * Broadcast Graphic Pop In / Alert
   */
  public playGraphicAlert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export const broadcastAudio = new BroadcastAudioService();
