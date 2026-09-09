export default function Pagination({ page, count, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  if (totalPages <= 1) return null

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-slate">
        Page {page} of {totalPages} ({count} total)
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-sm border border-slate-200 px-3 py-1.5 font-medium text-graphite hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-sm border border-slate-200 px-3 py-1.5 font-medium text-graphite hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
