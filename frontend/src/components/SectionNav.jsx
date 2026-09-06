import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id)
  const activeIndex = Math.max(sections.findIndex((s) => s.id === active), 0)

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-full border border-slate-200 bg-white p-2 shadow-lg 2xl:flex"
    >
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-2 w-0.5 -translate-x-1/2 rounded-full bg-amber/30"
        initial={false}
        animate={{ height: activeIndex * 36 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      />
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="group relative flex h-9 w-9 items-center justify-center"
          aria-label={s.label}
          aria-current={active === s.id}
        >
          <span
            className={`relative h-3 w-3 rounded-full border-2 transition-all duration-300 ${
              active === s.id
                ? 'scale-125 border-amber bg-amber shadow-sm shadow-amber/50'
                : 'border-slate-300 bg-white group-hover:border-slate-500'
            }`}
          />
          <span
            className={`pointer-events-none absolute left-full ml-3 origin-left scale-x-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-graphite opacity-0 shadow-md transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100 ${
              active === s.id ? 'text-amber-dim' : ''
            }`}
          >
            {s.label}
          </span>
        </button>
      ))}
    </motion.nav>
  )
}
