import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import ProgressBar from '../components/ProgressBar';

const SCANS = [
  { label: 'Scanning Smile', icon: '😊', color: 'sky', delay: 0.2, duration: 1.8 },
  { label: 'Scanning Kindness', icon: '💙', color: 'lavender', delay: 0.6, duration: 2.0 },
  { label: 'Scanning Nursing Skills', icon: '🏥', color: 'pink', delay: 1.0, duration: 2.2 },
  { label: 'Scanning Personality', icon: '✨', color: 'rainbow', delay: 1.4, duration: 1.9 },
  { label: 'Checking Heart Compatibility', icon: '❤️', color: 'pink', delay: 1.8, duration: 2.5 },
];

const RESULTS = [
  { label: 'Patient Name', value: 'Sheetal', icon: '👤' },
  { label: 'Profession', value: 'Nursing Student', icon: '🏥' },
  { label: 'Status', value: 'Very Caring ♥', icon: '💚' },
  { label: 'Smile Rating', value: 'Beautiful / 10', icon: '😊' },
  { label: 'Kindness Level', value: '∞ Unlimited', icon: '💙' },
];

export default function AnalysisScreen() {
  const { goNext } = useAppStore();
  const [phase, setPhase] = useState('scanning'); // scanning | result
  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('result');
      setTimeout(() => setWarningVisible(true), 800);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* BG glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.3) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-white/30 font-mono text-xs tracking-[0.3em] mb-2">
            AI ANALYSIS SYSTEM
          </p>
          <h2 className="font-display font-bold text-2xl text-white">
            {phase === 'scanning' ? '🔬 Running Analysis...' : '📊 Analysis Complete'}
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === 'scanning' ? (
            <motion.div
              key="scanning"
              className="glass-card p-6 space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Scanning header */}
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-sky-400 font-mono text-sm">Analyzing subject...</span>
              </div>

              {SCANS.map((scan, i) => (
                <motion.div
                  key={scan.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: scan.delay }}
                >
                  <ProgressBar
                    label={scan.label}
                    targetPercent={100}
                    duration={scan.duration}
                    delay={scan.delay + 0.3}
                    color={scan.color}
                    icon={scan.icon}
                  />
                </motion.div>
              ))}

              <motion.div
                className="text-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <p className="text-white/30 font-mono text-xs animate-pulse">
                  Processing emotional data...
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {/* Result card */}
              <div className="glass-card p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sky-400 font-mono text-sm tracking-widest">
                    ANALYSIS REPORT
                  </h3>
                  <span className="text-green-400 font-mono text-xs">✓ COMPLETE</span>
                </div>

                <div className="space-y-3">
                  {RESULTS.map((r, i) => (
                    <motion.div
                      key={r.label}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <span className="text-white/50 text-sm flex items-center gap-2">
                        <span>{r.icon}</span>
                        {r.label}
                      </span>
                      <span className="text-white font-semibold text-sm">{r.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Warning box */}
              <AnimatePresence>
                {warningVisible && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="p-4 rounded-2xl text-center mb-6"
                    style={{
                      background: 'rgba(236,72,153,0.1)',
                      border: '1px solid rgba(236,72,153,0.4)',
                      boxShadow: '0 0 20px rgba(236,72,153,0.2)',
                    }}
                  >
                    <motion.div
                      className="text-2xl mb-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ⚠️
                    </motion.div>
                    <p className="text-pink-400 font-mono text-sm font-bold">
                      WARNING DETECTED
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      Someone secretly likes you. 😏
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {warningVisible && (
                <motion.button
                  className="btn-primary w-full py-3.5 font-mono text-sm tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goNext}
                >
                  VIEW FULL REPORT →
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
