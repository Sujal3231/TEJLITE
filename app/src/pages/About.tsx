import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Sparkles, Shield, Check } from 'lucide-react';

const milestones = [
  { year: '1975', title: 'Established', description: 'Founded as Tej Kiran, a family-owned business, part of Gala\'s Family Group, which later evolved as Tej Lite.', image: '/src/images/1975.png' },
  { year: '1998', title: 'Showroom Launch', description: 'IIID Past President Ar. Jayant Tipnis inaugurated our Lighting Showroom in Mumbai.', image: '/src/images/1998.png' },
  { year: '2001', title: 'First Artemide', description: 'First to bring Artemide to India, marking a defining moment in premium lighting.', image: '/src/images/2001.png' },
  { year: '2002', title: 'International Brands & Lighting Idea Book', description: 'First to introduce international brands: Atelier Sedap (FR), Regent (CH), Vistosi (IT), Unilamp (TH), Atomis (NL), Cristallux (DE), Poesia (IT), Eglo (AT), Murano Glass Collection (IT), Belfiore (IT) & Swarovski (AT). Also introduced the Lighting Idea Book, a 24-chapter guide on lighting, distributed 5,000+ copies to architects, designers, and corporate institutions.', image: '/src/images/2002.png' },
  { year: '2003', title: 'Ratan Tata Visit', description: 'Honoured by a visit from Industrialist Shri Ratan Tata at our Tejlite Showroom.', image: '/src/images/2003.png' },
  { year: '2024', title: 'Growing Team & Endo Centre', description: 'A team of 23 dedicated professionals + partners. Launched Endo Experience Centre in Mumbai with President Mr. Kunihiko Endo.', image: '/src/images/2024.png' },
];

const values = [
  { icon: Sparkles, title: 'Bespoke Craftsmanship', description: 'Every custom piece is engineered once — it must be right the first time. No brief is too complex if the intention is honest.' },
  { icon: Shield, title: 'Complete In-House Capability', description: 'From design and fabrication to installation and after-care — one partner, one fluid journey, one point of accountability.' },
  { icon: Award, title: 'Value Engineering', description: 'We adapt specifications to suit any budget without compromising design intent, making us the go-to partner when projects need re-engineering.' },
  { icon: Users, title: 'Strong Relationships', description: 'Five decades of meaningful partnerships with India\'s most prestigious architects, developers, and hospitality brands.' },
];

const _team = [
  { name: 'Nemji Gala', role: 'Founder', bio: 'Visionary leader with 50+ years in the lighting industry. Built Tejlite from a family business into India\'s trusted lighting expert.', image: '/src/images/Nemji Sir.png' },
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <p className="font-display text-4xl lg:text-5xl text-[#C9A84C] mb-2">{value}</p>
      <p className="text-[#4A4A4A] text-sm uppercase tracking-[1px]">{label}</p>
    </motion.div>
  );
};

