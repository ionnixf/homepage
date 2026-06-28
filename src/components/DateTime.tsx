import { useState, useEffect } from 'react'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default function DateTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="widget-card relative overflow-hidden text-center px-8 py-8">
      {/* Accent corner mark */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-accent/40 rounded-l-xl" />

      <p className="font-sans text-xs text-muted uppercase tracking-[0.2em]">
        {formatDate(now)}
      </p>
      <p
        className="mt-2 text-fg tabular-nums antialiased"
        style={{
          fontFamily: '"DM Mono", "JetBrains Mono", ui-monospace, monospace',
          fontSize: 'clamp(2.25rem, 7vw, 3.75rem)',
          lineHeight: 1,
          fontWeight: 500,
          letterSpacing: '-0.04em',
        }}
      >
        {formatTime(now)}
      </p>
    </div>
  )
}
