import { useEffect, useRef, useState } from 'react'

/**
 * Tracks a boolean "active" state that a click can force on for a fixed
 * duration — for hover-reveal cards on touch devices (or anyone who wants
 * to click-and-hold a hover state instead of hovering with a mouse).
 */
export function useHoldActive(durationMs = 10000) {
  const [active, setActive] = useState(false)
  const timeoutRef = useRef(null)

  function trigger() {
    setActive(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setActive(false), durationMs)
  }

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  return { active, trigger }
}
