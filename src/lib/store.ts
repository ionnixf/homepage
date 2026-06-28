import { create } from 'zustand'
import type { AppState, QuickLink, WidgetConfig, WidgetId } from '../types'

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'greeting', visible: true },
  { id: 'dateTime', visible: true },
  { id: 'promptBar', visible: true },
  { id: 'quickLinks', visible: true },
]

const DEFAULT_LINKS: QuickLink[] = [
  { id: '1', label: 'GitHub', url: 'https://github.com' },
  { id: '2', label: 'YouTube', url: 'https://youtube.com' },
  { id: '3', label: 'Reddit', url: 'https://reddit.com' },
  { id: '4', label: 'Gmail', url: 'https://mail.google.com' },
]

interface PersistedState {
  theme: 'dark' | 'light'
  widgetOrder: WidgetId[]
  widgetVisibility: Record<WidgetId, boolean>
  quickLinks: QuickLink[]
  greetingName: string
  searchEngine: 'google' | 'duckduckgo' | 'bing'
  showBranding: boolean
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem('claude-home-config')
    if (raw) return JSON.parse(raw) as PersistedState
  } catch { /* ignore */ }
  return {
    theme: 'dark',
    widgetOrder: DEFAULT_WIDGETS.map((w) => w.id),
    widgetVisibility: Object.fromEntries(
      DEFAULT_WIDGETS.map((w) => [w.id, w.visible]),
    ) as Record<WidgetId, boolean>,
    quickLinks: DEFAULT_LINKS,
    greetingName: '',
    searchEngine: 'google',
    showBranding: true,
  }
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem('claude-home-config', JSON.stringify(state))
  } catch { /* ignore */ }
}

const persisted = loadState()

export const useStore = create<AppState>((set, get) => ({
  // ── State ──
  theme: persisted.theme,
  widgets: persisted.widgetOrder.map((id) => ({
    id,
    visible: persisted.widgetVisibility[id] ?? true,
  })),
  quickLinks: persisted.quickLinks,
  greetingName: persisted.greetingName,
  searchEngine: persisted.searchEngine,
  showBranding: persisted.showBranding,

  // ── Theme ──
  setTheme: (theme) => {
    set({ theme })
    const el = document.documentElement
    el.classList.toggle('dark', theme === 'dark')
    el.classList.toggle('light', theme === 'light')
    persist(get())
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },

  // ── Widgets ──
  toggleWidget: (id) => {
    set((s) => ({
      widgets: s.widgets.map((w) =>
        w.id === id ? { ...w, visible: !w.visible } : w
      ),
    }))
    persist(get())
  },

  reorderWidgets: (ids) => {
    set((s) => ({
      widgets: ids.map((id) => s.widgets.find((w) => w.id === id)!).filter(Boolean),
    }))
    persist(get())
  },

  // ── Quick Links ──
  addQuickLink: (link) => {
    set((s) => ({ quickLinks: [...s.quickLinks, link] }))
    persist(get())
  },

  updateQuickLink: (id, data) => {
    set((s) => ({
      quickLinks: s.quickLinks.map((l) =>
        l.id === id ? { ...l, ...data } : l
      ),
    }))
    persist(get())
  },

  removeQuickLink: (id) => {
    set((s) => ({ quickLinks: s.quickLinks.filter((l) => l.id !== id) }))
    persist(get())
  },

  // ── Settings ──
  setGreetingName: (name) => {
    set({ greetingName: name })
    persist(get())
  },

  setSearchEngine: (engine) => {
    set({ searchEngine: engine })
    persist(get())
  },

  setShowBranding: (show) => {
    set({ showBranding: show })
    persist(get())
  },
}))

function persist(state: AppState) {
  saveState({
    theme: state.theme,
    widgetOrder: state.widgets.map((w) => w.id),
    widgetVisibility: Object.fromEntries(
      state.widgets.map((w) => [w.id, w.visible]),
    ) as Record<WidgetId, boolean>,
    quickLinks: state.quickLinks,
    greetingName: state.greetingName,
    searchEngine: state.searchEngine,
    showBranding: state.showBranding,
  })
}
