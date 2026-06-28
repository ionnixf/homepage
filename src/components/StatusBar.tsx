import { useStore } from '../lib/store'
import ThemeToggle from './ThemeToggle'
import { Settings } from 'lucide-react'

interface StatusBarProps {
  onOpenSettings: () => void
}

export default function StatusBar({ onOpenSettings }: StatusBarProps) {
  const quickLinks = useStore((s) => s.quickLinks)

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 h-8 bg-status border-t border-line
        flex items-center justify-between px-3 text-xs font-mono text-dim z-50"
    >
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Claude Home</span>
        <span className="hidden sm:inline">v0.1.0</span>
      </div>

      <div className="flex items-center gap-3">
        <span>{quickLinks.length} links</span>
        <ThemeToggle />
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1 hover:text-fg transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={13} />
        </button>
      </div>
    </footer>
  )
}
