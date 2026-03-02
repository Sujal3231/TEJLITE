import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';

const servicesData: Record<string, {
  name: string;
  description: string;
  longDescription: string;
  heroImage: string;
  process: { title: string; description: string }[];
  features: string[];
  relatedProjects: { id: string; name: string; image: string }[];
}> = {
  'bespoke-design': {
    name: 'Bespoke Design Consultation',
    description: 'Custom lighting design by expert designers tailored to your space and style preferences.',
    longDescription: 'Our bespoke design consultation service offers a personalized approach to lighting design. Our team of expert designers works closely with you to understand your vision, space requirements, and aesthetic preferences. We create custom lighting solutions that perfectly complement your interior design while meeting functional needs.',
    heroImage: '/images/services/design.jpg',
    process: [
      { title: 'Initial Consultation', description: 'We discuss your vision, requirements, and budget.' },
      { title: 'Site Assessment', description: 'Our team visits your space to understand lighting needs.' },
      { title: 'Concept Development', description: 'We create initial design concepts and mood boards.' },
      { title: '3D Visualization', description: 'See your lighting design in realistic 3D renders.' },
      { title: 'Final Design', description: 'Approved designs move to production phase.' },
    ],
    features: [
      'Personalized design sessions with expert designers',
      '3D visualization and rendering',
      'Material and finish selection guidance',
      'Budget planning and optimization',
      'Technical specifications',
      'Installation guidance',
    ],
    relatedProjects: [
      { id: '1', name: 'The Royal Palace Hotel', image: '/images/projects/project-1.jpg' },
      { id: '2', name: 'Luxury Villa Residence', image: '/images/projects/project-2.jpg' },
    ],
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = slug ? servicesData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-32 text-center">
        <h1 className="font-display text-3xl text-[#0D0D0D] mb-4">Service Not Found</h1>
        <Link to="/services" className="btn-primary">Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={service.heroImage}
            alt={service.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 container-custom pb-16">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-[#C9A84C] mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-5xl text-white mb-4"
          >
            {service.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 max-w-2xl"
          >
            {service.description}
          </motion.p>
        </div>
      </section>

      {/* Description */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="eyebrow mb-4">About This Service</p>
            <p className="text-[#4A4A4A] leading-relaxed text-lg">
              {service.longDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">How It Works</p>
            <h2 className="font-display text-4xl text-[#0D0D0D]">
              Our Process
            </h2>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {service.process.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <span className="font-display text-5xl text-[#C9A84C]/20">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg text-[#0D0D0D] mt-4 mb-2">{step.title}</h3>
                <p className="text-[#4A4A4A] text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="eyebrow mb-4">What You Get</p>
              <h2 className="font-display text-3xl text-[#0D0D0D] mb-8">
                Service Features
              </h2>
              <ul className="space-y-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    <span className="text-[#4A4A4A]">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0D0D0D] p-12 text-center"
            >
              <h3 className="font-display text-2xl text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-white/60 mb-8">
                Contact us today to schedule your bespoke design consultation.
              </p>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                Book Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom">
          <h2 className="font-display text-2xl text-[#0D0D0D] mb-8">
            Related Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {service.relatedProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group relative aspect-video overflow-hidden"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display text-xl text-white">{project.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
