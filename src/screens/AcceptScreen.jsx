import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/useAppStore';
import { saveResponse } from '../lib/firebase';
import { sendTelegram, buildAcceptMessage } from '../lib/telegram';
import { sendEmail } from '../lib/emailjs';

export default function AcceptScreen() {
  const { goTo } = useAppStore();
  const [phase, setPhase] = useState('celebration'); // celebration | certificate
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (sent) return;
    setSent(true);

    // Notifications
    saveResponse('accepted');
    sendTelegram(buildAcceptMessage());
    sendEmail('accepted');

    // Confetti burst
    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
        colors: ['#38bdf8', '#ec4899', '#a78bfa', '#f9a8d4', '#fbbf24'],
      });
    };

    const launchConfetti = () => {
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    };

    launchConfetti();
    setTimeout(launchConfetti, 1000);
    setTimeout(launchConfetti, 2500);

    // Fireworks
    const end = Date.now() + 4000;
    const fireworkInterval = setInterval(() => {
      if (Date.now() > end) { clearInterval(fireworkInterval); return; }
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f9a8d4', '#a78bfa', '#38bdf8'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f9a8d4', '#a78bfa', '#38bdf8'],
      });
    }, 200);

    setTimeout(() => setPhase('certificate'), 3500);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated gradient bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(236,72,153,0.25) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(139,92,246,0.25) 0%, transparent 50%)',
            'radial-gradient(ellipse at 60% 40%, rgba(56,189,248,0.25) 0%, transparent 50%), radial-gradient(ellipse at 40% 60%, rgba(236,72,153,0.25) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Floating hearts */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-2xl"
          style={{ left: `${5 + i * 8}%`, bottom: 0 }}
          animate={{
            y: [0, -(window.innerHeight + 60)],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        >
          {['❤️', '💕', '💝', '💗'][i % 4]}
        </motion.div>
      ))}

      <div className="w-full max-w-md py-8 text-center">
        <AnimatePresence mode="wait">
          {phase === 'celebration' ? (
            <motion.div
              key="celebration"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h2 className="font-display font-black text-4xl text-gradient mb-3">
                ACCESS GRANTED
              </h2>
              <p className="text-white/60 text-lg">She said YES! 🥳</p>
            </motion.div>
          ) : (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              {/* Certificate */}
              <div className="certificate-border mb-6">
                <div className="certificate-inner text-center">
                  {/* Header */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-sky-400/50" />
                    <span className="text-sky-400 font-mono text-xs tracking-widest">OFFICIAL CERTIFICATE</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-sky-400/50" />
                  </div>

                  <motion.div
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    💝
                  </motion.div>

                  <h3 className="font-display font-black text-2xl text-white mb-1">
                    Certificate of Connection
                  </h3>
                  <p className="text-white/40 text-xs font-mono mb-5">
                    Officially Issued by LoveOS v1.0
                  </p>

                  {/* Fields */}
                  <div className="space-y-3 text-left mb-5">
                    {[
                      { label: 'Issued To', value: 'Sheetal ✨', color: '#f9a8d4' },
                      { label: 'Issued By', value: 'Udit 💙', color: '#38bdf8' },
                      { label: 'Status', value: 'Accepted ❤️', color: '#4ade80' },
                      { label: 'Mission', value: 'Make Each Other Smile', color: '#a78bfa' },
                      { label: 'Valid From', value: 'Right Now ∞', color: '#fbbf24' },
                    ].map((field, i) => (
                      <motion.div
                        key={field.label}
                        className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.15 }}
                      >
                        <span className="text-white/40 font-mono text-xs">{field.label}</span>
                        <span className="font-semibold text-sm" style={{ color: field.color }}>
                          {field.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stamp */}
                  <div className="flex justify-end">
                    <motion.div
                      className="px-3 py-1.5 rounded-lg border border-pink-500/50 text-pink-400 font-bold text-xs tracking-widest"
                      style={{
                        background: 'rgba(236,72,153,0.1)',
                        transform: 'rotate(-8deg)',
                      }}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: -8 }}
                      transition={{ delay: 1, type: 'spring' }}
                    >
                      ❤️ OFFICIAL
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                className="btn-accept w-full py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  confetti({
                    particleCount: 120,
                    spread: 120,
                    origin: { y: 0.6 },
                    colors: ['#38bdf8', '#ec4899', '#a78bfa', '#fbbf24'],
                  });
                  setTimeout(() => goTo('journey'), 600);
                }}
              >
                <span className="flex items-center justify-center gap-2 text-lg">
                  <span>Start Our Journey</span>
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                </span>
              </motion.button>

              <motion.p
                className="text-white/30 font-mono text-xs mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                This made someone very happy today. 🥹
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
