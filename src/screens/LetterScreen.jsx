import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import TypewriterText from '../components/TypewriterText';

const LETTER_LINES = [
  'Dear Sheetal,',
  '',
  'Pata hai, hum abhi ek doosre ko jaanna shuru hi kar rahe hain.',
  'Mere paas tumhare saath purani yaadein nahi hain abhi.',
  '',
  'Par har ek baat jo tum share karti ho,',
  'mujhe tumhari aur izzat hone lagti hai.',
  '',
  'Tumhe dekh ke lagta hai —',
  'yeh ladki har roz ek purpose ke saath uthti hai.',
  'Doosron ka khayal rakhna choose karti hai, chahe khud thaki ho.',
  '',
  'Aisa dil bahut rare hota hai, Sheetal. Seriously. 💙',
  '',
  'Tumhari nursing ki mehnat ko main dil se respect karta hoon.',
  'Itni badi responsibility itni quietly uthana — that\'s not easy.',
  '',
  'Aur phir bhi, sab ke beech,',
  'tum logon ko smile dete rehti ho.',
  '',
  'Bas yahi chahta hoon —',
  'ki mujhe bhi ek mauka mile tumhe smile karvaane ka. 😊',
  '',
  '— Koi jo genuinely tumhare liye root kar raha hai. 💙',
];

export default function LetterScreen() {
  const { goNext } = useAppStore();
  const [done, setDone] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setShowBtn(true), 500);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.4) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-lg py-8">
        {/* Envelope icon */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="text-5xl mb-3">💌</div>
          <p className="text-white/30 font-mono text-xs tracking-[0.3em]">
            CONFIDENTIAL LETTER
          </p>
        </motion.div>

        {/* Letter card */}
        <motion.div
          className="glass-card p-8 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            boxShadow: '0 0 60px rgba(139,92,246,0.15), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Paper texture lines */}
          <div className="absolute inset-8 pointer-events-none opacity-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-white"
                style={{ marginBottom: '1.5rem' }}
              />
            ))}
          </div>

          <TypewriterText
            lines={LETTER_LINES}
            className="font-display text-sm leading-8 text-white/90 relative z-10"
            speed={30}
            lineDelay={200}
            onComplete={() => setDone(true)}
            style={{ fontStyle: 'normal' }}
          />
        </motion.div>

        {/* CTA */}
        {showBtn && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <motion.button
              className="btn-accept px-10"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={goNext}
            >
              Continue... 💙
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
