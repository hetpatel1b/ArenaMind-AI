import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WorkspaceState {
  // Settings
  appearance: {
    theme: 'light' | 'dark' | 'system';
    reducedMotion: boolean;
    highContrast: boolean;
  };
  navigation: {
    sidebarCollapsed: boolean;
    activeTab: Record<string, string>; // path -> tabId
  };
  shortcuts: {
    enabled: boolean;
    showOverlay: boolean;
  };
  session: {
    locked: boolean;
    lastActive: number;
  };

  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (path: string, tabId: string) => void;
  toggleShortcuts: (enabled: boolean) => void;
  setShowShortcutOverlay: (show: boolean) => void;
  lockWorkspace: () => void;
  unlockWorkspace: () => void;
  updateLastActive: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      appearance: {
        theme: 'dark',
        reducedMotion: false,
        highContrast: false,
      },
      navigation: {
        sidebarCollapsed: false,
        activeTab: {},
      },
      shortcuts: {
        enabled: true,
        showOverlay: false,
      },
      session: {
        locked: false,
        lastActive: Date.now(),
      },

      setTheme: (theme) => set((state) => ({ appearance: { ...state.appearance, theme } })),
      setReducedMotion: (enabled) =>
        set((state) => ({ appearance: { ...state.appearance, reducedMotion: enabled } })),
      setHighContrast: (enabled) =>
        set((state) => ({ appearance: { ...state.appearance, highContrast: enabled } })),
      toggleSidebar: () =>
        set((state) => ({
          navigation: { ...state.navigation, sidebarCollapsed: !state.navigation.sidebarCollapsed },
        })),
      setActiveTab: (path, tabId) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            activeTab: { ...state.navigation.activeTab, [path]: tabId },
          },
        })),
      toggleShortcuts: (enabled) =>
        set((state) => ({ shortcuts: { ...state.shortcuts, enabled } })),
      setShowShortcutOverlay: (show) =>
        set((state) => ({ shortcuts: { ...state.shortcuts, showOverlay: show } })),
      lockWorkspace: () => set((state) => ({ session: { ...state.session, locked: true } })),
      unlockWorkspace: () =>
        set((state) => ({ session: { ...state.session, locked: false, lastActive: Date.now() } })),
      updateLastActive: () =>
        set((state) => ({ session: { ...state.session, lastActive: Date.now() } })),
    }),
    {
      name: 'arenamind-workspace-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        appearance: state.appearance,
        navigation: state.navigation,
        shortcuts: state.shortcuts,
        // We do NOT persist session.locked to avoid permanently locking if the user clears cookies but keeps localStorage,
        // Actually, it's safer to persist so returning users find it locked.
        session: { locked: state.session.locked, lastActive: state.session.lastActive },
      }),
    }
  )
);
