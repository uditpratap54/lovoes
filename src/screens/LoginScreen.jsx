import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const CORRECT_PASSWORD = 'sheetu@1234';

export default function LoginScreen() {
  const { goNext } = useAppStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [glowRed, setGlowRed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const inputRef = useRef(null);

  const funnyErrors = [
    "Unauthorized Access. Only Sheetal can unlock this system. 🔒",
    "Nice try, but Sheetal's heart has better security than that. 😄",
    "Access Denied. Hint: It's something special to her... 💭",
    "Still wrong! The answer is closer than you think... 🤫",
    "Seriously? Try typing your own name! 😂",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError('');
      goNext();
    } else {
      const errorMsg = funnyErrors[Math.min(attempt, funnyErrors.length - 1)];
      setError(errorMsg);
      setShake(true);
      setGlowRed(true);
      setAttempt((a) => a + 1);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setGlowRed(false), 2000);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.3) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="w-full max-w-sm"
        animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div
          className="glass-card p-8"
          style={{
            boxShadow: glowRed
              ? '0 0 40px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.2)'
              : '0 0 40px rgba(14,165,233,0.2)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔐
            </motion.div>
            <h1 className="font-display font-bold text-2xl text-white mb-1">
              LoveOS Authentication
            </h1>
            <p className="text-white/40 text-sm font-mono">SECURE ACCESS REQUIRED</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-mono text-white/50 mb-2 tracking-widest">
                USERNAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="Sheetal"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl font-mono text-sm text-sky-300 border border-white/10 outline-none"
                  style={{ background: 'rgba(56,189,248,0.05)' }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs font-mono">
                  ✓ VERIFIED
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono text-white/50 mb-2 tracking-widest">
                SECRET CODE
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Secret Code"
                  className="w-full px-4 py-3 rounded-xl font-mono text-sm text-white border border-white/10 outline-none placeholder-white/20 transition-all duration-300 focus:border-sky-400/50"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    boxShadow: glowRed
                      ? '0 0 20px rgba(239,68,68,0.3), inset 0 0 10px rgba(239,68,68,0.1)'
                      : 'none',
                  }}
                  autoFocus
                />
                <motion.span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                  animate={{ rotate: glowRed ? [0, -10, 10, -10, 0] : 0 }}
                >
                  {glowRed ? '🔴' : '🔑'}
                </motion.span>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-xl text-xs font-mono text-red-300 border border-red-500/30"
                  style={{ background: 'rgba(239,68,68,0.08)' }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              className="btn-primary w-full py-3.5 text-sm tracking-widest font-mono"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              AUTHENTICATE →
            </motion.button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-white/15 font-mono text-xs mt-6">
            Only you know this one. 🤫
          </p>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-white/20 font-mono text-xs">LOVEOS v1.0</span>
          <span className="text-white/20 font-mono text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            SECURE CONNECTION
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
