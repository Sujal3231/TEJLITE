import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { signOutAdmin } from '@/services/auth';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  Quote,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
  { icon: Briefcase, label: 'Projects', href: '/admin/projects' },
  { icon: Sparkles, label: 'Services', href: '/admin/services' },
  { icon: BookOpen, label: 'Catalogs', href: '/admin/catalogs' },
  { icon: MessageSquare, label: 'Enquiries', href: '/admin/enquiries' },
  { icon: Quote, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login');
    }
  }, [admin, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-[#1C1C1C] border-r border-white/10 w-64">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-[#C9A84C]">TL</span>
            <span className="font-display text-lg text-white">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded transition-colors ${
                isActive(item.href)
                  ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-heading text-sm uppercase tracking-[1px]">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10">
          {admin && (
            <div className="mb-4 px-3">
              <p className="text-white font-medium">{admin.displayName || 'Admin User'}</p>
              <p className="text-white/50 text-sm">{admin.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-heading text-sm uppercase tracking-[1px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#1C1C1C]">
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
              <Link to="/admin" className="flex items-center gap-3">
                <span className="font-display text-xl font-bold text-[#C9A84C]">TL</span>
                <span className="font-display text-lg text-white">Admin</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <nav className="py-6 px-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded transition-colors ${
                    isActive(item.href)
                      ? 'bg-[#C9A84C]/20 text-[#C9A84C]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-heading text-sm uppercase tracking-[1px]">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-heading text-sm uppercase tracking-[1px]">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-[#1C1C1C] border-b border-white/10 flex items-center justify-between px-4">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="font-display text-xl font-bold text-[#C9A84C]">TL</span>
            <span className="font-display text-lg text-white">Admin</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          <div className="max-w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
