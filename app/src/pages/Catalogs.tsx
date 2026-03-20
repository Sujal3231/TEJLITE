import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchCatalogs, updateCatalog, type Catalog } from '@/services/products';

const Catalogs = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      setLoading(true);
      const data = await fetchCatalogs();
      // Only show active catalogs
      setCatalogs(data.filter(c => c.status === 'active'));
    } catch (error) {
      console.error('Error loading catalogs:', error);
      toast.error('Failed to load catalogs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCatalog = async (catalog: Catalog) => {
    try {
      // Increment download count
      await updateCatalog(catalog.id, {
        download_count: (catalog.download_count || 0) + 1
      });
      
      // Open PDF in new tab
      window.open(catalog.pdf_url, '_blank');
      
      toast.success(`Opening ${catalog.title}...`);
    } catch (error) {
      console.error('Error opening catalog:', error);
      toast.error('Failed to open catalog');
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Digital catalog request submitted! We will send the PDF to your email within 24 hours.');
    setRequestForm({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/catalogs-hero.jpg"
            alt="Our Catalogs"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-4"
          >
            Download
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl text-white mb-4"
          >
            Our Catalogs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl"
          >
            Browse and download our complete range of lighting catalogs. 
            Explore our collections and find the perfect lighting for your space.
          </motion.p>
        </div>
      </section>

      {/* Catalogs Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C] mx-auto mb-4" />
              <p className="text-[#4A4A4A]">Loading catalogs...</p>
            </div>
          ) : catalogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#4A4A4A] text-lg mb-4">No catalogs available at the moment.</p>
              <p className="text-[#4A4A4A]">Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalogs.map((catalog, index) => (
                <motion.div
                  key={catalog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white border border-[#E5E0D5] overflow-hidden">
                    {/* Cover Image */}
                    <div 
                      className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                      style={{ perspective: '800px' }}
                    >
                      <div className="w-full h-full transition-transform duration-500 group-hover:rotate-y-6 group-hover:shadow-2xl">
                        <img
                          src={catalog.cover_image_url}
                          alt={catalog.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&q=80';
                          }}
                        />
                      </div>
                      
                      {catalog.is_latest && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-[#C9A84C] text-white text-xs font-heading uppercase tracking-[1px]">
                          Latest
                        </span>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleViewCatalog(catalog)}
                          className="px-6 py-3 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] hover:bg-[#A07830] transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Catalog
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#C9A84C] font-heading text-xs uppercase tracking-[1px]">
                          {catalog.year}
                        </span>
                        {/* {catalog.download_count > 0 && (
                          <span className="text-[#4A4A4A] text-sm">
                            {catalog.download_count} downloads
                          </span>
                        )} */}
                      </div>
                      <h3 className="font-display text-lg text-[#0D0D0D] mb-2">
                        {catalog.title}
                      </h3>
                      {catalog.description && (
                        <p className="text-[#4A4A4A] text-sm line-clamp-2">
                          {catalog.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow mb-4">Need Help?</p>
            <h2 className="font-display text-3xl lg:text-4xl text-[#0D0D0D] mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-[#4A4A4A] max-w-2xl mx-auto mb-8">
              Our team is here to help you find the perfect lighting solution. 
              Contact us for personalized recommendations and custom designs.
            </p>
            <a href="/contact" className="btn-primary">
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* PDF Catalog Request */}
      <section className="section-padding bg-[#1C1C1C]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow mb-4">Request</p>
              <h2 className="font-display text-3xl lg:text-4xl text-white mb-6">
                Digital Catalog
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Get our latest catalog delivered directly to your email. Fill in your 
                details and we will send you a comprehensive PDF catalog with our complete range.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C]">
                    <span className="text-xl">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Fill the form</p>
                    <p className="text-white/60 text-sm">Enter your contact details</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C]">
                    <span className="text-xl">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">We process</p>
                    <p className="text-white/60 text-sm">Within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C]">
                    <span className="text-xl">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Email delivery</p>
                    <p className="text-white/60 text-sm">PDF sent to your inbox</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8">
              <form onSubmit={handleRequestSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={requestForm.phone}
                      onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={requestForm.city}
                      onChange={(e) => setRequestForm({ ...requestForm, city: e.target.value })}
                      className="w-full px-4 py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={requestForm.address}
                    onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                    placeholder="Tell us about your project or specific requirements..."
                    className="w-full px-4 py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Request Digital Catalog
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalogs;
