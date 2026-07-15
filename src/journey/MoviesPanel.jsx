// ─── Movies Panel ──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2 } from 'lucide-react';
import { useJourneyStore } from './useJourneyStore';
import { GCard, SectionHeader, AddButton, DeleteBtn, StarRating, Modal, Field, SaveBtn, Empty } from './JourneyUI';

const GENRES = ['Romance', 'Comedy', 'Drama', 'Thriller', 'Action', 'Animation', 'Horror', 'Sci-Fi', 'Documentary'];
const BLANK = { title: '', genre: 'Romance', rating: 0, favouriteScene: '', poster: '' };

export default function MoviesPanel() {
  const { movies, addMovie, removeMovie, updateMovie } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) return;
    if (editId) { updateMovie(editId, form); setEditId(null); }
    else addMovie(form);
    setForm(BLANK); setOpen(false);
  };

  const startEdit = (item) => {
    setForm({ title: item.title, genre: item.genre || 'Romance', rating: item.rating || 0, favouriteScene: item.favouriteScene || '', poster: item.poster || '' });
    setEditId(item.id); setOpen(true);
  };

  const genreColor = { Romance: '#ec4899', Comedy: '#fbbf24', Drama: '#a78bfa', Thriller: '#ef4444', Action: '#f97316', Animation: '#38bdf8', Horror: '#4b5563', 'Sci-Fi': '#6366f1', Documentary: '#10b981' };

  return (
    <div>
      <SectionHeader emoji="🎬" title="Our Movie Collection" subtitle="Films we love to watch together" color="#a78bfa" />
      <AddButton onClick={() => { setEditId(null); setForm(BLANK); setOpen(true); }} label="Add Movie" color="#a78bfa" />

      {movies.length === 0 ? <Empty emoji="🎬" text="Add movies you love together!" /> : (
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {movies.map((item) => {
              const gc = genreColor[item.genre] || '#a78bfa';
              return (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                  layout transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                >
                  <GCard className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Poster placeholder / emoji */}
                      <div className="w-12 h-16 rounded-xl shrink-0 flex items-center justify-center text-2xl"
                        style={{ background: `${gc}22`, border: `1px solid ${gc}33` }}>
                        🎬
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display font-bold text-white">{item.title}</p>
                          {item.watched && (
                            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                              <CheckCircle2 size={11} /> Watched
                            </span>
                          )}
                        </div>
                        {item.genre && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block"
                            style={{ background: `${gc}18`, color: gc }}>
                            {item.genre}
                          </span>
                        )}
                        {item.favouriteScene && (
                          <p className="text-white/45 text-xs mt-1.5 italic">⭐ "{item.favouriteScene}"</p>
                        )}
                        <div className="mt-2"><StarRating value={item.rating} onChange={(v) => updateMovie(item.id, { rating: v })} color={gc} /></div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <motion.button
                          onClick={() => updateMovie(item.id, { watched: !item.watched })}
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-semibold"
                          style={{ background: item.watched ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.07)', color: item.watched ? '#4ade80' : 'rgba(255,255,255,0.4)' }}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                          <Play size={10} fill={item.watched ? '#4ade80' : 'none'} />
                          {item.watched ? 'Watched' : 'Watch'}
                        </motion.button>
                        <div className="flex gap-1">
                          <motion.button onClick={() => startEdit(item)}
                            className="px-2 py-1 rounded-lg text-xs font-mono"
                            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                            whileHover={{ background: 'rgba(255,255,255,0.14)' }}>Edit</motion.button>
                          <DeleteBtn onClick={() => removeMovie(item.id)} />
                        </div>
                      </div>
                    </div>
                  </GCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit Movie ✏️' : 'Add Movie 🎬'}>
        <Field label="MOVIE TITLE" value={form.title} onChange={f('title')} placeholder="The Notebook..." />
        <div className="mb-3">
          <label className="text-white/35 font-mono text-xs mb-1.5 block tracking-wider">GENRE</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <motion.button key={g} onClick={() => f('genre')(g)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: form.genre === g ? `${genreColor[g]}33` : 'rgba(255,255,255,0.06)', color: form.genre === g ? genreColor[g] : 'rgba(255,255,255,0.4)', border: `1px solid ${form.genre === g ? `${genreColor[g]}55` : 'transparent'}` }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >{g}</motion.button>
            ))}
          </div>
        </div>
        <Field label="FAVOURITE SCENE (optional)" value={form.favouriteScene} onChange={f('favouriteScene')} placeholder="That ending scene where..." as="textarea" rows={2} />
        <div className="mb-3">
          <label className="text-white/35 font-mono text-xs mb-1.5 block tracking-wider">RATING</label>
          <StarRating value={form.rating} onChange={f('rating')} color={genreColor[form.genre] || '#a78bfa'} />
        </div>
        <SaveBtn onClick={submit} label={editId ? '✓ Save Changes' : '+ Add Movie'} color="#a78bfa" />
      </Modal>
    </div>
  );
}
