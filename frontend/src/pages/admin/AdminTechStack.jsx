import SimpleCrudPage from '../../components/admin/SimpleCrudPage.jsx'
import { techStackApi } from '../../lib/api.js'

const fields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'logo', label: 'Logo', type: 'file', required: true },
  { key: 'order', label: 'Order', type: 'number', required: true },
  { key: 'published', label: 'Published', type: 'checkbox' },
]

export default function AdminTechStack() {
  return (
    <SimpleCrudPage
      title="Technology stack"
      description="Tech/tool logos shown on the homepage."
      api={techStackApi}
      fields={fields}
      imageField="logo"
      itemLabel={(item) => item.name}
    />
  )
}
