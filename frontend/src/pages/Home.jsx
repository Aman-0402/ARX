import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import Earth from '../components/Earth.jsx'
import Reveal from '../components/motion/Reveal.jsx'
import GradientBlobs from '../components/motion/GradientBlobs.jsx'
import StarField from '../components/motion/StarField.jsx'
import Counter from '../components/motion/Counter.jsx'
import { StaggerGrid, StaggerItem } from '../components/motion/StaggerGrid.jsx'
import {
  fetchTestimonials,
  fetchClients,
  industryApi,
  caseStudyApi,
  techStackApi,
  processStepApi,
  faqApi,
} from '../lib/api.js'

const testimonialAccents = [
  { avatar: 'bg-amber/15 text-amber-dim', quoteMark: 'text-amber/40', border: 'border-amber/30', top: 'bg-amber', tint: 'from-amber/10' },
  { avatar: 'bg-coral/15 text-coral', quoteMark: 'text-coral/40', border: 'border-coral/30', top: 'bg-coral', tint: 'from-coral/10' },
  { avatar: 'bg-mint/15 text-mint', quoteMark: 'text-mint/40', border: 'border-mint/30', top: 'bg-mint', tint: 'from-mint/10' },
  { avatar: 'bg-sunbeam/15 text-amber-dim', quoteMark: 'text-sunbeam/50', border: 'border-sunbeam/40', top: 'bg-sunbeam', tint: 'from-sunbeam/10' },
  { avatar: 'bg-grape/15 text-grape', quoteMark: 'text-grape/40', border: 'border-grape/30', top: 'bg-grape', tint: 'from-grape/10' },
]

