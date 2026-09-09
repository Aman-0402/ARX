import { useRef, useState } from 'react'

/**
 * Native HTML5 drag-and-drop reordering for a list of items with an `order`
 * field. Reorders the local array on drop, then calls onReordered(newItems)
 * so the caller can persist the new `order` values (only for items whose
 * order actually changed, to avoid needless PATCH calls).
 */
export function useDragReorder(items, onReordered) {
  const dragIndex = useRef(null)
  const [overIndex, setOverIndex] = useState(null)

  function onDragStart(index) {
    return () => {
      dragIndex.current = index
    }
  }

  function onDragOver(index) {
    return (e) => {
      e.preventDefault()
      setOverIndex(index)
    }
  }

  function onDrop(index) {
    return (e) => {
      e.preventDefault()
      setOverIndex(null)
      const from = dragIndex.current
      dragIndex.current = null
      if (from === null || from === index) return

      const next = [...items]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      onReordered(next)
    }
  }

  function onDragEnd() {
    dragIndex.current = null
    setOverIndex(null)
  }

  return { overIndex, onDragStart, onDragOver, onDrop, onDragEnd }
}