const About = () => {
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
            Four decades of illuminating excellence, crafting light that defines spaces.
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
              className="lg:col-span-2 relative bg-[#E8E4DB]"
            >
              <div className="relative h-full">
                {/* Founder Image */}
                <div className="h-full overflow-hidden">
                  <img
                    src="/src/images/Nemji Sir.png"
                    alt="Nemji Gala - Founder"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Nemji+Gala&background=C9A84C&color=fff&size=600`;
                    }}
                  />
                </div>
                
                {/* Quote Overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/95 backdrop-blur-sm p-6 border border-[#C9A84C]/20">
                    <p className="font-display text-lg text-[#0D0D0D] italic leading-relaxed mb-3">
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
              <div className="p-8 lg:p-12 lg:pl-16">
                <div className="mb-8">
                  <p className="eyebrow mb-4">Our Story</p>
                  <h2 className="font-display text-3xl lg:text-4xl text-[#0D0D0D] mb-8 leading-tight">
                    Five Decades of Illuminating Excellence
                  </h2>
                </div>
                
                <div className="space-y-6 text-[#4A4A4A] leading-relaxed">
                  <p>
                    Established in 1975 as Tej Kiran, a part of Gala's Family Group, Tejlite brings together more than five decades of hands-on experience in working with light, evolving technologies, manufacturing insight and project coordination. In 1996, this growing commitment to lighting was formally named Tej Lite — marking our dedicated journey into bespoke lighting and one of the first players to bring premium technical and decorative luminaires into the Indian market.
                  </p>
                  <p>
                    Based in Mumbai, Tejlite has contributed to some of India's most recognised landmark projects. We are comfortable taking on complex briefs where standard solutions fall short and design intent must be preserved without compromise. Every project is approached as its own story, never as a standard solution.
                  </p>
                  <p>
                    At Tejlite, we handle every aspect of lighting supply and installation under one roof — from planning and coordination to delivery and final handover. Our approach brings together thoughtful design integration, in-house development of custom lighting pieces, specialised installation and complete project coordination.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Timeline */}
      <section className="section-padding mb-10 bg-white">
  <div className="container-custom">
    <div className="text-center mb-6">
      <p className="eyebrow mb-4">Our Journey</p>
      <h2 className="font-display text-4xl text-[#0D0D0D]">Milestones</h2>
    </div>

    <div className="relative max-w-7xl mx-auto">
  {/* Timeline Line — fixed pixel, matches minHeight of top half + dot offset */}
  <div
    className="absolute left-0 w-full h-px bg-[#C9A84C]/30 hidden lg:block"
    style={{ top: '273px' }}
  ></div>

  <div className="hidden lg:grid lg:grid-cols-6 gap-2 relative">
    {milestones.map((milestone, index) => {
      const isAbove = index % 2 === 0;

      return (
        <motion.div
          key={milestone.year}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center group"
        >
          {/* TOP HALF — fixed 260px */}
          <div
            className="flex flex-col items-center justify-end w-full"
            style={{ height: '260px' }}  
          >
            {isAbove && (
              <>
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#E5E0D5] shadow-sm group-hover:border-[#C9A84C] transition-colors mb-3 flex-shrink-0">
                  <img
                    alt={`${milestone.year} milestone`}
                    className="w-full h-full object-cover"
                    src={milestone.image}
                  />
                </div>
                <div className="text-[#C9A84C] font-bold font-display text-base mb-1">{milestone.year}</div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider mb-2 text-[#0D0D0D] leading-tight">{milestone.title}</h4>
                <p className="text-[11px] text-[#4A4A4A] leading-relaxed px-1">{milestone.description}</p>
              </>
            )}
          </div>

          {/* DOT — always sits at exactly 260px from top */}
          <div className="w-3 h-3 rounded-full bg-[#C9A84C] ring-4 ring-white z-10 flex-shrink-0 my-2"></div>

          {/* BOTTOM HALF — fixed 260px */}
          <div
            className="flex flex-col items-center w-full"
            style={{ height: '260px' }}  
          >
            {!isAbove && (
              <>
                <div className="text-[#C9A84C] font-bold font-display text-base mb-1 mt-2">{milestone.year}</div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider mb-2 text-[#0D0D0D] leading-tight">{milestone.title}</h4>
                <p className="text-[11px] text-[#4A4A4A] leading-relaxed mb-4 px-1">{milestone.description}</p>
                <div className="w-28 h-28 rounded-lg overflow-hidden border border-[#E5E0D5] shadow-sm group-hover:border-[#C9A84C] transition-colors flex-shrink-0">
                  <img
                    alt={`${milestone.year} milestone`}
                    className="w-full h-full object-cover"
                    src={milestone.image}
                  />
                </div>
              </>
            )}
          </div>
        </motion.div>
      );
    })}
  </div>

  {/* MOBILE — unchanged */}
  <div className="lg:hidden flex flex-col">
    {milestones.map((milestone, index) => (
      <motion.div
        key={milestone.year}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        viewport={{ once: true }}
        className="flex flex-col items-center"
      >
        <div className="flex gap-4 items-start text-left w-full px-2 py-4 border border-[#E5E0D5] rounded-xl">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E5E0D5] flex-shrink-0">
            <img
              alt={`${milestone.year} milestone`}
              className="w-full h-full object-cover"
              src={milestone.image}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(milestone.title.substring(0, 2))}&background=C9A84C&color=fff&size=200`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[#C9A84C] font-bold font-display text-sm mb-0.5">{milestone.year}</div>
            <h4 className="font-bold text-[11px] uppercase tracking-wider mb-1 text-[#0D0D0D] leading-tight">{milestone.title}</h4>
            <p className="text-[11px] text-[#4A4A4A] leading-relaxed">{milestone.description}</p>
          </div>
        </div>
        {index < milestones.length - 1 && (
          <div className="flex flex-col items-center py-1">
            <div className="w-0.5 h-4 bg-[#C9A84C]/40"></div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
          </div>
        )}
      </motion.div>
    ))}
  </div>