const cardAccents = [
  { border: 'border-t-amber', ring: 'hover:border-amber', glow: 'hover:shadow-amber/20', chip: 'bg-amber/15 text-amber-dim' },
  { border: 'border-t-coral', ring: 'hover:border-coral', glow: 'hover:shadow-coral/20', chip: 'bg-coral/15 text-coral' },
  { border: 'border-t-mint', ring: 'hover:border-mint', glow: 'hover:shadow-mint/20', chip: 'bg-mint/15 text-mint' },
  { border: 'border-t-sunbeam', ring: 'hover:border-sunbeam', glow: 'hover:shadow-sunbeam/20', chip: 'bg-sunbeam/15 text-amber-dim' },
  { border: 'border-t-grape', ring: 'hover:border-grape', glow: 'hover:shadow-grape/20', chip: 'bg-grape/15 text-grape' },
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

const aboutStats = [
  { value: '120', suffix: '+', decimals: 0, static: null, label: 'Businesses served', accent: 'border-amber/40 bg-amber/5' },
  { value: null, static: '24/7', label: 'Support coverage', accent: 'border-coral/40 bg-coral/5' },
  { value: '99.98', suffix: '%', decimals: 2, static: null, label: 'Infrastructure uptime', accent: 'border-mint/40 bg-mint/5' },
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

function FAQItem({ faq, open, onToggle }) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-lg font-medium text-graphite">{faq.question}</span>
        <span className={`shrink-0 text-2xl text-slate transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="text-base leading-relaxed text-slate">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [testimonials, setTestimonials] = useState([])
  const [clients, setClients] = useState([])
  const [industries, setIndustries] = useState([])
  const [caseStudies, setCaseStudies] = useState([])
  const [techStack, setTechStack] = useState([])
  const [processSteps, setProcessSteps] = useState([])
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    fetchTestimonials().then(setTestimonials).catch(() => {})
    fetchClients().then(setClients).catch(() => {})
    industryApi.fetchPublic().then(setIndustries).catch(() => {})
    caseStudyApi.fetchPublic().then(setCaseStudies).catch(() => {})
    techStackApi.fetchPublic().then(setTechStack).catch(() => {})
    processStepApi.fetchPublic().then(setProcessSteps).catch(() => {})
    faqApi.fetchPublic().then(setFaqs).catch(() => {})
  }, [])

  return (
    <>
      <SEO
        path="/"
        title="IT Services & Modern Tech Solutions"
        description="ARX Infotech delivers scalable IT services, software development, cloud migration, cybersecurity, and academic automation solutions for businesses and institutions."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'ARX Infotech',
          url: 'https://arxinfo.tech',
          telephone: '+918317818107',
          email: 'info@arxinfo.tech',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '1st Floor, 150, Panchita, Bongaon–Bagdh Rd. Street',
            addressLocality: 'Kolkata',
            addressRegion: 'West Bengal',
            postalCode: '743235',
            addressCountry: 'IN',
          },
          description:
            'Managed IT services, cloud infrastructure, cybersecurity, product development, and academic automation.',
        }}
      />

      {/* Hero + CTA */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <GradientBlobs variant="blue" />
        <StarField count={80} />
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-16 pt-6 md:grid-cols-[1.15fr_1fr] md:items-center md:pb-20 md:pt-8">
          <div>
            <Reveal as="h1" className="font-display text-3xl font-semibold leading-[1.1] text-graphite sm:text-4xl md:text-6xl lg:text-7xl">
              Modern tech,{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                built to scale
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate">
                IT services, software, and cloud solutions engineered for growth.
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

          <Reveal delay={0.15} y={32} className="relative flex justify-center md:justify-end">
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-[75%] w-[75%] animate-pulse-glow rounded-full bg-gradient-to-br from-amber via-grape to-coral opacity-30 blur-3xl" />
            </div>
            <Earth />
          </Reveal>
        </div>
      </section>

      {/* Client logos / key metrics */}
      <section className="border-b border-slate-200 bg-paper py-16">
        <div className="mx-auto max-w-[1400px] px-4">
          {clients.length > 0 && (
            <>
              <Reveal>
                <p className="text-center text-sm font-medium uppercase tracking-wide text-slate">
                  Trusted by businesses and institutions
                </p>
              </Reveal>
              <StaggerGrid className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {clients.map((c) => {
                  const logo = (
                    <img
                      src={c.logo}
                      alt={c.name}
                      loading="lazy"
                      className="h-10 max-w-[140px] object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                    />
                  )
                  return (
                    <StaggerItem key={c.name}>
                      {c.website ? (
                        <a href={c.website} target="_blank" rel="noopener noreferrer">
                          {logo}
                        </a>
                      ) : (
                        logo
                      )}
                    </StaggerItem>
                  )
                })}
              </StaggerGrid>
            </>
          )}

          <StaggerGrid className={`grid grid-cols-2 gap-4 font-mono sm:grid-cols-4 ${clients.length > 0 ? 'mt-14' : ''}`}>
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
        </div>
      </section>

      {/* Services */}
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

      {/* Why choose us */}
      <section className="border-b border-slate-200 bg-paper-dim">
        <div className="mx-auto max-w-[1400px] px-4 py-24">
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
          </Reveal>
          <StaggerGrid className="mt-10 grid gap-3 md:grid-cols-2">
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
        </div>
      </section>

      {/* Industries / Solutions */}
      {industries.length > 0 && (
        <section className="border-b border-slate-200 bg-paper py-20">
          <div className="mx-auto max-w-[1400px] px-4">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold text-graphite md:text-5xl">Industries we serve</h2>
              <p className="mt-4 max-w-md text-lg text-slate">
                Solutions tailored to the sectors we work with most.
              </p>
            </Reveal>
            <StaggerGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind, i) => {
                const a = cardAccents[i % cardAccents.length]
                return (
                  <StaggerItem key={ind.name}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`h-full rounded-2xl border-2 border-slate-200 border-t-4 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl ${a.border} ${a.ring} ${a.glow}`}
                    >
                      {ind.icon && (
                        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${a.chip}`}>
                          {ind.icon}
                        </span>
                      )}
                      <h3 className="mt-4 font-display text-xl font-semibold text-graphite">{ind.name}</h3>
                      {ind.description && (
                        <p className="mt-2 text-sm leading-relaxed text-slate">{ind.description}</p>
                      )}
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Featured case studies */}
      {caseStudies.length > 0 && (
        <section className="border-b border-slate-200 bg-paper-dim py-20">
          <div className="mx-auto max-w-[1400px] px-4">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold text-graphite md:text-5xl">Featured case studies</h2>
              <p className="mt-4 max-w-md text-lg text-slate">
                Real outcomes from real engagements.
              </p>
            </Reveal>
            <StaggerGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs, i) => {
                const a = cardAccents[i % cardAccents.length]
                return (
                  <StaggerItem key={cs.title}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`h-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl ${a.glow}`}
                    >
                      {cs.image ? (
                        <img src={cs.image} alt="" loading="lazy" className="h-40 w-full object-cover" />
                      ) : (
                        <div className={`h-2 ${a.border.replace('border-t-', 'bg-')}`} />
                      )}
                      <div className="p-7">
                        {cs.client_name && (
                          <p className="text-xs font-medium uppercase tracking-wide text-slate">{cs.client_name}</p>
                        )}
                        <h3 className="mt-1 font-display text-xl font-semibold text-graphite">{cs.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate">{cs.summary}</p>
                        {cs.result && (
                          <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${a.chip}`}>
                            {cs.result}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                )
              })}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Technology stack */}
      {techStack.length > 0 && (
        <section className="border-b border-slate-200 bg-paper py-16">
          <div className="mx-auto max-w-[1400px] px-4">
            <Reveal>
              <p className="text-center text-sm font-medium uppercase tracking-wide text-slate">
                Our technology stack
              </p>
            </Reveal>
            <StaggerGrid className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {techStack.map((t) => (
                <StaggerItem key={t.name}>
                  <img
                    src={t.logo}
                    alt={t.name}
                    loading="lazy"
                    className="h-10 max-w-[120px] object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* Our process */}
      {processSteps.length > 0 && (
        <section className="border-b border-slate-200 bg-paper-dim py-20">
          <div className="mx-auto max-w-[1400px] px-4">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold text-graphite md:text-5xl">Our process</h2>
              <p className="mt-4 max-w-md text-lg text-slate">
                How we take a project from first call to delivery.
              </p>
            </Reveal>
            <StaggerGrid className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <StaggerItem key={step.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                  >
                    <span className="font-display text-5xl font-bold text-slate-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-graphite">{step.title}</h3>
                    {step.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate">{step.description}</p>
                    )}
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

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
                      {t.photo ? (
                        <img src={t.photo} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${a.avatar}`}>
                          {t.name.charAt(0)}
                        </span>
                      )}
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

      {/* About us preview */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-paper">
        <GradientBlobs variant="blue" />
        <div className="mx-auto max-w-[1400px] px-4 py-24">
          <Reveal>
            <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-graphite md:text-5xl">
              One accountable team, not a{' '}
              <span className="bg-gradient-to-r from-amber via-grape to-coral bg-clip-text text-transparent">
                handful of vendors
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
              ARX Infotech works with businesses and educational institutions across
              infrastructure, software, and security — combining managed IT services
              with product engineering so clients get one accountable partner.
            </p>
            <StaggerGrid className="mt-10 flex flex-wrap gap-4">
              {aboutStats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`rounded-2xl border-2 px-6 py-5 shadow-sm ${stat.accent}`}
                  >
                    <div className="font-display text-3xl font-semibold text-graphite">
                      {stat.static ?? (
                        <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                      )}
                    </div>
                    <div className="mt-1 text-sm text-slate">{stat.label}</div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerGrid>
            <Link
              to="/about"
              className="group mt-10 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-ink px-6 py-3.5 text-base font-medium text-paper transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              More about ARX Infotech
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="border-b border-slate-200 bg-paper-dim py-20">
          <div className="mx-auto max-w-[900px] px-4">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold text-graphite md:text-5xl">Frequently asked questions</h2>
            </Reveal>
            <div className="mt-10 border-t border-slate-200">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.question}
                  faq={faq}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ink py-24">
        <GradientBlobs variant="warm" />
        <StarField count={60} />
        <Reveal className="relative mx-auto max-w-[1100px] px-4">
          <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 via-ink to-slate-900/80 px-8 py-14 shadow-2xl shadow-black/40 sm:px-14 sm:py-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-grape/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5 text-sm font-medium text-amber">
                  Free consultation
                </span>
                <h2 className="mt-5 max-w-lg font-display text-4xl font-semibold leading-tight text-paper md:text-5xl">
                  Need IT support or custom software?
                </h2>
                <p className="mt-4 max-w-md text-lg text-slate-200/70">
                  Let's find the right technology solution for your business — no obligation.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-4">
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
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
