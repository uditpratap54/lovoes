// ─── Bucket List + Dates + Journal + Stats — combined smaller panels ───────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, Calendar, BookOpen, BarChart3 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useJourneyStore } from './useJourneyStore';
import { GCard, SectionHeader, AddButton, DeleteBtn, Modal, Field, SaveBtn, Empty, CelebrationPop } from './JourneyUI';

// ─── Bucket List ────────────────────────────────────────────────────────────
export function BucketPanel() {
  const { bucketItems, addBucketItem, toggleBucketItem, removeBucketItem } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ text: '', emoji: '🎯' });
  const [celebrate, setCelebrate] = useState(false);

  const submit = () => {
    if (!form.text.trim()) return;
    addBucketItem(form);
    setForm({ text: '', emoji: '🎯' });
    setOpen(false);
  };

  const handleToggle = (item) => {
    if (!item.done) {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 }, colors: ['#4ade80', '#22c55e', '#fbbf24'] });
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2200);
    }
    toggleBucketItem(item.id);
  };

  const done = bucketItems.filter(b => b.done).length;

  return (
    <div>
      <SectionHeader emoji="🎁" title="Bucket List" subtitle="Things we want to do together" color="#4ade80" />
      {bucketItems.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4ade80, #22c55e)' }}
              animate={{ width: `${bucketItems.length ? (done / bucketItems.length) * 100 : 0}%` }}
              transition={{ duration: 0.6 }} />
          </div>
          <span className="text-green-400 font-mono text-xs font-bold">{done}/{bucketItems.length}</span>
        </div>
      )}
      <AddButton onClick={() => setOpen(true)} label="Add Item" color="#22c55e" />
      <CelebrationPop show={celebrate} message="🎉 Completed!" />

      {bucketItems.length === 0 ? <Empty emoji="🎯" text="Add things you want to do together!" /> : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {bucketItems.map((item) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                layout transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              >
                <GCard className="p-3.5">
                  <div className="flex items-center gap-3">
                    <motion.button onClick={() => handleToggle(item)} whileTap={{ scale: 0.85 }}>
                      {item.done
                        ? <CheckSquare size={22} className="text-green-400" fill="rgba(74,222,128,0.2)" />
                        : <Square size={22} className="text-white/30" />
                      }
                    </motion.button>
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <p className={`flex-1 font-display font-semibold text-sm transition-all ${item.done ? 'text-white/30 line-through' : 'text-white'}`}>
                      {item.text}
                    </p>
                    {item.done && <span className="text-xs text-green-400/60 font-mono">✓ Done!</span>}
                    <DeleteBtn onClick={() => removeBucketItem(item.id)} />
                  </div>
                </GCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Bucket List Item 🎯">
        <Field label="EMOJI" value={form.emoji} onChange={(v) => setForm(p => ({ ...p, emoji: v }))} placeholder="🎯" />
        <Field label="WHAT DO YOU WANT TO DO?" value={form.text} onChange={(v) => setForm(p => ({ ...p, text: v }))} placeholder="Watch a sunrise together..." />
        <SaveBtn onClick={submit} label="+ Add to List" color="#22c55e" />
      </Modal>
    </div>
  );
}

// ─── Important Dates ────────────────────────────────────────────────────────
function countdown(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  // Set target to current year if it's past
  const thisYear = new Date(target);
  thisYear.setFullYear(now.getFullYear());
  if (thisYear < now) thisYear.setFullYear(now.getFullYear() + 1);
  const diff = Math.ceil((thisYear - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - target) / (1000 * 60 * 60 * 24));
}

export function DatesPanel() {
  const { dates, updateDate, addDate } = useJourneyStore();
  const [addOpen, setAddOpen] = useState(false);
  const [newDate, setNewDate] = useState({ label: '', emoji: '📅', date: '', note: '' });

  return (
    <div>
      <SectionHeader emoji="📅" title="Important Dates" subtitle="Every moment worth remembering" color="#fbbf24" />
      <AddButton onClick={() => setAddOpen(true)} label="Add Date" color="#f59e0b" />

      <div className="space-y-3">
        {dates.map((item) => {
          const days = daysSince(item.date);
          const cd = countdown(item.date);
          return (
            <GCard key={item.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{item.emoji}</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-white text-sm">{item.label}</p>
                  <input
                    type="date" value={item.date || ''}
                    onChange={(e) => updateDate(item.id, { date: e.target.value })}
                    className="mt-1 text-xs rounded-lg px-2 py-1 outline-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit' }}
                  />
                  {item.date && (
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {days !== null && days >= 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                          {days === 0 ? 'Today! 🎉' : `${days} days ago`}
                        </span>
                      )}
                      {cd !== null && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
                          {cd === 0 ? '🎊 Today!' : `${cd} days until next`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GCard>
          );
        })}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Important Date 📅">
        <Field label="EMOJI" value={newDate.emoji} onChange={(v) => setNewDate(p => ({ ...p, emoji: v }))} placeholder="💍" />
        <Field label="LABEL" value={newDate.label} onChange={(v) => setNewDate(p => ({ ...p, label: v }))} placeholder="First Date, Anniversary..." />
        <Field label="DATE" value={newDate.date} onChange={(v) => setNewDate(p => ({ ...p, date: v }))} type="date" />
        <SaveBtn onClick={() => { if (newDate.label.trim()) { addDate(newDate); setNewDate({ label: '', emoji: '📅', date: '', note: '' }); setAddOpen(false); } }} label="+ Add Date" color="#f59e0b" />
      </Modal>
    </div>
  );
}

// ─── Daily Journal ──────────────────────────────────────────────────────────
const MOODS = [
  { emoji: '😍', label: 'In Love' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '🥹', label: 'Emotional' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '😂', label: 'Laughing' },
  { emoji: '🥰', label: 'Grateful' },
];

export function JournalPanel() {
  const { journals, addJournal, removeJournal } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ mood: '😍', note: '' });

  const submit = () => {
    if (!form.note.trim()) return;
    addJournal(form);
    setForm({ mood: '😍', note: '' });
    setOpen(false);
  };

  return (
    <div>
      <SectionHeader emoji="🌙" title="Daily Journal" subtitle="How we felt today" color="#a78bfa" />
      <AddButton onClick={() => setOpen(true)} label="Add Today's Note" color="#8b5cf6" />

      {journals.length === 0 ? <Empty emoji="🌙" text="Start writing your daily memories!" /> : (
        <div className="space-y-3">
          <AnimatePresence>
            {journals.slice(0, 20).map((item) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                layout
              >
                <GCard className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{item.mood}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm leading-relaxed">{item.note}</p>
                      <p className="text-white/25 font-mono text-xs mt-1.5">
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <DeleteBtn onClick={() => removeJournal(item.id)} />
                  </div>
                </GCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Today's Memory 🌙">
        <div className="mb-3">
          <label className="text-white/35 font-mono text-xs mb-2 block tracking-wider">HOW ARE YOU FEELING?</label>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((m) => (
              <motion.button key={m.emoji} onClick={() => setForm(p => ({ ...p, mood: m.emoji }))}
                className="p-2.5 rounded-xl text-center flex flex-col items-center gap-1"
                style={{ background: form.mood === m.emoji ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${form.mood === m.emoji ? 'rgba(139,92,246,0.4)' : 'transparent'}` }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-xs text-white/40">{m.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <Field label="WHAT HAPPENED TODAY?" value={form.note} onChange={(v) => setForm(p => ({ ...p, note: v }))} placeholder="Today was special because..." as="textarea" rows={4} />
        <SaveBtn onClick={submit} label="✓ Save Memory" color="#8b5cf6" />
      </Modal>
    </div>
  );
}

// ─── Relationship Stats ─────────────────────────────────────────────────────
export function StatsPanel() {
  const { foods, movies, songs, memories, letters, destinations, bucketItems, journals, dates } = useJourneyStore();

  const firstDate = dates.find(d => d.label === 'Anniversary' || d.label === 'First Meet')?.date;
  const daysTogether = firstDate ? daysSince(firstDate) : null;
  const bucketDone = bucketItems.filter(b => b.done).length;
  const moviesWatched = movies.filter(m => m.watched).length;
  const visited = destinations.filter(d => d.visited).length;

  const stats = [
    { label: 'Days Together', value: daysTogether !== null ? `${daysTogether}` : '—', emoji: '💕', color: '#ec4899' },
    { label: 'Letters Written', value: letters.length, emoji: '💌', color: '#f9a8d4' },
    { label: 'Photos Uploaded', value: memories.length, emoji: '📷', color: '#38bdf8' },
    { label: 'Foods Added', value: foods.length, emoji: '🍕', color: '#f97316' },
    { label: 'Movies Watched', value: moviesWatched, emoji: '🎬', color: '#a78bfa' },
    { label: 'Songs Shared', value: songs.length, emoji: '🎵', color: '#8b5cf6' },
    { label: 'Places Planned', value: destinations.length, emoji: '🌍', color: '#22c55e' },
    { label: 'Bucket Done', value: `${bucketDone}/${bucketItems.length || 0}`, emoji: '🎯', color: '#4ade80' },
    { label: 'Journal Entries', value: journals.length, emoji: '🌙', color: '#818cf8' },
  ];

  return (
    <div>
      <SectionHeader emoji="❤️" title="Our Story in Numbers" subtitle="Every little thing we share" color="#ec4899" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 pb-8">
        {stats.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            className="relative group"
          >
            {/* Soft background glow on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
              style={{ background: s.color }} />
              
            {/* The actual premium card */}
            <div className="relative h-full p-5 rounded-3xl backdrop-blur-xl border border-white/10 transition-all duration-300"
              style={{ 
                background: 'rgba(25, 20, 30, 0.4)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
              
              <div className="flex items-center justify-between mb-4">
                {/* Glowing Icon Circle */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${s.color}44, ${s.color}11)`, border: `1px solid ${s.color}66` }}>
                  <motion.div className="text-2xl"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}>
                    {s.emoji}
                  </motion.div>
                </div>
                
                {/* Decorative floating particles on hover */}
                <motion.div className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 text-xs"
                  animate={{ y: [0, -15, 0], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  ✨
                </motion.div>
              </div>

              <div className="mt-2">
                <p className="font-display font-black text-4xl mb-1 tracking-tight" 
                   style={{ color: s.color, textShadow: `0 0 20px ${s.color}66` }}>
                  {s.value}
                </p>
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
