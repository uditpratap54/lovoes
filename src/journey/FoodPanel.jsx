// ─── Food Panel ────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useJourneyStore } from './useJourneyStore';
import { GCard, SectionHeader, AddButton, DeleteBtn, StarRating, HeartBtn, Modal, Field, SaveBtn, Empty } from './JourneyUI';

const SUGGESTIONS = ['🍕 Pizza', '🍜 Ramen', '🍔 Burger', '🥟 Momos', '🍦 Ice Cream', '🍣 Sushi', '🥗 Salad', '🌮 Tacos', '🍩 Donuts', '☕ Coffee'];

const BLANK = { emoji: '🍕', name: '', restaurant: '', why: '', rating: 0 };

export default function FoodPanel() {
  const { foods, addFood, removeFood, updateFood, heartFood } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [random, setRandom] = useState(null);
  const [editId, setEditId] = useState(null);

  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return;
    if (editId) { updateFood(editId, form); setEditId(null); }
    else addFood(form);
    setForm(BLANK); setOpen(false);
  };

  const startEdit = (item) => {
    setForm({ emoji: item.emoji, name: item.name, restaurant: item.restaurant || '', why: item.why || '', rating: item.rating || 0 });
    setEditId(item.id); setOpen(true);
  };

  const pickRandom = () => {
    if (foods.length === 0) return;
    setRandom(foods[Math.floor(Math.random() * foods.length)]);
    setTimeout(() => setRandom(null), 3000);
  };

  return (
    <div>
      <SectionHeader emoji="🍕" title="Our Favourite Foods ❤️" subtitle="Everything we love to eat together" color="#f97316" />

      <div className="flex items-center gap-3 mb-5">
        <AddButton onClick={() => { setEditId(null); setForm(BLANK); setOpen(true); }} label="Add Food" color="#f97316" />
        {foods.length > 0 && (
          <motion.button onClick={pickRandom}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', color: '#fb923c' }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            <Shuffle size={14} /> Random Pick
          </motion.button>
        )}
      </div>

      {/* Random food popup */}
      <AnimatePresence>
        {random && (
          <motion.div className="mb-4 p-4 rounded-2xl text-center"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          >
            <p className="text-white/40 text-xs font-mono mb-1">TONIGHT WE EAT</p>
            <p className="text-2xl font-black text-white">{random.emoji} {random.name}</p>
            {random.restaurant && <p className="text-orange-300/70 text-xs mt-1">📍 {random.restaurant}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {SUGGESTIONS.map((s, i) => (
          <motion.span key={i} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#fb923c' }}
            whileHover={{ scale: 1.05, background: 'rgba(249,115,22,0.2)' }}
            onClick={() => { setForm(p => ({ ...p, emoji: s.split(' ')[0], name: s.split(' ').slice(1).join(' ') })); setEditId(null); setOpen(true); }}
          >{s}</motion.span>
        ))}
      </div>

      {/* Food grid */}
      {foods.length === 0 ? <Empty emoji="🍕" text="Add your favourite foods!" /> : (
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {foods.map((item) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                layout transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              >
                <GCard className="p-4">
                  <div className="flex items-start gap-3">
                    <motion.span className="text-3xl shrink-0"
                      animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}>
                      {item.emoji}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-white text-base">{item.name}</p>
                      {item.restaurant && <p className="text-white/40 text-xs mt-0.5">📍 {item.restaurant}</p>}
                      {item.why && <p className="text-white/55 text-xs mt-1 italic">"{item.why}"</p>}
                      <div className="mt-2"><StarRating value={item.rating} onChange={(v) => updateFood(item.id, { rating: v })} color="#f97316" /></div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex gap-1.5">
                        <motion.button onClick={() => startEdit(item)}
                          className="px-2 py-1 rounded-lg text-xs font-mono"
                          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                          whileHover={{ background: 'rgba(255,255,255,0.14)' }}>Edit</motion.button>
                        <DeleteBtn onClick={() => removeFood(item.id)} />
                      </div>
                      <HeartBtn count={item.hearts} onClick={() => heartFood(item.id)} />
                    </div>
                  </div>
                </GCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Edit Food ✏️' : 'Add Food 🍕'}>
        <Field label="EMOJI" value={form.emoji} onChange={f('emoji')} placeholder="🍕" />
        <Field label="FOOD NAME" value={form.name} onChange={f('name')} placeholder="Pizza Margherita" />
        <Field label="RESTAURANT (optional)" value={form.restaurant} onChange={f('restaurant')} placeholder="Our favourite place..." />
        <Field label="WHY WE LOVE IT" value={form.why} onChange={f('why')} placeholder="Because it's perfect together..." as="textarea" rows={2} />
        <div className="mb-3">
          <label className="text-white/35 font-mono text-xs mb-1.5 block tracking-wider">RATING</label>
          <StarRating value={form.rating} onChange={f('rating')} color="#f97316" />
        </div>
        <SaveBtn onClick={submit} label={editId ? '✓ Save Changes' : '+ Add Food'} color="#f97316" />
      </Modal>
    </div>
  );
}
