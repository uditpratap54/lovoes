import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function MusicToggle() {
  const { musicPlaying, toggleMusic } = useAppStore();
  const audioRef = useRef(null);

  useEffect(() => {
    // Create the audio element with the user's file from the public folder
    const audio = new Audio('/WhatsApp Audio 2026-07-12 at 2.19.27 PM.mpeg');
    audio.loop = true;
    audioRef.current = audio;

    // Try to autoplay once the component mounts (if the browser allows it)
    if (musicPlaying) {
      audio.play().catch((err) => {
        console.log('Autoplay blocked by browser. Will play on first user interaction.', err);
      });
    }

    // Set up a global click/touch listener to start music on first user interaction if it should be playing
    const startAudioOnInteraction = () => {
      if (useAppStore.getState().musicPlaying && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((err) => console.log('Interaction play failed:', err));
      }
      // Remove listener after first interaction
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };

    window.addEventListener('click', startAudioOnInteraction);
    window.addEventListener('touchstart', startAudioOnInteraction);

    return () => {
      audio.pause();
      window.removeEventListener('click', startAudioOnInteraction);
      window.removeEventListener('touchstart', startAudioOnInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.play().catch((err) => {
        console.log('Play failed:', err);
      });
    } else {
      audio.pause();
    }
  }, [musicPlaying]);

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 group"
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
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="absolute right-[120%] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap backdrop-blur-md border"
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderColor: musicPlaying ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.2)',
              color: musicPlaying ? '#bae6fd' : '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            {musicPlaying ? 'Our Song Playing ✨' : 'Play Our Song ❤️'}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMusic}
        className="relative w-14 h-14 rounded-full flex items-center justify-center border"
        style={{
          background: musicPlaying ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.05)',
          borderColor: musicPlaying ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: musicPlaying ? '0 0 25px rgba(56,189,248,0.4)' : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Glowing ring / progress glow */}
        {musicPlaying && (
          <motion.div className="absolute inset-0 rounded-full"
            style={{ border: '2px solid rgba(56,189,248,0.8)', borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}
        
        {/* Ripple glow effect */}
        {musicPlaying && (
          <motion.div className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(56,189,248,0.25)' }}
            animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}

        {/* Rotating Disc */}
        <motion.div
          animate={{ rotate: musicPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center opacity-30"
        >
          {/* A simple disc svg */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={musicPlaying ? "#38bdf8" : "#fff"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </motion.div>

        {/* Play/Pause Icon */}
        <div className="relative z-10 p-2 rounded-full" style={{ background: musicPlaying ? 'rgba(14,165,233,0.5)' : 'rgba(255,255,255,0.1)' }}>
          {musicPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M7 4.5v15l12-7.5L7 4.5z"/></svg>
          )}
        </div>

        {/* Animated EQ bars when playing */}
        {musicPlaying && (
          <span className="absolute -top-1 -right-1 flex items-end gap-[2px] p-1.5 rounded-full backdrop-blur-md"
            style={{ background: 'rgba(14,165,233,0.4)', border: '1px solid rgba(56,189,248,0.5)', boxShadow: '0 0 10px rgba(56,189,248,0.6)' }}>
            {[1, 2, 3, 4].map((i) => (
              <motion.span key={i} className="w-1 rounded-full bg-white"
                animate={{ height: ['4px', `${6 + i * 2}px`, '4px'] }}
                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                style={{ display: 'block', minHeight: '4px' }}
              />
            ))}
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
