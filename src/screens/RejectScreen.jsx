import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { saveResponse } from '../lib/firebase';
import { sendTelegram, buildRejectMessage } from '../lib/telegram';
import { sendEmail } from '../lib/emailjs';

const DELETE_STEPS = [
  { label: 'Locating Feelings.exe...', pct: 8, delay: 400 },
  { label: 'Scanning Emotion Database...', pct: 20, delay: 1000 },
  { label: 'Accessing Heart.dll...', pct: 35, delay: 1800 },
  { label: 'Deleting Admiration Files...', pct: 50, delay: 2600 },
  { label: 'Removing Smile.exe...', pct: 62, delay: 3300 },
  { label: 'Erasing Happy Thoughts...', pct: 75, delay: 4100 },
  { label: 'Purging Memory Cache...', pct: 88, delay: 4900 },
  { label: 'Finalizing Deletion...', pct: 98, delay: 5700 },
];

const GLITCH_CHARS = '!@#$%^&*<>?/|\\{}[]';

function GlitchText({ text, active }) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iteration = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((char, idx) => {
          if (idx < iteration) return text[idx];
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join('')
      );
      if (iteration >= text.length) clearInterval(intervalRef.current);
      iteration += 0.4;
    }, 40);
    return () => clearInterval(intervalRef.current);
  }, [active, text]);

  return <span>{display}</span>;
}

// Floating broken heart particles
function BrokenHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          style={{ left: `${5 + i * 9}%`, bottom: -40 }}
          animate={{
            y: [0, -(window.innerHeight + 80)],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 0.4, 0],
            rotate: [0, (Math.random() - 0.5) * 180],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeOut',
          }}
        >
          {['💔', '🥀', '😢', '💧', '🌧️'][i % 5]}
        </motion.div>
      ))}
    </div>
  );
}

