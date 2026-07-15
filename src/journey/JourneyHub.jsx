// ─── Journey Hub — the full interactive journey experience ────────────────────
// Mounted AFTER the existing JourneyScreen's final phase, via "Start Journey" btn
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import FoodPanel        from './FoodPanel';
import MoviesPanel      from './MoviesPanel';
import SongsPanel       from './SongsPanel';
import GalleryPanel     from './GalleryPanel';
import LettersPanel     from './LettersPanel';
import DestinationsPanel from './DestinationsPanel';
import { BucketPanel, DatesPanel, JournalPanel, StatsPanel } from './ExtraPanels';
import { useJourneyStore } from './useJourneyStore';

// ── Random romantic quotes ───────────────────────────────────────────────────
const QUOTES = [
  '"You are my favourite chapter ❤️"',
  '"Our story is just getting started."',
  '"I\'d choose you again and again."',
  '"So lucky to have you in my life."',
  '"Every day with you is a gift."',
  '"You make ordinary moments magical."',
  '"With you, every place feels like home."',
  '"You are my calm in every storm."',
  '"Loving you is the best thing I do."',
  '"You are my person. Always. 💙"',
];

// ── Navigation tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'stats',   emoji: '❤️',  label: 'Our Story'    },
  { id: 'food',    emoji: '🍕',  label: 'Foods'        },
  { id: 'movies',  emoji: '🎬',  label: 'Movies'       },
  { id: 'songs',   emoji: '🎵',  label: 'Songs'        },
  { id: 'gallery', emoji: '📷',  label: 'Memories'     },
  { id: 'letters', emoji: '💌',  label: 'Letters'      },
  { id: 'places',  emoji: '🌍',  label: 'Places'       },
  { id: 'bucket',  emoji: '🎯',  label: 'Bucket List'  },
  { id: 'dates',   emoji: '📅',  label: 'Dates'        },
  { id: 'journal', emoji: '🌙',  label: 'Journal'      },
];

// ── Chapter intro animation ──────────────────────────────────────────────────
const CHAPTERS = [
  { emoji: '❤️',  title: 'First Meet',       color: '#ec4899' },
  { emoji: '🌸',  title: 'First Smile',      color: '#f9a8d4' },
  { emoji: '📸',  title: 'First Picture',    color: '#38bdf8' },
  { emoji: '🍕',  title: 'Favourite Food',   color: '#f97316' },
  { emoji: '🎬',  title: 'Favourite Movies', color: '#a78bfa' },
  { emoji: '🎵',  title: 'Favourite Songs',  color: '#8b5cf6' },
  { emoji: '☕',  title: 'Favourite Drinks', color: '#92400e' },
  { emoji: '🌍',  title: 'Dream Destinations', color: '#22c55e' },
  { emoji: '🎁',  title: 'Bucket List',      color: '#4ade80' },
  { emoji: '💌',  title: 'Love Letters',     color: '#f9a8d4' },
];

