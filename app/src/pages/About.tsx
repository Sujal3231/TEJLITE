import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Sparkles, Shield, Check } from 'lucide-react';

// Import milestone images
import milestone1975 from '../images/1975.png';
import milestone1998 from '../images/1998.png';
import milestone2001 from '../images/2001.png';
import milestone2002 from '../images/2002.png';
import milestone2003 from '../images/2003.png';
import milestone2024 from '../images/2024.png';
import founderImage from '../images/Nemji Sir.png';

// Import logo images
import tejLiteGroupLogo from '../images/logo/Left Content.png';
import tejLiteLogo from '../images/logo/Entity 1_ TEJ LITE.png';
import experienceEmotionLogo from '../images/logo/Entity 2_ EXPERIENCE+EMOTION.png';

const milestones = [
  { year: '1975', title: 'Established', description: 'Founded as Tej Kiran, a family-owned business, part of Gala\'s Family Group, which later evolved as Tej Lite.', image: milestone1975 },
  { year: '1998', title: 'Showroom Launch', description: 'IIID Past President Ar. Jayant Tipnis inaugurated our Lighting Showroom in Mumbai.', image: milestone1998 },
  { year: '2001', title: 'First Artemide', description: 'First to bring Artemide to India, marking a defining moment in premium lighting.', image: milestone2001 },
  { year: '2002', title: 'International Brands & Lighting Idea Book', description: 'First to introduce international brands: Atelier Sedap (FR), Regent (CH), Vistosi (IT), Unilamp (TH), Atomis (NL), Cristallux (DE), Poesia (IT), Eglo (AT), Murano Glass Collection (IT), Belfiore (IT) & Swarovski (AT). Also introduced the Lighting Idea Book, a 24-chapter guide on lighting, distributed 5,000+ copies to architects, designers, and corporate institutions.', image: milestone2002 },
  { year: '2003', title: 'Ratan Tata Visit', description: 'Honoured by a visit from Industrialist Shri Ratan Tata at our Tejlite Showroom.', image: milestone2003 },
  { year: '2024', title: 'Growing Team & Endo Centre', description: 'A team of 23 dedicated professionals + partners. Launched Endo Experience Centre in Mumbai with President Mr. Kunihiko Endo.', image: milestone2024 },
];

const values = [
  { icon: Sparkles, title: 'Bespoke Craftsmanship', description: 'Every custom piece is engineered once, it must be right the first time.' },
  { icon: Shield, title: 'Complete In-House Capability', description: 'From design and fabrication to installation and after-care, one partner, one fluid journey, one point of accountability.' },
  { icon: Award, title: 'Value Engineering', description: 'We adapt specifications to suit any budget without compromising design intent, making us the go-to partner when projects need re-engineering.' },
  { icon: Users, title: 'Strong Relationships', description: 'Five decades of meaningful partnerships with India\'s most prestigious architects, developers, and hospitality brands.' },
];

const stats = [
  { value: '50+', label: 'Years of Excellence' },
  { value: '37,650+', label: 'Bespoke Products Delivered' },
  { value: '104+', label: 'Years Collective Team Experience' },
  { value: '345 sqm', label: 'Experience Showroom Mumbai' },
];

// Animated Counter Component
const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric value and suffix
    const numericMatch = value.match(/^([\d,]+)/);
    const suffix = value.replace(/^[\d,]+/, '');
    
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[1].replace(/,/g, ''));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(targetNumber, Math.floor(increment * step));
      
      // Format number with commas if original had them
      const formattedNumber = numericMatch[1].includes(',') 
        ? current.toLocaleString() 
        : current.toString();
      
      setDisplayValue(formattedNumber + suffix);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value); // Ensure final value matches exactly
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <p className="font-display text-4xl lg:text-5xl text-[#C9A84C] mb-2">{displayValue}</p>
      <p className="text-[#4A4A4A] text-sm uppercase tracking-[1px]">{label}</p>
    </motion.div>
  );
};

