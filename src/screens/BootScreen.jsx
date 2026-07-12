import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const BOOT_LINES = [
  { text: '> Initializing LoveOS v1.0...', color: '#38bdf8', delay: 500 },
  { text: '> Connecting Secure Server...', color: '#a78bfa', delay: 1200 },
  { text: '> Loading Emotion Engine...', color: '#f9a8d4', delay: 2000 },
  { text: '> Checking Heartbeat... ♥', color: '#ec4899', delay: 2800 },
  { text: '> Scanning Happiness Database...', color: '#38bdf8', delay: 3600 },
  { text: '> Verifying Credentials...', color: '#a78bfa', delay: 4300 },
  { text: '> All Systems Operational.', color: '#4ade80', delay: 5000 },
  { text: '> Starting...', color: '#ffffff', delay: 5600 },
];

export default function BootScreen() {
  const { goNext } = useAppStore();
  const [visibleLines, setVisibleLines] = useState([]);
  const [loadingPct, setLoadingPct] = useState(0);
  const [done, setDone] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay)
    );

    // Animate loading bar
    const interval = setInterval(() => {
      setLoadingPct((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 1;
      });
    }, 60);

    // Transition after boot
    const doneTimer = setTimeout(() => {
      setDone(true);
      setTimeout(goNext, 800);
    }, 6800);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(doneTimer);
    };
  }, []);

  // Heartbeat pulse
  const [heartPulse, setHeartPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setHeartPulse((p) => !p), 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56,189,248,0.05) 2px, rgba(56,189,248,0.05) 4px)',
        }}
      />

      {/* Logo */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: heartPulse ? 1.15 : 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          ❤️
        </motion.div>
        <h1 className="font-display font-black text-3xl tracking-widest text-gradient">
          LOVEOS
        </h1>
        <p className="text-white/30 font-mono text-xs tracking-[0.3em] mt-1">
          SYSTEM v1.0.0
        </p>
      </motion.div>

      {/* Terminal box */}
      <div className="glass-dark w-full max-w-lg mx-4 p-6 font-mono text-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          <span className="text-white/30 text-xs ml-2 tracking-widest">LOVEOS TERMINAL</span>
        </div>

        <div className="space-y-1 min-h-[200px]">
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="leading-relaxed"
              style={{ color: line.color }}
            >
              {line.text}
            </motion.div>
          ))}
          {visibleLines.length < BOOT_LINES.length && (
            <span className="inline-block w-2 h-4 bg-sky-400 animate-cursor-blink" />
          )}
        </div>
      </div>

      {/* Loading bar */}
      <div className="w-full max-w-lg mx-4 mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/30 font-mono text-xs">LOADING SYSTEM</span>
          <span className="text-sky-400 font-mono text-xs font-bold">{loadingPct}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${loadingPct}%`,
              background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899)',
              boxShadow: '0 0 10px rgba(14,165,233,0.8)',
              transition: 'width 0.06s linear',
            }}
          />
        </div>
      </div>

      {/* Bottom branding */}
      <motion.p
        className="absolute bottom-8 text-white/10 font-mono text-xs tracking-[0.5em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        OPERATION SHEETAL • CLASSIFIED
      </motion.p>
    </motion.div>
  );
}
