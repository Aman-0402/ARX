import SimpleCrudPage from '../../components/admin/SimpleCrudPage.jsx'
import { caseStudyApi } from '../../lib/api.js'

const fields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'client_name', label: 'Client name (optional)', type: 'text' },
  { key: 'summary', label: 'Summary', type: 'textarea', required: true },
  { key: 'result', label: 'Result (e.g. "40% faster reporting")', type: 'text' },
  { key: 'image', label: 'Image (optional)', type: 'file' },
  { key: 'order', label: 'Order', type: 'number', required: true },
  { key: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminCaseStudies() {
  return (
    <SimpleCrudPage
      title="Case studies"
      description="Featured case studies shown on the homepage."
      api={caseStudyApi}
      fields={fields}
      imageField="image"
      itemLabel={(item) => item.title}
    />
  )
}
