import SimpleCrudPage from '../../components/admin/SimpleCrudPage.jsx'
import { faqApi } from '../../lib/api.js'

const fields = [
  { key: 'question', label: 'Question', type: 'text', required: true },
  { key: 'answer', label: 'Answer', type: 'textarea', required: true },
  { key: 'order', label: 'Order', type: 'number', required: true },
  { key: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminFAQ() {
  return (
    <SimpleCrudPage
      title="FAQ"
      description="Frequently asked questions shown on the homepage."
      api={faqApi}
      fields={fields}
      itemLabel={(item) => item.question}
    />
  )
}
