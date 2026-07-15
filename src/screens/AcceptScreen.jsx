import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { saveResponse } from '../lib/firebase';
import { sendTelegram, buildAcceptMessage } from '../lib/telegram';
import { sendEmail } from '../lib/emailjs';

// ── Confetti helpers ──────────────────────────────────────────────────────────
function fireConfetti(opts = {}) {
  confetti({
    origin: { y: 0.7 },
    colors: ['#38bdf8', '#ec4899', '#a78bfa', '#f9a8d4', '#fbbf24', '#4ade80'],
    ...opts,
  });
}

function launchBurst() {
  fireConfetti({ particleCount: 60, spread: 26, startVelocity: 55 });
  fireConfetti({ particleCount: 45, spread: 60 });
  fireConfetti({ particleCount: 70, spread: 100, decay: 0.91, scalar: 0.8 });
  fireConfetti({ particleCount: 20, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
}

// ── Floating hearts background ─────────────────────────────────────────────
function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{ left: `${3 + i * 6}%`, bottom: -40 }}
          animate={{
            y: [0, -(window.innerHeight + 80)],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.3, 0.6],
            rotate: [0, (Math.random() - 0.5) * 40],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeOut',
          }}
        >
          {['❤️', '💕', '💝', '💗', '💖', '✨', '🌸', '💫'][i % 8]}
        </motion.div>
      ))}
    </div>
  );
}

// ── Page 1: EXPLOSION / ACCESS GRANTED ───────────────────────────────────────
function CelebrationPage() {
  return (
    <motion.div
      key="celebration"
      className="w-full max-w-md text-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0, filter: 'blur(12px)' }}
      transition={{ type: 'spring', stiffness: 130, damping: 14 }}
    >
      {/* Big glowing ring */}
      <div className="relative inline-block mb-8">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 40px rgba(236,72,153,0.6), 0 0 80px rgba(139,92,246,0.4)',
              '0 0 80px rgba(56,189,248,0.8), 0 0 160px rgba(236,72,153,0.4)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className="text-9xl select-none"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 12, -12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          🎉
        </motion.div>
      </div>

      {/* ACCESS GRANTED */}
      <motion.h1
        className="font-display font-black text-5xl mb-3"
        style={{
          background: 'linear-gradient(135deg, #38bdf8, #a78bfa, #ec4899)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
      >
        ACCESS GRANTED
      </motion.h1>

      <motion.p
        className="text-white/70 text-xl font-display"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        She said YES! 🥳
      </motion.p>

      {/* Pulsing dot row */}
      <motion.div
        className="flex justify-center gap-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {['#38bdf8', '#a78bfa', '#ec4899', '#fbbf24', '#4ade80'].map((c, i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: c }}
            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Page 2: Love Stats / Data Visualization ───────────────────────────────────
function LoveStatsPage() {
  const stats = [
    { label: 'Happiness Level', value: 100, unit: '%', color: '#f9a8d4', icon: '💗' },
    { label: 'Heart Rate', value: 999, unit: 'bpm', color: '#38bdf8', icon: '💓' },
    { label: 'Smiles Per Day', value: 24, unit: '/day', color: '#a78bfa', icon: '😊' },
    { label: 'Love Capacity', value: '∞', unit: '', color: '#fbbf24', icon: '✨' },
  ];

  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="stats"
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          className="text-5xl mb-3"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📊
        </motion.div>
        <h2 className="font-display font-black text-2xl text-white mb-1">
          Relationship Analytics
        </h2>
        <p className="text-white/40 font-mono text-xs tracking-widest">LOVE OS — REAL TIME DATA</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.18, type: 'spring', stiffness: 150 }}
            style={{
              background: `linear-gradient(135deg, ${s.color}15, ${s.color}08)`,
              border: `1px solid ${s.color}30`,
              borderRadius: 16,
              padding: '1rem',
            }}
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-mono font-black text-2xl" style={{ color: s.color }}>
              {typeof s.value === 'number' && animated ? (
                <CountUp target={s.value} duration={1500} />
              ) : (
                s.value
              )}
              {s.unit}
            </div>
            <div className="text-white/40 text-xs mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Heartbeat SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '1rem',
        }}
      >
        <p className="text-white/30 font-mono text-xs mb-2">HEART MONITOR</p>
        <svg viewBox="0 0 300 60" className="w-full">
          <motion.polyline
            points="0,30 40,30 55,10 65,50 75,15 85,45 95,30 300,30"
            fill="none"
            stroke="#ec4899"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.8))' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function CountUp({ target, duration }) {
  const [val, setVal] = useState(0);
  const start = useRef(Date.now());
  const raf = useRef(null);
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - start.current;
      const progress = Math.min(elapsed / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return <>{val}</>;
}

