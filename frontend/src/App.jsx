import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingContact from './components/FloatingContact.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import RequireAuth from './components/RequireAuth.jsx'

const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))
const BlogSubmit = lazy(() => import('./pages/BlogSubmit.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Overview = lazy(() => import('./pages/admin/Overview.jsx'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog.jsx'))
const AdminContact = lazy(() => import('./pages/admin/AdminContact.jsx'))
const AdminVerify = lazy(() => import('./pages/admin/AdminVerify.jsx'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices.jsx'))
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam.jsx'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials.jsx'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-amber" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isBareLayout = location.pathname === '/login' || location.pathname.startsWith('/admin')
  const transitionKey = location.pathname.startsWith('/admin') ? '/admin' : location.pathname

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
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
