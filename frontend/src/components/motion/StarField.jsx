import { useMemo } from 'react'

export default function StarField({ count = 70, className = '' }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() < 0.15 ? 3 : Math.random() < 0.5 ? 2 : 1,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    [count],
  )

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute animate-twinkle rounded-full bg-graphite/70"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
