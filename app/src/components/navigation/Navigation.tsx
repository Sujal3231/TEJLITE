import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategories, fetchSubcategories, type Category, type Subcategory } from '@/services/products';
import tejLiteLogo from '../../images/logo/Tej Lite Logo.png';

interface CategoryWithSubs extends Category {
  subcategories: Subcategory[];
}

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const location = useLocation();

  // Fetch categories and subcategories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const [categoriesData, subcategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSubcategories()
        ]);

        // Filter active categories and sort by sort_order
        const activeCategories = categoriesData
          .filter(c => c.status === 'active')
          .sort((a, b) => a.sort_order - b.sort_order);

        // Map categories with their subcategories
        const categoriesWithSubs: CategoryWithSubs[] = activeCategories.map(category => ({
          ...category,
          subcategories: subcategoriesData
            .filter(sub => sub.category_id === category.id && sub.status === 'active')
            .sort((a, b) => a.sort_order - b.sort_order)
        }));

        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    setShowAllCategories(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products', hasMegaMenu: true },
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Catalogs', href: '/catalogs' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  // Pages that should have solid header background (all pages except home)
  const shouldHaveSolidHeader = location.pathname !== '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || shouldHaveSolidHeader
            ? 'bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/95 to-[#0D0D0D]/80 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="h-20 lg:h-20 flex items-center">
          <div className="container-custom w-full flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 animate-slide-left"
            >
              <img
                src={tejLiteLogo}
                alt="TEJ LITE"
                className="h-14 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasMegaMenu && setIsMegaMenuOpen(true)}
                  onMouseLeave={() => link.hasMegaMenu && setIsMegaMenuOpen(false)}
                >
                  <Link
                    to={link.href}
                    className={`nav-link font-heading text-sm uppercase tracking-[2px] transition-colors duration-300 py-2 flex items-center gap-1 ${
                      location.pathname === link.href || 
                      (link.href === '/products' && location.pathname.startsWith('/products'))
                        ? 'text-[#C9A84C] border-b-2 border-[#C9A84C]' 
                        : 'text-white/90 hover:text-[#C9A84C]'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {link.label}
                    {link.hasMegaMenu && <ChevronDown className="w-4 h-4" />}
                  </Link>
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Enquire Now Button */}
              <Link
                to="/contact"
                className="hidden lg:inline-flex btn-primary text-xs"
              >
                Enquire Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="hidden lg:block absolute top-full left-0 right-0 bg-[#1C1C1C] border-t-2 border-[#C9A84C] shadow-2xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C9A84C]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#C9A84C]/50"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => {
                setIsMegaMenuOpen(false);
                setHoveredCategory(null);
              }}
            >
              <div className="container-custom py-8">
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-white/50">Loading categories...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/50">No categories available</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-8">
                      {/* Categories Grid */}
                      <div className="col-span-3 grid grid-cols-4 gap-6">
                        {(showAllCategories ? categories : categories.slice(0, 12)).map((category) => (
                          <div
                            key={category.id}
                            className="space-y-3"
                            onMouseEnter={() => setHoveredCategory(category.id)}
                          >
                            <Link
                              to={`/products?category=${category.slug}`}
                              className="block font-heading text-xs uppercase tracking-[2px] text-[#C9A84C] border-b border-[#C9A84C]/30 pb-2 hover:border-[#C9A84C] transition-colors"
                            >
                              {category.name}
                            </Link>
                            {category.subcategories.length > 0 && (
                              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C9A84C]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#C9A84C]/50 pr-2">
                                <ul className="space-y-2">
                                  {category.subcategories.slice(0, 10).map((sub) => (
                                    <li key={sub.id}>
                                      <Link
                                        to={`/products?category=${category.slug}&subcategory=${sub.slug}`}
                                        className="text-white/70 text-sm hover:text-[#C9A84C] hover:translate-x-1 transition-all duration-200 inline-block"
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))}
                                  {category.subcategories.length > 10 && (
                                    <li>
                                      <Link
                                        to={`/products?category=${category.slug}`}
                                        className="text-[#C9A84C] text-sm font-medium hover:text-white transition-colors inline-flex items-center gap-1 mt-2"
                                      >
                                        View More ({category.subcategories.length - 10} more)
                                        <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                                      </Link>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* View More Categories Button */}
                        {!showAllCategories && categories.length > 12 && (
                          <div className="col-span-4 flex justify-center mt-4">
                            <button
                              onClick={() => setShowAllCategories(true)}
                              className="px-6 py-3 bg-[#C9A84C]/10 border border-[#C9A84C] text-[#C9A84C] font-heading text-xs uppercase tracking-[2px] hover:bg-[#C9A84C] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                            >
                              View More Categories ({categories.length - 12} more)
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        
                        {/* Show Less Button */}
                        {showAllCategories && categories.length > 12 && (
                          <div className="col-span-4 flex justify-center mt-4">
                            <button
                              onClick={() => setShowAllCategories(false)}
                              className="px-6 py-3 bg-[#C9A84C]/10 border border-[#C9A84C] text-[#C9A84C] font-heading text-xs uppercase tracking-[2px] hover:bg-[#C9A84C] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                            >
                              Show Less
                              <ChevronDown className="w-4 h-4 rotate-180" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Featured Image - Sticky */}
                      <div className="col-span-1">
                        <div className="sticky top-4">
                          <div className="relative h-[350px] rounded overflow-hidden bg-[#0D0D0D]">
                            {hoveredCategory && categories.find(c => c.id === hoveredCategory)?.cover_image_url ? (
                              <img
                                src={categories.find(c => c.id === hoveredCategory)?.cover_image_url}
                                alt={categories.find(c => c.id === hoveredCategory)?.name}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[#C9A84C] text-6xl">✦</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-white font-display text-lg">
                                {hoveredCategory 
                                  ? categories.find(c => c.id === hoveredCategory)?.name 
                                  : 'Explore Our Collections'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View All Button */}
                    <div className="mt-8 text-center">
                      <Link
                        to="/products"
                        className="inline-flex btn-secondary text-xs"
                      >
                        View All Products
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#0D0D0D] overflow-y-auto"
            >
              <div className="p-6 pt-24">
                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      {link.hasMegaMenu ? (
                        <div className="space-y-3">
                          <Link
                            to={link.href}
                            className={`block font-heading text-sm uppercase tracking-[2px] transition-colors ${
                              location.pathname === link.href || 
                              (link.href === '/products' && location.pathname.startsWith('/products'))
                                ? 'text-[#C9A84C] border-l-2 border-[#C9A84C] pl-2' 
                                : 'text-[#C9A84C]'
                            }`}
                          >
                            {link.label}
                          </Link>
                          {loading ? (
                            <p className="pl-4 text-white/50 text-sm">Loading...</p>
                          ) : (
                            <div className="pl-4 space-y-2 border-l border-[#C9A84C]/30">
                              {categories.map((category) => (
                                <Link
                                  key={category.id}
                                  to={`/products?category=${category.slug}`}
                                  className="block text-white/70 text-sm py-1 hover:text-[#C9A84C] transition-colors"
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={link.href}
                          className={`block font-heading text-sm uppercase tracking-[2px] transition-colors py-2 ${
                            location.pathname === link.href || 
                            (link.href === '/products' && location.pathname.startsWith('/products'))
                              ? 'text-[#C9A84C] border-l-2 border-[#C9A84C] pl-2' 
                              : 'text-white/90 hover:text-[#C9A84C]'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="btn-primary w-full text-center text-xs"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
