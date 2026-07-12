import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ThreeBackground from './components/ThreeBackground';
import Cursor from './components/Cursor';
import MusicToggle from './components/MusicToggle';
import SecretListener from './components/SecretListener';

import BootScreen from './screens/BootScreen';
import LoginScreen from './screens/LoginScreen';
import FingerprintScreen from './screens/FingerprintScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import MedicalReportScreen from './screens/MedicalReportScreen';
import MemoriesScreen from './screens/MemoriesScreen';
import GiftBoxScreen from './screens/GiftBoxScreen';
import LetterScreen from './screens/LetterScreen';
import ProposalScreen from './screens/ProposalScreen';
import AcceptScreen from './screens/AcceptScreen';
import RejectScreen from './screens/RejectScreen';
import JourneyScreen from './screens/JourneyScreen';

import { useAppStore } from './store/useAppStore';

const SCREEN_MAP = {
  boot: BootScreen,
  login: LoginScreen,
  fingerprint: FingerprintScreen,
  analysis: AnalysisScreen,
  medical: MedicalReportScreen,
  memories: MemoriesScreen,
  gift: GiftBoxScreen,
  letter: LetterScreen,
  proposal: ProposalScreen,
  accept: AcceptScreen,
  reject: RejectScreen,
  journey: JourneyScreen,
};

// Double tap logo easter egg
function LogoEasterEgg() {
  const [taps, setTaps] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleTap = () => {
    setTaps((t) => t + 1);
    if (taps >= 1) {
      setShowMessage(true);
      setTaps(0);
      setTimeout(() => setShowMessage(false), 3000);
    }
    setTimeout(() => setTaps(0), 500);
  };

  return (
    <>
      <button
        onClick={handleTap}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 select-none"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        title="LoveOS"
      >
        <span className="text-lg">❤️</span>
      </button>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="fixed top-16 left-4 z-50 glass-card px-4 py-3"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <p className="text-pink-300 font-display font-semibold text-sm">
              You are amazing ❤️
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Screen progress indicator
function ScreenIndicator({ current }) {
  const screens = ['boot', 'login', 'fingerprint', 'analysis', 'medical', 'memories', 'gift', 'letter', 'proposal'];
  const idx = screens.indexOf(current);
  if (idx < 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5">
      {screens.map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: i === idx ? '20px' : '6px',
            height: '6px',
            background: i <= idx
              ? 'linear-gradient(90deg, #38bdf8, #a78bfa)'
              : 'rgba(255,255,255,0.15)',
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const { currentScreen } = useAppStore();
  const [isMobile] = useState(() => window.innerWidth < 768);

  const CurrentScreen = SCREEN_MAP[currentScreen];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Three.js background */}
      <ThreeBackground />

      {/* Custom cursor (desktop only) */}
      {!isMobile && <Cursor />}

      {/* Easter egg logo */}
      <LogoEasterEgg />

      {/* Screen progress */}
      <ScreenIndicator current={currentScreen} />

      {/* Music toggle */}
      <MusicToggle />

      {/* Secret keyboard listener */}
      <SecretListener />

      {/* Main screen */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {CurrentScreen && <CurrentScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global background gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(14,165,233,0.06) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
