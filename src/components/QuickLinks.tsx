import { useState } from 'react'
import { useStore } from '../lib/store'
import { Globe, Plus, X, Pencil } from 'lucide-react'
import type { QuickLink } from '../types'

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
}

interface LinkFormProps {
  initial?: QuickLink
  onSubmit: (data: { label: string; url: string }) => void
  onCancel: () => void
}

function LinkForm({ initial, onSubmit, onCancel }: LinkFormProps) {
  const [label, setLabel] = useState(initial?.label ?? '')
  const [url, setUrl] = useState(initial?.url ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim() || !url.trim()) return
    onSubmit({ label: label.trim(), url: url.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Link label"
        className="bg-input border border-line rounded px-2.5 py-1.5 text-sm text-fg
          font-mono placeholder:text-dim outline-none focus:ring-1 focus:ring-accent/40"
        autoFocus
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="bg-input border border-line rounded px-2.5 py-1.5 text-sm text-fg
          font-mono placeholder:text-dim outline-none focus:ring-1 focus:ring-accent/40"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-xs font-sans text-muted/60 hover:text-fg
            hover:bg-panel-hover rounded transition-colors cursor-pointer tactile"
        >
          cancel
        </button>
        <button
          type="submit"
          disabled={!label.trim() || !url.trim()}
          className="px-3 py-1 text-xs font-sans text-white bg-accent tactile
            hover:bg-accent-hover rounded disabled:opacity-40 transition-colors cursor-pointer"
        >
          {initial ? 'save' : 'add'}
        </button>
      </div>
    </form>
  )
}

interface LinkCardProps {
  link: QuickLink
  onEdit: (link: QuickLink) => void
  onDelete: (id: string) => void
}

function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <div className="bg-panel-hover border border-line rounded-lg p-3">
        <LinkForm
          initial={link}
          onSubmit={(data) => {
            onEdit({ ...link, ...data })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-line
        bg-panel hover:bg-panel-hover transition-colors no-underline cursor-pointer relative"
    >
      <Globe size={14} className="text-dim/60 group-hover:text-accent shrink-0 transition-colors" />
      <span className="text-sm text-fg truncate flex-1">
        {link.label}
      </span>
      <span className="font-mono text-[10px] text-dim/60 truncate max-w-[90px] hidden sm:block">
        {link.url.replace(/^https?:\/\//, '')}
      </span>

      {/* Edit/delete on hover */}
      <div
        className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.preventDefault()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setEditing(true)
          }}
          className="p-1 rounded text-dim hover:text-accent hover:bg-accent-subtle
            transition-colors cursor-pointer tactile"
          aria-label="Edit link"
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(link.id)
          }}
          className="p-1 rounded text-dim hover:text-error hover:bg-error/10
            transition-colors cursor-pointer tactile"
          aria-label="Delete link"
        >
          <X size={12} />
        </button>
      </div>
    </a>
  )
}

export default function QuickLinks() {
  const quickLinks = useStore((s) => s.quickLinks)
  const addQuickLink = useStore((s) => s.addQuickLink)
  const updateQuickLink = useStore((s) => s.updateQuickLink)
  const removeQuickLink = useStore((s) => s.removeQuickLink)
  const [adding, setAdding] = useState(false)

  return (
    <div className="widget-card relative">
      {/* Accent corner mark */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-accent/30 rounded-l-xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 pl-1">
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-accent/70 flex items-center gap-2">
          <span className="inline-block w-[5px] h-[5px] rounded-full bg-accent/60" />
          Quick Links
        </h2>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-xs font-sans text-muted/60
            hover:text-accent transition-colors cursor-pointer tactile"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="mb-3">
          <LinkForm
            onSubmit={(data) => {
              addQuickLink({ id: generateId(), ...data })
              setAdding(false)
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {/* Links */}
      {quickLinks.length === 0 && !adding && (
        <p className="text-xs font-mono text-dim py-2 pl-1">
          No links yet. Click "add" to create one.
        </p>
      )}

      {quickLinks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
          {quickLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={(updated) => updateQuickLink(link.id, { label: updated.label, url: updated.url })}
              onDelete={removeQuickLink}
            />
          ))}
        </div>
      )}
    </div>
  )
}
