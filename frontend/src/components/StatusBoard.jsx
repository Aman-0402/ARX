import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const rows = [
  { label: 'Infrastructure uptime', value: '99.98%', state: 'ok' },
  { label: 'Support response window', value: '< 15 min', state: 'ok' },
  { label: 'Active client systems', value: '120+', state: 'ok' },
  { label: 'Security posture', value: 'Hardened', state: 'ok' },
]

export default function StatusBoard() {
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 })
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100])

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700 bg-ink-raised font-mono text-paper shadow-2xl shadow-ink/40"
      >
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(47,111,237,0.25), transparent 60%)`
            ),
          }}
          className="pointer-events-none absolute inset-0"
        />

        <div
          style={{ transform: 'translateZ(40px)' }}
          className="relative flex items-center justify-between border-b border-slate-700 px-4 py-3"
        >
          <span className="text-xs tracking-wide text-slate-200/60">system.status</span>
          <span className="flex items-center gap-1.5 text-xs text-amber">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-amber"
            />
            live
          </span>
        </div>
        <dl className="relative">
          {rows.map((row, i) => (
            <div
              key={row.label}
              style={{ transform: `translateZ(${28 - i * 4}px)` }}
              className={`relative flex items-center justify-between px-4 py-3 text-sm ${
                i !== rows.length - 1 ? 'border-b border-slate-700/60' : ''
              }`}
            >
              <dt className="text-slate-200/60">{row.label}</dt>
              <dd className="text-paper">{row.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  )
}
