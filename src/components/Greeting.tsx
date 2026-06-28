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
    <div className="text-center select-none py-2">
      <h1 className="font-sans text-3xl font-semibold tracking-tight text-fg">
        {greeting}
        {name ? (
          <>
            , <span className="text-accent">{name}</span>
          </>
        ) : null}
      </h1>
      {showBranding ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent/70 mt-2">
          Claude Home
        </p>
      ) : null}
    </div>
  )
}
