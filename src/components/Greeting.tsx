import { useState, useEffect } from 'react'
import { useStore } from '../lib/store'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Greeting() {
  const name = useStore((s) => s.greetingName)
  const showBranding = useStore((s) => s.showBranding)
  const [greeting, setGreeting] = useState(getGreeting)

  useEffect(() => {
    const id = setInterval(() => {
      setGreeting(getGreeting())
    }, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center select-none pt-6 pb-1">
      <h1
        className="text-fg font-semibold"
        style={{
          fontFamily: '"Source Serif 4", Georgia, serif',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
        }}
      >
        {greeting}
        {name ? (
          <>
            , <span className="text-accent">{name}</span>
          </>
        ) : null}
      </h1>
      {showBranding ? (
        <p
          className="text-muted/40 mt-3 uppercase select-none"
          style={{
            fontFamily: '"DM Mono", "JetBrains Mono", ui-monospace, monospace',
            fontSize: 'clamp(9px, 1.5vw, 11px)',
            letterSpacing: '0.35em',
          }}
        >
          Claude Home
        </p>
      ) : null}
    </div>
  )
}
