import { create } from 'zustand';

const SCREENS = [
  'boot',
  'login',
  'fingerprint',
  'analysis',
  'medical',
  'memories',
  'gift',
  'letter',
  'proposal',
  'accept',
  'reject',
];

export const useAppStore = create((set, get) => ({
  currentScreen: 'boot',
  screenHistory: ['boot'],
  musicPlaying: false,
  darkMode: true,
  secretBuffer: '',
  activeSecrets: [],

  goTo: (screen) =>
    set((state) => ({
      currentScreen: screen,
      screenHistory: [...state.screenHistory, screen],
    })),

  goNext: () => {
    const { currentScreen } = get();
    const idx = SCREENS.indexOf(currentScreen);
    if (idx < SCREENS.length - 1) {
      const next = SCREENS[idx + 1];
      set((state) => ({
        currentScreen: next,
        screenHistory: [...state.screenHistory, next],
      }));
    }
  },

  toggleMusic: () => set((state) => ({ musicPlaying: !state.musicPlaying })),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  appendSecretBuffer: (char) =>
    set((state) => {
      const newBuffer = (state.secretBuffer + char).slice(-10).toUpperCase();
      const newSecrets = [...state.activeSecrets];

      if (newBuffer.endsWith('LOVE') && !newSecrets.includes('love')) {
        newSecrets.push('love');
        setTimeout(() => {
          useAppStore.getState().removeSecret('love');
        }, 5000);
      }
      if (newBuffer.endsWith('SHEETAL') && !newSecrets.includes('sheetal')) {
        newSecrets.push('sheetal');
        setTimeout(() => {
          useAppStore.getState().removeSecret('sheetal');
        }, 5000);
      }
      if (newBuffer.endsWith('NURSE') && !newSecrets.includes('nurse')) {
        newSecrets.push('nurse');
        setTimeout(() => {
          useAppStore.getState().removeSecret('nurse');
        }, 5000);
      }

      return { secretBuffer: newBuffer, activeSecrets: newSecrets };
    }),

  removeSecret: (secret) =>
    set((state) => ({
      activeSecrets: state.activeSecrets.filter((s) => s !== secret),
    })),
}));