</div>
  </div>
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
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C]">
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

      {/* Team Section */}
      {/* <section className="section-padding bg-[#F2EDE4]">
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
      </section> */}

      {/* Our Clients Section */}
      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="eyebrow mb-4">Trusted By</p>
            <h2 className="font-display text-4xl text-[#0D0D0D] mb-4">Our Clients</h2>
            <p className="text-[#4A4A4A] max-w-2xl mx-auto">
              Trusted by leading brands, hotels, and organizations across various industries
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {[
              { logo: '/src/images/clients/palladium.png', name: 'Palladium' },
              { logo: '/src/images/clients/inorbit.png', name: 'Inorbit' },
              { logo: '/src/images/clients/phoenix-mills.png', name: 'Phoenix Mills' },
              { logo: '/src/images/clients/goldmine.png', name: 'Goldmine' },
              { logo: '/src/images/clients/boss-home-appliances.png', name: 'Boss' },
              { logo: '/src/images/clients/shapoorji-pallonji.png', name: 'Shapoorji Pallonji' },
              { logo: '/src/images/clients/kanakia.png', name: 'Kanakia' },
              { logo: '/src/images/clients/plus-light-tech.png', name: 'Plus Light Tech' },
              { logo: '/src/images/clients/ramoji-film-city.png', name: 'Ramoji Film City' },
              { logo: '/src/images/clients/the-club-mumbai.png', name: 'The Club Mumbai' },
              { logo: '/src/images/clients/st-regis.png', name: 'St Regis' },
              { logo: '/src/images/clients/taj-hotels.png', name: 'Taj Hotels' },
              { logo: '/src/images/clients/sunshine-tower-hotel.png', name: 'Sunshine Hotel' },
              { logo: '/src/images/clients/dolphin-hotels.png', name: 'Dolphin Hotels' },
              { logo: '/src/images/clients/hotel-roma-kristo.png', name: 'Hotel Roma Kristo' },
              { logo: '/src/images/clients/hotel-maple-ivy.png', name: 'Maple Ivy' },
              { logo: '/src/images/clients/saregamapa.png', name: 'Saregamapa' },
              { logo: '/src/images/clients/jw-marriott.png', name: 'JW Marriott' },
              { logo: '/src/images/clients/bafna-motors.png', name: 'Bafna Motors' },
              { logo: '/src/images/clients/star-plus.png', name: 'Star Plus' },
              { logo: '/src/images/clients/aamby-valley.png', name: 'Aamby Valley' },
              { logo: '/src/images/clients/pnp.png', name: 'PNP' },
              { logo: '/src/images/clients/reliance-industries.png', name: 'Reliance Industries' },
              { logo: '/src/images/clients/rdcc-bank.png', name: 'RDCC Bank' },
              { logo: '/src/images/clients/godrej-interio.png', name: 'Godrej Interio' },
              { logo: '/src/images/clients/vivanta.png', name: 'Vivanta' },
              { logo: '/src/images/clients/courtyard-marriott.png', name: 'Courtyard' },
              { logo: '/src/images/clients/avighna.png', name: 'Avighna' },
              { logo: '/src/images/clients/charbhuja-jewellers.png', name: 'Charbhuja Jewellers' },
              { logo: '/src/images/clients/red-brick.png', name: 'Red Brick' },
              { logo: '/src/images/clients/somaya-kalappa.png', name: 'Somaya & Kalappa' },
              { logo: '/src/images/clients/syndrome.png', name: 'Syndrome' },
              { logo: '/src/images/clients/tata-consultancy.png', name: 'TATA' },
              { logo: '/src/images/clients/project-eve.png', name: 'Project Eve' },
              { logo: '/src/images/clients/ever-shine-banquets.png', name: 'Ever Shine' },
              { logo: '/src/images/clients/lokmat.png', name: 'Lokmat' },
              { logo: '/src/images/clients/sankpal.png', name: 'Sankpal' },
              // { logo: '/src/images/clients/nitido.png', name: 'Nitido' },
              { logo: '/src/images/clients/jio.png', name: 'Jio' },
              { logo: '/src/images/clients/reliance-retail.png', name: 'Reliance Retail' },
              { logo: '/src/images/clients/krishival.png', name: 'Krishival' },
              { logo: '/src/images/clients/salar-jung-museum.png', name: 'Salar Jung Museum' },
              { logo: '/src/images/clients/nss-hill-spring.png', name: 'NSS Hill Spring' },
              { logo: '/src/images/clients/siddhivinayak.png', name: 'Siddhivinayak' },
              { logo: '/src/images/clients/nashik-city-centre.png', name: 'Nashik City Centre' },
              { logo: '/src/images/clients/hotel-aram.png', name: 'Hotel Aram' },
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

          {/* <div className="text-center mt-12">
            <p className="text-[#4A4A4A] text-sm">
              And many more satisfied clients across hospitality, retail, residential, and commercial sectors
            </p>
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-10">
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