// ─── Love Letters Panel ────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Mail, MailOpen } from 'lucide-react';
import { useJourneyStore } from './useJourneyStore';
import { SectionHeader, AddButton, DeleteBtn, Modal, Field, SaveBtn, Empty } from './JourneyUI';

const BLANK = { title: '', body: '', from: 'Udit 💙', locked: false };

export default function LettersPanel() {
  const { letters, addLetter, removeLetter, updateLetter } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [readLetter, setReadLetter] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.body.trim()) return;
    if (editId) { updateLetter(editId, form); setEditId(null); }
    else addLetter(form);
    setForm(BLANK); setOpen(false);
  };

  const startEdit = (item) => {
    setForm({ title: item.title, body: item.body, from: item.from, locked: item.locked });
    setEditId(item.id); setOpen(true);
  };

  return (
    <div>
      <SectionHeader emoji="💌" title="Love Letters" subtitle="Words straight from the heart" color="#f9a8d4" />
      <AddButton onClick={() => { setEditId(null); setForm(BLANK); setOpen(true); }} label="Write a Letter" color="#ec4899" />

      {letters.length === 0 ? <Empty emoji="💌" text="Write your first love letter!" /> : (
        <div className="space-y-3">
          <AnimatePresence>
            {letters.map((item) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                layout transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              >
                <motion.div className="p-4 rounded-2xl cursor-pointer"
                  style={{ background: 'rgba(236,72,153,0.07)', border: '1px solid rgba(236,72,153,0.18)' }}
                  whileHover={{ background: 'rgba(236,72,153,0.13)', borderColor: 'rgba(236,72,153,0.3)' }}
                  onClick={() => !item.locked && setReadLetter(item)}
                >
                  <div className="flex items-center gap-3">
                    <motion.div className="text-2xl"
                      animate={{ rotate: item.locked ? [0] : [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                      {item.locked ? <Lock size={22} className="text-pink-400/60" /> : <Mail size={22} className="text-pink-400" />}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-white text-sm">
                        {item.title || 'A letter for you...'}
                      </p>
                      <p className="text-white/35 text-xs mt-0.5">
                        {item.locked ? '🔒 Locked' : `from ${item.from} · ${item.body.slice(0, 40)}...`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); updateLetter(item.id, { locked: !item.locked }); }}
                        className="p-1.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.07)', color: item.locked ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      >
                        {item.locked ? <Lock size={13} /> : <Unlock size={13} />}
                      </motion.button>
                      <motion.button onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                        className="px-2 py-1 rounded-lg text-xs font-mono"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                        whileHover={{ background: 'rgba(255,255,255,0.14)' }}>Edit</motion.button>
                      <DeleteBtn onClick={(e) => { e?.stopPropagation?.(); removeLetter(item.id); }} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Write modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit Letter ✏️' : 'Write a Letter 💌'}>
        <Field label="TITLE (optional)" value={form.title} onChange={f('title')} placeholder="My dearest..." />
        <Field label="YOUR LETTER" value={form.body} onChange={f('body')} placeholder="Dear Sheetal, Today I wanted to tell you..." as="textarea" rows={6} />
        <Field label="FROM" value={form.from} onChange={f('from')} placeholder="Udit 💙" />
        <div className="flex items-center gap-3 mb-3">
          <label className="text-white/35 font-mono text-xs tracking-wider">LOCK THIS LETTER</label>
          <motion.button onClick={() => f('locked')(!form.locked)}
            className="w-10 h-5 rounded-full relative flex items-center"
            style={{ background: form.locked ? 'rgba(236,72,153,0.6)' : 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div className="w-4 h-4 rounded-full bg-white absolute"
              animate={{ left: form.locked ? '22px' : '2px' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }} />
          </motion.button>
        </div>
        <SaveBtn onClick={submit} label={editId ? '✓ Save Letter' : '📬 Send Letter'} color="#ec4899" />
      </Modal>

      {/* Read letter modal — envelope animation */}
      <AnimatePresence>
        {readLetter && (
          <>
            <motion.div className="fixed inset-0 z-[9990] bg-black/70"
              style={{ backdropFilter: 'blur(10px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setReadLetter(null)} />
            <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4">
              <motion.div className="w-full max-w-sm rounded-3xl p-6"
                style={{ background: 'rgba(10,5,15,0.97)', border: '1px solid rgba(236,72,153,0.3)', boxShadow: '0 0 60px rgba(236,72,153,0.15)' }}
                initial={{ opacity: 0, scale: 0.7, rotateX: -30 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              >
                <div className="text-center mb-4">
                  <motion.div initial={{ y: -30 }} animate={{ y: 0 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <MailOpen size={36} className="text-pink-400 mx-auto mb-2" />
                  </motion.div>
                  <p className="font-display font-black text-xl text-white">{readLetter.title || 'A letter for you...'}</p>
                </div>
                <motion.div className="p-4 rounded-2xl mb-4"
                  style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.15)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                >
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-display italic">{readLetter.body}</p>
                </motion.div>
                <motion.p className="text-pink-300/60 font-mono text-xs text-right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  — {readLetter.from}
                </motion.p>
                <motion.button className="w-full py-3 rounded-2xl font-bold text-sm mt-4"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
                  whileHover={{ background: 'rgba(255,255,255,0.12)' }} whileTap={{ scale: 0.97 }}
                  onClick={() => setReadLetter(null)}>Close 💌</motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
