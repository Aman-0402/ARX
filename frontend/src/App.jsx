import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingContact from './components/FloatingContact.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import SwarmCursor from './components/SwarmCursor.jsx'

const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail.jsx'))
const Industries = lazy(() => import('./pages/Industries.jsx'))
const CaseStudies = lazy(() => import('./pages/CaseStudies.jsx'))
const TechStack = lazy(() => import('./pages/TechStack.jsx'))
const OurProcess = lazy(() => import('./pages/OurProcess.jsx'))
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const BlogSubmit = lazy(() => import('./pages/BlogSubmit.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Overview = lazy(() => import('./pages/admin/Overview.jsx'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog.jsx'))
const AdminContact = lazy(() => import('./pages/admin/AdminContact.jsx'))
const AdminVerify = lazy(() => import('./pages/admin/AdminVerify.jsx'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices.jsx'))
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam.jsx'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials.jsx'))
const AdminClients = lazy(() => import('./pages/admin/AdminClients.jsx'))
const AdminIndustries = lazy(() => import('./pages/admin/AdminIndustries.jsx'))
const AdminCaseStudies = lazy(() => import('./pages/admin/AdminCaseStudies.jsx'))
const AdminTechStack = lazy(() => import('./pages/admin/AdminTechStack.jsx'))
const AdminProcessSteps = lazy(() => import('./pages/admin/AdminProcessSteps.jsx'))
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ.jsx'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'))

function PageLoader() {
  // Only appears if the chunk is still loading after 300ms, so fast/cached
  // loads never flash a spinner — it's reserved for genuinely slow loads.
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-amber" />
      <span className="font-mono text-xs text-slate">Loading…</span>
    </motion.div>
  )
}

const SWARM_PALETTE = ['#0EA5E9', '#22D3EE', '#2F6FED', '#8B5CF6', '#2EC4B6', '#FF6B6B', '#FFD166']

export default function App() {
  const location = useLocation()
  const isBareLayout = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const transitionKey = location.pathname.startsWith('/admin') ? '/admin' : location.pathname
  const swarmColor = useMemo(() => SWARM_PALETTE[Math.floor(Math.random() * SWARM_PALETTE.length)], [])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {!isBareLayout && (
        <SwarmCursor
          global
          color={swarmColor}
          accentColor={swarmColor}
          count={8}
          size={5}
          speed={2.5}
          spread={100}
          wander={0.25}
          trail={0.75}
          scatterOnClick
          style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
        />
      )}
      {!isBareLayout && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={transitionKey}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/submit" element={<BlogSubmit />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/technology" element={<TechStack />} />
                <Route path="/process" element={<OurProcess />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <AdminLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<Overview />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="contact" element={<AdminContact />} />
                  <Route path="verify" element={<AdminVerify />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="clients" element={<AdminClients />} />
                  <Route path="industries" element={<AdminIndustries />} />
                  <Route path="case-studies" element={<AdminCaseStudies />} />
                  <Route path="tech-stack" element={<AdminTechStack />} />
                  <Route path="process-steps" element={<AdminProcessSteps />} />
                  <Route path="faq" element={<AdminFAQ />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isBareLayout && <Footer />}
      {!isBareLayout && <FloatingContact />}
    </div>
  )
}
