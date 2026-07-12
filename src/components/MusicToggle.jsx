import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function MusicToggle() {
  const { musicPlaying, toggleMusic } = useAppStore();
  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = createRomanticPiano();
    return () => engineRef.current?.destroy?.();
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    if (musicPlaying) {
      engineRef.current.start();
    } else {
      engineRef.current.stop();
    }
  }, [musicPlaying]);

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: musicPlaying
          ? 'rgba(14,165,233,0.15)'
          : 'rgba(255,255,255,0.05)',
        border: musicPlaying
          ? '1px solid rgba(56,189,248,0.5)'
          : '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: musicPlaying
          ? '0 0 25px rgba(56,189,248,0.5), 0 0 50px rgba(56,189,248,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      title={musicPlaying ? 'Pause Music' : 'Play Music'}
    >
      {musicPlaying ? (
        /* Pause icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4" width="4" height="16" rx="1.5" fill="#38bdf8" />
          <rect x="14" y="4" width="4" height="16" rx="1.5" fill="#38bdf8" />
        </svg>
      ) : (
        /* Play icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 4.5v15l12-7.5L7 4.5z" fill="#38bdf8" />
        </svg>
      )}

      {/* Animated EQ bars when playing */}
      {musicPlaying && (
        <span
          className="absolute -top-2 -right-2 flex items-end gap-0.5 p-1 rounded-full"
          style={{
            background: 'rgba(14,165,233,0.2)',
            border: '1px solid rgba(56,189,248,0.3)',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-0.5 rounded-full bg-sky-400"
              animate={{ height: ['4px', `${6 + i * 3}px`, '4px'] }}
              transition={{
                duration: 0.6 + i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
              style={{ display: 'block', minHeight: '4px' }}
            />
          ))}
        </span>
      )}

      {/* Music note tooltip */}
      {!musicPlaying && (
        <span className="absolute -top-1 -right-1 text-xs">🎵</span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Romantic Piano Engine — Web Audio API
   Plays a looping piano piece inspired by
   soft romantic/lofi ballads.
   Sections: melody + bass + chord pads + reverb
───────────────────────────────────────────── */

// Note frequency helpers
const NOTE = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
};

// Romantic melody: Am - F - C - G progression, 8 bars, 4/4 time
// Each entry: [freq, startBeat, durationBeats, volume]
const BEAT = 0.55; // seconds per beat (≈ 109 BPM, dreamy)

const MELODY = [
  // Bar 1-2: Am feel
  [NOTE.A5, 0,   0.9, 0.18],
  [NOTE.E5, 1,   0.9, 0.14],
  [NOTE.C5, 2,   0.9, 0.14],
  [NOTE.E5, 3,   0.7, 0.12],
  [NOTE.A5, 3.5, 0.7, 0.16],
  [NOTE.A5, 4,   1.8, 0.18],
  [NOTE.G5, 5.5, 0.4, 0.12],
  [NOTE.E5, 6,   0.9, 0.15],
  [NOTE.D5, 7,   0.9, 0.13],

  // Bar 3-4: F → C
  [NOTE.C5, 8,   0.9, 0.16],
  [NOTE.E5, 9,   0.9, 0.14],
  [NOTE.F5, 10,  1.4, 0.18],
  [NOTE.E5, 11.5,0.4, 0.12],
  [NOTE.D5, 12,  0.9, 0.14],
  [NOTE.C5, 13,  1.8, 0.18],
  [NOTE.B4, 14.5,0.4, 0.10],
  [NOTE.A4, 15,  0.9, 0.13],

  // Bar 5-6: C → G
  [NOTE.C5, 16,  0.9, 0.16],
  [NOTE.D5, 17,  0.9, 0.14],
  [NOTE.E5, 18,  0.9, 0.15],
  [NOTE.G5, 19,  1.4, 0.18],
  [NOTE.F5, 20.5,0.4, 0.12],
  [NOTE.E5, 21,  0.9, 0.14],
  [NOTE.D5, 22,  0.9, 0.13],
  [NOTE.G4, 23,  0.9, 0.12],

  // Bar 7-8: Am resolve
  [NOTE.A4, 24,  0.9, 0.16],
  [NOTE.C5, 25,  0.9, 0.14],
  [NOTE.E5, 26,  0.9, 0.15],
  [NOTE.A5, 27,  1.8, 0.20],
  [NOTE.G5, 28.5,0.4, 0.12],
  [NOTE.E5, 29,  0.9, 0.14],
  [NOTE.C5, 30,  0.9, 0.13],
  [NOTE.A4, 31,  0.9, 0.12],
];

const TOTAL_BEATS = 32;

// Bass notes: root on beat 1 and 3 of each bar
const BASS = [
  // Am bars
  [NOTE.A2 || 110.00, 0,  0.6, 0.22],
  [NOTE.E3,           2,  0.6, 0.18],
  [NOTE.A2 || 110.00, 4,  0.6, 0.22],
  [NOTE.E3,           6,  0.6, 0.18],
  // F bars
  [NOTE.F3,           8,  0.6, 0.22],
  [NOTE.C4,           10, 0.6, 0.18],
  // C bars
  [NOTE.C3,           12, 0.6, 0.22],
  [NOTE.G3,           14, 0.6, 0.18],
  // G bars
  [NOTE.G3,           16, 0.6, 0.22],
  [NOTE.D4,           18, 0.6, 0.18],
  [NOTE.G3,           20, 0.6, 0.22],
  [NOTE.D4,           22, 0.6, 0.18],
  // Am resolve
  [NOTE.A3,           24, 0.6, 0.22],
  [NOTE.E4,           26, 0.6, 0.18],
  [NOTE.A3,           28, 0.6, 0.22],
  [NOTE.E4,           30, 0.6, 0.18],
];

// Chord pads: [freqs[], startBeat, durationBeats, volume]
const CHORDS = [
  [[NOTE.A3, NOTE.C4, NOTE.E4], 0,  7.8, 0.06],  // Am
  [[NOTE.F3, NOTE.A3, NOTE.C4], 8,  3.8, 0.06],  // F
  [[NOTE.C3, NOTE.E3, NOTE.G3], 12, 3.8, 0.06],  // C
  [[NOTE.G3, NOTE.B3, NOTE.D4], 16, 7.8, 0.06],  // G
  [[NOTE.A3, NOTE.C4, NOTE.E4], 24, 7.8, 0.06],  // Am
];

function createRomanticPiano() {
  let ctx = null;
  let masterGain = null;
  let reverbNode = null;
  let playing = false;
  let loopTimeout = null;
  let scheduledNodes = [];

  const init = () => {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Master gain (with fade)
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    // Simple reverb using delay + feedback
    reverbNode = createReverb(ctx);
    reverbNode.connect(masterGain);
  };

  // Piano note: triangle + sine blend for warm tone
  const playPianoNote = (freq, startTime, durationBeats, vol, toReverb = false) => {
    if (!ctx) return;
    const dur = durationBeats * BEAT;
    const destination = toReverb ? reverbNode : masterGain;

    // Main oscillator (triangle = warm piano body)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.value = freq;
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2; // octave above = harmonic shimmer

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(destination);

    // Piano ADSR envelope
    const attack = 0.01;
    const decay = 0.15;
    const sustain = vol * 0.6;
    const release = Math.min(0.8, dur * 0.4);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + attack);
    gain.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);
    gain.gain.setValueAtTime(sustain, startTime + dur - release);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + dur + 0.05);
    osc2.stop(startTime + dur + 0.05);

    scheduledNodes.push(osc1, osc2, gain);
  };

  const playBassNote = (freq, startTime, durationBeats, vol) => {
    if (!ctx) return;
    const dur = durationBeats * BEAT;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(masterGain);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    osc.start(startTime);
    osc.stop(startTime + dur + 0.1);
    scheduledNodes.push(osc, gain);
  };

  const playChord = (freqs, startTime, durationBeats, vol) => {
    freqs.forEach((f) => playPianoNote(f, startTime, durationBeats, vol, true));
  };

  const scheduleLoop = (startTime) => {
    if (!playing) return;

    // Clear old nodes
    scheduledNodes = [];

    // Schedule melody
    MELODY.forEach(([freq, beat, dur, vol]) => {
      playPianoNote(freq, startTime + beat * BEAT, dur, vol, true);
    });

    // Schedule bass
    BASS.forEach(([freq, beat, dur, vol]) => {
      playBassNote(freq, startTime + beat * BEAT, dur, vol);
    });

    // Schedule chords
    CHORDS.forEach(([freqs, beat, dur, vol]) => {
      playChord(freqs, startTime + beat * BEAT, dur, vol);
    });

    const loopDuration = TOTAL_BEATS * BEAT * 1000;
    loopTimeout = setTimeout(() => {
      if (playing) scheduleLoop(startTime + TOTAL_BEATS * BEAT);
    }, loopDuration - 200); // schedule next loop 200ms before end
  };

  return {
    start: () => {
      if (playing) return;
      init();
      ctx.resume();
      playing = true;

      // Fade in master
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);

      scheduleLoop(ctx.currentTime + 0.1);
    },

    stop: () => {
      if (!playing) return;
      playing = false;
      clearTimeout(loopTimeout);

      // Fade out gracefully
      if (masterGain) {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      }
    },

    destroy: () => {
      playing = false;
      clearTimeout(loopTimeout);
      ctx?.close();
    },
  };
}

// Simple reverb using a convolver with generated impulse
function createReverb(ctx) {
  const convolver = ctx.createConvolver();
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.35;

  // Generate impulse response (exponential decay)
  const rate = ctx.sampleRate;
  const length = rate * 2.5;
  const impulse = ctx.createBuffer(2, length, rate);

  for (let c = 0; c < 2; c++) {
    const ch = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
    }
  }

  convolver.buffer = impulse;
  convolver.connect(gainNode);
  return gainNode;
}
