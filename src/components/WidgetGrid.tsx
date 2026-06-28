import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useStore } from '../lib/store'
import Greeting from './Greeting'
import DateTime from './DateTime'
import PromptBar from './PromptBar'
import QuickLinks from './QuickLinks'
import type { WidgetId } from '../types'

const WIDGET_MAP: Record<WidgetId, React.ReactNode> = {
  greeting: <Greeting />,
  dateTime: <DateTime />,
  promptBar: <PromptBar />,
  quickLinks: <QuickLinks />,
}

const WIDGET_CLASSES: Record<WidgetId, string> = {
  greeting: 'w-full',
  dateTime: 'w-full',
  promptBar: 'w-full',
  quickLinks: 'w-full',
}

interface SortableWidgetProps {
  id: WidgetId
  isDragging?: boolean
  index: number
}

function SortableWidget({ id, isDragging, index }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
    animationDelay: `${index * 0.08}s`,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group widget-enter ${WIDGET_CLASSES[id]} w-full ${
        isDragging ? 'z-50' : ''
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 opacity-0
          group-hover:opacity-100 transition-opacity text-dim hover:text-accent
          cursor-grab active:cursor-grabbing z-10 tactile"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      {WIDGET_MAP[id]}
    </div>
  )
}

export default function WidgetGrid() {
  const widgets = useStore((s) => s.widgets)
  const reorderWidgets = useStore((s) => s.reorderWidgets)
  const [activeId, setActiveId] = useState<WidgetId | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const visibleWidgets = widgets.filter((w) => w.visible)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as WidgetId)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    // Reorder only the visible widgets while preserving hidden widget positions
    const visibleIds = visibleWidgets.map((w) => w.id)
    const oldIndex = visibleIds.indexOf(active.id as WidgetId)
    const newIndex = visibleIds.indexOf(over.id as WidgetId)

    if (oldIndex === newIndex) return

    const newVisibleIds = arrayMove(visibleIds, oldIndex, newIndex)

    // Merge: keep hidden widgets in their current positions, replace visible ones
    const allIds = widgets.map((w) => w.id)
    const hiddenIds = allIds.filter((id) => !visibleIds.includes(id))
    const merged: WidgetId[] = []
    let vi = 0
    for (const id of allIds) {
      if (hiddenIds.includes(id)) {
        merged.push(id)
      } else {
        merged.push(newVisibleIds[vi])
        vi++
      }
    }

    reorderWidgets(merged)
  }

  if (visibleWidgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center select-none">
        <p className="font-sans text-sm text-muted/60">
          All widgets are hidden
        </p>
        <p className="font-sans text-xs text-dim/50 mt-2">
          Open settings to show some widgets
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleWidgets.map((w) => w.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col items-center gap-3 w-full">
          {visibleWidgets.map((w, i) => (
            <SortableWidget key={w.id} id={w.id} isDragging={w.id === activeId} index={i} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div className={`${WIDGET_CLASSES[activeId]} w-full opacity-80`}>
            {WIDGET_MAP[activeId]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
