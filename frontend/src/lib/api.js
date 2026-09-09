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

async function apiFetchForm(path, { method = 'POST', formData }) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    credentials: 'include',
    body: formData,
  })
  return res
}

export async function submitContact(payload) {
  await fetchCsrfCookie()
  const res = await apiFetch('/contact/', { method: 'POST', body: payload })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Could not send your message. Please try again.')
  }
  return res.json()
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services/`)
  if (!res.ok) {
    throw new Error('Could not load services.')
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

export async function createAdminPost(formData) {
  const res = await apiFetchForm('/admin/blog/', { method: 'POST', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create post.')
  }
  return res.json()
}

export async function updateAdminPost(slug, formData) {
  const res = await apiFetchForm(`/admin/blog/${encodeURIComponent(slug)}/`, { method: 'PATCH', formData })
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

export async function submitBlogPost(formData) {
  const res = await fetch(`${API_BASE}/blog/submit/`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not submit your post.')
  }
  return res.json()
}

export async function fetchAdminStats() {
  const res = await apiFetch('/admin/stats/')
  if (!res.ok) throw new Error('Could not load stats.')
  return res.json()
}

export async function fetchAdminContacts() {
  const res = await apiFetch('/admin/contact/')
  if (!res.ok) throw new Error('Could not load contact submissions.')
  return res.json()
}

export async function setContactHandled(id, handled) {
  const res = await apiFetch(`/admin/contact/${id}/`, { method: 'PATCH', body: { handled } })
  if (!res.ok) throw new Error('Could not update submission.')
  return res.json()
}

export async function deleteContact(id) {
  const res = await apiFetch(`/admin/contact/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete submission.')
}

export async function fetchAdminVerifyRecords() {
  const res = await apiFetch('/admin/verify/')
  if (!res.ok) throw new Error('Could not load verification records.')
  return res.json()
}

export async function createVerifyRecord(payload) {
  const res = await apiFetch('/admin/verify/', { method: 'POST', body: payload })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create record.')
  }
  return res.json()
}

export async function updateVerifyRecord(code, payload) {
  const res = await apiFetch(`/admin/verify/${encodeURIComponent(code)}/`, { method: 'PATCH', body: payload })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not update record.')
  }
  return res.json()
}

export async function deleteVerifyRecord(code) {
  const res = await apiFetch(`/admin/verify/${encodeURIComponent(code)}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete record.')
}

export async function fetchAdminServiceGroups() {
  const res = await apiFetch('/admin/services/')
  if (!res.ok) throw new Error('Could not load service groups.')
  return res.json()
}

export async function createServiceGroup(formData) {
  const res = await apiFetchForm('/admin/services/', { method: 'POST', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create service group.')
  }
  return res.json()
}

export async function updateServiceGroup(id, formData) {
  const res = await apiFetchForm(`/admin/services/${id}/`, { method: 'PATCH', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not update service group.')
  }
  return res.json()
}

export async function deleteServiceGroup(id) {
  const res = await apiFetch(`/admin/services/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete service group.')
}

export async function fetchTeam() {
  const res = await fetch(`${API_BASE}/team/`)
  if (!res.ok) throw new Error('Could not load team.')
  return res.json()
}

export async function fetchAdminTeam() {
  const res = await apiFetch('/admin/team/')
  if (!res.ok) throw new Error('Could not load team members.')
  return res.json()
}

export async function createTeamMember(formData) {
  const res = await apiFetchForm('/admin/team/', { method: 'POST', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create team member.')
  }
  return res.json()
}

export async function updateTeamMember(id, formData) {
  const res = await apiFetchForm(`/admin/team/${id}/`, { method: 'PATCH', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not update team member.')
  }
  return res.json()
}

export async function deleteTeamMember(id) {
  const res = await apiFetch(`/admin/team/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete team member.')
}

export async function fetchTestimonials() {
  const res = await fetch(`${API_BASE}/testimonials/`)
  if (!res.ok) throw new Error('Could not load testimonials.')
  return res.json()
}

export async function fetchAdminTestimonials() {
  const res = await apiFetch('/admin/testimonials/')
  if (!res.ok) throw new Error('Could not load testimonials.')
  return res.json()
}

export async function createTestimonial(formData) {
  const res = await apiFetchForm('/admin/testimonials/', { method: 'POST', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create testimonial.')
  }
  return res.json()
}

export async function updateTestimonial(id, formData) {
  const res = await apiFetchForm(`/admin/testimonials/${id}/`, { method: 'PATCH', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not update testimonial.')
  }
  return res.json()
}

export async function deleteTestimonial(id) {
  const res = await apiFetch(`/admin/testimonials/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete testimonial.')
}

export async function fetchClients() {
  const res = await fetch(`${API_BASE}/clients/`)
  if (!res.ok) throw new Error('Could not load clients.')
  return res.json()
}

export async function fetchAdminClients() {
  const res = await apiFetch('/admin/clients/')
  if (!res.ok) throw new Error('Could not load clients.')
  return res.json()
}

export async function createClient(formData) {
  const res = await apiFetchForm('/admin/clients/', { method: 'POST', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not create client.')
  }
  return res.json()
}

export async function updateClient(id, formData) {
  const res = await apiFetchForm(`/admin/clients/${id}/`, { method: 'PATCH', formData })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(Object.values(err)[0]?.[0] || 'Could not update client.')
  }
  return res.json()
}

export async function deleteClient(id) {
  const res = await apiFetch(`/admin/clients/${id}/`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Could not delete client.')
}

/**
 * Factory for simple public-list + admin-CRUD resources (Industry, CaseStudy,
 * TechStackItem, ProcessStep, FAQ) that all follow the same shape as
 * Client/Testimonial above — avoids repeating the same 5 functions per resource.
 */
function makeSimpleResource(path, label, { multipart = false } = {}) {
  const send = multipart ? apiFetchForm : apiFetch
  return {
    async fetchPublic() {
      const res = await fetch(`${API_BASE}/${path}/`)
      if (!res.ok) throw new Error(`Could not load ${label}.`)
      return res.json()
    },
    async fetchAdmin() {
      const res = await apiFetch(`/admin/${path}/`)
      if (!res.ok) throw new Error(`Could not load ${label}.`)
      return res.json()
    },
    async create(body) {
      const res = await send(`/admin/${path}/`, { method: 'POST', ...(multipart ? { formData: body } : { body }) })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(Object.values(err)[0]?.[0] || `Could not create ${label} entry.`)
      }
      return res.json()
    },
    async update(id, body) {
      const res = await send(`/admin/${path}/${id}/`, { method: 'PATCH', ...(multipart ? { formData: body } : { body }) })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(Object.values(err)[0]?.[0] || `Could not update ${label} entry.`)
      }
      return res.json()
    },
    async remove(id) {
      const res = await apiFetch(`/admin/${path}/${id}/`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Could not delete ${label} entry.`)
    },
  }
}

export const industryApi = makeSimpleResource('industries', 'industries')
export const caseStudyApi = makeSimpleResource('case-studies', 'case studies', { multipart: true })
export const techStackApi = makeSimpleResource('tech-stack', 'tech stack', { multipart: true })
export const processStepApi = makeSimpleResource('process-steps', 'process steps')
export const faqApi = makeSimpleResource('faqs', 'FAQs')