// Page 1: Deletion terminal
function DeletingPage({ currentStep, pct }) {
  return (
    <motion.div
      key="deleting"
      className="w-full max-w-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal header */}
      <div
        className="rounded-t-2xl px-4 py-3 flex items-center gap-2"
        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderBottom: 'none' }}
      >
        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
        <div className="w-3 h-3 rounded-full bg-green-400 opacity-40" />
        <span className="text-white/40 font-mono text-xs ml-2">LoveOS — Terminal v1.0</span>
      </div>

      {/* Terminal body */}
      <div
        className="rounded-b-2xl p-6"
        style={{
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(239,68,68,0.3)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            className="w-5 h-5 rounded-full border-2 border-red-400 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-red-400 font-mono text-sm font-bold tracking-wide">
            INITIATING DELETION PROTOCOL...
          </span>
        </div>

        <div className="space-y-2 mb-6 text-left font-mono text-xs">
          <div className="text-white/30 mb-3">$ sudo rm -rf /heart/feelings/Udit/*</div>
          {DELETE_STEPS.slice(0, currentStep + 1).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className={i < currentStep ? 'text-green-400' : 'text-red-400'}>
                {i < currentStep ? '✓' : '▶'}
              </span>
              <span className={i < currentStep ? 'text-white/30' : 'text-white/70'}>
                {step.label}
              </span>
              {i === currentStep && (
                <motion.span
                  className="text-red-400"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  █
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #ef4444, #f97316)',
                boxShadow: '0 0 10px rgba(239,68,68,0.7)',
              }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs">
            <span className="text-red-400/60">Deletion Progress</span>
            <span className="text-red-400">{pct}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Page 2: System Crash / Error
function ErrorPage() {
  const [shake, setShake] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShake(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="error"
      className="w-full max-w-md"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, x: shake ? [0, -10, 10, -8, 8, 0] : 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div
        animate={{ x: [0, -8, 8, -6, 6, -4, 4, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          background: 'rgba(0,0,0,0.9)',
          border: '1px solid rgba(239,68,68,0.6)',
          borderRadius: 20,
          boxShadow: '0 0 60px rgba(239,68,68,0.3), 0 0 120px rgba(239,68,68,0.1)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
        }}
      >
        {/* BSOD-style header */}
        <div
          className="rounded-xl p-3 mb-5 text-center"
          style={{ background: 'rgba(239,68,68,0.2)' }}
        >
          <p className="text-red-400 font-mono text-xs tracking-widest font-bold">
            ⚠️ CRITICAL SYSTEM ERROR ⚠️
          </p>
        </div>

        <motion.div
          className="text-center mb-5"
          animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-6xl">💔</span>
        </motion.div>

        <div className="font-mono text-sm space-y-2 mb-5">
          <div className="flex justify-between">
            <span className="text-white/30">Error Code:</span>
            <span className="text-red-400 font-bold">0xDEAD_HEART</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/30">Process:</span>
            <span className="text-white/60">DeleteFeelings.exe</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/30">Reason:</span>
            <span className="text-yellow-400">EMOTION_OVERFLOW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/30">Status:</span>
            <motion.span
              className="text-red-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              FAILED
            </motion.span>
          </div>
        </div>

        <div
          className="rounded-xl p-4 font-mono text-xs text-white/50"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <GlitchText text="DELETION_FAILED: Feelings cannot be removed from this system. The heart module has infinite storage for this particular user." active={true} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Page 3: Heart's Real Message
function HeartMessagePage() {
  const lines = [
    "Okay... deletion failed.",
    "Because some things can't be deleted.",
    "Not with code. Not with time.",
    "I tried. But my heart refused.",
  ];

  return (
    <motion.div
      key="heart-msg"
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div
        style={{
          background: 'rgba(15,15,25,0.9)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 24,
          padding: '2rem',
          boxShadow: '0 0 60px rgba(139,92,246,0.15)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Broken → healing heart animation */}
        <div className="text-center mb-6">
          <motion.div
            className="text-6xl mb-3"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💜
          </motion.div>
          <div className="h-px w-20 mx-auto" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />
        </div>

        {/* Handwritten-style message lines */}
        <div className="space-y-3 mb-6 text-center">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.35 }}
              className="font-display text-white/80 text-lg leading-relaxed"
              style={{ fontStyle: 'italic' }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center"
        >
          <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          <p className="text-white/40 font-mono text-xs">
            — System log from: Heart.dll —
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Page 4: Honest Emotional Note
function HonestNotePage() {
  const reasons = [
    { icon: '🌙', text: 'I never expected anything in return.' },
    { icon: '✨', text: 'Your smile was more than enough.' },
    { icon: '💙', text: 'My respect for you hasn\'t changed one bit.' },
    { icon: '🌸', text: 'You\'re still amazing, with or without a yes.' },
  ];

  return (
    <motion.div
      key="honest"
      className="w-full max-w-md"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(139,92,246,0.08))',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 24,
          padding: '2rem',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
        }}
      >
        <div className="text-center mb-6">
          <motion.div
            className="text-5xl mb-3"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🤍
          </motion.div>
          <h3 className="font-display font-bold text-2xl text-white mb-1">
            Thank You
          </h3>
          <p className="text-white/40 font-mono text-xs tracking-widest">
            FOR YOUR HONESTY
          </p>
        </div>

        {/* Reasons list */}
        <div className="space-y-3 mb-6">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.2 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-xl">{r.icon}</span>
              <p className="text-white/70 text-sm">{r.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center p-4 rounded-xl"
          style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}
        >
          <p className="text-sky-300/80 text-sm leading-relaxed">
            Your happiness matters more to me than any answer. 
            <br />
            <span className="text-white/40 text-xs mt-1 block">— Always, Udit 💙</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Page 5: Final Farewell + Comeback option
function FinalPage({ onReconsider }) {
  const [friendClicked, setFriendClicked] = useState(false);

  return (
    <motion.div
      key="final"
      className="w-full max-w-md space-y-5"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {/* Big emoji farewell */}
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-7xl mb-3"
        >
          😊
        </motion.div>
        <h2 className="font-display font-black text-3xl text-white mb-1">
          No Hard Feelings
        </h2>
        <p className="text-white/40 font-mono text-xs tracking-widest">FRIENDSHIP MODE: ACTIVATED</p>
      </div>

      {/* Stars / sparkles row */}
      <div className="flex justify-center gap-2">
        {['⭐', '💫', '✨', '🌟', '💫'].map((s, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="text-lg"
          >
            {s}
          </motion.span>
        ))}
      </div>

      {/* Quote card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: '1.5rem',
          backdropFilter: 'blur(20px)',
        }}
      >
        <p className="text-white/60 text-sm leading-relaxed text-center italic font-display">
          "Not every story ends the way we imagine,<br />
          but every honest ending is beautiful in its own way."
        </p>
        <p className="text-white/25 font-mono text-xs text-center mt-3">— LoveOS Wisdom Core</p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <AnimatePresence>
          {!friendClicked ? (
            <motion.button
              key="friend-btn"
              className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 text-base"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                boxShadow: '0 0 30px rgba(14,165,233,0.4)',
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(14,165,233,0.7)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFriendClicked(true)}
            >
              <span>Stay as Friends</span>
              <span>🤝</span>
            </motion.button>
          ) : (
            <motion.div
              key="friend-confirmed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-full py-4 rounded-2xl text-center"
              style={{
                background: 'rgba(14,165,233,0.1)',
                border: '1px solid rgba(14,165,233,0.3)',
              }}
            >
              <p className="text-sky-400 font-bold text-sm">✓ Friendship Accepted! 🎊</p>
              <p className="text-white/40 font-mono text-xs mt-1">New friendship.exe installed successfully</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="w-full py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          style={{
            background: 'rgba(236,72,153,0.08)',
            border: '1px solid rgba(236,72,153,0.25)',
            color: 'rgba(249,168,212,0.8)',
          }}
          whileHover={{ scale: 1.02, background: 'rgba(236,72,153,0.15)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onReconsider}
        >
          <span>Wait... Let me reconsider</span>
          <span>🤔</span>
        </motion.button>
      </div>

      {/* Bottom watermark */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-white/20 font-mono text-xs"
      >
        — No pressure. No regrets. Only good vibes. —
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
export default function RejectScreen() {
  const { goTo } = useAppStore();
  // phases: deleting → error → heart-msg → honest → final
  const [phase, setPhase] = useState('deleting');
  const [currentStep, setCurrentStep] = useState(0);
  const [pct, setPct] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (sent) return;
    setSent(true);
    saveResponse('rejected');
    sendTelegram(buildRejectMessage());
    sendEmail('rejected');
  }, []);

  useEffect(() => {
    if (phase !== 'deleting') return;
    DELETE_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        setPct(step.pct);
      }, step.delay);
    });
    setTimeout(() => setPhase('error'), 6800);
    setTimeout(() => setPhase('heart-msg'), 8800);
    setTimeout(() => setPhase('honest'), 12000);
    setTimeout(() => setPhase('final'), 15500);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Dynamic background glow based on phase */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background:
            phase === 'deleting' || phase === 'error'
              ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.12) 0%, transparent 60%)'
              : phase === 'heart-msg'
              ? 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, transparent 60%)',
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Floating particles (only on final pages) */}
      {(phase === 'honest' || phase === 'final') && <BrokenHearts />}

      {/* Phase indicator dots */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {['deleting', 'error', 'heart-msg', 'honest', 'final'].map((p, i) => (
          <motion.div
            key={p}
            className="rounded-full"
            animate={{
              width: phase === p ? 20 : 6,
              height: 6,
              background:
                phase === p
                  ? 'linear-gradient(90deg, #ef4444, #a78bfa)'
                  : ['deleting', 'error', 'heart-msg', 'honest', 'final'].indexOf(phase) > i
                  ? 'rgba(167,139,250,0.5)'
                  : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>

      <div className="w-full max-w-md py-12 flex items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {phase === 'deleting' && (
            <DeletingPage key="del" currentStep={currentStep} pct={pct} />
          )}
          {phase === 'error' && <ErrorPage key="err" />}
          {phase === 'heart-msg' && <HeartMessagePage key="hm" />}
          {phase === 'honest' && <HonestNotePage key="hn" />}
          {phase === 'final' && (
            <FinalPage key="fin" onReconsider={() => goTo('proposal')} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
