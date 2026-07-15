import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isLight = theme === 'light';
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50 group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            className="absolute left-[120%] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap backdrop-blur-md border"
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderColor: isLight ? 'rgba(251,146,60,0.4)' : 'rgba(139,92,246,0.3)',
              color: isLight ? '#f59e0b' : '#c4b5fd',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            {isLight ? 'Switch to Dark Mode 🌙' : 'Switch to Light Mode ☀️'}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleTheme}
        className="relative w-14 h-14 rounded-full flex items-center justify-center select-none"
        style={{
          background: isLight
            ? 'linear-gradient(135deg, #fde68a, #fb923c)'
            : 'linear-gradient(135deg, #1e1b4b, #312e81)',
          boxShadow: isLight
            ? '0 0 24px rgba(251,146,60,0.6), 0 4px 16px rgba(0,0,0,0.2)'
            : '0 0 24px rgba(99,102,241,0.5), 0 4px 16px rgba(0,0,0,0.4)',
          border: isLight
            ? '1px solid rgba(251,191,36,0.5)'
            : '1px solid rgba(139,92,246,0.4)',
          transition: 'background 0.7s ease, box-shadow 0.7s ease, border-color 0.7s ease',
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Soft rotating outer ring */}
        <motion.div className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${isLight ? 'rgba(251,146,60,0.5)' : 'rgba(139,92,246,0.5)'}`, borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Ripple glow effect on hover */}
        <motion.div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: isLight ? 'rgba(251,146,60,0.4)' : 'rgba(139,92,246,0.4)' }}
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />

        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            className="text-2xl relative z-10 drop-shadow-md"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0,   opacity: 1, scale: 1   }}
            exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: 'backOut' }}
          >
            {isLight ? '☀️' : '🌙'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
