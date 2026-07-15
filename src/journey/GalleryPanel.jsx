// ─── Memory Gallery Panel ──────────────────────────────────────────────────────
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Maximize2, ZoomIn } from 'lucide-react';
import { useJourneyStore } from './useJourneyStore';
import { SectionHeader, AddButton, DeleteBtn, HeartBtn, Modal, Field, SaveBtn, Empty } from './JourneyUI';

export default function GalleryPanel() {
  const { memories, addMemory, removeMemory, heartMemory } = useJourneyStore();
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [form, setForm] = useState({ caption: '', dataUrl: '', type: 'image' });
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, dataUrl: ev.target.result, type: file.type.startsWith('video') ? 'video' : 'image' }));
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!form.dataUrl && !form.caption.trim()) return;
    addMemory({ ...form });
    setForm({ caption: '', dataUrl: '', type: 'image' });
    setOpen(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <SectionHeader emoji="📷" title="Memory Gallery" subtitle="Every moment captured with love" color="#f9a8d4" />
      <AddButton onClick={() => setOpen(true)} label="Upload Memory" color="#ec4899" />

      {memories.length === 0 ? <Empty emoji="📷" text="Upload your favourite memories together!" /> : (
        <div className="columns-2 gap-3 space-y-3">
          <AnimatePresence>
            {memories.map((item) => (
              <motion.div key={item.id} className="break-inside-avoid mb-3"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                layout
              >
                <div className="relative group rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  {item.dataUrl ? (
                    item.type === 'video'
                      ? <video src={item.dataUrl} className="w-full object-cover" style={{ maxHeight: 200 }} muted loop />
                      : <img src={item.dataUrl} alt={item.caption} className="w-full object-cover" style={{ maxHeight: 200 }} loading="lazy" />
                  ) : (
                    <div className="h-24 flex items-center justify-center text-4xl"
                      style={{ background: 'rgba(236,72,153,0.1)' }}>📷</div>
                  )}

                  {/* Hover overlay */}
                  <motion.div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.55)' }}>
                    {item.dataUrl && (
                      <motion.button onClick={() => setLightbox(item)}
                        className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Maximize2 size={16} className="text-white" />
                      </motion.button>
                    )}
                    <DeleteBtn onClick={() => removeMemory(item.id)} />
                  </motion.div>
                </div>

                {(item.caption || item.hearts > 0) && (
                  <div className="flex items-center justify-between px-1 mt-1.5">
                    {item.caption && <p className="text-white/55 text-xs flex-1 truncate">{item.caption}</p>}
                    <HeartBtn count={item.hearts} onClick={() => heartMemory(item.id)} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Memory 📷">
        <div className="mb-3">
          <label className="text-white/35 font-mono text-xs mb-1.5 block tracking-wider">PHOTO OR VIDEO</label>
          <motion.div
            className="w-full h-28 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            style={{ background: 'rgba(236,72,153,0.06)', border: '2px dashed rgba(236,72,153,0.25)' }}
            whileHover={{ background: 'rgba(236,72,153,0.12)', borderColor: 'rgba(236,72,153,0.5)' }}
            onClick={() => fileRef.current?.click()}
          >
            {form.dataUrl
              ? <span className="text-green-400 text-sm font-bold">✓ File selected!</span>
              : <><Upload size={22} className="text-pink-400/60" /><p className="text-white/30 text-xs">Click to upload</p></>
            }
          </motion.div>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </div>
        <Field label="CAPTION (optional)" value={form.caption} onChange={(v) => setForm(p => ({ ...p, caption: v }))} placeholder="This moment when..." />
        <SaveBtn onClick={submit} label="+ Add Memory" color="#ec4899" />
      </Modal>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()} className="relative max-w-lg w-full">
                {lightbox.type === 'video'
                  ? <video src={lightbox.dataUrl} className="w-full rounded-2xl" controls autoPlay />
                  : <img src={lightbox.dataUrl} alt={lightbox.caption} className="w-full rounded-2xl object-contain" style={{ maxHeight: '80vh' }} />
                }
                {lightbox.caption && <p className="text-white/70 text-center text-sm mt-3">{lightbox.caption}</p>}
                <motion.button onClick={() => setLightbox(null)}
                  className="absolute top-3 right-3 p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.6)' }}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <X size={18} className="text-white" />
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
