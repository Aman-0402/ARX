import SimpleCrudPage from '../../components/admin/SimpleCrudPage.jsx'
import { processStepApi } from '../../lib/api.js'

const fields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'order', label: 'Order (step number)', type: 'number', required: true },
  { key: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminProcessSteps() {
  return (
    <SimpleCrudPage
      title="Our process"
      description="Process steps shown on the homepage, in order."
      api={processStepApi}
      fields={fields}
      itemLabel={(item) => item.title}
    />
  )
}
