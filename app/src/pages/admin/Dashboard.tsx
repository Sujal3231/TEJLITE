import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  FolderTree, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  MessageSquare,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Plus,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchProducts,
  fetchCategories,
  fetchProjects,
  fetchServices,
  fetchCatalogs,
  fetchEnquiries,
  type Product,
  type Category,
  type Project,
  type Enquiry
} from '@/services/products';

interface DashboardStats {
  products: number;
  categories: number;
  projects: number;
  services: number;
  catalogs: number;
  newEnquiries: number;
}

const quickActions = [
  { label: 'Add Product', href: '/admin/products', icon: Plus, color: 'bg-[#C9A84C] hover:bg-[#A07830]' },
  { label: 'Add Project', href: '/admin/projects', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'View Enquiries', href: '/admin/enquiries', icon: MessageSquare, color: 'bg-green-600 hover:bg-green-700' },
  { label: 'Add Service', href: '/admin/services', icon: Plus, color: 'bg-purple-600 hover:bg-purple-700' },
];

const AdminDashboard = () => {
  const { admin, loading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    projects: 0,
    services: 0,
    catalogs: 0,
    newEnquiries: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(date);
  }, []);

  useEffect(() => {
    if (!authLoading && admin) {
      loadDashboardData();
    }
  }, [authLoading, admin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        productsData,
        categoriesData,
        projectsData,
        servicesData,
        catalogsData,
        enquiriesData
      ] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchProjects(),
        fetchServices(),
        fetchCatalogs(),
        fetchEnquiries()
      ]);

      // Calculate stats
      const newEnquiriesCount = enquiriesData.filter(e => e.status === 'new').length;

      setStats({
        products: productsData.length,
        categories: categoriesData.length,
        projects: projectsData.length,
        services: servicesData.length,
        catalogs: catalogsData.length,
        newEnquiries: newEnquiriesCount
      });

      // Get recent enquiries (last 5)
      const sortedEnquiries = [...enquiriesData]
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentEnquiries(sortedEnquiries);

      // Get recent products (last 5)
      const sortedProducts = [...productsData]
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5);
      setRecentProducts(sortedProducts);

      setCategories(categoriesData);
      setAllProjects(projectsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500/20 text-red-500';
      case 'read': return 'bg-blue-500/20 text-blue-500';
      case 'responded': return 'bg-green-500/20 text-green-500';
      case 'archived': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const statsConfig = [
    { 
      label: 'Total Products', 
      value: stats.products, 
      icon: Package, 
      href: '/admin/products',
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      label: 'Categories', 
      value: stats.categories, 
      icon: FolderTree, 
      href: '/admin/categories',
      color: 'bg-green-500/10 text-green-500'
    },
    { 
      label: 'Projects', 
      value: stats.projects, 
      icon: Briefcase, 
      href: '/admin/projects',
      color: 'bg-purple-500/10 text-purple-500'
    },
    { 
      label: 'Services', 
      value: stats.services, 
      icon: Sparkles, 
      href: '/admin/services',
      color: 'bg-orange-500/10 text-orange-500'
    },
    { 
      label: 'Catalogs', 
      value: stats.catalogs, 
      icon: BookOpen, 
      href: '/admin/catalogs',
      color: 'bg-pink-500/10 text-pink-500'
    },
    { 
      label: 'New Enquiries', 
      value: stats.newEnquiries, 
      icon: MessageSquare, 
      href: '/admin/enquiries',
      color: 'bg-red-500/10 text-red-500'
    },
  ];

  // Calculate content distribution for chart
  const getContentDistribution = () => {
    const total = stats.products + stats.projects + stats.services + stats.catalogs;
    if (total === 0) return [];

    return [
      { 
        label: 'Products', 
        count: stats.products, 
        percentage: Math.round((stats.products / total) * 100),
        color: 'bg-blue-500'
      },
      { 
        label: 'Projects', 
        count: stats.projects, 
        percentage: Math.round((stats.projects / total) * 100),
        color: 'bg-purple-500'
      },
      { 
        label: 'Services', 
        count: stats.services, 
        percentage: Math.round((stats.services / total) * 100),
        color: 'bg-orange-500'
      },
      { 
        label: 'Catalogs', 
        count: stats.catalogs, 
        percentage: Math.round((stats.catalogs / total) * 100),
        color: 'bg-pink-500'
      },
    ].filter(item => item.count > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">
            Welcome back, Admin
          </h1>
          <p className="text-white/50">{currentDate}</p>
        </div>
        <div className="flex gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={`px-4 py-2 ${action.color} text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 transition-colors`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.href} className="block bg-[#1C1C1C] border border-white/10 p-6 hover:border-[#C9A84C]/50 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-[#C9A84C] transition-colors" />
              </div>
              <p className="text-white/50 font-heading text-sm uppercase tracking-[1px] mb-1">
                {stat.label}
              </p>
              <p className="text-white text-3xl font-display">{stat.value}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1C1C1C] border border-white/10"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-display text-xl text-white">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-[#C9A84C] text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {recentEnquiries.length > 0 ? (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{enquiry.name}</p>
                      <p className="text-white/50 text-sm">{enquiry.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-heading uppercase tracking-[1px] rounded ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/40 capitalize">{enquiry.type}</span>
                    {enquiry.product_name && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="text-[#C9A84C]">{enquiry.product_name}</span>
                      </>
                    )}
                    <span className="text-white/20 ml-auto">{formatDate(enquiry.created_at)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-2" />
                <p className="text-white/50">No enquiries yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1C1C1C] border border-white/10"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-display text-xl text-white">Recently Added Products</h2>
            <Link to="/admin/products" className="text-[#C9A84C] text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/5 flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-white/50 text-sm">{getCategoryName(product.category_id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-sm">{formatDate(product.created_at)}</p>
                    <Link 
                      to={`/products/${product.id}`}
                      target="_blank"
                      className="text-[#C9A84C] text-sm hover:underline inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-2" />
                <p className="text-white/50">No products yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1C1C1C] border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-white">Content Overview</h2>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
            <span>Total: {stats.products + stats.projects + stats.services + stats.catalogs} items</span>
          </div>
        </div>
        
        {getContentDistribution().length > 0 ? (
          <div className="space-y-4">
            {getContentDistribution().map((item, index) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-white font-heading text-sm uppercase tracking-[1px]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 text-sm">{item.count} items</span>
                    <span className="text-[#C9A84C] font-medium text-sm w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.6 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-2" />
            <p className="text-white/50">No content yet. Start by adding products, projects, or services.</p>
          </div>
        )}

        {/* Quick Stats Summary */}
        {getContentDistribution().length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/50 text-xs font-heading uppercase tracking-[1px] mb-1">
                Featured Products
              </p>
              <p className="text-white text-2xl font-display">
                {recentProducts.filter(p => p.is_featured).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-xs font-heading uppercase tracking-[1px] mb-1">
                Featured Projects
              </p>
              <p className="text-white text-2xl font-display">
                {allProjects.filter(p => p.is_featured).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-xs font-heading uppercase tracking-[1px] mb-1">
                Active Categories
              </p>
              <p className="text-white text-2xl font-display">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/50 text-xs font-heading uppercase tracking-[1px] mb-1">
                Pending Enquiries
              </p>
              <p className="text-white text-2xl font-display">
                {recentEnquiries.filter(e => e.status === 'new' || e.status === 'read').length}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
