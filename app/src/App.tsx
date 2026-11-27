import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import { Loader2 } from 'lucide-react';

// Layouts (keep eager - always needed)
import MainLayout from '@/layouts/MainLayout';

// Lazy-loaded public pages
const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Catalogs = lazy(() => import('@/pages/Catalogs'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Setup = lazy(() => import('@/pages/Setup'));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminCategories = lazy(() => import('@/pages/admin/Categories'));
const AdminProjects = lazy(() => import('@/pages/admin/Projects'));
const AdminServices = lazy(() => import('@/pages/admin/Services'));
const AdminCatalogs = lazy(() => import('@/pages/admin/Catalogs'));
const AdminEnquiries = lazy(() => import('@/pages/admin/Enquiries'));
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
    <Loader2 className="w-10 h-10 animate-spin text-[#C9A84C]" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
        <Toaster position="top-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
