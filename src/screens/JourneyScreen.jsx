import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import JourneyHub from '../journey/JourneyHub';

const PROMISES = [
  { emoji: '☕', text: 'Kabhi kabhi chai pe milenge — plan kare ya unplanned.', delay: 0.2 },
  { emoji: '📱', text: 'Teri good morning message ka wait karunga. Always.', delay: 0.4 },
  { emoji: '😂', text: 'Chhoti chhoti baatein share karenge — memes, thoughts, sab kuch.', delay: 0.6 },
  { emoji: '🤝', text: 'Hard days pe "I\'m here" sunne ke liye main hoon.', delay: 0.8 },
  { emoji: '🏥', text: 'Teri nursing ki journey ko celebrate karenge — har choti jeet.', delay: 1.0 },
  { emoji: '🌙', text: 'Late night talks jo khud hi khatam nahi hoti. Woh sab.', delay: 1.2 },
];

const FINAL_WORDS = [
  'Koi pressure nahi.',
  'Koi expectations nahi.',
  'Bas ek cute sa naya chapter. 💙',
];

export default function JourneyScreen() {
  const [phase, setPhase] = useState('intro'); // intro | promises | final
  const [finalLineIdx, setFinalLineIdx] = useState(0);
  const [showRestart, setShowRestart] = useState(false);
  // ── NEW: Journey Hub toggle ─────────────────────────────────────────────
  const [showHub, setShowHub] = useState(false);

  useEffect(() => {
    // Big confetti burst on mount
    const burst = () => {
      confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.3 }, colors: ['#f9a8d4', '#a78bfa', '#38bdf8'] });
      confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.7 }, colors: ['#fbbf24', '#4ade80', '#ec4899'] });
    };
    burst();
    setTimeout(burst, 800);

    setTimeout(() => setPhase('promises'), 1200);
  }, []);

  useEffect(() => {
    if (phase !== 'final') return;
    FINAL_WORDS.forEach((_, i) => {
      setTimeout(() => setFinalLineIdx(i + 1), 600 + i * 700);
    });
    setTimeout(() => setShowRestart(true), 600 + FINAL_WORDS.length * 700 + 400);
  }, [phase]);

  // ── Render Journey Hub when activated ──────────────────────────────────
  if (showHub) return <JourneyHub onBack={() => setShowHub(false)} />;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated rainbow gradient bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 30%, rgba(236,72,153,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(56,189,248,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.2) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(236,72,153,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 60%, rgba(56,189,248,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Floating emojis */}
      {['💕', '✨', '🌸', '💫', '❤️', '🌟', '💝', '🎊'].map((emoji, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none text-2xl select-none"
          style={{ left: `${5 + i * 12}%`, bottom: '-40px' }}
          animate={{
            y: [0, -(window.innerHeight + 80)],
            x: [0, Math.sin(i) * 60],
            opacity: [0, 0.9, 0],
            rotate: [0, (i % 2 === 0 ? 1 : -1) * 30],
          }}
          transition={{
            duration: 5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="w-full max-w-md py-8 relative z-10">
        <AnimatePresence mode="wait">

          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              className="text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <motion.div
                className="text-8xl mb-4"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🚀
              </motion.div>
              <h2 className="font-display font-black text-3xl text-gradient">
                Chalte hain...
              </h2>
            </motion.div>
          )}

          {/* PROMISES PHASE */}
          {phase === 'promises' && (
            <motion.div
              key="promises"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <motion.div className="text-center mb-7">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💙
                </motion.div>
                <p className="text-white/30 font-mono text-xs tracking-[0.3em] mb-1">
                  CHAPTER ONE
                </p>
                <h2 className="font-display font-bold text-2xl text-white">
                  Kuch choti si baatein...
                </h2>
                <p className="text-white/40 text-sm mt-1">
                  Jo main promise karta hoon 🤝
                </p>
              </motion.div>

              {/* Promise cards */}
              <div className="space-y-3 mb-7">
                {PROMISES.map((p, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: p.delay, type: 'spring', stiffness: 100 }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                    whileHover={{
                      background: 'rgba(56,189,248,0.08)',
                      borderColor: 'rgba(56,189,248,0.25)',
                      x: 4,
                    }}
                  >
                    <span className="text-2xl shrink-0">{p.emoji}</span>
                    <p className="text-white/75 text-sm leading-relaxed">{p.text}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="btn-accept w-full py-4 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 }, colors: ['#ec4899', '#a78bfa', '#38bdf8'] });
                  setPhase('final');
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Aur aage...</span>
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* FINAL PHASE */}
          {phase === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="text-center"
            >
              {/* Big heart */}
              <motion.div
                className="text-7xl mb-6"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [-5, 5, -5],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                💝
              </motion.div>

              {/* Glass card */}
              <div
                className="glass-card p-8 mb-6"
                style={{ boxShadow: '0 0 60px rgba(236,72,153,0.15), 0 20px 60px rgba(0,0,0,0.4)' }}
              >
                {/* Shimmer heading */}
                <h2 className="shimmer-text font-display font-black text-3xl mb-6">
                  Sheetal ❤️
                </h2>

                <div className="space-y-3 mb-4">
                  {FINAL_WORDS.map((line, i) => (
                    <AnimatePresence key={i}>
                      {finalLineIdx > i && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-display text-base text-white/80 leading-relaxed"
                        >
                          {line}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  ))}
                </div>

                {showRestart && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <p className="text-white/40 font-mono text-xs">
                      — Udit 💙
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Stars / sparkles row */}
              {showRestart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 150 }}
                  className="flex justify-center gap-3 text-2xl mb-6"
                >
                  {['🌟', '💕', '🌸', '💕', '🌟'].map((s, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* ── NEW: Start Journey button ─────────────────────── */}
              {showRestart && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base mb-3 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #38bdf8)',
                    boxShadow: '0 0 40px rgba(236,72,153,0.5), 0 0 80px rgba(139,92,246,0.25)',
                  }}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 60px rgba(236,72,153,0.7)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    confetti({ particleCount: 80, spread: 120, origin: { y: 0.7 }, colors: ['#f9a8d4', '#a78bfa', '#38bdf8'] });
                    setTimeout(() => setShowHub(true), 400);
                  }}
                >
                  {/* shimmer */}
                  <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                    animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} />
                  <span className="relative flex items-center justify-center gap-2">
                    <span>✨ Start Our Journey</span>
                    <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>→</motion.span>
                  </span>
                </motion.button>
              )}

              {/* Replay confetti button (original, untouched) */}
              {showRestart && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full py-3.5 rounded-2xl font-mono text-sm text-white/60 transition-all duration-300 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    confetti({ particleCount: 150, spread: 160, origin: { y: 0.5 }, colors: ['#f9a8d4', '#a78bfa', '#38bdf8', '#fbbf24', '#4ade80'] });
                    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.3, x: 0.2 }, colors: ['#ec4899', '#a78bfa'] }), 300);
                    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.3, x: 0.8 }, colors: ['#38bdf8', '#4ade80'] }), 500);
                  }}
                >
                  🎊 Ek baar aur celebrate karo!
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
