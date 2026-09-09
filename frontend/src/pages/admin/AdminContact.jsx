import { useEffect, useState } from 'react'
import Pagination from '../../components/admin/Pagination.jsx'
import SearchBox from '../../components/admin/SearchBox.jsx'
import { fetchAdminContacts, setContactHandled, deleteContact } from '../../lib/api.js'
import { confirmDelete } from '../../lib/alerts.js'

const PAGE_SIZE = 5

export default function AdminContact() {
  const [submissions, setSubmissions] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')

  function load() {
    setStatus('loading')
    fetchAdminContacts({ page, search })
      .then((data) => {
        setSubmissions(data.results)
        setCount(data.count)
        setStatus('ready')
      })
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }

  useEffect(load, [page, search])

  function handleSearch(value) {
    setSearch(value)
    setPage(1)
  }

  async function toggleHandled(item) {
    try {
      await setContactHandled(item.id, !item.handled)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!(await confirmDelete())) return
    try {
      await deleteContact(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-graphite">Contact submissions</h1>
        <SearchBox onSearch={handleSearch} placeholder="Search submissions…" />
      </div>

      {error && (
        <p className="mt-4 border border-slate-200 p-4 text-sm text-red-700">{error}</p>
      )}
      {status === 'loading' && <p className="mt-6 text-sm text-slate">Loading…</p>}
      {status === 'ready' && submissions.length === 0 && (
        <p className="mt-6 text-sm text-slate">No submissions found.</p>
      )}

      <ul className="mt-6 divide-y divide-slate-200 border-t border-slate-200">
        {submissions.map((item) => (
          <li key={item.id} className="flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-graphite">
                {item.name}
                {!item.handled && (
                  <span className="ml-2 font-mono text-xs text-amber-dim">new</span>
                )}
              </p>
              <p className="text-sm text-slate">
                <a href={`mailto:${item.email}`} className="hover:text-ink">{item.email}</a>
                {item.phone && <> · {item.phone}</>}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-graphite">{item.message}</p>
              <p className="mt-2 font-mono text-xs text-slate">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <button onClick={() => toggleHandled(item)} className="text-graphite hover:text-ink">
                Mark {item.handled ? 'unhandled' : 'handled'}
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-red-700 hover:text-red-800">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination page={page} count={count} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  )
}
