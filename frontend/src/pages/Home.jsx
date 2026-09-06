import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Earth from '../components/Earth.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import StarField from '../components/motion/StarField.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'
import { fetchTestimonials } from '../lib/api.js'

const testimonialAccents = [
  { avatar: 'bg-amber/15 text-amber-dim', quoteMark: 'text-amber/40', border: 'border-amber/30', top: 'bg-amber', tint: 'from-amber/10' },
  { avatar: 'bg-coral/15 text-coral', quoteMark: 'text-coral/40', border: 'border-coral/30', top: 'bg-coral', tint: 'from-coral/10' },
  { avatar: 'bg-mint/15 text-mint', quoteMark: 'text-mint/40', border: 'border-mint/30', top: 'bg-mint', tint: 'from-mint/10' },
  { avatar: 'bg-sunbeam/15 text-amber-dim', quoteMark: 'text-sunbeam/50', border: 'border-sunbeam/40', top: 'bg-sunbeam', tint: 'from-sunbeam/10' },
  { avatar: 'bg-grape/15 text-grape', quoteMark: 'text-grape/40', border: 'border-grape/30', top: 'bg-grape', tint: 'from-grape/10' },
]

const whyPoints = [
  { text: 'Global service capability with remote and on-site support models.', dot: 'bg-amber' },
  { text: 'Client-first approach with transparent communication and dedicated assistance.', dot: 'bg-coral' },
  { text: 'Strong focus on quality, scalability, and security in solution design.', dot: 'bg-mint' },
  { text: 'Professional delivery aligned with long-term business sustainability.', dot: 'bg-grape' },
]

const metrics = [
  { value: '24/7', label: 'Support', accent: 'border-t-amber' },
  { value: '100%', label: 'Client focus', accent: 'border-t-coral' },
  { value: 'Secure', label: 'Solutions', accent: 'border-t-mint' },
  { value: 'Fast', label: 'Delivery', accent: 'border-t-grape' },
]

const services = [
  {
    name: 'Managed IT Services',
    detail: 'Infrastructure monitoring, IT support, cloud migration, system optimization, and maintenance solutions.',
    accent: 'border-t-amber',
    ring: 'border-amber/30 hover:border-amber',
    chip: 'bg-amber/15 text-amber',
    glow: 'hover:shadow-amber/20',
    imageBg: 'from-amber/20 via-ink-raised to-ink-raised',
    icon: (
      <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm0 10a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4Zm3-8h.01M7 17h.01" />
    ),
  },
  {
    name: 'Product Development',
    detail: 'Full-cycle product engineering including UI/UX, development, testing, deployment, and scalability.',
    accent: 'border-t-coral',
    ring: 'border-coral/30 hover:border-coral',
    chip: 'bg-coral/15 text-coral',
    glow: 'hover:shadow-coral/20',
    imageBg: 'from-coral/20 via-ink-raised to-ink-raised',
    icon: <path d="m8 9-4 3 4 3m8-6 4 3-4 3m-2-9-4 12" />,
  },
  {
    name: 'Academic Solutions',
    detail: 'Automation platforms for admissions, attendance management, reporting systems, and LMS integrations.',
    accent: 'border-t-mint',
    ring: 'border-mint/30 hover:border-mint',
    icon: <path d="M22 10 12 5 2 10l10 5 10-5Zm-5 2.5v4.5c0 1-2.5 2.5-5 2.5s-5-1.5-5-2.5v-4.5M22 10v6" />,
    chip: 'bg-mint/15 text-mint',
    glow: 'hover:shadow-mint/20',
    imageBg: 'from-mint/20 via-ink-raised to-ink-raised',
  },
]

const deliverables = [
  {
    title: 'IT infrastructure & support',
    copy: 'We manage IT infrastructure, servers, network monitoring, backups, troubleshooting, performance optimization, and maintenance for businesses.',
    items: ['Server monitoring', 'Network management', 'Backup & recovery', 'System optimization'],
    accent: 'border-t-amber',
    ring: 'hover:border-amber',
    glow: 'hover:shadow-amber/20',
    chip: 'bg-amber/10 text-amber-dim',
    tint: 'from-amber/15 via-white to-white',
    blob: 'bg-amber/30',
    icon: <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm0 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Zm4-8h.01M7 17h.01" />,
  },
  {
    title: 'Development & automation',
    copy: 'We create custom digital solutions that automate workflows, improve productivity, and enhance customer experience through modern technology.',
    items: ['Web application development', 'Automation systems', 'UI/UX design', 'API development'],
    accent: 'border-t-coral',
    ring: 'hover:border-coral',
    glow: 'hover:shadow-coral/20',
    chip: 'bg-coral/10 text-coral',
    tint: 'from-coral/15 via-white to-white',
    blob: 'bg-coral/30',
    icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  },
]


