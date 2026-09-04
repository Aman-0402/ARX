const rows = [
  { label: 'Infrastructure uptime', value: '99.98%', state: 'ok' },
  { label: 'Support response window', value: '< 15 min', state: 'ok' },
  { label: 'Active client systems', value: '120+', state: 'ok' },
  { label: 'Security posture', value: 'Hardened', state: 'ok' },
]

export default function StatusBoard() {
  return (
    <div className="w-full max-w-sm border border-slate-700 bg-ink-raised font-mono text-paper">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <span className="text-xs tracking-wide text-slate-200/60">system.status</span>
        <span className="flex items-center gap-1.5 text-xs text-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          live
        </span>
      </div>
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 text-sm ${
              i !== rows.length - 1 ? 'border-b border-slate-700/60' : ''
            }`}
          >
            <dt className="text-slate-200/60">{row.label}</dt>
            <dd className="text-paper">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
