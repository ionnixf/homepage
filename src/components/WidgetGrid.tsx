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
  editing: boolean
}

function SortableWidget({ id, isDragging, index, editing }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortDragging,
  } = useSortable({ id, disabled: !editing })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.3 : 1,
    animationDelay: `${index * 0.08}s`,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative widget-enter ${WIDGET_CLASSES[id]} w-full
        ${isDragging ? 'z-50' : ''}
        ${editing ? 'ring-1 ring-accent/20 rounded-xl' : ''}
        ${isSortDragging ? 'ring-2 ring-accent/40' : ''}
      `}
    >
      {/* Drag handle — only visible in edit mode */}
      {editing ? (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute -left-10 top-1/2 -translate-y-1/2 p-1.5
            text-dim hover:text-accent cursor-grab active:cursor-grabbing
            z-10 tactile"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
      ) : null}

      {WIDGET_MAP[id]}
    </div>
  )
}

export default function WidgetGrid() {
  const widgets = useStore((s) => s.widgets)
  const reorderWidgets = useStore((s) => s.reorderWidgets)
  const editing = useStore((s) => s.editing)
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

    const visibleIds = visibleWidgets.map((w) => w.id)
    const oldIndex = visibleIds.indexOf(active.id as WidgetId)
    const newIndex = visibleIds.indexOf(over.id as WidgetId)

    if (oldIndex === newIndex) return

    const newVisibleIds = arrayMove(visibleIds, oldIndex, newIndex)

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
        <div
          className={`flex flex-col items-center w-full ${
            editing ? 'gap-5' : 'gap-4'
          }`}
        >
          {visibleWidgets.map((w, i) => (
            <SortableWidget
              key={w.id}
              id={w.id}
              isDragging={w.id === activeId}
              index={i}
              editing={editing}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div
            className={`${WIDGET_CLASSES[activeId]} w-full opacity-90
              ring-2 ring-accent/30 rounded-xl shadow-lg shadow-black/10`}
          >
            {WIDGET_MAP[activeId]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
