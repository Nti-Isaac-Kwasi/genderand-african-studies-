export const playSound = (type: 'click' | 'correct' | 'incorrect' | 'timeout') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playOsc = (freq: number, oscType: OscillatorType, startTime: number, duration: number, vol = 0.1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
    if (type === 'click') {
      playOsc(600, 'sine', now, 0.1, 0.05);
    } else if (type === 'correct') {
      playOsc(523.25, 'square', now, 0.15, 0.05); // C5
      playOsc(659.25, 'square', now + 0.1, 0.2, 0.05); // E5
    } else if (type === 'incorrect') {
      playOsc(300, 'sawtooth', now, 0.15, 0.05);
      playOsc(250, 'sawtooth', now + 0.15, 0.2, 0.05);
    } else if (type === 'timeout') {
      playOsc(400, 'sawtooth', now, 0.2, 0.05);
      playOsc(300, 'sawtooth', now + 0.2, 0.3, 0.05);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
