import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Sparkles, Shield, Check } from 'lucide-react';

const milestones = [
  { year: '1977', title: 'Founded', description: 'Tej Lite established in Mumbai with a vision to create exceptional lighting.' },
  { year: '1990', title: 'First Export', description: 'Expanded beyond India with our first international project in Dubai.' },
  { year: '2000', title: 'Expanded Range', description: 'Launched comprehensive product line covering all lighting categories.' },
  { year: '2010', title: 'Hotel Specialization', description: 'Became preferred lighting partner for luxury hotel chains.' },
  { year: '2020', title: 'Pan-India Presence', description: 'Established showrooms and service centers across major Indian cities.' },
  { year: '2025', title: 'Digital Transformation', description: 'Launched new digital platform for enhanced customer experience.' },
];

const values = [
  { icon: Sparkles, title: 'Craftsmanship', description: 'Every piece is crafted with meticulous attention to detail and quality.' },
  { icon: Shield, title: 'Innovation', description: 'Constantly pushing boundaries in lighting design and technology.' },
  { icon: Award, title: 'Quality', description: 'Only the finest materials and rigorous quality control standards.' },
  { icon: Users, title: 'Trust', description: 'Building lasting relationships through integrity and excellence.' },
];

const team = [
  { name: 'Rajesh Tejpal', role: 'Founder & CEO', bio: 'Visionary leader with 40+ years in lighting industry.', image: '/images/team/ceo.jpg' },
  { name: 'Priya Sharma', role: 'Creative Director', bio: 'Award-winning designer with expertise in luxury interiors.', image: '/images/team/creative.jpg' },
  { name: 'Amit Kumar', role: 'Head of Operations', bio: 'Ensures seamless execution of every project.', image: '/images/team/operations.jpg' },
  { name: 'Sneha Patel', role: 'Client Relations', bio: 'Dedicated to delivering exceptional customer experience.', image: '/images/team/client.jpg' },
];

const stats = [
  { value: '47+', label: 'Years of Excellence' },
  { value: '1000+', label: 'Projects Completed' },
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Countries Served' },
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
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <span className="absolute -top-8 -left-4 text-[150px] leading-none text-[#C9A84C]/10 font-display">
                "
              </span>
              <blockquote className="relative z-10">
                <p className="font-display text-2xl lg:text-3xl text-[#0D0D0D] italic leading-relaxed mb-6">
                  Light is not just illumination. It is emotion, atmosphere, and the soul of a space.
                </p>
                <footer className="text-[#C9A84C] font-heading text-sm uppercase tracking-[2px]">
                  — Rajesh Tejpal, Founder
                </footer>
              </blockquote>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#4A4A4A] leading-relaxed mb-6">
                Tej Lite was founded in 1977 with a singular vision: to create lighting fixtures 
                that transcend mere functionality and become works of art. What began as a small 
                workshop in Mumbai has grown into one of India\'s most respected lighting brands, 
                known for our commitment to craftsmanship and innovation.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed mb-6">
                Over four decades, we have had the privilege of illuminating some of the most 
                prestigious spaces in India and beyond. From grand hotel lobbies to intimate 
                residences, from commercial landmarks to heritage monuments, our lighting 
                solutions have left their mark on countless projects.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed">
                Today, Tej Lite continues to push the boundaries of lighting design, combining 
                traditional craftsmanship with modern technology to create fixtures that are 
                both timeless and contemporary.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Our Journey</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-[#C9A84C]/30" />

            <div className="grid lg:grid-cols-6 gap-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative text-center"
                >
                  <div className="lg:hidden mb-4">
                    <span className="font-display text-4xl text-[#C9A84C]">{milestone.year}</span>
                  </div>
                  <div className="hidden lg:block mb-8">
                    <div className="w-4 h-4 mx-auto bg-[#C9A84C] rounded-full relative z-10" />
                    <span className="font-display text-2xl text-[#C9A84C] mt-4 block">{milestone.year}</span>
                  </div>
                  <h3 className="font-display text-lg text-[#0D0D0D] mb-2">{milestone.title}</h3>
                  <p className="text-[#4A4A4A] text-sm">{milestone.description}</p>
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
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Our People</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Meet the Team
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
