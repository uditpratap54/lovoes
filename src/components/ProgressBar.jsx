import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ label, targetPercent = 100, duration = 2, delay = 0, color = 'sky', icon }) {
  const [width, setWidth] = useState(0);
  const [started, setStarted] = useState(false);

  const gradients = {
    sky: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
    pink: 'linear-gradient(90deg, #ec4899, #f9a8d4)',
    lavender: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
    rainbow: 'linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899)',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      let start = null;
      const animate = (ts) => {
        if (!start) start = ts;
        const elapsed = (ts - start) / (duration * 1000);
        const pct = Math.min(elapsed * targetPercent, targetPercent);
        setWidth(pct);
        if (pct < targetPercent) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-2 text-sm text-white/70 font-mono">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <motion.span
          className="text-xs font-bold font-mono"
          style={{ color: color === 'sky' ? '#38bdf8' : color === 'pink' ? '#f9a8d4' : '#a78bfa' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: started ? 1 : 0 }}
        >
          {Math.round(width)}%
        </motion.span>
      </div>
      <div className="progress-bar-track">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: gradients[color] || gradients.sky,
            boxShadow: `0 0 10px ${color === 'sky' ? 'rgba(56,189,248,0.7)' : color === 'pink' ? 'rgba(249,168,212,0.7)' : 'rgba(167,139,250,0.7)'}`,
            transition: 'width 0.05s linear',
          }}
        >
          {/* Shimmer */}
          <div
            className="h-full w-full opacity-50 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s linear infinite',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