// ── Page 3: Official Certificate ─────────────────────────────────────────────
function CertificatePage() {
  const fields = [
    { label: 'Issued To', value: 'Sheetal ✨', color: '#f9a8d4' },
    { label: 'Issued By', value: 'Udit 💙', color: '#38bdf8' },
    { label: 'Status', value: '✓ Accepted ❤️', color: '#4ade80' },
    { label: 'Mission', value: 'Make Each Other Happy', color: '#a78bfa' },
    { label: 'Valid From', value: 'Right Now ∞', color: '#fbbf24' },
    { label: 'Certified By', value: 'LoveOS HQ 🏛️', color: '#fb923c' },
  ];

  return (
    <motion.div
      key="certificate"
      className="w-full max-w-md"
      initial={{ opacity: 0, rotateY: -20, y: 40 }}
      animate={{ opacity: 1, rotateY: 0, y: 0 }}
      exit={{ opacity: 0, rotateY: 20 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
    >
      {/* Certificate frame */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56,189,248,0.4), rgba(167,139,250,0.4), rgba(249,168,212,0.4))',
          borderRadius: 24,
          padding: 2,
        }}
      >
        <div
          style={{
            background: 'rgba(5,5,15,0.95)',
            borderRadius: 22,
            padding: '1.75rem',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Certificate header */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.5))' }} />
            <div className="text-center">
              <p className="text-sky-400 font-mono text-xs tracking-[0.25em] font-bold">OFFICIAL CERTIFICATE</p>
              <p className="text-white/20 font-mono text-xs">of Connection</p>
            </div>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(56,189,248,0.5))' }} />
          </div>

          {/* Seal emoji */}
          <div className="text-center mb-5">
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💝
            </motion.div>
          </div>

          {/* Fields */}
          <div className="space-y-2.5 mb-5">
            {fields.map((f, i) => (
              <motion.div
                key={f.label}
                className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.12 }}
              >
                <span className="text-white/35 font-mono text-xs">{f.label}</span>
                <span className="font-semibold text-sm" style={{ color: f.color }}>
                  {f.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Stamp + Signature row */}
          <div className="flex items-end justify-between">
            <div>
              <div className="w-24 h-px mb-1" style={{ background: 'rgba(56,189,248,0.4)' }} />
              <p className="text-white/30 font-mono text-xs">Authorized</p>
            </div>
            <motion.div
              className="text-center px-4 py-2 rounded-xl font-bold text-xs tracking-widest"
              style={{
                background: 'rgba(236,72,153,0.12)',
                border: '1.5px solid rgba(236,72,153,0.5)',
                color: '#f9a8d4',
                transform: 'rotate(-8deg)',
                boxShadow: '0 0 20px rgba(236,72,153,0.2)',
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: -8 }}
              transition={{ delay: 1, type: 'spring', stiffness: 200 }}
            >
              ❤️ OFFICIAL
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page 4: Future Together / CTA ─────────────────────────────────────────────
function FuturePage({ onStart }) {
  const promises = [
    { icon: '🌅', text: 'Sunrise walks together' },
    { icon: '🍕', text: 'Sharing the last slice (always)' },
    { icon: '😂', text: 'Laughing at dumb jokes at 2AM' },
    { icon: '💪', text: 'Being each other\'s strength' },
    { icon: '✈️', text: 'Adventures waiting to happen' },
    { icon: '🌙', text: 'Good night texts, every night' },
  ];

  return (
    <motion.div
      key="future"
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-3"
          animate={{ scale: [1, 1.15, 1], y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚀
        </motion.div>
        <h2 className="font-display font-black text-3xl text-white mb-1">
          Our Chapter Begins
        </h2>
        <p className="text-white/40 font-mono text-xs tracking-widest">WHAT LIES AHEAD</p>
      </div>

      {/* Promises grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {promises.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 180 }}
            className="flex items-center gap-2.5 p-3 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-xl">{p.icon}</span>
            <span className="text-white/65 text-xs leading-tight">{p.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Big CTA */}
      <motion.button
        className="w-full py-5 rounded-2xl font-bold text-white text-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #38bdf8)',
          backgroundSize: '200% 200%',
          boxShadow: '0 0 40px rgba(236,72,153,0.6), 0 0 80px rgba(139,92,246,0.3)',
        }}
        whileHover={{
          scale: 1.04,
          boxShadow: '0 0 70px rgba(236,72,153,0.8), 0 0 140px rgba(139,92,246,0.5)',
        }}
        whileTap={{ scale: 0.97 }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 3, repeat: Infinity }}
        onClick={onStart}
        initial={{ opacity: 0 }}
        // This animate override won't work because of the background animation — handled by style
      >
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <span className="relative flex items-center justify-center gap-3">
          <span>Start Our Journey</span>
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            →
          </motion.span>
        </span>
      </motion.button>

      <motion.p
        className="text-center text-white/25 font-mono text-xs mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        This made someone incredibly happy today. 🥹
      </motion.p>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AcceptScreen() {
  const { goTo } = useAppStore();
  // phases: celebration → stats → certificate → future
  const [phase, setPhase] = useState('celebration');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (sent) return;
    setSent(true);
    saveResponse('accepted');
    sendTelegram(buildAcceptMessage());
    sendEmail('accepted');

    // Initial confetti
    launchBurst();
    setTimeout(launchBurst, 800);
    setTimeout(launchBurst, 2000);

    // Continuous fireworks for first 5 seconds
    const end = Date.now() + 5000;
    const fw = setInterval(() => {
      if (Date.now() > end) { clearInterval(fw); return; }
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f9a8d4', '#a78bfa', '#38bdf8'] });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#f9a8d4', '#a78bfa', '#38bdf8'] });
    }, 200);

    // Auto-advance phases
    setTimeout(() => setPhase('stats'), 3500);
    setTimeout(() => setPhase('certificate'), 8000);
    setTimeout(() => setPhase('future'), 13000);
  }, []);

  const phaseOrder = ['celebration', 'stats', 'certificate', 'future'];

  const handleStart = () => {
    launchBurst();
    setTimeout(launchBurst, 400);
    setTimeout(() => goTo('journey'), 800);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated bg gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.25) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse at 60% 40%, rgba(56,189,248,0.25) 0%, transparent 50%), radial-gradient(ellipse at 40% 60%, rgba(236,72,153,0.25) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
      />

      <FloatingHearts />

      {/* Phase indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {phaseOrder.map((p, i) => (
          <motion.div
            key={p}
            className="rounded-full"
            animate={{
              width: phase === p ? 22 : 7,
              height: 7,
              background:
                phase === p
                  ? 'linear-gradient(90deg, #ec4899, #a78bfa)'
                  : phaseOrder.indexOf(phase) > i
                  ? 'rgba(236,72,153,0.5)'
                  : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      {/* Manual phase nav (skip buttons on non-first pages) */}
      {phase !== 'celebration' && phase !== 'future' && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 font-mono text-xs text-white/30 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={() => {
            const idx = phaseOrder.indexOf(phase);
            if (idx < phaseOrder.length - 1) setPhase(phaseOrder[idx + 1]);
          }}
          whileHover={{ opacity: 1, color: 'rgba(255,255,255,0.7)' }}
        >
          Next →
        </motion.button>
      )}

      <div className="w-full max-w-md py-12 flex items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {phase === 'celebration' && <CelebrationPage key="cel" />}
          {phase === 'stats' && <LoveStatsPage key="stats" />}
          {phase === 'certificate' && <CertificatePage key="cert" />}
          {phase === 'future' && <FuturePage key="fut" onStart={handleStart} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
