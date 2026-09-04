const API_BASE = '/api'

export async function submitContact(payload) {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Could not send your message. Please try again.')
  }
  return res.json()
}

export async function verifyCertificate(code) {
  const res = await fetch(`${API_BASE}/verify/${encodeURIComponent(code)}/`)
  if (res.status === 404) {
    return { found: false }
  }
  if (!res.ok) {
    throw new Error('Verification service is unavailable right now.')
  }
  const data = await res.json()
  return { found: true, ...data }
}
