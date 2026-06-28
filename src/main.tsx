import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useStore } from './lib/store'
import './styles/index.css'
import App from './App'

// Prevent flash of wrong theme: apply before React renders
const stored = localStorage.getItem('claude-home-config')
if (stored) {
  try {
    const { theme } = JSON.parse(stored)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  } catch { /* ignore */ }
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', prefersDark)
  document.documentElement.classList.toggle('light', !prefersDark)
}

function Root() {
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle('dark', theme === 'dark')
    el.classList.toggle('light', theme === 'light')
  }, [theme])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
