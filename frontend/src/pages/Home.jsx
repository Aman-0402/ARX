import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatusBoard from '../components/StatusBoard.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'

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
    accent: 'border-t-amber',
    chip: 'bg-amber/15 text-amber-dim',
  },
  {
    name: 'Product Development',
    detail: 'Full-cycle product engineering including UI/UX, development, testing, deployment, and scalability.',
    accent: 'border-t-coral',
    chip: 'bg-coral/15 text-coral',
  },
  {
    name: 'Academic Solutions',
    detail: 'Automation platforms for admissions, attendance management, reporting systems, and LMS integrations.',
    accent: 'border-t-mint',
    chip: 'bg-mint/15 text-mint',
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
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:items-center md:py-16">
          <div>
            <Reveal as="h1" className="font-display text-4xl font-semibold leading-[1.1] text-graphite md:text-5xl">
              IT services and modern tech solutions for growing businesses
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate">
                ARX Infotech delivers scalable IT services, software development, cloud
                migration, and academic automation solutions to help organizations
                grow faster.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:bg-graphite hover:shadow-lg"
              >
                Explore services
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-graphite px-5 py-3 text-sm font-medium text-graphite transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-md"
              >
                Get a free consultation
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.15} y={32} className="flex justify-center md:justify-end">
            <StatusBoard />
          </Reveal>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-[1fr_1fr]">
          <Reveal>
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
          </Reveal>

          <Reveal delay={0.15} className="relative overflow-hidden rounded-2xl border border-slate-700 bg-ink p-8 text-paper">
            <GradientBlobs variant="mixed" />
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
          </Reveal>
        </div>
      </section>

      {/* Core services */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
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
          </Reveal>

          <StaggerGrid className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service, i) => (
              <StaggerItem key={service.name}>
                <motion.div
                  whileHover={{ y: -6, rotate: -0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`h-full rounded-2xl border-t-4 bg-paper p-8 shadow-sm ${service.accent}`}
                >
                  <span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-xs ${service.chip}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-graphite">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{service.detail}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* What we deliver */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-graphite">What we deliver</h2>
            <p className="mt-3 max-w-md text-slate">
              Professional solutions designed for business growth and digital efficiency.
            </p>
          </Reveal>

          <StaggerGrid className="mt-12 grid gap-10 md:grid-cols-2">
            {deliverables.map((block) => (
              <StaggerItem key={block.title}>
                <div className="rounded-2xl border-t-2 border-ink pt-6">
                  <h3 className="font-display text-xl font-semibold text-graphite">{block.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{block.copy}</p>
                  <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-graphite">
                    {block.items.map((item) => (
                      <li key={item} className="border-b border-slate-200 pb-2">{item}</li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-graphite">What our clients say</h2>
          </Reveal>
          <StaggerGrid className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <motion.figure
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-paper p-6 shadow-sm"
                >
                  <blockquote className="text-sm leading-relaxed text-graphite">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 border-t border-slate-200 pt-4 text-sm">
                    <div className="font-medium text-graphite">{t.name}</div>
                    <div className="text-slate">{t.org}</div>
                  </figcaption>
                </motion.figure>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink">
        <GradientBlobs variant="warm" />
        <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-paper md:text-3xl">
              Need IT support or custom software?
            </h2>
            <p className="mt-2 text-slate-200/70">
              Get a free consultation and discover the best technology solution for your business.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="rounded-xl bg-amber px-5 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-amber/90 hover:shadow-lg">
              Get consultation
            </Link>
            <a href="tel:+918317818107" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-paper transition-all hover:-translate-y-0.5 hover:border-paper">
              Call now
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
