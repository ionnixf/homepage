import { useStore } from '../lib/store'
import ThemeToggle from './ThemeToggle'
import { Settings, Layout } from 'lucide-react'

interface StatusBarProps {
  onOpenSettings: () => void
}

export default function StatusBar({ onOpenSettings }: StatusBarProps) {
  const quickLinks = useStore((s) => s.quickLinks)
  const editing = useStore((s) => s.editing)
  const setEditing = useStore((s) => s.setEditing)

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 h-7 bg-status border-t border-line
        flex items-center justify-between px-3 text-[11px] font-sans text-dim/60 z-50"
    >
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline">Dawn</span>
        <span className="hidden sm:inline">v0.3.0</span>
        <span>{quickLinks.length} links</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded tactile transition-colors cursor-pointer font-sans text-[11px] ${
            editing
              ? 'bg-accent/15 text-accent'
              : 'text-dim/60 hover:text-fg hover:bg-panel-hover'
          }`}
          aria-label={editing ? 'Done editing' : 'Edit layout'}
        >
          <Layout size={12} />
          <span>{editing ? 'Done' : 'Edit'}</span>
        </button>

        <ThemeToggle />
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1 hover:text-fg transition-colors cursor-pointer tactile"
          aria-label="Settings"
        >
          <Settings size={12} />
        </button>
      </div>
    </footer>
  )
}
