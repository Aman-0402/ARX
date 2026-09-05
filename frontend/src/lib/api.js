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

export async function fetchBlogPosts() {
  const res = await fetch(`${API_BASE}/blog/`)
  if (!res.ok) {
    throw new Error('Could not load blog posts.')
  }
  return res.json()
}

export async function fetchBlogPost(slug) {
  const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}/`)
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error('Could not load this post.')
  }
  return res.json()
}
