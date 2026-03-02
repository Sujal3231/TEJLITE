import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { fetchProjects, type Project } from '@/services/products';

const Projects = () => {
  const [selectedType, setSelectedType] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState<string[]>(['All']);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      // Filter only active projects
      const activeProjects = data.filter(p => p.status === 'active');
      setProjects(activeProjects);

      // Extract unique project types
      const types = ['All', ...Array.from(new Set(activeProjects.map(p => p.project_type)))];
      setProjectTypes(types);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedType === 'All' 
    ? projects 
    : projects.filter(p => p.project_type === selectedType);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[350px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/projects-hero.jpg"
            alt="Our Projects"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80';
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
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl text-white mb-4"
          >
            Our Signature Installations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl"
          >
            Explore our portfolio of luxury lighting installations across India and beyond.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-30 bg-[#FAF7F2] border-b border-[#E5E0D5]">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-heading text-sm uppercase tracking-[1px] transition-all ${
                  selectedType === type 
                    ? 'bg-[#C9A84C] text-white' 
                    : 'bg-white text-[#4A4A4A] border border-[#E5E0D5] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Masonry Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C] mx-auto mb-4" />
              <p className="text-[#4A4A4A]">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#4A4A4A] text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative overflow-hidden cursor-pointer ${
                    project.is_featured ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <Link to={`/projects/${project.id}`}>
                    <img
                      src={project.hero_image_url || (project.images && project.images[0]) || ''}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <span className="inline-block px-3 py-1 bg-[#C9A84C] text-white text-xs font-heading uppercase tracking-[1px] mb-3">
                        {project.project_type}
                      </span>
                      <h3 className={`font-display text-white mb-2 ${project.is_featured ? 'text-2xl' : 'text-xl'}`}>
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <span className="inline-flex items-center gap-2 text-[#C9A84C] font-heading text-xs uppercase tracking-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                        View Project
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-[#1C1C1C]">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '1000+', label: 'Projects Completed' },
              { value: '20+', label: 'Countries Served' },
              { value: '500+', label: 'Products' },
              { value: '47+', label: 'Years Experience' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-display text-4xl lg:text-5xl text-[#C9A84C] mb-2">
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm uppercase tracking-[1px]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#F2EDE4]">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl text-[#0D0D0D] mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-[#4A4A4A] max-w-2xl mx-auto mb-8">
            Let us bring your vision to life with our bespoke lighting solutions. 
            Contact us for a consultation.
          </p>
          <Link to="/contact" className="btn-primary">
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Projects;
