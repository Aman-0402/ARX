const values = [
  { title: 'Security-first design', copy: 'Every system we ship is built to a hardened baseline, not patched after the fact.' },
  { title: 'Transparent delivery', copy: 'Clients see status, timelines, and decisions as they happen — no black boxes.' },
  { title: 'Built to scale', copy: 'Architecture decisions account for the client at 10x, not just at launch.' },
  { title: 'Long-term partnership', copy: 'We stay on as infrastructure evolves, not just for the initial build.' },
]

export default function About() {
  return (
    <>
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <span className="font-mono text-xs text-slate">About ARX Infotech</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-graphite">
            IT services and academic automation, built by people who run the systems they design
          </h1>
          <p className="mt-6 max-w-2xl text-slate">
            ARX Infotech works with businesses and educational institutions across
            infrastructure, software, and security — combining managed IT services
            with product engineering so clients get one accountable partner
            instead of a handful of vendors.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
          <div className="border border-slate-200 bg-paper p-8">
            <h2 className="font-display text-xl font-semibold text-graphite">What we do</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              We manage infrastructure and support, build custom software
              products, and deliver automation platforms for schools and
              colleges — admissions, attendance, reporting, and LMS
              integration — under one engineering team.
            </p>
          </div>
          <div className="border border-slate-200 bg-paper p-8">
            <h2 className="font-display text-xl font-semibold text-graphite">Who we work with</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Small and mid-sized businesses that need dependable IT support,
              and academic institutions modernizing admissions, attendance,
              and reporting workflows.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl font-semibold text-graphite">How we work</h2>
          <div className="mt-10 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="bg-paper p-7">
                <h3 className="font-display text-base font-semibold text-graphite">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
