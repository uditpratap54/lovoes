import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { saveResponse } from '../lib/firebase';
import { sendTelegram, buildRejectMessage } from '../lib/telegram';
import { sendEmail } from '../lib/emailjs';

const DELETE_STEPS = [
  { label: 'Locating Feelings...', pct: 10, delay: 500 },
  { label: 'Accessing Emotion Database...', pct: 25, delay: 1200 },
  { label: 'Deleting Admiration Files...', pct: 45, delay: 2200 },
  { label: 'Removing Smile.exe...', pct: 60, delay: 3100 },
  { label: 'Erasing Happy Thoughts...', pct: 78, delay: 4000 },
  { label: 'Compiling...', pct: 90, delay: 4800 },
  { label: 'Finalizing...', pct: 98, delay: 5400 },
];

export default function RejectScreen() {
  const { goTo } = useAppStore();
  const [phase, setPhase] = useState('deleting'); // deleting | error | final
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
    setTimeout(() => setPhase('error'), 6200);
    setTimeout(() => setPhase('final'), 7500);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.3) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-sm text-center">
        <AnimatePresence mode="wait">
          {phase === 'deleting' && (
            <motion.div
              key="deleting"
              className="glass-card p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-sky-400 font-mono text-sm font-bold">
                  Deleting Feelings...
                </span>
              </div>

              <div className="space-y-3 mb-6 text-left">
                {DELETE_STEPS.slice(0, currentStep + 1).map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 font-mono text-xs"
                  >
                    <span className="text-sky-400">{i < currentStep ? '✓' : '>'}</span>
                    <span className={i < currentStep ? 'text-white/40' : 'text-white/70'}>
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="progress-bar-track mb-2">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%`, transition: 'width 0.4s ease' }}
                />
              </div>
              <p className="text-white/40 font-mono text-xs">{pct}% complete</p>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              className="glass-card p-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ border: '1px solid rgba(239,68,68,0.4)', boxShadow: '0 0 40px rgba(239,68,68,0.2)' }}
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                ❌
              </motion.div>
              <h3 className="text-red-400 font-mono font-bold text-xl mb-3">ERROR</h3>
              <p className="text-white/70 text-sm font-mono mb-2">
                DELETION_FAILED
              </p>
              <p className="text-white/50 text-sm">
                Feelings cannot be deleted from this system.
              </p>
              <p className="text-white/30 font-mono text-xs mt-3">
                Error Code: EMOTION_OVERFLOW_0x❤️
              </p>
            </motion.div>
          )}

          {phase === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <motion.div
                className="text-6xl mb-5"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💙
              </motion.div>

              <div className="glass-card p-8 mb-6">
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  Thank you for your honesty.
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Your answer will never reduce my respect for you.
                  You are still an amazing person, and I'm glad our paths crossed. 🤍
                </p>
                <p className="text-white/40 text-xs font-mono">
                  — No hard feelings, only good vibes —
                </p>
              </div>

              {/* Smile animation */}
              <motion.div
                className="text-5xl mb-6"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                😊
              </motion.div>

              <div className="space-y-3">
                <motion.button
                  className="btn-primary w-full py-3.5 font-mono text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    /* Friendly ending */
                  }}
                >
                  Become Friends 🤝
                </motion.button>

                <motion.button
                  className="btn-reject w-full py-3.5 font-mono text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goTo('proposal')}
                >
                  Think Again... 🤔
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
