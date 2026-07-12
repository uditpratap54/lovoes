import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const FIELDS = [
  { label: 'Patient Name', value: 'Sheetal', icon: '👤', color: '#38bdf8' },
  { label: 'Blood Group', value: 'LOVE+', icon: '🩸', color: '#ec4899' },
  { label: 'Heart Rate', value: 'Increases whenever you reply', icon: '💓', color: '#f9a8d4' },
  { label: 'Diagnosis', value: 'Permanent Crush Syndrome™', icon: '🔬', color: '#a78bfa' },
  { label: 'Severity', value: 'Moderate (and growing)', icon: '📊', color: '#38bdf8' },
  { label: 'Prescribed Medicine', value: 'One smile from Sheetal', icon: '💊', color: '#4ade80' },
  { label: 'Side Effects', value: 'Excessive happiness', icon: '😄', color: '#fbbf24' },
  { label: 'Doctor Advice', value: 'Proceed to confidential message', icon: '🩺', color: '#ec4899' },
];

export default function MedicalReportScreen() {
  const { goNext } = useAppStore();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers = FIELDS.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), 400 + i * 400)
    );
    const btnTimer = setTimeout(() => setShowButton(true), 400 + FIELDS.length * 400 + 300);
    return () => { timers.forEach(clearTimeout); clearTimeout(btnTimer); };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.4) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md py-8">
        {/* Report header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-white/30 font-mono text-xs tracking-[0.3em] mb-1">
            CONFIDENTIAL MEDICAL REPORT
          </p>
          <h2 className="font-display font-bold text-2xl text-white mb-1">
            🏥 LoveOS Diagnostics
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 font-mono text-xs">CLASSIFIED DOCUMENT</span>
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Report card */}
        <div className="glass-card p-6 mb-4">
          {/* Report ID bar */}
          <div
            className="flex items-center justify-between p-3 rounded-xl mb-5 font-mono text-xs"
            style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}
          >
            <span className="text-pink-400">REPORT #SH-2024-❤️</span>
            <span className="text-white/40">
              {new Date().toLocaleDateString('en-IN')}
            </span>
          </div>

          <div className="space-y-3">
            {FIELDS.map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                animate={
                  i < visibleCount
                    ? { opacity: 1, x: 0, filter: 'blur(0px)' }
                    : { opacity: 0, x: -30, filter: 'blur(10px)' }
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
              >
                <span className="text-lg shrink-0 mt-0.5">{field.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-xs font-mono mb-0.5">{field.label}</p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: field.color }}
                  >
                    {field.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stamp */}
        {visibleCount >= FIELDS.length && (
          <motion.div
            className="flex justify-end mb-4"
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: -15 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <div
              className="px-4 py-2 rounded-lg border-2 border-pink-500/60 text-pink-400 font-bold text-sm tracking-widest"
              style={{ background: 'rgba(236,72,153,0.05)' }}
            >
              ❤️ CERTIFIED CUTE
            </div>
          </motion.div>
        )}

        {showButton && (
          <motion.button
            className="btn-primary w-full py-3.5 font-mono text-sm tracking-widest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goNext}
          >
            CONTINUE TO MEMORIES →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
