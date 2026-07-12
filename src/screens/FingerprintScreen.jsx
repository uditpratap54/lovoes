import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function FingerprintScreen() {
  const { goNext } = useAppStore();
  const [phase, setPhase] = useState('idle'); // idle | scanning | verified
  const [scanY, setScanY] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleTap = () => {
    if (phase !== 'idle') return;
    setPhase('scanning');

    // Animate scan line
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 2500;
      setScanY(elapsed * 160);
      setProgress(Math.min(elapsed * 100, 100));
      if (elapsed < 1) requestAnimationFrame(animate);
      else {
        setScanY(0);
        setProgress(100);
        setTimeout(() => setPhase('verified'), 300);
        setTimeout(() => goNext(), 2500);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: phase === 'verified'
            ? 'radial-gradient(ellipse at center, rgba(74,222,128,0.3) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(56,189,248,0.2) 0%, transparent 70%)',
          transition: 'background 0.5s ease',
        }}
      />

      <div className="text-center w-full max-w-sm">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-white/40 font-mono text-xs tracking-[0.3em] mb-2">
            BIOMETRIC AUTHENTICATION
          </p>
          <h2 className="font-display font-bold text-2xl text-white">
            Identity Verification
          </h2>
        </motion.div>

        {/* Fingerprint SVG */}
        <motion.div
          className="relative inline-flex items-center justify-center mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          onClick={handleTap}
          style={{ cursor: phase === 'idle' ? 'pointer' : 'default' }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute w-52 h-52 rounded-full border border-sky-400/30"
            animate={phase === 'scanning' ? { scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-44 h-44 rounded-full border border-sky-400/20"
            animate={phase === 'scanning' ? { scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />

          {/* Main fingerprint container */}
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: phase === 'verified'
                ? 'rgba(74,222,128,0.1)'
                : 'rgba(56,189,248,0.05)',
              border: `2px solid ${phase === 'verified' ? 'rgba(74,222,128,0.5)' : 'rgba(56,189,248,0.3)'}`,
              boxShadow: phase === 'scanning'
                ? '0 0 40px rgba(56,189,248,0.5), 0 0 80px rgba(56,189,248,0.2)'
                : phase === 'verified'
                ? '0 0 40px rgba(74,222,128,0.5)'
                : '0 0 20px rgba(56,189,248,0.2)',
              transition: 'all 0.5s ease',
            }}
          >
            {/* Fingerprint SVG */}
            <svg
              width="90"
              height="110"
              viewBox="0 0 90 110"
              fill="none"
              className="fingerprint-svg"
            >
              {/* Simplified fingerprint ridges */}
              {[
                'M45,5 C20,5 5,22 5,45',
                'M45,10 C23,10 10,25 10,45',
                'M45,16 C26,16 16,29 16,45',
                'M45,22 C29,22 22,33 22,45',
                'M45,28 C33,28 28,37 28,45',
                'M45,34 C36,34 34,40 34,45',
                'M45,5 C70,5 85,22 85,45',
                'M45,10 C67,10 80,25 80,45',
                'M45,16 C64,16 74,29 74,45',
                'M45,22 C61,22 68,33 68,45',
                'M45,28 C57,28 62,37 62,45',
                'M45,34 C54,34 56,40 56,45',
                'M5,45 C5,70 22,85 45,85',
                'M10,45 C10,67 25,80 45,80',
                'M16,45 C16,64 29,74 45,74',
                'M22,45 C22,61 33,68 45,68',
                'M28,45 C28,57 37,62 45,62',
                'M34,45 C34,54 40,56 45,56',
                'M85,45 C85,70 68,85 45,85',
                'M80,45 C80,67 65,80 45,80',
                'M74,45 C74,64 61,74 45,74',
                'M68,45 C68,61 57,68 45,68',
                'M62,45 C62,57 53,62 45,62',
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={phase === 'verified' ? '#4ade80' : '#38bdf8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity={0.6 + (i % 3) * 0.1}
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: phase === 'idle' ? 200 : 0,
                    transition: `stroke-dashoffset ${0.8 + i * 0.05}s ease`,
                  }}
                />
              ))}
            </svg>

            {/* Scan line */}
            {phase === 'scanning' && (
              <div
                className="absolute left-0 right-0 h-0.5 pointer-events-none"
                style={{
                  top: `${(scanY / 160) * 100}%`,
                  background: 'linear-gradient(90deg, transparent, #38bdf8, #a78bfa, #38bdf8, transparent)',
                  boxShadow: '0 0 10px rgba(56,189,248,0.8)',
                }}
              />
            )}

            {/* Verified check */}
            <AnimatePresence>
              {phase === 'verified' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-green-400 text-4xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  ✓
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Progress bar */}
        {phase === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <div className="progress-bar-track mx-auto max-w-xs">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
              />
            </div>
            <p className="text-white/40 font-mono text-xs mt-2">
              Scanning... {Math.round(progress)}%
            </p>
          </motion.div>
        )}

        {/* Status text */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {phase === 'idle' && (
            <>
              <p className="text-sky-400 font-mono text-sm mb-2 animate-pulse">
                TAP TO SCAN
              </p>
              <p className="text-white/30 text-xs font-mono">
                Place your finger to authenticate
              </p>
            </>
          )}
          {phase === 'scanning' && (
            <p className="text-sky-400 font-mono text-sm animate-pulse">
              🔵 Scanning biometrics...
            </p>
          )}
          {phase === 'verified' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <p className="text-green-400 font-mono text-lg font-bold mb-1">
                ✅ Identity Verified
              </p>
              <p className="text-white/60 font-display text-sm">
                Welcome, Sheetal. 💙
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* AI voice text */}
        <AnimatePresence>
          {phase === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 glass p-3 rounded-2xl"
            >
              <p className="text-white/50 font-mono text-xs">
                🤖 AI: &nbsp;
                <span className="text-lavender-300">
                  "Match confirmed. You are the only authorized user of this system."
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
