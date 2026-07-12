import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const MEMORIES = [
  {
    emoji: '🌙',
    title: 'Late Night Talks',
    desc: 'Those conversations that go way past bedtime but somehow feel too short.',
    color: 'from-sky-500/20 to-lavender-500/20',
    border: 'rgba(56,189,248,0.3)',
    glow: 'rgba(56,189,248,0.2)',
    delay: 0.1,
  },
  {
    emoji: '🏥',
    title: 'Hospital Success',
    desc: 'Every patient you help is a victory. You make a real difference every day.',
    color: 'from-green-500/20 to-sky-500/20',
    border: 'rgba(74,222,128,0.3)',
    glow: 'rgba(74,222,128,0.2)',
    delay: 0.2,
  },
  {
    emoji: '☕',
    title: 'Coffee Together',
    desc: "A future of coffee and conversations I'm looking forward to.",
    color: 'from-amber-500/20 to-pink-500/20',
    border: 'rgba(251,191,36,0.3)',
    glow: 'rgba(251,191,36,0.15)',
    delay: 0.3,
  },
  {
    emoji: '🤝',
    title: 'Supporting Each Other',
    desc: 'Through the hard study nights, the tough days — always in each other\'s corner.',
    color: 'from-lavender-500/20 to-pink-500/20',
    border: 'rgba(167,139,250,0.3)',
    glow: 'rgba(167,139,250,0.2)',
    delay: 0.4,
  },
  {
    emoji: '✨',
    title: 'Making New Memories',
    desc: 'The best chapters haven\'t been written yet. Let\'s fill them together.',
    color: 'from-pink-500/20 to-sky-500/20',
    border: 'rgba(236,72,153,0.3)',
    glow: 'rgba(236,72,153,0.2)',
    delay: 0.5,
  },
  {
    emoji: '🌟',
    title: 'Growing Together',
    desc: 'Two people, different paths, choosing to walk side by side for a while.',
    color: 'from-sky-400/20 to-lavender-400/20',
    border: 'rgba(56,189,248,0.3)',
    glow: 'rgba(56,189,248,0.15)',
    delay: 0.6,
  },
];

function MemoryCard({ memory }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: memory.delay, duration: 0.5, type: 'spring', stiffness: 120 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="memory-card"
      style={{
        borderColor: hovered ? memory.border : 'rgba(255,255,255,0.07)',
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${memory.glow}` : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 bg-gradient-to-br ${memory.color}`}
        style={{ opacity: hovered ? 1 : 0 }}
      />

      <div className="relative z-10">
        <motion.div
          className="text-4xl mb-3"
          animate={hovered ? { scale: 1.3, rotate: [0, -10, 10, 0] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {memory.emoji}
        </motion.div>
        <h3 className="font-display font-bold text-white text-base mb-2">
          {memory.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed">
          {memory.desc}
        </p>

        {/* Hover indicator */}
        <motion.div
          className="flex items-center gap-1 mt-3 text-xs font-mono"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: memory.border }}
        >
          <span>Future awaits</span>
          <span>→</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function MemoriesScreen() {
  const { goNext } = useAppStore();

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
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(236,72,153,0.3) 0%, transparent 50%)',
        }}
      />

      <div className="w-full max-w-2xl py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-white/30 font-mono text-xs tracking-[0.3em] mb-2">
            FUTURE MEMORIES MODULE
          </p>
          <h2 className="font-display font-bold text-3xl text-white mb-2">
            Our Future Moments ✨
          </h2>
          <p className="text-white/40 text-sm">
            The memories we're yet to make
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {MEMORIES.map((memory, i) => (
            <MemoryCard key={i} memory={memory} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            className="btn-primary px-10 py-3.5 font-mono text-sm tracking-widest"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
          >
            OPEN YOUR GIFT →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
