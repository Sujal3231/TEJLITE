import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Hammer, Lightbulb, Wrench, Palette, Truck, RefreshCw, Globe, Loader2 } from 'lucide-react';
import { RiEqualizerLine, RiMedalLine, RiHandHeartLine, RiCoinLine } from 'react-icons/ri';
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
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Why Tej Lite</p>
            <h2 className="font-display text-4xl lg:text-5xl text-[#0D0D0D] mb-6 font-semibold">
              Why Us
            </h2>
            <p className="text-[#2A2A2A] max-w-2xl mx-auto text-lg font-medium">
              With decades of experience and unwavering commitment to quality, 
              we've built our reputation on delivering exceptional lighting solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Customisable Range",
                description: "Standard or custom: we have the flexibility to deliver specifications designed around your exact project parameters.",
                icon: <RiEqualizerLine className="w-8 h-8 text-[#C9A84C]" />
              },
              {
                title: "50+ Years in the Industry",
                description: "Throughout this time, decades of knowledge and experience has accumulated through the numerous projects we have been involved in.",
                icon: <RiMedalLine className="w-8 h-8 text-[#C9A84C]" />
              },
              {
                title: "Strong Relationships",
                description: "We believe in building meaningful, sustainable partnerships and consider client satisfaction our most valued achievement.",
                icon: <RiHandHeartLine className="w-8 h-8 text-[#C9A84C]" />
              },
              {
                title: "Value Engineering",
                description: "We optimize specifications to reduce costs and keep your project within budget—without compromising quality or performance.",
                icon: <RiCoinLine className="w-8 h-8 text-[#C9A84C]" />
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center group"
              >
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full border-2 border-[#C9A84C] bg-white flex items-center justify-center mb-[-12px] relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-[#A07830] shadow-sm">
                  {item.icon}
                </div>
                
                {/* Card */}
                <div className="bg-white rounded-xl pt-8 pb-6 px-6 w-full h-48 flex flex-col justify-between transition-all duration-300 group-hover:shadow-lg border border-[#E5E0D5] group-hover:border-[#C9A84C]">
                  <div>
                    <h3 className="font-heading text-sm font-bold uppercase tracking-[0.05em] text-[#0D0D0D] leading-tight mb-3 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-sm font-normal leading-relaxed text-[#2A2A2A] line-clamp-8">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="section-padding bg-[#0D0D0D]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4 text-[#C9A84C]">How We Work</p>
            <h2 className="font-display text-4xl lg:text-6xl text-white mb-6">
              Our Process
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Our team are integral to every step of the journey. This active participation enables 
              us to maintain the highest levels of quality control and customer care.
            </p>
          </div>

          {/* Horizontal Chevron Process Flow */}
          <div className="w-full mb-16">
            {/* Desktop Version */}
            <div className="hidden md:flex w-full rounded-lg overflow-hidden">
              {[
                {
                  number: "1",
                  title: "Research &\nDevelopment",
                  items: ["Understand Client Needs", "Dialogue on Technical Input", "Proposal"],
                  bgColor: "bg-[#C9A84C]"
                },
                {
                  number: "2", 
                  title: "Design Approval\n& Pricing",
                  items: ["Product Design", "Electrical Schematics", "Luminaire Quotation"],
                  bgColor: "bg-[#B8975C]"
                },
                {
                  number: "3",
                  title: "Manufacturing &\nProduct Development", 
                  items: ["CNC", "Metalwork", "Custom PCB Production"],
                  bgColor: "bg-[#A7866C]"
                },
                {
                  number: "4",
                  title: "Testing, Finishing &\nAssembling",
                  items: ["Product Testing", "Programming"],
                  bgColor: "bg-[#96757C]"
                },
                {
                  number: "5",
                  title: "Delivery &\nInstallation", 
                  items: ["Commissioning", "Inspection", "Final System Testing"],
                  bgColor: "bg-[#85648C]"
                },
                {
                  number: "6",
                  title: "After-care",
                  items: ["Quarterly Audits", "Repair & Maintenance", "Lighting Quality Assurance"],
                  bgColor: "bg-[#74539C]"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`
                    flex-1 relative p-6 md:p-8 flex flex-col justify-start min-h-[240px] cursor-default
                    transition-all duration-400 hover:flex-[1.6] group
                    ${step.bgColor}
                  `}
                  style={{
                    clipPath: index === 0 
                      ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)'
                      : index < 5
                      ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)'
                      : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20px 50%)',
                    marginLeft: index > 0 ? '-1px' : '0'
                  }}
                >
                  {/* Large background number */}
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-display text-[130px] leading-none text-white/12 pointer-events-none select-none transition-opacity duration-300 group-hover:opacity-25">
                    {step.number}
                  </span>
                  
                  {/* Step content */}
                  <div className="relative z-10 pt-4">
                    <h3 className="text-white font-heading text-xs md:text-sm font-semibold uppercase tracking-wider mb-3 leading-tight whitespace-pre-line">
                      {step.title}
                    </h3>
                    <ul className="space-y-1">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="text-white/40 text-xs mt-1">–</span>
                          <span className="text-white/75 text-xs leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile Version */}
            <div className="md:hidden space-y-4">
              {[
                {
                  number: "1",
                  title: "Research & Development",
                  items: ["Understand Client Needs", "Dialogue on Technical Input", "Proposal"],
                  bgColor: "bg-[#C9A84C]"
                },
                {
                  number: "2", 
                  title: "Design Approval & Pricing",
                  items: ["Product Design", "Electrical Schematics", "Luminaire Quotation"],
                  bgColor: "bg-[#B8975C]"
                },
                {
                  number: "3",
                  title: "Manufacturing & Product Development", 
                  items: ["CNC", "Metalwork", "Custom PCB Production"],
                  bgColor: "bg-[#A7866C]"
                },
                {
                  number: "4",
                  title: "Testing, Finishing & Assembling",
                  items: ["Product Testing", "Programming"],
                  bgColor: "bg-[#96757C]"
                },
                {
                  number: "5",
                  title: "Delivery & Installation", 
                  items: ["Commissioning", "Inspection", "Final System Testing"],
                  bgColor: "bg-[#85648C]"
                },
                {
                  number: "6",
                  title: "After-care",
                  items: ["Quarterly Audits", "Repair & Maintenance", "Lighting Quality Assurance"],
                  bgColor: "bg-[#74539C]"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`
                    relative p-6 min-h-[160px] flex flex-col justify-start
                    ${step.bgColor}
                    ${index < 5 ? 'border-b border-white/8' : ''}
                  `}
                >
                  {/* Large background number */}
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-display text-[80px] leading-none text-white/12 pointer-events-none select-none">
                    {step.number}
                  </span>
                  
                  {/* Step content */}
                  <div className="relative z-10 pt-4">
                    <h3 className="text-white font-heading text-sm font-semibold uppercase tracking-wider mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <ul className="space-y-1">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="text-white/40 text-xs mt-1">–</span>
                          <span className="text-white/75 text-xs leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Decorative line and footer note */}
            <div className="mt-12">
              <div className="h-[1px] bg-gradient-to-r from-[#C9A84C] to-transparent w-2/5 opacity-40 mb-5"></div>
              <p className="text-white/20 text-xs uppercase tracking-[0.1em] font-heading">
                End-to-end quality · 6 integrated stages
              </p>
            </div>
          </div>
          

          {/* Quote Section */}
          <div className="mt-20 relative h-[400px] rounded-lg overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80')`
              }}
            >
              <div className="absolute inset-0 bg-[#C9A84C]/20 backdrop-brightness-75"></div>
              <div className="absolute bottom-12 left-12 max-w-md">
                <p className="text-white font-display italic text-2xl leading-relaxed">
                  "Architectural precision is not just a standard, it's our foundational philosophy."
                </p>
                <p className="text-white/80 font-heading text-sm uppercase tracking-widest mt-4">
                  — Nemji Gala, Founder
                </p>
              </div>
            </div>
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


