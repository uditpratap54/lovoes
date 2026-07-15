// ─── Dream Destinations Panel ──────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { useJourneyStore } from './useJourneyStore';
import { GCard, SectionHeader, AddButton, DeleteBtn, Modal, Field, SaveBtn, Empty } from './JourneyUI';

const BLANK = { country: '', city: '', emoji: '🌍', note: '', visited: false };

export default function DestinationsPanel() {
  const { destinations, addDestination, removeDestination, updateDestination } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.city.trim() && !form.country.trim()) return;
    if (editId) { updateDestination(editId, form); setEditId(null); }
    else addDestination(form);
    setForm(BLANK); setOpen(false);
  };

  const startEdit = (item) => {
    setForm({ country: item.country, city: item.city, emoji: item.emoji || '🌍', note: item.note || '', visited: item.visited || false });
    setEditId(item.id); setOpen(true);
  };

  const visited = destinations.filter(d => d.visited);
  const wishlist = destinations.filter(d => !d.visited);

  return (
    <div>
      <SectionHeader emoji="🌍" title="Dream Destinations" subtitle="Places we want to explore together" color="#38bdf8" />
      <AddButton onClick={() => { setEditId(null); setForm(BLANK); setOpen(true); }} label="Add Place" color="#0ea5e9" />

      {destinations.length === 0 ? <Empty emoji="✈️" text="Add your dream travel destinations!" /> : (
        <div className="space-y-5">
          {wishlist.length > 0 && (
            <div>
              <p className="text-white/35 font-mono text-xs tracking-widest mb-3">WISHLIST ✨ ({wishlist.length})</p>
              <div className="space-y-3">
                <AnimatePresence>
                  {wishlist.map((item) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      layout transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                    >
                      <GCard className="p-4">
                        <div className="flex items-center gap-3">
                          <motion.span className="text-3xl shrink-0"
                            animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                            {item.emoji}
                          </motion.span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-white">
                              {item.city}{item.city && item.country ? ', ' : ''}{item.country}
                            </p>
                            {item.note && <p className="text-white/40 text-xs mt-0.5 italic">"{item.note}"</p>}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <motion.button onClick={() => updateDestination(item.id, { visited: true })}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-semibold"
                              style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}
                              whileHover={{ scale: 1.05, background: 'rgba(74,222,128,0.2)' }} whileTap={{ scale: 0.95 }}
                            >
                              <CheckCircle2 size={11} /> Visited!
                            </motion.button>
                            <motion.button onClick={() => startEdit(item)}
                              className="px-2 py-1 rounded-lg text-xs font-mono"
                              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                              whileHover={{ background: 'rgba(255,255,255,0.14)' }}>Edit</motion.button>
                            <DeleteBtn onClick={() => removeDestination(item.id)} />
                          </div>
                        </div>
                      </GCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {visited.length > 0 && (
            <div>
              <p className="text-white/35 font-mono text-xs tracking-widest mb-3">BEEN THERE 🗺️ ({visited.length})</p>
              <div className="space-y-3">
                {visited.map((item) => (
                  <GCard key={item.id} className="p-4 opacity-75">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display font-bold text-white/80">
                          {item.city}{item.city && item.country ? ', ' : ''}{item.country}
                        </p>
                        <span className="text-xs text-green-400 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 size={11} /> Visited ✓
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <motion.button onClick={() => updateDestination(item.id, { visited: false })}
                          className="px-2 py-1 rounded-lg text-xs font-mono"
                          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                          whileHover={{ background: 'rgba(255,255,255,0.14)' }}>Unmark</motion.button>
                        <DeleteBtn onClick={() => removeDestination(item.id)} />
                      </div>
                    </div>
                  </GCard>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit Place ✏️' : 'Add Destination 🌍'}>
        <Field label="EMOJI" value={form.emoji} onChange={f('emoji')} placeholder="🌍" />
        <Field label="CITY" value={form.city} onChange={f('city')} placeholder="Paris, Tokyo, Manali..." />
        <Field label="COUNTRY" value={form.country} onChange={f('country')} placeholder="France, Japan, India..." />
        <Field label="WHY THIS PLACE?" value={form.note} onChange={f('note')} placeholder="We want to see the cherry blossoms together..." as="textarea" rows={2} />
        <SaveBtn onClick={submit} label={editId ? '✓ Save Changes' : '+ Add Place'} color="#0ea5e9" />
      </Modal>
    </div>
  );
}
