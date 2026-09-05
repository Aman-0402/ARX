const API_BASE = '/api'

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (method !== 'GET') {
    headers['X-CSRFToken'] = getCookie('csrftoken')
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  return res
}

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

export async function fetchCsrfCookie() {
  await apiFetch('/auth/csrf/')
}

export async function login(username, password) {
  const res = await apiFetch('/auth/login/', { method: 'POST', body: { username, password } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Invalid credentials.')
  }
  return res.json()
}

export async function logout() {
  await apiFetch('/auth/logout/', { method: 'POST' })
}

export async function fetchMe() {
  const res = await apiFetch('/auth/me/')
  if (!res.ok) return null
  return res.json()
}

export async function fetchAdminPosts() {
  const res = await apiFetch('/admin/blog/')
  if (!res.ok) throw new Error('Could not load posts.')
  return res.json()
}

export async function createAdminPost(payload) {
  const res = await apiFetch('/admin/blog/', { method: 'POST', body: payload })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create post.')
  }
  return res.json()
}

export async function updateAdminPost(slug, payload) {
  const res = await apiFetch(`/admin/blog/${encodeURIComponent(slug)}/`, { method: 'PATCH', body: payload })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not update post.')
  }
  return res.json()
}

export async function deleteAdminPost(slug) {
  const res = await apiFetch(`/admin/blog/${encodeURIComponent(slug)}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete post.')
}
