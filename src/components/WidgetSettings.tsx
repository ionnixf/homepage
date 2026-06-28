import { useEffect, useRef } from 'react'
import { useStore } from '../lib/store'
import { X } from 'lucide-react'
import type { WidgetId } from '../types'

const WIDGET_LABELS: Record<WidgetId, string> = {
  greeting: 'Greeting',
  dateTime: 'Date & Time',
  promptBar: 'Search Bar',
  quickLinks: 'Quick Links',
}

const WIDGET_DESCRIPTIONS: Record<WidgetId, string> = {
  greeting: 'Personalised time-of-day greeting',
  dateTime: 'Current date and time display',
  promptBar: 'Terminal-style search prompt',
  quickLinks: 'Editable bookmark grid',
}

interface WidgetSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function WidgetSettings({ isOpen, onClose }: WidgetSettingsProps) {
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
      className="fixed inset-0 z-40 flex items-center justify-center
        bg-canvas/80 backdrop-blur-sm"
    >
      <div
        className="bg-panel border border-line rounded-xl w-full max-w-md mx-4
          shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-mono text-sm uppercase tracking-widest text-fg">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-dim hover:text-fg hover:bg-panel-hover
              transition-colors cursor-pointer tactile"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Widget toggles */}
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
              Widgets
            </h3>
            <div className="space-y-2">
              {widgets.map((w) => (
                <label
                  key={w.id}
                  className="flex items-center justify-between py-2 px-3
                    rounded-md hover:bg-panel-hover transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm text-fg font-medium">
                      {WIDGET_LABELS[w.id]}
                    </p>
                    <p className="text-xs text-muted font-mono">
                      {WIDGET_DESCRIPTIONS[w.id]}
                    </p>
                  </div>
                  <div
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      w.visible ? 'bg-accent' : 'bg-line'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full
                        bg-white transition-transform ${
                          w.visible ? 'translate-x-4' : 'translate-x-0'
                        }`}
                    />
                    <input
                      type="checkbox"
                      checked={w.visible}
                      onChange={() => toggleWidget(w.id)}
                      className="sr-only"
                    />
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Greeting name */}
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              Greeting Name
            </h3>
            <input
              type="text"
              value={greetingName}
              onChange={(e) => setGreetingName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-input border border-line rounded px-3 py-2
                text-sm text-fg font-mono placeholder:text-dim outline-none
                focus:ring-1 focus:ring-accent/40"
            />
          </section>

          {/* Appearance */}
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              Appearance
            </h3>
            <label
              className="flex items-center justify-between py-2 px-3
                rounded-md hover:bg-panel-hover transition-colors cursor-pointer"
            >
              <div>
                <p className="text-sm text-fg font-medium">Show "Claude Home" branding</p>
                <p className="text-xs text-muted font-mono">Subtitle under the greeting</p>
              </div>
              <div
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  showBranding ? 'bg-accent' : 'bg-line'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full
                    bg-white transition-transform ${
                      showBranding ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
                <input
                  type="checkbox"
                  checked={showBranding}
                  onChange={() => setShowBranding(!showBranding)}
                  className="sr-only"
                />
              </div>
            </label>
          </section>

          {/* Search engine */}
          <section>
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
              Search Engine
            </h3>
            <div className="flex gap-2">
              {(['google', 'duckduckgo', 'bing'] as const).map((engine) => (
                <button
                  key={engine}
                  type="button"
                  onClick={() => setSearchEngine(engine)}
                  className={`flex-1 px-3 py-2 rounded text-xs font-sans tactile
                    transition-colors cursor-pointer ${
                      searchEngine === engine
                        ? 'bg-accent text-white'
                        : 'bg-input text-muted hover:text-fg hover:bg-panel-hover'
                    }`}
                >
                  {engine}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-line px-5 py-3">
          <p className="font-mono text-[10px] text-dim text-center">
            All settings are stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  )
}
