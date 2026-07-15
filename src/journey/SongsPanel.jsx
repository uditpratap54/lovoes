// ─── Songs Panel ───────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { useJourneyStore } from './useJourneyStore';
import { GCard, SectionHeader, AddButton, DeleteBtn, Modal, Field, SaveBtn, Empty } from './JourneyUI';

const MOODS = ['Romantic 💕', 'Happy 😊', 'Chill 🌙', 'Energetic ⚡', 'Emotional 🥹', 'Nostalgic 🌸'];
const BLANK = { title: '', artist: '', mood: 'Romantic 💕', link: '' };

// Floating music notes animation
function MusicNotes() {
  const notes = ['♩', '♪', '♫', '♬', '🎵', '🎶'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i}
          className="absolute text-lg select-none"
          style={{ left: `${10 + i * 11}%`, bottom: -30, color: 'rgba(167,139,250,0.35)' }}
          animate={{ y: [0, -(window.innerHeight + 60)], x: [0, Math.sin(i) * 40], opacity: [0, 0.7, 0], rotate: [0, (i % 2 ? 1 : -1) * 30] }}
          transition={{ duration: 7 + i * 0.5, repeat: Infinity, delay: i * 0.9, ease: 'easeInOut' }}
        >
          {notes[i % notes.length]}
        </motion.div>
      ))}
    </div>
  );
}

const MOOD_COLOR = { 'Romantic 💕': '#ec4899', 'Happy 😊': '#fbbf24', 'Chill 🌙': '#38bdf8', 'Energetic ⚡': '#f97316', 'Emotional 🥹': '#a78bfa', 'Nostalgic 🌸': '#f9a8d4' };

export default function SongsPanel() {
  const { songs, addSong, removeSong, updateSong } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) return;
    if (editId) { updateSong(editId, form); setEditId(null); }
    else addSong(form);
    setForm(BLANK); setOpen(false);
  };

  const startEdit = (item) => {
    setForm({ title: item.title, artist: item.artist || '', mood: item.mood || 'Romantic 💕', link: item.link || '' });
    setEditId(item.id); setOpen(true);
  };

  return (
    <div className="relative">
      <MusicNotes />
      <div className="relative z-10">
        <SectionHeader emoji="🎵" title="Our Favourite Songs" subtitle="The soundtrack of our story" color="#a78bfa" />
        <AddButton onClick={() => { setEditId(null); setForm(BLANK); setOpen(true); }} label="Add Song" color="#8b5cf6" />

        {songs.length === 0 ? <Empty emoji="🎵" text="Add songs that remind you of each other!" /> : (
          <div className="space-y-3">
            <AnimatePresence>
              {songs.map((item, idx) => {
                const mc = MOOD_COLOR[item.mood] || '#a78bfa';
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    layout transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                  >
                    <GCard className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Animated music icon */}
                        <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${mc}22` }}
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.3 }}
                        >
                          <Music size={18} style={{ color: mc }} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-white truncate">{item.title}</p>
                          {item.artist && <p className="text-white/45 text-xs mt-0.5">by {item.artist}</p>}
                          {item.mood && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold mt-1.5 inline-block"
                              style={{ background: `${mc}18`, color: mc }}>{item.mood}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.link && (
                            <motion.a href={item.link} target="_blank" rel="noreferrer"
                              className="p-2 rounded-xl"
                              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
                              whileHover={{ background: 'rgba(255,255,255,0.14)', scale: 1.1 }}
                            >
                              <ExternalLink size={13} />
                            </motion.a>
                          )}
                          <motion.button onClick={() => startEdit(item)}
                            className="px-2 py-1 rounded-lg text-xs font-mono"
                            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                            whileHover={{ background: 'rgba(255,255,255,0.14)' }}>Edit</motion.button>
                          <DeleteBtn onClick={() => removeSong(item.id)} />
                        </div>
                      </div>
                    </GCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit Song ✏️' : 'Add Song 🎵'}>
        <Field label="SONG TITLE" value={form.title} onChange={f('title')} placeholder="Perfect, by Ed Sheeran..." />
        <Field label="ARTIST" value={form.artist} onChange={f('artist')} placeholder="Artist name..." />
        <div className="mb-3">
          <label className="text-white/35 font-mono text-xs mb-1.5 block tracking-wider">MOOD</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const mc = MOOD_COLOR[m] || '#a78bfa';
              return (
                <motion.button key={m} onClick={() => f('mood')(m)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: form.mood === m ? `${mc}28` : 'rgba(255,255,255,0.06)', color: form.mood === m ? mc : 'rgba(255,255,255,0.4)', border: `1px solid ${form.mood === m ? `${mc}55` : 'transparent'}` }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >{m}</motion.button>
              );
            })}
          </div>
        </div>
        <Field label="SPOTIFY / YOUTUBE LINK (optional)" value={form.link} onChange={f('link')} placeholder="https://..." />
        <SaveBtn onClick={submit} label={editId ? '✓ Save Changes' : '+ Add Song'} color="#8b5cf6" />
      </Modal>
    </div>
  );
}
