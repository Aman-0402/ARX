export default function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-graphite">
        {label}
        {required && <span className="text-amber-dim"> *</span>}
      </span>
      {children}
    </label>
  )
}
