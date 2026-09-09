import SimpleCrudPage from '../../components/admin/SimpleCrudPage.jsx'
import { caseStudyApi } from '../../lib/api.js'

const fields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'client_name', label: 'Client name (optional)', type: 'text' },
  { key: 'summary', label: 'Summary (shown on the homepage card)', type: 'textarea', required: true },
  { key: 'content', label: 'Full write-up (shown on its own detail page, optional)', type: 'textarea' },
  { key: 'result', label: 'Result (e.g. "40% faster reporting")', type: 'text' },
  { key: 'image', label: 'Image (optional)', type: 'file' },
  { key: 'image_alt', label: 'Image alt text (optional)', type: 'text' },
  { key: 'order', label: 'Order', type: 'number', required: true },
  { key: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminCaseStudies() {
  return (
    <SimpleCrudPage
      title="Case studies"
      description="Featured case studies shown on the homepage, each with its own detail page."
      api={caseStudyApi}
      fields={fields}
      imageField="image"
      itemLabel={(item) => item.title}
    />
  )
}
