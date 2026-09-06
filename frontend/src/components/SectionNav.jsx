import { useEffect, useState } from 'react'

export default function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id)

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
    <nav className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="group flex items-center gap-3"
          aria-label={s.label}
          aria-current={active === s.id}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full border-2 border-slate-300 transition-all duration-300 ${
              active === s.id ? 'scale-125 border-amber bg-amber' : 'bg-transparent group-hover:border-slate-500'
            }`}
          />
          <span
            className={`origin-left scale-x-0 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-graphite opacity-0 shadow-md transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100 ${
              active === s.id ? 'text-amber-dim' : ''
            }`}
          >
            {s.label}
          </span>
        </button>
      ))}
    </nav>
  )
}