function ChapterIntro({ onDone }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => {
        if (prev >= CHAPTERS.length - 1) { clearInterval(timer); setTimeout(onDone, 700); return prev; }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const ch = CHAPTERS[idx];
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx} className="text-center"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.3, y: -20 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <motion.div className="text-8xl mb-4"
            animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.6 }}>
            {ch.emoji}
          </motion.div>
          <motion.h2 className="font-display font-black text-3xl"
            style={{ color: ch.color, textShadow: `0 0 40px ${ch.color}88` }}>
            {ch.title}
          </motion.h2>
          <div className="flex justify-center gap-1.5 mt-6">
            {CHAPTERS.map((_, i) => (
              <motion.div key={i} className="rounded-full"
                animate={{ width: i === idx ? 20 : 6, height: 6, background: i <= idx ? ch.color : 'rgba(255,255,255,0.15)' }}
                transition={{ duration: 0.3 }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="text-white/30 font-mono text-xs mt-8 tracking-widest">OUR JOURNEY BEGINS...</p>
    </div>
  );
}

function MagicalBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Slow moving nebula glow */}
      <motion.div className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{ background: 'radial-gradient(circle at 30% 70%, rgba(236,72,153,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(139,92,246,0.15) 0%, transparent 50%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Floating hearts */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={`h${i}`} className="absolute text-sm lg:text-base select-none"
          style={{ left: `${(i * 7) % 100}%`, bottom: -30, opacity: 0 }}
          animate={{ y: [0, -(window.innerHeight + 100)], x: [0, Math.sin(i) * 50, 0], opacity: [0, 0.6, 0], rotate: [0, (i%2===0?1:-1)*45] }}
          transition={{ duration: 10 + i * 0.8, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
        >❤️</motion.div>
      ))}

      {/* Twinkling stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={`s${i}`} className="absolute rounded-full"
          style={{ left: `${(i * 13 + 3) % 100}%`, top: `${(i * 11 + 5) % 100}%`, width: i%3===0?3:1.5, height: i%3===0?3:1.5, background: 'rgba(255,255,255,0.9)' }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.5, 0.8] }}
          transition={{ duration: 1.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Shooting stars */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div key={`ss${i}`} className="absolute h-[1px] rounded-full"
          style={{ top: `${10 + i * 20}%`, left: '-10%', width: 120, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }}
          animate={{ x: ['0vw', '120vw'], opacity: [0, 1, 0], rotate: [15, 15] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 5 + 3, repeatDelay: 12 + i * 4 }}
        />
      ))}

      {/* Fireflies */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={`ff${i}`} className="absolute w-2 h-2 rounded-full"
          style={{ left: `${15 + i * 8}%`, top: `${20 + i * 6}%`, background: '#fbbf24', boxShadow: '0 0 12px #fbbf24, 0 0 4px #fff' }}
          animate={{ x: [0, Math.random()*60-30, 0], y: [0, Math.random()*60-30, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Cursor heart trail ───────────────────────────────────────────────────────
function CursorTrail() {
  const [sparks, setSparks] = useState([]);
  const handleClick = (e) => {
    const id = Date.now();
    setSparks(p => [...p.slice(-8), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setSparks(p => p.filter(s => s.id !== id)), 1200);
  };
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      <AnimatePresence>
        {sparks.map(s => (
          <motion.div key={s.id} className="absolute text-lg" style={{ left: s.x - 12, top: s.y - 12 }}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >💕</motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Floating quote banner ────────────────────────────────────────────────────
function QuoteBanner() {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    const pick = () => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    pick();
    const t = setInterval(() => { setQuote(null); setTimeout(pick, 600); }, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {quote && (
        <motion.div className="fixed bottom-10 left-1/2 z-40 -translate-x-1/2 px-8 py-5 rounded-[2rem] text-center max-w-md w-[92%] pointer-events-none"
          style={{ 
            background: 'linear-gradient(135deg, rgba(20,10,30,0.7), rgba(40,15,50,0.6))', 
            border: '1px solid rgba(236,72,153,0.3)', 
            backdropFilter: 'blur(24px)', 
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(236,72,153,0.15)' 
          }}
          initial={{ opacity: 0, y: 40, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 120, damping: 25 }}
        >
          <motion.div 
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            💖
          </motion.div>
          <p className="text-pink-100/90 text-sm md:text-base font-display italic font-medium leading-relaxed mt-2 relative z-10">
            <span className="text-pink-400 text-xl md:text-2xl mr-1.5 opacity-80">"</span>
            {quote.replace(/"/g, '')}
            <span className="text-pink-400 text-xl md:text-2xl ml-1.5 opacity-80">"</span>
          </p>
          
          {/* Animated border glow pulse */}
          <motion.div className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{ border: '2px solid rgba(236,72,153,0.6)', mixBlendMode: 'screen' }}
            animate={{ opacity: [0, 0.5, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Journey Hub ────────────────────────────────────────────────────────
export default function JourneyHub({ onBack }) {
  const [showIntro, setShowIntro] = useState(true);
  const { activeTab, setTab } = useJourneyStore();
  const navRef = useRef(null);

  useEffect(() => {
    if (!showIntro) {
      confetti({ particleCount: 100, spread: 140, origin: { y: 0.6 }, colors: ['#f9a8d4', '#a78bfa', '#38bdf8', '#fbbf24', '#4ade80'] });
    }
  }, [showIntro]);

  const PANEL_MAP = {
    stats:   <StatsPanel />,
    food:    <FoodPanel />,
    movies:  <MoviesPanel />,
    songs:   <SongsPanel />,
    gallery: <GalleryPanel />,
    letters: <LettersPanel />,
    places:  <DestinationsPanel />,
    bucket:  <BucketPanel />,
    dates:   <DatesPanel />,
    journal: <JournalPanel />,
  };

  if (showIntro) return <ChapterIntro onDone={() => setShowIntro(false)} />;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <MagicalBg />
      <CursorTrail />
      <QuoteBanner />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative z-30 flex-shrink-0 bg-black/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <motion.button onClick={onBack}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <span className="text-white/70 group-hover:text-white transition-colors">←</span>
            <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
          
          <div className="text-center relative">
            <motion.div 
              className="absolute -top-6 -right-8 text-2xl"
              animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              💖
            </motion.div>
            <motion.h1 
              className="font-display font-black text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 relative overflow-hidden pb-1"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              style={{ backgroundSize: '200% auto', textShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              Our Journey
            </motion.h1>
            <p className="text-pink-300/80 text-xs font-mono tracking-[0.25em] uppercase mt-1">Every beautiful memory</p>
          </div>
          <div className="w-12" />
        </div>

        {/* ── Tab navigation ─────────────────────────────────────────────── */}
        <div ref={navRef} className="flex sm:justify-center overflow-x-auto px-6 pb-5 pt-3 gap-3 md:gap-4 scrollbar-hide snap-x items-center">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`group relative flex items-center gap-2 shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all duration-500 snap-center
                  ${isActive 
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-pink-300 shadow-[0_8px_30px_rgba(236,72,153,0.25)]' 
                    : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white/90 backdrop-blur-md'} border`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span animate={isActive ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                  {tab.emoji}
                </motion.span>
                <span className="inline whitespace-nowrap">{tab.label}</span>
                
                {isActive && (
                  <>
                    <motion.div layoutId="activeTabUnderline" className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
                    <motion.div className="absolute -top-4 right-2 text-xs pointer-events-none"
                      animate={{ y: [0, -20], opacity: [1, 0], scale: [0.5, 1.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    >❤️</motion.div>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Soft glowing divider */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent shadow-[0_0_15px_rgba(236,72,153,0.6)]" />
      </div>

      {/* ── Panel content ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto relative z-20 px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {PANEL_MAP[activeTab] || null}
          </motion.div>
        </AnimatePresence>
        <div className="h-24" /> {/* bottom padding */}
      </div>
    </div>
  );
}
