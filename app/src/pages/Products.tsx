import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, List, ChevronDown, X, Search, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchSubcategories,
  type Product,
  type Category,
  type Subcategory
} from '@/services/products';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [gridCols, setGridCols] = useState<2 | 4>(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Firebase data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Firebase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, subcategoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSubcategories()
      ]);

      // Filter active products and sort
      const activeProducts = productsData.filter(p => p.status === 'active');
      setProducts(activeProducts);

      // Filter active categories and sort
      const activeCategories = categoriesData
        .filter(c => c.status === 'active')
        .sort((a, b) => a.sort_order - b.sort_order);
      setCategories(activeCategories);

      // Filter active subcategories
      const activeSubcategories = subcategoriesData.filter(s => s.status === 'active');
      setSubcategories(activeSubcategories);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Filter by category (using category_id)
    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category && product.category_id !== category.id) return false;
    }
    
    // Filter by subcategories (using subcategory_id)
    if (selectedSubcategories.length > 0) {
      const subcategoryIds = selectedSubcategories
        .map(slug => subcategories.find(s => s.slug === slug)?.id)
        .filter(Boolean);
      if (!subcategoryIds.includes(product.subcategory_id)) return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      case 'newest':
        if (a.is_new && !b.is_new) return -1;
        if (!a.is_new && b.is_new) return 1;
        return 0;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Get current subcategories for selected category
  const currentSubcategories = selectedCategory 
    ? subcategories.filter(sub => {
        const category = categories.find(c => c.slug === selectedCategory);
        return category && sub.category_id === category.id;
      }).sort((a, b) => a.sort_order - b.sort_order)
    : [];

  // Get category by slug
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
  
  // Get product count for each category
  const getCategoryCount = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId).length;
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? null : slug);
    setSelectedSubcategories([]);
    setSearchParams(slug ? { category: slug } : {});
  };

  const handleSubcategoryToggle = (slug: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setSearchParams({});
    toast.info('Filters cleared');
  };

  const activeFilterCount = (selectedCategory ? 1 : 0) + selectedSubcategories.length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C] mx-auto mb-4" />
          <p className="text-[#4A4A4A]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Banner */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/products-hero.jpg"
            alt="Our Collections"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <nav className="flex items-center justify-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#C9A84C]">Products</span>
          </nav>
          <h1 className="font-display text-4xl lg:text-5xl text-white mb-4">
            {selectedCategory 
              ? getCategoryBySlug(selectedCategory)?.name 
              : 'Our Collections'}
          </h1>
          <p className="text-white/60">
            {sortedProducts.length} Products
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-20 z-30 bg-[#FAF7F2] border-b border-[#E5E0D5]">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleCategoryClick('')}
              className={`flex-shrink-0 px-3 py-1.5 font-heading text-xs uppercase tracking-[1px] rounded-full transition-all ${
                !selectedCategory 
                  ? 'bg-[#C9A84C] text-white shadow-sm' 
                  : 'bg-white text-[#4A4A4A] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`flex-shrink-0 px-3 py-1.5 font-heading text-xs uppercase tracking-[1px] rounded-full transition-all flex items-center gap-1.5 ${
                  selectedCategory === category.slug 
                    ? 'bg-[#C9A84C] text-white shadow-sm' 
                    : 'bg-white text-[#4A4A4A] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]'
                }`}
              >
                {category.name}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category.slug
                    ? 'bg-white/20 text-white'
                    : 'bg-[#0D0D0D]/5 text-[#4A4A4A]'
                }`}>
                  {getCategoryCount(category.id)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Subcategory Pills */}
      {currentSubcategories.length > 0 && (
        <section className="bg-[#F2EDE4] border-b border-[#E5E0D5]">
          <div className="container-custom py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[#4A4A4A] text-sm">Filter by:</span>
              {currentSubcategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => handleSubcategoryToggle(sub.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-heading transition-all ${
                    selectedSubcategories.includes(sub.slug)
                      ? 'bg-[#C9A84C] text-white'
                      : 'bg-white text-[#4A4A4A] border border-[#E5E0D5] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Search & Filter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] w-64"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E0D5] text-[#4A4A4A]"
              >
                <Filter className="w-4 h-4" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="bg-[#C9A84C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-white border border-[#E5E0D5] text-[#4A4A4A] focus:outline-none focus:border-[#C9A84C] cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4A4A] pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-white border border-[#E5E0D5]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#C9A84C] text-white' : 'text-[#4A4A4A]'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#C9A84C] text-white' : 'text-[#4A4A4A]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Columns Toggle */}
              {viewMode === 'grid' && (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => setGridCols(4)}
                    className={`p-2 ${gridCols === 4 ? 'text-[#C9A84C]' : 'text-[#4A4A4A]'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(2)}
                    className={`p-2 ${gridCols === 2 ? 'text-[#C9A84C]' : 'text-[#4A4A4A]'}`}
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="bg-current" />
                      <div className="bg-current" />
                      <div className="bg-current" />
                      <div className="bg-current" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-[#4A4A4A] text-sm">Active filters:</span>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-sm">
                  {getCategoryBySlug(selectedCategory)?.name}
                  <button onClick={() => handleCategoryClick('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubcategories.map((sub) => (
                <span key={sub} className="inline-flex items-center gap-1 px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-sm">
                  {currentSubcategories.find(s => s.slug === sub)?.name}
                  <button onClick={() => handleSubcategoryToggle(sub)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-[#4A4A4A] hover:text-[#C9A84C] text-sm underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <p className="text-[#4A4A4A] text-sm mb-6">
            Showing {sortedProducts.length} of {products.length} products
          </p>

          {/* Products Grid/List */}
          {sortedProducts.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? `grid gap-6 ${gridCols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`
                : 'space-y-6'
            }>
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group bg-white overflow-hidden card-hover ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden bg-[#F2EDE4] ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-[4/3]'}`}>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#C9A84C] text-6xl">✦</span>
                      </div>
                    )}
                    {product.is_new && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-[#C9A84C] text-white text-xs font-heading uppercase tracking-[1px]">
                        New
                      </span>
                    )}
                    {product.is_featured && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-[#0D0D0D] text-white text-xs font-heading uppercase tracking-[1px]">
                        Featured
                      </span>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-[#C9A84C] hover:text-white transition-colors"
                        onClick={() => toast.info('Quick view coming soon')}
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/contact?product=${product.id}`}
                        className="w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-[#C9A84C] hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1">
                    <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-[1.5px] mb-2">
                      {product.category?.name || 'Product'}
                    </p>
                    <h3 className="font-display text-lg text-[#0D0D0D] mb-3">
                      {product.name}
                    </h3>
                    {viewMode === 'list' && product.short_description && (
                      <p className="text-[#4A4A4A] text-sm mb-4 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex items-center gap-2 text-[#C9A84C] font-heading text-sm uppercase tracking-[1px] hover:gap-3 transition-all"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#4A4A4A] text-lg mb-4">No products found</p>
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            </div>
          )}

          {/* Load More */}
          {sortedProducts.length > 0 && sortedProducts.length < products.length && (
            <div className="text-center mt-12">
              <button 
                className="btn-secondary"
                onClick={() => toast.info('More products coming soon')}
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