export default function Home() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(() => {})
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <StarField count={80} />
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-16 pt-6 md:grid-cols-[1.15fr_1fr] md:items-center md:pb-20 md:pt-8">
          <div>
            <Reveal as="h1" className="font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-6xl lg:text-7xl">
              IT services and{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                modern tech
              </span>{' '}
              solutions for growing businesses
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate">
                ARX Infotech delivers scalable IT services, software development, cloud
                migration, and academic automation solutions to help organizations
                grow faster.
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="group relative isolate overflow-hidden rounded-xl border-2 border-ink bg-ink px-7 py-4 text-base font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 hover:text-ink hover:shadow-lg"
              >
                <span className="absolute inset-0 origin-right scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <span className="relative">Explore services</span>
              </Link>
              <Link
                to="/contact"
                className="group relative isolate overflow-hidden rounded-xl border-2 border-graphite bg-paper px-7 py-4 text-base font-medium text-graphite transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:text-paper hover:shadow-md"
              >
                <span className="absolute inset-0 origin-right scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100" />
                <span className="relative">Get a free consultation</span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.15} y={32} className="flex justify-center md:justify-end">
            <Earth />
          </Reveal>
        </div>
      </section>

      {/* Why choose */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-4 py-24 md:grid-cols-[1fr_1fr] md:items-center">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold leading-tight text-graphite md:text-5xl">
              Why organizations{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                choose ARX
              </span>{' '}
              Infotech
            </h2>
            <p className="mt-5 max-w-md text-lg text-slate">
              We focus on delivering secure, scalable, and high-performance
              solutions with a client-first approach.
            </p>
            <StaggerGrid className="mt-10 space-y-3">
              {whyPoints.map((point) => (
                <StaggerItem key={point.text}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-paper px-5 py-4 text-base text-graphite shadow-sm"
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${point.dot}`} />
                    {point.text}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <Link
              to="/about"
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-base font-medium text-paper transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Learn more about us
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="font-display text-2xl font-semibold text-graphite">We build future-ready systems</h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-slate">
              Cloud migration, automation, IT services, software products, and
              digital platforms designed for growth.
            </p>
            <StaggerGrid className="mt-8 grid grid-cols-2 gap-4 font-mono">
              {metrics.map((metric) => (
                <StaggerItem key={metric.label}>
                  <motion.div
                    whileHover={{ y: -6, rotate: -1.5, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className={`flex flex-col items-center rounded-2xl border-t-4 bg-ink px-6 py-6 text-center text-paper shadow-lg shadow-ink/20 ${metric.accent}`}
                  >
                    <div className="text-3xl font-semibold">{metric.value}</div>
                    <div className="mt-2 h-px w-8 bg-slate-700" />
                    <div className="mt-2 text-sm text-slate-200/60">{metric.label}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </Reveal>
        </div>
      </section>

      {/* Core services */}
      <section className="relative overflow-hidden border-b border-slate-700 bg-ink">
        <GradientBlobs variant="mixed" />
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-semibold text-paper md:text-5xl">Our core services</h2>
              <p className="mt-4 max-w-md text-lg text-slate-200/70">
                Complete IT and digital transformation solutions, built around
                how your organization actually works.
              </p>
            </div>
            <Link
              to="/services"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl border-2 border-amber bg-amber px-6 py-3.5 text-base font-semibold text-paper shadow-lg shadow-amber/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber/50"
            >
              <span className="absolute inset-0 origin-right scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative">View all services</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </Reveal>

          <StaggerGrid className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.name}>
                <motion.div
                  whileHover={{ y: -8, rotate: -0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`group h-full overflow-hidden rounded-2xl border-2 border-t-4 bg-ink-raised shadow-xl transition-all duration-300 ${service.accent} ${service.ring} ${service.glow}`}
                >
                  <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${service.imageBg}`}>
                    <div className="flex h-full items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={`h-16 w-16 ${service.chip.split(' ')[1]}`}>
                        {service.icon}
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex translate-y-2 items-center bg-ink p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-lg font-medium leading-relaxed text-paper">{service.detail}</p>
                    </div>
                  </div>
                  <div className="p-9">
                    <h3 className="font-display text-2xl font-semibold text-paper">
                      {service.name}
                    </h3>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* What we deliver */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto max-w-[1400px] px-4 py-20">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold text-graphite md:text-5xl">What we deliver</h2>
            <p className="mt-4 max-w-md text-lg text-slate">
              Professional solutions designed for business growth and digital efficiency.
            </p>
          </Reveal>

          <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-2">
            {deliverables.map((block) => (
              <StaggerItem key={block.title}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`group relative isolate grid overflow-hidden rounded-2xl border-2 border-slate-200 border-t-4 shadow-md transition-shadow duration-300 hover:shadow-xl ${block.accent} ${block.ring} ${block.glow}`}
                >
                  <div className={`relative col-start-1 row-start-1 flex flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br p-10 text-center transition-opacity duration-300 group-hover:opacity-0 ${block.tint}`}>
                    <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${block.blob}`} />
                    <span className={`relative inline-flex h-16 w-16 items-center justify-center rounded-2xl ${block.chip}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                        {block.icon}
                      </svg>
                    </span>
                    <h3 className="relative font-display text-2xl font-semibold text-graphite">{block.title}</h3>
                    <p className="relative text-sm text-slate">Hover to see what's included</p>
                  </div>

                  <div className="col-start-1 row-start-1 flex flex-col justify-center gap-4 bg-amber/10 p-9 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="font-display text-xl font-semibold text-graphite">{block.title}</h3>
                    <p className="text-base leading-relaxed text-graphite/80">{block.copy}</p>
                    <div className="flex flex-wrap gap-2">
                      {block.items.map((item) => (
                        <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-graphite shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden border-b border-slate-200 bg-paper-dim py-20">
        <div className="mx-auto max-w-[1400px] px-4">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold text-graphite md:text-5xl">What our clients say</h2>
          </Reveal>
        </div>

        {testimonials.length > 0 && (
          <div className="relative mt-14">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper-dim to-transparent md:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper-dim to-transparent md:w-32" />
            <div className="flex w-max gap-6 animate-marquee">
              {[...testimonials, ...testimonials].map((t, i) => {
                const a = testimonialAccents[i % testimonials.length % testimonialAccents.length]
                return (
                  <figure
                    key={i}
                    className={`flex w-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border-2 bg-gradient-to-br to-white p-8 shadow-md md:w-[380px] ${a.border} ${a.tint}`}
                  >
                    <span className={`-mx-8 -mt-8 mb-6 block h-1.5 ${a.top}`} />
                    <div>
                      <span className={`font-display text-6xl leading-none ${a.quoteMark}`}>“</span>
                      <blockquote className="-mt-4 text-base leading-relaxed text-graphite">{t.quote}</blockquote>
                    </div>
                    <figcaption className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-5">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${a.avatar}`}>
                        {t.name.charAt(0)}
                      </span>
                      <div className="text-sm">
                        <div className="font-medium text-graphite">{t.name}</div>
                        <div className="text-slate">{t.org}</div>
                      </div>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink">
        <GradientBlobs variant="warm" />
        <Reveal className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-4 py-24 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight text-paper md:text-5xl">
              Need IT support or custom software?
            </h2>
            <p className="mt-4 max-w-md text-lg text-slate-200/70">
              Get a free consultation and discover the best technology solution for your business.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl border-2 border-amber bg-amber px-7 py-4 text-base font-semibold text-ink shadow-lg shadow-amber/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber/50"
            >
              <span className="absolute inset-0 origin-right scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative">Get consultation</span>
              <span className="relative transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
            <a
              href="tel:+918317818107"
              className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-xl border-2 border-slate-700 px-7 py-4 text-base font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-paper"
            >
              <span className="absolute inset-0 origin-right scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-ink">Call now</span>
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
