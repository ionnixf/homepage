import { useEffect, useRef } from 'react'
import { useStore } from '../lib/store'
import { X } from 'lucide-react'
import AccentPicker from './AccentPicker'
import type { WidgetId } from '../types'

const WIDGET_LABELS: Record<WidgetId, string> = {
  greeting: 'Greeting',
  dateTime: 'Date & Time',
  promptBar: 'Search Bar',
  quickLinks: 'Quick Links',
}

const WIDGET_DESCRIPTIONS: Record<WidgetId, string> = {
  greeting: 'Time-of-day greeting with your name',
  dateTime: 'Current date and live clock',
  promptBar: 'Terminal-style search prompt',
  quickLinks: 'Editable bookmark grid',
}

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border transition-all duration-200 tactile ${
        checked
          ? 'bg-accent border-accent'
          : 'bg-panel border-line hover:border-line-strong'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0
          transition-all duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[1px]'
        }`}
      />
    </button>
  )
}

export default function WidgetSettings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const widgets = useStore((s) => s.widgets)
  const toggleWidget = useStore((s) => s.toggleWidget)
  const greetingName = useStore((s) => s.greetingName)
  const setGreetingName = useStore((s) => s.setGreetingName)
  const searchEngine = useStore((s) => s.searchEngine)
  const setSearchEngine = useStore((s) => s.setSearchEngine)
  const showBranding = useStore((s) => s.showBranding)
  const setShowBranding = useStore((s) => s.setShowBranding)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Close on backdrop click
  useEffect(() => {
    if (!isOpen) return
    const el = overlayRef.current
    if (!el) return
    function handler(e: MouseEvent) {
      if (e.target === el) onClose()
    }
    el.addEventListener('mousedown', handler)
    return () => el?.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex items-start justify-center
        pt-6 sm:items-center sm:pt-0
        bg-canvas/80 backdrop-blur-sm"
    >
      <div
        className="bg-panel border border-line rounded-xl w-full max-w-lg mx-4
          shadow-lg flex flex-col max-h-[90dvh]"
      >
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
          <h2 className="font-sans text-sm font-medium text-fg">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-dim hover:text-fg hover:bg-panel-hover
              transition-all cursor-pointer tactile"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-line/50">
          {/* Widgets */}
          <section className="px-6 py-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
              Widgets
            </h3>
            <p className="font-sans text-xs text-dim mb-4">
              Show or hide each widget on the page
            </p>
            <div className="space-y-1">
              {widgets.map((w) => (
                <label
                  key={w.id}
                  className="flex items-center justify-between py-2.5 px-3
                    rounded-lg hover:bg-panel-hover transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-fg font-medium">{WIDGET_LABELS[w.id]}</p>
                    <p className="text-xs text-muted">{WIDGET_DESCRIPTIONS[w.id]}</p>
                  </div>
                  <Toggle
                    checked={w.visible}
                    onChange={() => toggleWidget(w.id)}
                    id={`widget-${w.id}`}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Greeting */}
          <section className="px-6 py-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
              Greeting
            </h3>
            <p className="font-sans text-xs text-dim mb-3">
              Personalise the time-of-day message
            </p>
            <input
              type="text"
              value={greetingName}
              onChange={(e) => setGreetingName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-input border border-line rounded-lg px-4 py-2.5
                text-sm text-fg font-sans placeholder:text-dim/50 outline-none
                transition-all duration-200
                focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
            />
          </section>

          {/* Appearance */}
          <section className="px-6 py-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
              Appearance
            </h3>
            <p className="font-sans text-xs text-dim mb-3">
              Control what shows on your start page
            </p>
            <label
              className="flex items-center justify-between py-2.5 px-3
                rounded-lg hover:bg-panel-hover transition-colors cursor-pointer"
            >
              <div>
                <p className="text-sm text-fg font-medium">Show "Dawn" branding</p>
                <p className="text-xs text-muted">Subtitle under the greeting</p>
              </div>
              <Toggle
                checked={showBranding}
                onChange={() => setShowBranding(!showBranding)}
                id="branding-toggle"
              />
            </label>
          </section>

          {/* Accent Color */}
          <section className="px-6 py-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
              Accent Color
            </h3>
            <p className="font-sans text-xs text-dim mb-4">
              Choose a preset or pick your own colour
            </p>
            <AccentPicker />
          </section>

          {/* Search Engine */}
          <section className="px-6 py-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">
              Search Engine
            </h3>
            <p className="font-sans text-xs text-dim mb-3">
              Which search engine to use in the prompt bar
            </p>
            <div className="flex gap-2">
              {(['google', 'duckduckgo', 'bing'] as const).map((engine) => (
                <button
                  key={engine}
                  type="button"
                  onClick={() => setSearchEngine(engine)}
                  className={`flex-1 px-4 py-2 rounded-lg text-xs font-sans tactile
                    transition-all duration-200 cursor-pointer ${
                      searchEngine === engine
                        ? 'bg-accent text-white shadow-sm shadow-accent/20'
                        : 'bg-input text-muted hover:text-fg hover:bg-panel-hover border border-line hover:border-line-strong'
                    }`}
                >
                  {engine === 'google' ? 'Google' : engine === 'duckduckgo' ? 'DuckDuckGo' : 'Bing'}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="border-t border-line/50 px-6 py-3 shrink-0">
          <p className="font-sans text-[10px] text-dim text-center">
            All settings saved locally in your browser
          </p>
        </div>
      </div>
    </div>
  )
}
