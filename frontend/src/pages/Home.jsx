import { Link } from 'react-router-dom'
import StatusBoard from '../components/StatusBoard.jsx'

const whyPoints = [
  'Global service capability with remote and on-site support models.',
  'Client-first approach with transparent communication and dedicated assistance.',
  'Strong focus on quality, scalability, and security in solution design.',
  'Professional delivery aligned with long-term business sustainability.',
]

const metrics = [
  { value: '24/7', label: 'Support' },
  { value: '100%', label: 'Client focus' },
  { value: 'Secure', label: 'Solutions' },
  { value: 'Fast', label: 'Delivery' },
]

const services = [
  {
    name: 'Managed IT Services',
    detail: 'Infrastructure monitoring, IT support, cloud migration, system optimization, and maintenance solutions.',
  },
  {
    name: 'Product Development',
    detail: 'Full-cycle product engineering including UI/UX, development, testing, deployment, and scalability.',
  },
  {
    name: 'Academic Solutions',
    detail: 'Automation platforms for admissions, attendance management, reporting systems, and LMS integrations.',
  },
]

const deliverables = [
  {
    title: 'IT infrastructure & support',
    copy: 'We manage IT infrastructure, servers, network monitoring, backups, troubleshooting, performance optimization, and maintenance for businesses.',
    items: ['Server monitoring', 'Network management', 'Backup & recovery', 'System optimization'],
  },
  {
    title: 'Development & automation',
    copy: 'We create custom digital solutions that automate workflows, improve productivity, and enhance customer experience through modern technology.',
    items: ['Web application development', 'Automation systems', 'UI/UX design', 'API development'],
  },
]

const testimonials = [
  {
    quote: 'ARX Infotech transformed our infrastructure — downtime dropped and performance improved dramatically.',
    name: 'Ellen Downing',
    org: 'Wrode Co.',
  },
  {
    quote: 'Outstanding security audit and quick remediation suggestions. Highly recommended.',
    name: 'Douglas Galveston',
    org: 'Sitwell Financial',
  },
  {
    quote: 'Their team is proactive and always available. Fantastic partner.',
    name: 'Kian Graham',
    org: 'Henlow Express',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:items-center md:py-16">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-graphite md:text-5xl">
              IT services and modern tech solutions for growing businesses
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate">
              ARX Infotech delivers scalable IT services, software development, cloud
              migration, and academic automation solutions to help organizations
              grow faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-graphite"
              >
                Explore services
              </Link>
              <Link
                to="/contact"
                className="rounded-sm border border-graphite px-5 py-3 text-sm font-medium text-graphite hover:border-ink"
              >
                Get a free consultation
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <StatusBoard />
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-graphite">
              Why organizations choose ARX Infotech
            </h2>
            <p className="mt-4 max-w-md text-slate">
              We focus on delivering secure, scalable, and high-performance
              solutions with a client-first approach.
            </p>
            <ul className="mt-8 space-y-4">
              {whyPoints.map((point) => (
                <li key={point} className="flex gap-3 border-t border-slate-200 pt-4 text-sm text-graphite">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/about" className="mt-8 inline-block text-sm font-medium text-ink underline decoration-amber decoration-2 underline-offset-4">
              Learn more about us
            </Link>
          </div>

          <div className="border border-slate-700 bg-ink p-8 text-paper">
            <h3 className="font-display text-xl font-semibold">We build future-ready systems</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-200/70">
              Cloud migration, automation, IT services, software products, and
              digital platforms designed for growth.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 font-mono">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="text-2xl text-amber">{metric.value}</div>
                  <div className="mt-1 text-xs text-slate-200/60">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core services */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-graphite">Our core services</h2>
              <p className="mt-3 max-w-md text-slate">
                Complete IT and digital transformation solutions, built around
                how your organization actually works.
              </p>
            </div>
            <Link to="/services" className="text-sm font-medium text-ink underline decoration-amber decoration-2 underline-offset-4">
              View all services
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 md:grid-cols-3">
            {services.map((service, i) => (
              <div key={service.name} className="bg-paper p-8">
                <span className="font-mono text-xs text-slate">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-graphite">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{service.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we deliver */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-3xl font-semibold text-graphite">What we deliver</h2>
          <p className="mt-3 max-w-md text-slate">
            Professional solutions designed for business growth and digital efficiency.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {deliverables.map((block) => (
              <div key={block.title} className="border-t-2 border-ink pt-6">
                <h3 className="font-display text-xl font-semibold text-graphite">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{block.copy}</p>
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-graphite">
                  {block.items.map((item) => (
                    <li key={item} className="border-b border-slate-200 pb-2">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-3xl font-semibold text-graphite">What our clients say</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col justify-between border border-slate-200 p-6">
                <blockquote className="text-sm leading-relaxed text-graphite">“{t.quote}”</blockquote>
                <figcaption className="mt-6 border-t border-slate-200 pt-4 text-sm">
                  <div className="font-medium text-graphite">{t.name}</div>
                  <div className="text-slate">{t.org}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-paper md:text-3xl">
              Need IT support or custom software?
            </h2>
            <p className="mt-2 text-slate-200/70">
              Get a free consultation and discover the best technology solution for your business.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="rounded-sm bg-amber px-5 py-3 text-sm font-medium text-ink hover:bg-amber/90">
              Get consultation
            </Link>
            <a href="tel:+918317818107" className="rounded-sm border border-slate-700 px-5 py-3 text-sm font-medium text-paper hover:border-paper">
              Call now
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
