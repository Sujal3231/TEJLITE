import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';

// Public Pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Catalogs from '@/pages/Catalogs';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Setup from '@/pages/Setup';

// Admin Pages
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProducts from '@/pages/admin/Products';
import AdminCategories from '@/pages/admin/Categories';
import AdminProjects from '@/pages/admin/Projects';
import AdminServices from '@/pages/admin/Services';
import AdminCatalogs from '@/pages/admin/Catalogs';
import AdminEnquiries from '@/pages/admin/Enquiries';
import AdminTestimonials from '@/pages/admin/Testimonials';
import AdminSettings from '@/pages/admin/Settings';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="catalogs" element={<Catalogs />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Setup Route */}
          <Route path="/setup" element={<Setup />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="catalogs" element={<AdminCatalogs />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
