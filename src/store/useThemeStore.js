// ─── Theme Store — Light / Dark with localStorage persistence ─────────────────
import { create } from 'zustand';

const getSaved = () => {
  try { return localStorage.getItem('loveos_theme') || 'dark'; }
  catch { return 'dark'; }
};

export const useThemeStore = create((set) => ({
  theme: getSaved(), // 'dark' | 'light'

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('loveos_theme', next); } catch { /* noop */ }
      return { theme: next };
    }),

  setTheme: (theme) => {
    try { localStorage.setItem('loveos_theme', theme); } catch { /* noop */ }
    return set({ theme });
  },
}));