const About = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/about-hero.jpg"
            alt="Our Story"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80';
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
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-6xl text-white mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl"
          >
            More than five decades of illuminating excellence, crafting light that defines spaces.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-[#F8F6F1]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-0 min-h-[600px]">
            {/* Founder Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 relative bg-[#E8E4DB] min-h-[400px] lg:min-h-full"
            >
              <div className="relative h-full">
                {/* Founder Image */}
                <div className="h-full overflow-hidden">
                  <img
                    src={founderImage}
                    alt="Nemji Gala - Founder"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Nemji+Gala&background=C9A84C&color=fff&size=600`;
                    }}
                  />
                </div>
                
                {/* Quote Overlay */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8">
                   <div className="bg-white backdrop-blur-sm p-4 lg:p-6 border border-[#C9A84C]/20">
                    <p className="font-display text-base lg:text-lg text-[#0D0D0D] italic leading-relaxed mb-2 lg:mb-3">
                      No brief is too complex if the intention is honest.
                    </p>
                    <footer className="text-[#C9A84C] font-heading text-xs uppercase tracking-[2px]">
                      — Nemji Gala, Founder
                    </footer>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 flex items-center"
            >
              <div className="p-6 lg:p-12 lg:pl-16">
                <div className="mb-6 lg:mb-8">
                  <p className="eyebrow mb-4">Our Story</p>
                  <h2 className="font-display text-2xl lg:text-3xl xl:text-4xl text-[#0D0D0D] mb-6 lg:mb-8 leading-tight">
                    Five Decades of Illuminating Excellence
                  </h2>
                </div>
                
                <div className="space-y-4 lg:space-y-6 text-[#4A4A4A] leading-relaxed text-sm lg:text-base">
                  <p>
                    Established in 1975 as Tej Kiran, a part of Gala's Family Group, Tejlite brings together more than five decades of hands-on experience in working with light, evolving technologies, manufacturing insight and project coordination. In 1996, this growing commitment to lighting was formally named Tej Lite, marking our dedicated journey into bespoke lighting and one of the first players to bring premium technical and decorative luminaires into the Indian market.
                  </p>
                  <p>
                    Based in Mumbai, Tejlite has contributed to some of India's most recognised landmark projects. We are comfortable taking on complex briefs where standard solutions fall short and design intent must be preserved without compromise. Every project is approached as its own story, never as a standard solution.
                  </p>
                  <p>
                    At Tejlite, we handle every aspect of lighting supply and installation under one roof, from planning and coordination to delivery and final handover. Our approach brings together thoughtful design integration, in-house development of custom lighting pieces, specialised installation and complete project coordination.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

{/* Brand Showcase Section */}
      <section className="bg-black py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative flex flex-col md:flex-row items-center justify-between min-h-[500px]">
            {/* Left Content - TEJ LITE GROUP */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/3 mb-8 md:mb-0"
            >
              <img
                src={tejLiteGroupLogo}
                alt="TEJ LITE GROUP"
                className="w-full max-w-[400px] h-auto mx-auto md:mx-0"
              />
            </motion.div>

            {/* Mobile Simple Connector */}
            <div className="md:hidden w-full flex justify-center mb-8">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-12 bg-[#C9A84C]"></div>
                <div className="w-4 h-4 bg-[#C9A84C] rounded-full"></div>
                <div className="w-0.5 h-12 bg-[#C9A84C]"></div>
              </div>
            </div>

            {/* The Diagram (SVG Branching Line) - Desktop Only */}
            <div className="hidden md:block absolute left-1/3 right-1/3 h-full pointer-events-none">
              <svg className="w-full h-full" fill="none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                {/* Central connecting line */}
                <path d="M0 150 H100" stroke="#C9A84C" strokeWidth="2" />
                {/* Upper Branch */}
                <path d="M100 150 C180 150 220 80 300 80" stroke="#C9A84C" strokeWidth="2" />
                <path d="M295 75 L300 80 L295 85" stroke="#C9A84C" strokeWidth="2" />
                {/* Lower Branch */}
                <path d="M100 150 C180 150 220 220 300 220" stroke="#C9A84C" strokeWidth="2" />
                <path d="M295 215 L300 220 L295 225" stroke="#C9A84C" strokeWidth="2" />
              </svg>
            </div>

            {/* Right Content - Brand Arms */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-full md:w-1/3 flex flex-col gap-12 md:gap-20 md:pl-12"
            >
              {/* Entity 1: TEJ LITE */}
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start">
                  <img
                    alt="Tej Lite Logo"
                    className="w-full max-w-[280px] h-auto"
                    src={tejLiteLogo}
                  />
                </div>
              </div>

              {/* Mobile Simple Separator */}
              <div className="md:hidden flex justify-center">
                <div className="w-12 h-0.5 bg-[#C9A84C]/60"></div>
              </div>

              {/* Entity 2: EXPERIENCE+EMOTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-center md:justify-start">
                  <img
                    alt="Experience + Emotion Logo"
                    className="w-full max-w-[280px] h-auto"
                    src={experienceEmotionLogo}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Our Journey</p>
            <h2 className="font-display text-4xl text-[#0D0D0D] mb-4">Milestones</h2>
            <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto"></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Desktop Timeline */}
            <div className="hidden lg:block">
              {/* Dotted connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 border-t-2 border-dotted border-[#C9A84C]/40 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-6 gap-4 relative z-10">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Timeline Card */}
                    <div 
                      className="relative h-[280px] w-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-[#E5E0D5] hover:border-[#C9A84C]"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${milestone.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                      onClick={() => setSelectedMilestone(milestone)}
                    >
                      {/* Card Content */}
                      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                        <div>
                          <div className="text-[#C9A84C] font-bold font-display text-2xl mb-2">
                            {milestone.year}
                          </div>
                          <h4 className="font-bold text-sm uppercase tracking-wider leading-tight mb-3">
                            {milestone.title}
                          </h4>
                        </div>
                        
                        <div>
                          <p className="text-xs leading-relaxed opacity-90">
                            {milestone.description.length > 100 
                              ? `${milestone.description.substring(0, 100)}...` 
                              : milestone.description
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="lg:hidden space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="relative h-[200px] rounded-2xl overflow-hidden bg-white shadow-lg cursor-pointer border border-[#E5E0D5]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${milestone.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    {/* Card Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                      <div>
                        <div className="text-[#C9A84C] font-bold font-display text-xl mb-2">
                          {milestone.year}
                        </div>
                        <h4 className="font-bold text-sm uppercase tracking-wider leading-tight mb-2">
                          {milestone.title}
                        </h4>
                      </div>
                      
                      <div>
                        <p className="text-xs leading-relaxed opacity-90">
                          {milestone.description.length > 80 
                            ? `${milestone.description.substring(0, 80)}...` 
                            : milestone.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile connector line */}
                  {index < milestones.length - 1 && (
                    <div className="flex justify-center py-4">
                      <div className="w-0.5 h-8 bg-[#C9A84C]/40"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Popup Modal */}
        {selectedMilestone && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ maxWidth: '21rem' }}
            >
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedMilestone.image}
                  alt={`${selectedMilestone.year} milestone`}
                  className="w-full h-45 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors text-xl"
                >
                  ×
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#C9A84C] text-white px-3 py-1 rounded-full font-bold text-lg">
                    {selectedMilestone.year}
                  </span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <h3 className="font-display text-2xl text-[#0D0D0D] mb-4">
                  {selectedMilestone.title}
                </h3>
                <p className="text-[#4A4A4A] leading-relaxed">
                  {selectedMilestone.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </section>
  

      {/* Stats Section */}
      <section className="section-padding bg-[#0D0D0D]">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <AnimatedCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">What We Stand For</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] rounded-full">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl text-[#0D0D0D] mb-2">{value.title}</h3>
                <p className="text-[#4A4A4A] text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="relative py-24 bg-[#0D0D0D] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/craftsmanship.jpg"
            alt="Craftsmanship"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1920&q=80';
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">Our Craft</p>
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-8">
              The Art of Lighting
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Every Tej Lite fixture is a testament to the skill and dedication of our craftsmen. 
              From the initial design sketch to the final polish, each piece undergoes a meticulous 
              process that ensures unparalleled quality and beauty.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                'Hand-selected materials',
                'Traditional techniques',
                'Modern precision',
              ].map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 text-white/80">
                  <Check className="w-5 h-5 text-[#C9A84C]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Commented out for new brand showcase */}
      {/* 
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Our People</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Meet the Team
            </h2>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-md mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="aspect-square mb-4 overflow-hidden bg-[#E5E0D5]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=C9A84C&color=fff&size=300`;
                    }}
                  />
                </div>
                <h3 className="font-display text-lg text-[#0D0D0D]">{member.name}</h3>
                <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-[1px] mb-2">
                  {member.role}
                </p>
                <p className="text-[#4A4A4A] text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Our Clients Section */}
      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Trusted By</p>
            <h2 className="font-display text-4xl text-[#0D0D0D] mb-4">Our Clients</h2>
            <p className="text-[#4A4A4A] max-w-2xl mx-auto">
              Trusted by leading brands, hotels, and organizations across various industries
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {[
              { logo: '/images/clients/palladium.png', name: 'Palladium' },
              { logo: '/images/clients/inorbit.png', name: 'Inorbit' },
              { logo: '/images/clients/phoenix-mills.png', name: 'Phoenix Mills' },
              { logo: '/images/clients/goldmine.png', name: 'Goldmine' },
              { logo: '/images/clients/boss-home-appliances.png', name: 'Boss' },
              { logo: '/images/clients/shapoorji-pallonji.png', name: 'Shapoorji Pallonji' },
              { logo: '/images/clients/kanakia.png', name: 'Kanakia' },
              { logo: '/images/clients/plus-light-tech.png', name: 'Plus Light Tech' },
              { logo: '/images/clients/ramoji-film-city.png', name: 'Ramoji Film City' },
              { logo: '/images/clients/the-club-mumbai.png', name: 'The Club Mumbai' },
              { logo: '/images/clients/st-regis.png', name: 'St Regis' },
              { logo: '/images/clients/taj-hotels.png', name: 'Taj Hotels' },
              { logo: '/images/clients/sunshine-tower-hotel.png', name: 'Sunshine Hotel' },
              { logo: '/images/clients/dolphin-hotels.png', name: 'Dolphin Hotels' },
              { logo: '/images/clients/hotel-roma-kristo.png', name: 'Hotel Roma Kristo' },
              { logo: '/images/clients/hotel-maple-ivy.png', name: 'Maple Ivy' },
              { logo: '/images/clients/saregamapa.png', name: 'Saregamapa' },
              { logo: '/images/clients/jw-marriott.png', name: 'JW Marriott' },
              { logo: '/images/clients/bafna-motors.png', name: 'Bafna Motors' },
              { logo: '/images/clients/star-plus.png', name: 'Star Plus' },
              { logo: '/images/clients/aamby-valley.png', name: 'Aamby Valley' },
              { logo: '/images/clients/pnp.png', name: 'PNP' },
              { logo: '/images/clients/reliance-industries.png', name: 'Reliance Industries' },
              { logo: '/images/clients/rdcc-bank.png', name: 'RDCC Bank' },
              { logo: '/images/clients/godrej-interio.png', name: 'Godrej Interio' },
              { logo: '/images/clients/vivanta.png', name: 'Vivanta' },
              { logo: '/images/clients/courtyard-marriott.png', name: 'Courtyard' },
              { logo: '/images/clients/avighna.png', name: 'Avighna' },
              { logo: '/images/clients/charbhuja-jewellers.png', name: 'Charbhuja Jewellers' },
              { logo: '/images/clients/red-brick.png', name: 'Red Brick' },
              { logo: '/images/clients/somaya-kalappa.png', name: 'Somaya & Kalappa' },
              { logo: '/images/clients/syndrome.png', name: 'Syndrome' },
              { logo: '/images/clients/tata-consultancy.png', name: 'TATA' },
              { logo: '/images/clients/project-eve.png', name: 'Project Eve' },
              { logo: '/images/clients/ever-shine-banquets.png', name: 'Ever Shine' },
              { logo: '/images/clients/lokmat.png', name: 'Lokmat' },
              { logo: '/images/clients/sankpal.png', name: 'Sankpal' },
              { logo: '/images/clients/nitido.png', name: 'Nitido' },
              { logo: '/images/clients/jio.png', name: 'Jio' },
              { logo: '/images/clients/reliance-retail.png', name: 'Reliance Retail' },
              { logo: '/images/clients/krishival.png', name: 'Krishival' },
              { logo: '/images/clients/salar-jung-museum.png', name: 'Salar Jung Museum' },
              { logo: '/images/clients/nss-hill-spring.png', name: 'NSS Hill Spring' },
              { logo: '/images/clients/siddhivinayak.png', name: 'Siddhivinayak' },
              { logo: '/images/clients/nashik-city-centre.png', name: 'Nashik City Centre' },
              { logo: '/images/clients/hotel-aram.png', name: 'Hotel Aram' },
            ].map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-[#E5E0D5] hover:border-[#C9A84C]/30">
                  <div className="flex items-center justify-center h-12">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-[#4A4A4A] text-sm">
              And many more satisfied clients across hospitality, retail, residential, and commercial sectors
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl lg:text-4xl text-[#0D0D0D] mb-6">
            Ready to Illuminate Your Space?
          </h2>
          <p className="text-[#4A4A4A] max-w-2xl mx-auto mb-8">
            Let us bring our decades of expertise to your next project. Contact us 
            for a consultation and discover how we can transform your space with light.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link to="/products" className="btn-secondary">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;