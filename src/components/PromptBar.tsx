import { useState, type FormEvent } from 'react'
import { useStore } from '../lib/store'
import { Search, ArrowUpRight } from 'lucide-react'

const SEARCH_URLS: Record<string, string> = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  bing: 'https://www.bing.com/search?q=',
}

export default function PromptBar() {
  const searchEngine = useStore((s) => s.searchEngine)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    const base = SEARCH_URLS[searchEngine]
    window.location.href = base + encodeURIComponent(q)
  }

  return (
    <div
      className={`widget-card relative overflow-hidden transition-all ${
        focused ? 'border-accent/40 shadow-sm shadow-accent/5' : ''
      }`}
    >
      {/* Accent left bar */}
      <div
        className={`absolute top-0 left-0 w-[3px] h-full rounded-l-xl transition-opacity ${
          focused ? 'bg-accent opacity-100' : 'bg-accent/30'
        }`}
      />

      <form onSubmit={handleSubmit} className="flex items-center gap-3 pl-2">
        <Search
          size={18}
          className={`shrink-0 transition-colors ${
            focused ? 'text-accent' : 'text-dim'
          }`}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="ask anything..."
          className="flex-1 bg-transparent text-fg font-mono text-base
            placeholder:text-dim/60 outline-none min-w-0 py-1"
          autoFocus
        />

        <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted/40 shrink-0">
          {searchEngine}
        </span>

        <button
          type="submit"
          disabled={!query.trim()}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg tactile
            bg-accent text-white hover:bg-accent-hover
            disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Search"
        >
          <ArrowUpRight size={16} />
        </button>
      </form>

      {/* Bottom accent line */}
      <div
        className={`mt-3 ml-1 h-[2px] rounded-full transition-all ${
          focused ? 'bg-accent/60' : 'bg-line'
        }`}
        style={{ width: 'calc(100% - 0.5rem)' }}
      />
    </div>
  )
}
