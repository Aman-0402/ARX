import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Login from './pages/Login.jsx'
import Overview from './pages/admin/Overview.jsx'
import AdminBlog from './pages/admin/AdminBlog.jsx'
import AdminContact from './pages/admin/AdminContact.jsx'
import AdminVerify from './pages/admin/AdminVerify.jsx'
import AdminServices from './pages/admin/AdminServices.jsx'
import AdminTeam from './pages/admin/AdminTeam.jsx'

export default function App() {
  const location = useLocation()
  const isBareLayout = location.pathname === '/login' || location.pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col">
      {!isBareLayout && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
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
          </Route>
        </Routes>
      </main>
      {!isBareLayout && <Footer />}
    </div>
  )
}
