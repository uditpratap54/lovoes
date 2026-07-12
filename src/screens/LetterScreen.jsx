import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import TypewriterText from '../components/TypewriterText';

const LETTER_LINES = [
  '**🔒 CONFIDENTIAL FILE**',
  '**Security Level:** HIGH',
  '**Access Granted To:** Sheetal ❤️',
  '',
  '**Hey Sheetal,**',
  '',
  'Agar tum yahan tak pahunch gayi ho, toh congratulations... tumne successfully is secret file ko unlock kar liya. 😄',
  '',
  'Sach bolun? Jab hum Snapchat par pehli baar mile the, tab bilkul nahi socha tha ki ek random conversation itni interesting ban jayegi.',
  '',
  'Abhi humari story bilkul new hai. Na bahut saari memories hain, na koi badi promises. Aur shayad yehi is story ki sabse achhi baat hai... kyunki har chapter abhi likhna baaki hai.',
  '',
  'Tum nursing padh rahi ho. Roz itna kuch seekhti ho taaki ek din kisi ki life better bana sako. Mujhe ye baat genuinely pasand hai. Kisi ki care karna sirf profession nahi hota, woh personality bhi dikhata hai.',
  '',
  'Aur waise... ek chhota sa system error bhi detect hua hai. 🤭',
  '',
  '**Report Generated Successfully**',
  '',
  '* Patient Name: Sheetal',
  '* Profession: Future Super Nurse 👩‍⚕️',
  '* Smile Level: 100%',
  '* Kindness: Unlimited',
  '* Attitude: Perfect Balance',
  '* Status: Someone\'s favourite person... without even trying.',
  '',
  'Ab meri report bhi sun lo...',
  '',
  '* Sleep Quality: Depends on your reply. 😅',
  '* Mood: Better after talking to you.',
  '* Bug Detected: I smile whenever your notification pops up.',
  '* Solution Found: Keep talking to Sheetal.',
  '',
  'Main future predict nahi kar sakta. Bas itna jaanta hoon ki tumhare saath aur baatein karna, tumhe aur achhe se jaana, aur dheere-dheere ek achhi story banana mujhe accha lagega.',
  '',
  'Isliye aaj koi filmy dialogue ya over-the-top promise nahi.',
  '',
  'Bas ek simple sa question...',
  '',
  '**Kya tum mujhe apni life mein ek special jagah dena chahogi?**',
  '',
  'Agar answer **"Yes"** hai, toh shayad ye humari story ka first official chapter hoga. ❤️',
  '',
  'Aur agar answer **"No"** bhi hua, toh bhi thank you... kyunki is secret file ko kholne ke liye time nikalna bhi mere liye kaafi special hai.',
  '',
  '**– Udit** 💙',
  '',
  '**End of Confidential File**',
  '',
  '**Status:** Waiting for Sheetal\'s Decision...',
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
