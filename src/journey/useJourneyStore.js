// ─── Journey Store — Zustand-based local state + localStorage persistence ───
import { create } from 'zustand';

const LS = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* silent */ }
};

export const useJourneyStore = create((set, get) => ({
  // ── active tab ─────────────────────────────────────────────────────────────
  activeTab: 'home',
  setTab: (tab) => set({ activeTab: tab }),

  // ── foods ──────────────────────────────────────────────────────────────────
  foods: LS('lj_foods', []),
  addFood: (item) => {
    const foods = [{ ...item, id: Date.now(), hearts: 0 }, ...get().foods];
    set({ foods }); save('lj_foods', foods);
  },
  updateFood: (id, patch) => {
    const foods = get().foods.map(f => f.id === id ? { ...f, ...patch } : f);
    set({ foods }); save('lj_foods', foods);
  },
  removeFood: (id) => {
    const foods = get().foods.filter(f => f.id !== id);
    set({ foods }); save('lj_foods', foods);
  },
  heartFood: (id) => {
    const foods = get().foods.map(f => f.id === id ? { ...f, hearts: (f.hearts || 0) + 1 } : f);
    set({ foods }); save('lj_foods', foods);
  },

  // ── movies ─────────────────────────────────────────────────────────────────
  movies: LS('lj_movies', []),
  addMovie: (item) => {
    const movies = [{ ...item, id: Date.now(), watched: false }, ...get().movies];
    set({ movies }); save('lj_movies', movies);
  },
  updateMovie: (id, patch) => {
    const movies = get().movies.map(m => m.id === id ? { ...m, ...patch } : m);
    set({ movies }); save('lj_movies', movies);
  },
  removeMovie: (id) => {
    const movies = get().movies.filter(m => m.id !== id);
    set({ movies }); save('lj_movies', movies);
  },

  // ── songs ──────────────────────────────────────────────────────────────────
  songs: LS('lj_songs', []),
  addSong: (item) => {
    const songs = [{ ...item, id: Date.now() }, ...get().songs];
    set({ songs }); save('lj_songs', songs);
  },
  updateSong: (id, patch) => {
    const songs = get().songs.map(s => s.id === id ? { ...s, ...patch } : s);
    set({ songs }); save('lj_songs', songs);
  },
  removeSong: (id) => {
    const songs = get().songs.filter(s => s.id !== id);
    set({ songs }); save('lj_songs', songs);
  },

  // ── memories (gallery) ────────────────────────────────────────────────────
  memories: LS('lj_memories', []),
  addMemory: (item) => {
    const memories = [{ ...item, id: Date.now(), hearts: 0 }, ...get().memories];
    set({ memories }); save('lj_memories', memories);
  },
  removeMemory: (id) => {
    const memories = get().memories.filter(m => m.id !== id);
    set({ memories }); save('lj_memories', memories);
  },
  heartMemory: (id) => {
    const memories = get().memories.map(m => m.id === id ? { ...m, hearts: (m.hearts || 0) + 1 } : m);
    set({ memories }); save('lj_memories', memories);
  },

  // ── love letters ──────────────────────────────────────────────────────────
  letters: LS('lj_letters', []),
  addLetter: (item) => {
    const letters = [{ ...item, id: Date.now(), locked: false, opened: false }, ...get().letters];
    set({ letters }); save('lj_letters', letters);
  },
  updateLetter: (id, patch) => {
    const letters = get().letters.map(l => l.id === id ? { ...l, ...patch } : l);
    set({ letters }); save('lj_letters', letters);
  },
  removeLetter: (id) => {
    const letters = get().letters.filter(l => l.id !== id);
    set({ letters }); save('lj_letters', letters);
  },

  // ── destinations ──────────────────────────────────────────────────────────
  destinations: LS('lj_destinations', []),
  addDestination: (item) => {
    const destinations = [{ ...item, id: Date.now(), visited: false }, ...get().destinations];
    set({ destinations }); save('lj_destinations', destinations);
  },
  updateDestination: (id, patch) => {
    const destinations = get().destinations.map(d => d.id === id ? { ...d, ...patch } : d);
    set({ destinations }); save('lj_destinations', destinations);
  },
  removeDestination: (id) => {
    const destinations = get().destinations.filter(d => d.id !== id);
    set({ destinations }); save('lj_destinations', destinations);
  },

  // ── bucket list ───────────────────────────────────────────────────────────
  bucketItems: LS('lj_bucket', []),
  addBucketItem: (item) => {
    const bucketItems = [{ ...item, id: Date.now(), done: false }, ...get().bucketItems];
    set({ bucketItems }); save('lj_bucket', bucketItems);
  },
  toggleBucketItem: (id) => {
    const bucketItems = get().bucketItems.map(b => b.id === id ? { ...b, done: !b.done } : b);
    set({ bucketItems }); save('lj_bucket', bucketItems);
  },
  removeBucketItem: (id) => {
    const bucketItems = get().bucketItems.filter(b => b.id !== id);
    set({ bucketItems }); save('lj_bucket', bucketItems);
  },

  // ── important dates ───────────────────────────────────────────────────────
  dates: LS('lj_dates', [
    { id: 1, label: 'Anniversary', emoji: '💍', date: '', note: '' },
    { id: 2, label: 'First Chat',  emoji: '💬', date: '', note: '' },
    { id: 3, label: 'First Call',  emoji: '📞', date: '', note: '' },
    { id: 4, label: 'First Meet',  emoji: '🤝', date: '', note: '' },
  ]),
  updateDate: (id, patch) => {
    const dates = get().dates.map(d => d.id === id ? { ...d, ...patch } : d);
    set({ dates }); save('lj_dates', dates);
  },
  addDate: (item) => {
    const dates = [...get().dates, { ...item, id: Date.now() }];
    set({ dates }); save('lj_dates', dates);
  },

  // ── daily journal ─────────────────────────────────────────────────────────
  journals: LS('lj_journals', []),
  addJournal: (item) => {
    const journals = [{ ...item, id: Date.now(), date: new Date().toISOString() }, ...get().journals];
    set({ journals }); save('lj_journals', journals);
  },
  removeJournal: (id) => {
    const journals = get().journals.filter(j => j.id !== id);
    set({ journals }); save('lj_journals', journals);
  },
}));
