import { useEffect, useState } from 'react'

export default function SearchBox({ onSearch, placeholder = 'Search…' }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const t = setTimeout(() => onSearch(value), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full max-w-xs border border-slate-200 bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
    />
  )
}
