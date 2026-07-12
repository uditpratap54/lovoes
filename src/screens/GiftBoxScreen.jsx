import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function GiftBoxScreen() {
  const { goNext } = useAppStore();
  const [opened, setOpened] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showContent, setShowContent] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);

    // Create burst particles
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      emoji: ['❤️', '✨', '🌟', '💫', '🎊', '🎉', '💕', '💝'][i % 8],
      angle: (i / 40) * 360,
      distance: 80 + Math.random() * 120,
      duration: 0.8 + Math.random() * 0.8,
    }));
    setParticles(newParticles);

    setTimeout(() => {
      setShowContent(true);
      setParticles([]);
    }, 1500);

    setTimeout(goNext, 3000);
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ background: opened ? 'transparent' : 'rgba(0,0,0,0.6)' }}
    >
      {/* Dark vignette */}
      {!opened && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)',
          }}
        />
      )}

      {/* Burst particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-2xl pointer-events-none z-50"
          style={{ left: '50%', top: '50%' }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <div className="text-center">
        {/* Spotlight effect */}
        {!opened && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 300px 400px at 50% 50%, rgba(56,189,248,0.08) 0%, transparent 100%)',
            }}
          />
        )}

        {/* Header */}
        {!opened && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/30 font-mono text-xs tracking-[0.4em] mb-2">
              CLASSIFIED PACKAGE
            </p>
            <h2 className="font-display font-bold text-2xl text-white">
              One Confidential Gift is Waiting
            </h2>
            <p className="text-white/40 text-sm mt-2">
              — Just for you, Sheetal —
            </p>
          </motion.div>
        )}

        {/* Gift box */}
        <AnimatePresence>
          {!opened ? (
            <motion.div
              key="gift"
              className="gift-box cursor-pointer mx-auto"
              onClick={handleOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              exit={{ scale: 0, opacity: 0, rotate: 720 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-[100px] select-none"
                animate={{
                  y: [0, -15, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🎁
              </motion.div>

              {/* Glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-30"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.4) 0%, transparent 70%)' }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="opened"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
              className="text-center"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                💝
              </motion.div>
              <motion.h3
                className="font-display font-bold text-2xl text-gradient mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                A message from the heart...
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {!opened && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white/40 font-mono text-xs animate-pulse">
              TAP THE GIFT TO OPEN
            </p>
            <div className="flex justify-center mt-3">
              <motion.div
                className="text-sky-400 text-lg"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
