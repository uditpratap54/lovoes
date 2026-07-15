// ─── LightModeOverlay ─────────────────────────────────────────────────────────
// A magical morning romantic atmosphere layered ON TOP of the existing dark bg.
// Only renders when theme === 'light'. Zero impact on dark mode.
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';

// Reduce motion accessibility
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Cherry blossom petals ───────────────────────────────────────────────────
function Petals() {
  if (prefersReduced()) return null;
  const petals = ['🌸', '🌺', '🌹', '🌷', '💮', '🏵️'];
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none text-lg"
          style={{ left: `${(i * 5.8 + 2) % 100}%`, top: -30 }}
          animate={{
            y:       [0, window.innerHeight + 60],
            x:       [0, Math.sin(i * 0.7) * 80],
            rotate:  [0, (i % 2 === 0 ? 1 : -1) * 360],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration:   8 + (i % 5) * 1.2,
            repeat:     Infinity,
            delay:      i * 0.7,
            ease:       'linear',
            times:      [0, 0.1, 0.85, 1],
          }}
        >
          {petals[i % petals.length]}
        </motion.div>
      ))}
    </>
  );
}

// ── Slow drifting clouds ────────────────────────────────────────────────────
function Clouds() {
  if (prefersReduced()) return null;
  const CLOUD_DATA = [
    { top: '8%',  size: 70, delay: 0,   dur: 28 },
    { top: '18%', size: 50, delay: 6,   dur: 22 },
    { top: '5%',  size: 90, delay: 12,  dur: 35 },
    { top: '28%', size: 55, delay: 3,   dur: 26 },
  ];
  return (
    <>
      {CLOUD_DATA.map((c, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none"
          style={{ top: c.top, left: -120 }}
          animate={{ x: [0, window.innerWidth + 140] }}
          transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: 'linear' }}
        >
          <div style={{
            width:         c.size,
            height:        c.size * 0.55,
            background:    'rgba(255,255,255,0.75)',
            borderRadius:  '50%',
            boxShadow:     '0 4px 30px rgba(255,255,255,0.6)',
            filter:        'blur(6px)',
          }} />
        </motion.div>
      ))}
    </>
  );
}

// ── Sun rays ────────────────────────────────────────────────────────────────
function SunRays() {
  return (
    <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none"
      style={{ zIndex: 1 }}>
      {/* Central sun glow */}
      <motion.div
        className="absolute top-8 right-8 rounded-full"
        style={{ width: 80, height: 80, background: 'radial-gradient(circle, rgba(251,191,36,0.9), rgba(251,146,60,0.5) 60%, transparent 100%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-14 right-14 origin-left h-px"
          style={{
            width:     60 + i * 8,
            background: 'linear-gradient(90deg, rgba(251,191,36,0.6), transparent)',
            transform:  `rotate(${i * 45}deg)`,
          }}
          animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── White butterflies ───────────────────────────────────────────────────────
function Butterflies() {
  if (prefersReduced()) return null;
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none text-2xl"
          style={{ left: `${15 + i * 22}%`, top: `${20 + i * 15}%` }}
          animate={{
            x:       [0,  60, 120,  80, 0, -40, 0],
            y:       [0, -30,   0,  30, 0, -20, 0],
            rotate:  [0,  10,  -5,   8, 0,  -8, 0],
            opacity: [0,   1,   1,   1, 1,   1, 0],
          }}
          transition={{
            duration:    12 + i * 2,
            repeat:      Infinity,
            delay:       i * 4,
            ease:        'easeInOut',
            times:       [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
          }}
        >
          🦋
        </motion.div>
      ))}
    </>
  );
}

// ── Rainbow sparkle particles ────────────────────────────────────────────────
function RainbowSparkles() {
  if (prefersReduced()) return null;
  const colors = ['#f9a8d4', '#fb923c', '#fbbf24', '#4ade80', '#38bdf8', '#a78bfa', '#ec4899'];
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none rounded-full"
          style={{
            left:       `${(i * 7.3 + 3) % 100}%`,
            top:        `${(i * 9.1 + 10) % 80}%`,
            width:      4,
            height:     4,
            background: colors[i % colors.length],
            boxShadow:  `0 0 8px ${colors[i % colors.length]}`,
          }}
          animate={{
            scale:   [0, 1.5, 0],
            opacity: [0, 1, 0],
            y:       [0, -20, 0],
          }}
          transition={{
            duration:   2 + Math.random() * 2,
            repeat:     Infinity,
            delay:      i * 0.5,
            ease:       'easeInOut',
          }}
        />
      ))}
    </>
  );
}

// ── Floating hearts (pastel, light mode) ────────────────────────────────────
function LightHearts() {
  if (prefersReduced()) return null;
  const pastelHearts = ['🩷', '🤍', '💗', '💓', '🌸', '💝'];
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none"
          style={{ left: `${(i * 10 + 5) % 100}%`, bottom: -30 }}
          animate={{
            y:       [0, -(window.innerHeight + 50)],
            x:       [0, Math.sin(i) * 40],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 7 + i * 0.5,
            repeat:   Infinity,
            delay:    i * 0.9,
            ease:     'easeInOut',
          }}
        >
          {pastelHearts[i % pastelHearts.length]}
        </motion.div>
      ))}
    </>
  );
}

// ── Click sparkle handler ────────────────────────────────────────────────────
function ClickSparkles() {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const handle = (e) => {
      const id = Date.now() + Math.random();
      const sparklePack = Array.from({ length: 5 }).map((_, i) => ({
        id: id + i,
        x:  e.clientX + (Math.random() - 0.5) * 30,
        y:  e.clientY + (Math.random() - 0.5) * 30,
        emoji: ['✨', '💫', '🌸', '💕', '⭐'][i],
      }));
      setSparks(p => [...p.slice(-20), ...sparklePack]);
      sparklePack.forEach(sp => {
        setTimeout(() => setSparks(p => p.filter(s => s.id !== sp.id)), 900);
      });
    };
    window.addEventListener('click', handle);
    return () => window.removeEventListener('click', handle);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997]">
      <AnimatePresence>
        {sparks.map(s => (
          <motion.div
            key={s.id}
            className="absolute text-base"
            style={{ left: s.x - 10, top: s.y - 10 }}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.6, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            {s.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Main overlay component ───────────────────────────────────────────────────
export default function LightModeOverlay() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <AnimatePresence>
      {isLight && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {/* Warm morning gradient overlay */}
          {/* Soft morning tint — low opacity so existing dark bg + white text stays readable */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(160deg, rgba(254,240,180,0.38) 0%, rgba(252,220,235,0.35) 35%, rgba(230,225,255,0.30) 65%, rgba(210,230,255,0.28) 100%)',
            }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Warm sunrise glow from top-right — accent only */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 85% 5%, rgba(251,191,36,0.18) 0%, transparent 45%)' }} />

          {/* Blush vignette — very subtle */}
          <div className="absolute inset-x-0 bottom-0 h-32"
            style={{ background: 'linear-gradient(to top, rgba(251,207,232,0.18), transparent)' }} />

          {/* All romantic light effects */}
          <SunRays />
          <Clouds />
          <Petals />
          <Butterflies />
          <RainbowSparkles />
          <LightHearts />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Light mode click sparkles (pointer-events on, needs to be separate) ─────
export function LightModeClickEffects() {
  const { theme } = useThemeStore();
  if (theme !== 'light') return null;
  return <ClickSparkles />;
}
