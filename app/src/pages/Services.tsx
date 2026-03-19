import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Hammer, Lightbulb, Wrench, Palette, Truck, RefreshCw, Globe, Loader2 } from 'lucide-react';
import { fetchServices, type Service } from '@/services/products';

// Icon mapping for services
const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  hammer: Hammer,
  lightbulb: Lightbulb,
  wrench: Wrench,
  palette: Palette,
  truck: Truck,
  refresh: RefreshCw,
  globe: Globe,
};

const usps = [
  { icon: Sparkles, title: '47 Years Experience', description: 'Decades of lighting excellence' },
  { icon: Palette, title: 'Custom Made', description: 'Tailored to your vision' },
  { icon: Hammer, title: 'Premium Materials', description: 'Only the finest quality' },
  { icon: Truck, title: 'Pan-India Delivery', description: 'Nationwide service network' },
];

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServices();
        // Filter only active services
        const activeServices = data.filter(s => s.status === 'active');
        setServices(activeServices);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/services-hero.jpg"
            alt="Our Services"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-4"
          >
            What We Offer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl text-white mb-6"
          >
            Complete Lighting Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg mb-8"
          >
            From concept to installation, we provide end-to-end lighting services 
            for residential, commercial, and hospitality projects.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/contact" className="btn-primary">
              Get a Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Our Expertise</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Services We Provide
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C] mx-auto mb-4" />
              <p className="text-[#4A4A4A]">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#4A4A4A]">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                // Get icon from icon_url or default to Lightbulb
                const IconComponent = service.icon_url ? iconMap[service.icon_url] || Lightbulb : Lightbulb;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group bg-white p-8 border border-[#E5E0D5] hover:border-[#C9A84C] transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Icon: render emoji if present, else Lucide icon */}
                    <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#C9A84C] text-white transition-colors">
                      {service.icon_url && !/^[a-z]+$/.test(service.icon_url.trim()) ? (
                        <span className="text-2xl leading-none" style={{ filter: 'brightness(0) invert(1)' }}>{service.icon_url.trim()}</span>
                      ) : (
                        <IconComponent className="w-8 h-8" />
                      )}
                    </div>
                    
                    <h3 className="font-display text-xl text-[#0D0D0D] mb-3">
                      {service.name}
                    </h3>
                    
                    <div className="w-12 h-[2px] bg-[#C9A84C] mb-4" />
                    
                    {/* Render description as bullet list if multi-line, else plain text */}
                    {service.short_description?.includes('\n') ? (
                      <ul className="space-y-1.5 mb-6">
                        {service.short_description.split('\n').filter(line => line.trim()).map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#4A4A4A] text-sm">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0" />
                            {line.trim()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6">
                        {service.short_description}
                      </p>
                    )}

                    <Link
                      to={`/contact?service=${service.slug}`}
                      className="inline-flex items-center gap-2 text-[#C9A84C] font-heading text-xs uppercase tracking-[1px] hover:gap-3 transition-all"
                    >
                      Enquire About This Service
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-[#1C1C1C]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Why Tej Lite</p>
            <h2 className="font-display text-4xl text-white">
              The Tej Lite Advantage
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {usps.map((usp, index) => (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C]">
                  <usp.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-lg text-white mb-2">
                  {usp.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {usp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">How We Work</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Our Process
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', description: 'We understand your vision, requirements, and budget.' },
              { step: '02', title: 'Design', description: 'Our designers create custom lighting plans and 3D visualizations.' },
              { step: '03', title: 'Fabrication', description: 'Skilled craftsmen bring the designs to life with precision.' },
              { step: '04', title: 'Installation', description: 'Professional installation and final adjustments.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <span className="font-display text-6xl text-[#C9A84C]/20">
                  {item.step}
                </span>
                <h3 className="font-display text-xl text-[#0D0D0D] mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-[#4A4A4A] text-sm">
                  {item.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-[2px] bg-[#C9A84C]/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#0D0D0D]">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-white mb-6">
            Ready to Illuminate Your Space?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Contact us today for a free consultation. Our lighting experts will 
            help you create the perfect ambiance for your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Get a Free Quote
            </Link>
            <Link to="/projects" className="btn-secondary border-white text-white hover:bg-white hover:text-[#0D0D0D]">
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
