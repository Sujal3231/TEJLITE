import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown, Quote, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  fetchProducts, 
  fetchCategories,
  fetchTestimonials,
  type Product,
  type Category,
  type Testimonial
} from '@/services/products';

const stats = [
  { label: 'Years', value: new Date().getFullYear() - 1976, suffix: '+' },
  { label: 'Projects', value: 1000, suffix: '+' },
  { label: 'Products', value: 500, suffix: '+' },
  // { label: 'Countries', value: 20, suffix: '+' },
];

// Animated Counter Component
const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display text-4xl lg:text-5xl font-bold text-[#C9A84C]">
      {count}{suffix}
    </span>
  );
};

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allFeaturedProducts, setAllFeaturedProducts] = useState<Product[]>([]); // Store all featured products
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Track selected category
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Load data from Firebase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, testimonialsData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchTestimonials().catch(err => {
          console.warn('Failed to load testimonials:', err);
          return []; // Return empty array if testimonials fail
        })
      ]);

      // Filter featured and active products (limit to 4)
      const featured = productsData
        .filter(p => p.is_featured && p.status === 'active');
      
      setAllFeaturedProducts(featured); // Store all featured products
      setFeaturedProducts(featured.slice(0, 4)); // Show first 4

      // Filter active projects and shuffle them (limit to 6)
      // Filter active categories sorted by sort_order (show all)
      const activeCategories = categoriesData
        .filter(c => c.status === 'active')
        .sort((a, b) => a.sort_order - b.sort_order);
      setCategories(activeCategories);

      // Filter active testimonials
      const activeTestimonials = testimonialsData.filter(t => t.status === 'active');
      setTestimonials(activeTestimonials);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load some content');
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance testimonials (only if more than 1)
  useEffect(() => {
    if (testimonials.length <= 1) return; // Don't auto-rotate if only 1 or 0 testimonials
    
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Filter products by category
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === 'all') {
      setFeaturedProducts(allFeaturedProducts.slice(0, 4));
    } else {
      const filtered = allFeaturedProducts.filter(p => p.category_id === categoryId);
      setFeaturedProducts(filtered.slice(0, 4));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Ken Burns Effect */}
        <div className="absolute inset-0 animate-ken-burns">
          <img
            src="/images/hero-bg.jpg"
            alt="Luxury chandelier in an elegant interior"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1920&q=80';
            }}
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="eyebrow mb-6"
          >
            Bespoke Lighting Since 1975
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-hero text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight font-bold"
          >
            Crafting Light,<br />
            <span className="text-[#C9A84C]">Defining Spaces</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light tracking-wide"
          >
            Chandeliers & Custom Lighting for Extraordinary Interiors
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/products" className="btn-primary">
              Explore Products
            </Link>
            <Link to="/projects" className="btn-secondary border-white text-white hover:bg-white hover:text-[#0D0D0D]">
              View Projects
            </Link>
          </motion.div>
        </div>

        {/* Bottom Ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-4">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="flex gap-12 whitespace-nowrap"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12">
                  <span className="text-white/60 font-heading text-sm uppercase tracking-[2px]">Since 1975</span>
                  <span className="text-[#C9A84C]">•</span>
                  <span className="text-white/60 font-heading text-sm uppercase tracking-[2px]">Bespoke Craftsmanship</span>
                  <span className="text-[#C9A84C]">•</span>
                  <span className="text-white/60 font-heading text-sm uppercase tracking-[2px]">Custom Designs</span>
                  <span className="text-[#C9A84C]">•</span>
                  <span className="text-white/60 font-heading text-sm uppercase tracking-[2px]">1000+ Projects</span>
                  <span className="text-[#C9A84C]">•</span>
                  <span className="text-white/60 font-heading text-sm uppercase tracking-[2px]">Pan-India Delivery</span>
                  <span className="text-[#C9A84C]">•</span>
                  <span className="text-white/60 font-heading text-sm uppercase tracking-[2px]">Export Ready</span>
                  <span className="text-[#C9A84C]">•</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Categories Strip */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="group relative aspect-square rounded-full overflow-hidden block"
                  >
                    {category.cover_image_url ? (
                      <img
                        src={category.cover_image_url}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        width={300}
                        height={300}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1C1C1C] flex items-center justify-center">
                        <span className="text-[#C9A84C] text-4xl">✦</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-[#C9A84C]/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-heading text-xs uppercase tracking-[1px] text-center px-2">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-[#4A4A4A]">No categories available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-[4/5] lg:aspect-[4/5] overflow-hidden">
                <img
                  src="/images/heritage.jpg"
                  alt="Artisan hand-crafting a bespoke lighting fixture"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={1000}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 lg:w-48 lg:h-48 bg-[#C9A84C]/10 -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <p className="eyebrow mb-4">Our Heritage</p>
              <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl text-[#0D0D0D] mb-4 lg:mb-6 leading-tight">
                Four Decades of<br />Illuminating Excellence
              </h2>
              <p className="text-[#4A4A4A] leading-relaxed mb-4 lg:mb-6 text-sm lg:text-base">
                Since 1975, Tej Lite has been at the forefront of bespoke lighting design. 
                Our journey began with a simple vision: to create lighting fixtures that 
                transcend mere functionality and become works of art.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed mb-6 lg:mb-8 text-sm lg:text-base">
                Every piece we craft tells a story of meticulous craftsmanship, 
                innovative design, and an unwavering commitment to excellence. From 
                grand chandeliers that grace hotel lobbies to intimate pendant lights 
                for luxury residences, we bring the same dedication to every project.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <p className="text-[#4A4A4A] text-xs lg:text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn-secondary inline-flex items-center gap-2">
                Learn Our Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Featured Products Section */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Our Collection</p>
            <h2 className="font-display text-4xl lg:text-5xl text-[#0D0D0D]">
              Signature Collection
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {/* All Tab */}
            <button
              onClick={() => handleCategoryFilter('all')}
              className={`px-6 py-2 font-heading text-sm uppercase tracking-[1px] transition-colors border ${
                selectedCategory === 'all'
                  ? 'text-[#C9A84C] border-[#C9A84C]'
                  : 'text-[#4A4A4A] border-transparent hover:text-[#C9A84C] hover:border-[#C9A84C]'
              }`}
            >
              All
            </button>
            
            {/* Dynamic Category Tabs */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-6 py-2 font-heading text-sm uppercase tracking-[1px] transition-colors border ${
                  selectedCategory === category.id
                    ? 'text-[#C9A84C] border-[#C9A84C]'
                    : 'text-[#4A4A4A] border-transparent hover:text-[#C9A84C] hover:border-[#C9A84C]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white overflow-hidden card-hover"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EDE4]">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C9A84C]/20">
                        <span className="text-6xl">✦</span>
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
                  </div>
                  <div className="p-5">
                    <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-[1.5px] mb-2">
                      {product.category?.name || 'Product'}
                    </p>
                    <h3 className="font-display text-lg text-[#0D0D0D] mb-3 line-clamp-2">
                      {product.name}
                    </h3>
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex items-center gap-2 text-[#C9A84C] font-heading text-sm uppercase tracking-[1px] hover:gap-3 transition-all"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[#4A4A4A]">No featured products available</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Testimonials</p>
              <h2 className="font-display text-4xl lg:text-5xl text-[#0D0D0D]">
                What Our Clients Say
              </h2>
            </div>

            <div className="relative">
              <Quote className="w-16 h-16 text-[#C9A84C]/20 mx-auto mb-8" />
              
              <div className="text-center">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: currentTestimonial === index ? 1 : 0,
                      display: currentTestimonial === index ? 'block' : 'none'
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="font-display text-2xl lg:text-3xl text-[#0D0D0D] italic mb-8 leading-relaxed">
                      "{testimonial.testimonial_text}"
                    </p>
                    <p className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C]">
                      {testimonial.client_name}
                    </p>
                    {testimonial.project_type && (
                      <p className="text-[#4A4A4A] text-sm mt-1">
                        {testimonial.project_type}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Dot Navigation */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-3 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentTestimonial === index ? 'bg-[#C9A84C]' : 'bg-[#C9A84C]/30'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      
    </div>
  );
};

export default Home;
