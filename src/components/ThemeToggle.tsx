import { Sun, Moon } from 'lucide-react'
import { useStore } from '../lib/store'

export default function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-dim/60 tactile
        hover:text-fg hover:bg-panel-hover rounded transition-colors cursor-pointer font-sans"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
      <span>{theme === 'dark' ? 'light' : 'dark'}</span>
    </button>
  )
}
