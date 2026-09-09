import SimpleCrudPage from '../../components/admin/SimpleCrudPage.jsx'
import { industryApi } from '../../lib/api.js'

const fields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'icon', label: 'Icon (emoji, optional)', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'order', label: 'Order', type: 'number', required: true },
  { key: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminIndustries() {
  return (
    <SimpleCrudPage
      title="Industries"
      description="Industries/solutions shown on the homepage."
      api={industryApi}
      fields={fields}
      itemLabel={(item) => item.name}
    />
  )
}
