const serviceGroups = [
  {
    name: 'Managed IT services',
    items: ['Server monitoring & maintenance', 'Network management & VPN setup', 'Backup & disaster recovery', 'Helpdesk & remote support'],
  },
  {
    name: 'Cloud & infrastructure',
    items: ['Cloud migration (AWS, Azure, GCP)', 'Cloud cost optimization', 'Virtualization & VDI', 'CI/CD & DevOps pipelines'],
  },
  {
    name: 'Cybersecurity',
    items: ['Security audits & penetration testing', 'Endpoint & network security', 'SIEM & incident response', 'Compliance & data protection'],
  },
  {
    name: 'Product development',
    items: ['Web & mobile app development', 'UI/UX design', 'API design & integration', 'QA & automation testing'],
  },
  {
    name: 'Academic automation',
    items: ['Admission & enrollment portals', 'Attendance management systems', 'LMS integration', 'Result & reporting dashboards'],
  },
  {
    name: 'Data & AI',
    items: ['Business intelligence dashboards', 'Data engineering & ETL', 'Automation & RPA', 'AI & chatbot integration'],
  },
]

export default function Services() {
  return (
    <>
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-xs text-slate">Services</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-graphite">
            Complete IT and digital transformation solutions
          </h1>
          <p className="mt-6 max-w-2xl text-slate">
            From day-to-day infrastructure support to full product builds and
            academic automation platforms — organized so you can find exactly
            what you need.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-2">
            {serviceGroups.map((group) => (
              <div key={group.name} className="bg-paper p-8">
                <h2 className="font-display text-lg font-semibold text-graphite">{group.name}</h2>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 border-t border-slate-200 pt-2 text-sm text-slate first:border-t-0 first:pt-0">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
