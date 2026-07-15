// ─── Shared UI primitives used across all journey panels ──────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart } from 'lucide-react';

// ── Glass card wrapper ──────────────────────────────────────────────────────
export function GCard({ children, className = '', style = {}, ...rest }) {
  return (
    <motion.div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        ...style,
      }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.25 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Section header ──────────────────────────────────────────────────────────
export function SectionHeader({ emoji, title, subtitle, color = '#38bdf8' }) {
  return (
    <div className="text-center mb-6">
      <motion.div
        className="text-5xl mb-2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {emoji}
      </motion.div>
      <h2 className="font-display font-black text-2xl text-white">{title}</h2>
      {subtitle && <p className="text-white/40 text-sm mt-1">{subtitle}</p>}
      <div className="h-px mt-3 mx-auto w-24 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

// ── AddButton ──────────────────────────────────────────────────────────────
export function AddButton({ onClick, label = 'Add', color = '#ec4899' }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white mb-5"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 0 18px ${color}55` }}
      whileHover={{ scale: 1.04, boxShadow: `0 0 32px ${color}88` }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="text-lg leading-none">+</span> {label}
    </motion.button>
  );
}

// ── DeleteBtn ──────────────────────────────────────────────────────────────
export function DeleteBtn({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="p-1.5 rounded-xl transition-colors"
      style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
      whileHover={{ background: 'rgba(239,68,68,0.25)', scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <X size={13} strokeWidth={2.5} />
    </motion.button>
  );
}

// ── StarRating ─────────────────────────────────────────────────────────────
export function StarRating({ value = 0, onChange, max = 5, color = '#fbbf24' }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onChange && onChange(i + 1)}
          whileTap={{ scale: 1.3 }}
          className="focus:outline-none"
        >
          <Star
            size={16}
            fill={i < value ? color : 'none'}
            stroke={i < value ? color : 'rgba(255,255,255,0.25)'}
            strokeWidth={2}
          />
        </motion.button>
      ))}
    </div>
  );
}

// ── HeartBtn ───────────────────────────────────────────────────────────────
export function HeartBtn({ count = 0, onClick }) {
  const [popped, setPopped] = useState(false);
  const handle = () => {
    setPopped(true);
    setTimeout(() => setPopped(false), 600);
    onClick?.();
  };
  return (
    <motion.button
      onClick={handle}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold"
      style={{ background: 'rgba(236,72,153,0.1)', color: '#f9a8d4' }}
      whileHover={{ background: 'rgba(236,72,153,0.2)' }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.span animate={popped ? { scale: [1, 1.6, 1] } : {}} transition={{ duration: 0.4 }}>
        <Heart size={12} fill="#ec4899" stroke="none" />
      </motion.span>
      {count > 0 && <span>{count}</span>}
    </motion.button>
  );
}

// ── Modal overlay ──────────────────────────────────────────────────────────
export function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9980] bg-black/65"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[9981] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-sm rounded-3xl p-5 overflow-y-auto"
              style={{
                background: 'rgba(10,10,20,0.95)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 0 60px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(24px)',
                maxHeight: '90vh',
              }}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-white">{title}</h3>
                  <motion.button onClick={onClose} whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <X size={16} className="text-white/60" />
                  </motion.button>
                </div>
              )}
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Input field ────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, placeholder, type = 'text', as = 'input', rows = 3 }) {
  const common = {
    value,
    onChange: (e) => onChange(e.target.value),
    placeholder,
    className: 'w-full rounded-xl px-3.5 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none transition-all duration-200 resize-none',
    style: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'inherit' },
    onFocus: (e) => { e.target.style.borderColor = 'rgba(56,189,248,0.4)'; },
    onBlur:  (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; },
  };
  return (
    <div className="mb-3">
      {label && <label className="text-white/35 font-mono text-xs mb-1 block tracking-wider">{label}</label>}
      {as === 'textarea'
        ? <textarea {...common} rows={rows} />
        : <input {...common} type={type} />
      }
    </div>
  );
}

// ── Save button ────────────────────────────────────────────────────────────
export function SaveBtn({ onClick, label = 'Save', color = '#38bdf8' }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full py-3 rounded-2xl font-bold text-sm text-white mt-2"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 0 16px ${color}44` }}
      whileHover={{ scale: 1.02, boxShadow: `0 0 28px ${color}77` }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
export function Empty({ emoji = '✨', text = 'Nothing here yet!' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="text-center py-10 text-white/30"
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <p className="text-sm font-mono">{text}</p>
    </motion.div>
  );
}

// ── Celebration popup ─────────────────────────────────────────────────────
export function CelebrationPop({ show, onDone, message = '🎉 Amazing!' }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5, y: -40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          onAnimationComplete={onDone}
        >
          <div className="px-8 py-5 rounded-3xl text-2xl font-black"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
