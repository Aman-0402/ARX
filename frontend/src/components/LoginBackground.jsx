import { useMemo } from 'react'
import GradientBlobs from './motion/GradientBlobs.jsx'
import StarField from './motion/StarField.jsx'

const rows = [
  { text: 'SYS_STATUS: ONLINE   //   UPTIME: 99.98%   //   SECURE_ACCESS   //   ARX_INFOTECH   //   ', duration: 34, size: 'text-sm', opacity: 'opacity-[0.07]' },
  { text: 'AUTH_SERVICE: READY   //   ENCRYPTION: AES-256   //   SESSION: PROTECTED   //   ', duration: 46, size: 'text-lg', opacity: 'opacity-[0.06]', reverse: true },
  { text: 'ARX_INFOTECH   //   MODERN TECH, BUILT TO SCALE   //   IT SERVICES   //   CLOUD   //   ', duration: 26, size: 'text-2xl', opacity: 'opacity-[0.05]' },
  { text: 'FIREWALL: ACTIVE   //   BACKUP: SCHEDULED   //   MONITORING: 24/7   //   ', duration: 40, size: 'text-sm', opacity: 'opacity-[0.07]', reverse: true },
  { text: 'ADMIN CONSOLE   //   ARX_INFOTECH   //   ACCESS SECURE SYSTEMS   //   ', duration: 30, size: 'text-lg', opacity: 'opacity-[0.06]' },
]

const particleColors = ['bg-amber', 'bg-coral', 'bg-grape', 'bg-mint']

export default function LoginBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 12,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Moving blueprint grid */}
      <div className="animate-drift absolute inset-0 opacity-[0.35] bg-[radial-gradient(rgba(21,34,56,0.10)_1px,transparent_1px)] bg-[length:26px_26px]" />

      <GradientBlobs variant="blue" />
      <StarField count={70} />

      {/* Radar rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-spin-slow h-[560px] w-[560px] rounded-full border border-dashed border-amber/20" />
        <div className="animate-spin-slow-reverse absolute inset-0 m-auto h-[400px] w-[400px] rounded-full border border-dashed border-grape/20" />
        <div className="animate-spin-slow absolute inset-0 m-auto h-[260px] w-[260px] rounded-full border border-dashed border-coral/20" />
      </div>

      {/* Rising data particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={`animate-rise absolute bottom-0 rounded-full ${p.color} opacity-0`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Scanning beam sweep */}
      <div className="animate-scan absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-transparent via-amber/[0.08] to-transparent" />

      {/* Drifting status text */}
      <div className="absolute inset-0 flex flex-col justify-around">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex w-max whitespace-nowrap font-mono font-medium tracking-widest text-graphite ${row.size} ${row.opacity} ${row.reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
            style={{ animationDuration: `${row.duration}s` }}
          >
            <span className="pr-4">{row.text.repeat(4)}</span>
            <span className="pr-4">{row.text.repeat(4)}</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper" />
    </div>
  )
}
