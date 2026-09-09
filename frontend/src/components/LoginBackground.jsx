const rows = [
  { text: 'SYS_STATUS: ONLINE   //   UPTIME: 99.98%   //   SECURE_ACCESS   //   ARX_INFOTECH   //   ', duration: 34, size: 'text-sm', opacity: 'opacity-[0.07]' },
  { text: 'AUTH_SERVICE: READY   //   ENCRYPTION: AES-256   //   SESSION: PROTECTED   //   ', duration: 46, size: 'text-lg', opacity: 'opacity-[0.06]', reverse: true },
  { text: 'ARX_INFOTECH   //   MODERN TECH, BUILT TO SCALE   //   IT SERVICES   //   CLOUD   //   ', duration: 26, size: 'text-2xl', opacity: 'opacity-[0.05]' },
  { text: 'FIREWALL: ACTIVE   //   BACKUP: SCHEDULED   //   MONITORING: 24/7   //   ', duration: 40, size: 'text-sm', opacity: 'opacity-[0.07]', reverse: true },
  { text: 'ADMIN CONSOLE   //   ARX_INFOTECH   //   ACCESS SECURE SYSTEMS   //   ', duration: 30, size: 'text-lg', opacity: 'opacity-[0.06]' },
]

export default function LoginBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
