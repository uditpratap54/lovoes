import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        background: musicPlaying
          ? 'rgba(14,165,233,0.15)'
          : 'rgba(255,255,255,0.05)',
        border: musicPlaying
          ? '1px solid rgba(56,189,248,0.5)'
          : '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: musicPlaying
          ? '0 0 25px rgba(56,189,248,0.5), 0 0 50px rgba(56,189,248,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
      title={musicPlaying ? 'Pause Music' : 'Play Music'}
    >
      {musicPlaying ? (
        /* Pause icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4" width="4" height="16" rx="1.5" fill="#38bdf8" />
          <rect x="14" y="4" width="4" height="16" rx="1.5" fill="#38bdf8" />
        </svg>
      ) : (
        /* Play icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M7 4.5v15l12-7.5L7 4.5z" fill="#38bdf8" />
        </svg>
      )}

      {/* Animated EQ bars when playing */}
      {musicPlaying && (
        <span
          className="absolute -top-2 -right-2 flex items-end gap-0.5 p-1 rounded-full"
          style={{
            background: 'rgba(14,165,233,0.2)',
            border: '1px solid rgba(56,189,248,0.3)',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="w-0.5 rounded-full bg-sky-400"
              animate={{ height: ['4px', `${6 + i * 3}px`, '4px'] }}
              transition={{
                duration: 0.6 + i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
              style={{ display: 'block', minHeight: '4px' }}
            />
          ))}
        </span>
      )}

      {/* Music note tooltip */}
      {!musicPlaying && (
        <span className="absolute -top-1 -right-1 text-xs">🎵</span>
      )}
    </button>
  );
}
