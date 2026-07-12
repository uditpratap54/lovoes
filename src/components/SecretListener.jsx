import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function SecretListener() {
  const { activeSecrets, appendSecretBuffer } = useAppStore();
  const [hearts, setHearts] = useState([]);
  const [fireworks, setFireworks] = useState([]);
  const [showHeartbeat, setShowHeartbeat] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      const char = e.key.toUpperCase();
      if (/^[A-Z]$/.test(char)) {
        appendSecretBuffer(char);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [appendSecretBuffer]);

  useEffect(() => {
    if (activeSecrets.includes('love')) {
      // Launch floating hearts
      const newHearts = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        delay: i * 0.15,
      }));
      setHearts((prev) => [...prev, ...newHearts]);
      setTimeout(
        () => setHearts((prev) => prev.filter((h) => !newHearts.find((n) => n.id === h.id))),
        4000
      );
    }
  }, [activeSecrets.includes('love')]);

  useEffect(() => {
    if (activeSecrets.includes('sheetal')) {
      setFireworks(
        Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.6,
        }))
      );
      setTimeout(() => setFireworks([]), 3000);
    }
  }, [activeSecrets.includes('sheetal')]);

  useEffect(() => {
    if (activeSecrets.includes('nurse')) {
      setShowHeartbeat(true);
      setTimeout(() => setShowHeartbeat(false), 4000);
    }
  }, [activeSecrets.includes('nurse')]);

  return (
    <>
      {/* Floating hearts for LOVE */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="fixed pointer-events-none text-2xl z-[9999]"
          initial={{ x: heart.x, y: heart.y, opacity: 1, scale: 0.5 }}
          animate={{
            y: heart.y - 400,
            opacity: 0,
            scale: [0.5, 1.5, 1],
            rotate: [0, 20, -20, 0],
          }}
          transition={{ duration: 3.5, delay: heart.delay, ease: 'easeOut' }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Fireworks for SHEETAL */}
      {fireworks.map((fw) => (
        <motion.div
          key={fw.id}
          className="fixed pointer-events-none z-[9999]"
          style={{ left: fw.x, top: fw.y }}
        >
          {['✨', '🌟', '⭐', '💫'].map((s, i) => (
            <motion.span
              key={i}
              className="absolute text-xl"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: [1, 2, 0],
              }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      ))}

      {/* Heartbeat animation for NURSE */}
      <AnimatePresence>
        {showHeartbeat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-[9998] pointer-events-none"
          >
            <div className="glass-card p-8 text-center">
              <svg width="200" height="80" viewBox="0 0 200 80">
                <polyline
                  points="0,40 30,40 45,10 55,70 65,20 80,50 90,40 200,40"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2"
                  className="heartbeat-line"
                />
              </svg>
              <p className="text-pink-400 font-mono text-sm mt-2">💓 Heartbeat Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
