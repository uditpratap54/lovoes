import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function ProposalScreen() {
  const { goTo } = useAppStore();
  const [rejectPos, setRejectPos] = useState({ x: 0, y: 0 });
  const [rejectClicks, setRejectClicks] = useState(0);
  const rejectRef = useRef(null);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowQuestion(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleRejectHover = () => {
    if (rejectClicks >= 3) return; // After 3 tries, let them click it
    const maxX = window.innerWidth * 0.3;
    const maxY = 150;
    const x = (Math.random() - 0.5) * maxX;
    const y = (Math.random() - 0.5) * maxY;
    setRejectPos({ x, y });
  };

  const handleRejectClick = () => {
    setRejectClicks((c) => c + 1);
    if (rejectClicks >= 2) {
      goTo('reject');
    } else {
      handleRejectHover();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Romantic ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 40% 50%, rgba(236,72,153,0.2) 0%, transparent 50%), radial-gradient(ellipse at 60% 40%, rgba(139,92,246,0.2) 0%, transparent 50%)',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg pointer-events-none"
          style={{
            left: `${10 + i * 12}%`,
            top: '100%',
          }}
          animate={{
            y: [0, -(window.innerHeight + 50)],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.7, 0],
            rotate: [0, (Math.random() - 0.5) * 90],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        >
          {['💕', '💙', '✨', '🌸', '💫', '❤️', '🌟', '💝'][i]}
        </motion.div>
      ))}

      <div className="w-full max-w-sm text-center">
        {/* Heart animation */}
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            💍
          </motion.span>
        </motion.div>

        {/* Main card */}
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              className="glass-card p-8 mb-6"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
              style={{
                boxShadow: '0 0 60px rgba(236,72,153,0.2), 0 0 100px rgba(139,92,246,0.1), 0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <p className="text-white/40 font-mono text-xs tracking-[0.3em] mb-4">
                FINAL QUESTION
              </p>
              <h2 className="font-display font-bold text-2xl text-white leading-snug mb-2">
                Will you let me become
              </h2>
              <h2 className="font-display font-bold text-2xl text-gradient leading-snug mb-6">
                someone special in your life?
              </h2>
              <p className="text-white/40 text-sm">
                No pressure. No expectations. Just an honest question. 💙
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        {showQuestion && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >

            {/* Reject — runs away */}
            <motion.div
              animate={{
                x: rejectPos.x,
                y: rejectPos.y,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.button
                ref={rejectRef}
                className="btn-reject w-full"
                onMouseEnter={handleRejectHover}
                onClick={handleRejectClick}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Reject</span>
                  <span>🙈</span>
                </span>
              </motion.button>
            </motion.div>

            {rejectClicks > 0 && rejectClicks < 3 && (
              <motion.p
                key={rejectClicks}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-white/30 font-mono text-xs"
              >
                {['Hmm... catch me if you can! 😄', 'You sure? Think about it... 🤔'][rejectClicks - 1]}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
