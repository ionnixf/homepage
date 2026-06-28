export type WidgetId = 'promptBar' | 'quickLinks' | 'dateTime' | 'greeting'

export interface WidgetConfig {
  id: WidgetId
  visible: boolean
}

export interface QuickLink {
  id: string
  label: string
  url: string
}

export interface AppState {
  theme: 'dark' | 'light'
  widgets: WidgetConfig[]
  quickLinks: QuickLink[]
  greetingName: string
  searchEngine: 'google' | 'duckduckgo' | 'bing'
  showBranding: boolean
  setTheme: (theme: 'dark' | 'light') => void
  toggleTheme: () => void
  toggleWidget: (id: WidgetId) => void
  reorderWidgets: (ids: WidgetId[]) => void
  addQuickLink: (link: QuickLink) => void
  updateQuickLink: (id: string, data: Partial<Pick<QuickLink, 'label' | 'url'>>) => void
  removeQuickLink: (id: string) => void
  setGreetingName: (name: string) => void
  setSearchEngine: (engine: AppState['searchEngine']) => void
  setShowBranding: (show: boolean) => void
}
