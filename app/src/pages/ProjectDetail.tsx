import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MapPin, Calendar, User, Loader2 } from 'lucide-react';
import { fetchProjectById, fetchProjects, type Project } from '@/services/products';
import { toast } from 'sonner';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProject(slug);
    }
  }, [slug]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const [projectData, allProjects] = await Promise.all([
        fetchProjectById(projectId),
        fetchProjects()
      ]);

      if (!projectData) {
        toast.error('Project not found');
        navigate('/projects');
        return;
      }

      console.log('Loaded project data:', projectData);
      setProject(projectData);

      // Get related projects from same type
      const related = allProjects
        .filter(p => 
          p.id !== projectData.id && 
          p.project_type === projectData.project_type &&
          p.status === 'active'
        )
        .slice(0, 2);
      setRelatedProjects(related);

    } catch (error) {
      console.error('Error loading project:', error);
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C] mx-auto mb-4" />
          <p className="text-[#4A4A4A]">Loading project...</p>
        </div>
      </div>
    );
  }

  // Show error if project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-32 text-center">
        <h1 className="font-display text-3xl text-[#0D0D0D] mb-4">Project Not Found</h1>
        <Link to="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

  const allImages = [
    ...(project.hero_image_url ? [project.hero_image_url] : []),
    ...(project.images || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={project.hero_image_url || (project.images && project.images[0]) || ''}
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 container-custom pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <Link to="/projects" className="hover:text-[#C9A84C] transition-colors">Projects</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-[#C9A84C]">{project.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-[#C9A84C] text-white text-xs font-heading uppercase tracking-[1px] mb-4">
              {project.project_type}
            </span>
            <h1 className="font-display text-4xl lg:text-6xl text-white mb-4">
              {project.name}
            </h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C9A84C]" />
                {project.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C9A84C]" />
                {project.year}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl text-[#0D0D0D] mb-6">
                  About the Project
                </h2>
                <p className="text-[#4A4A4A] leading-relaxed mb-6">
                  {project.long_description || project.short_description}
                </p>

                {/* Gallery */}
                <h3 className="font-display text-2xl text-[#0D0D0D] mb-6">
                  Project Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`relative aspect-square overflow-hidden cursor-pointer group ${
                        index === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${project.name} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 border border-[#E5E0D5] sticky top-24"
              >
                <h3 className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C] mb-6">
                  Project Details
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[#4A4A4A] text-xs uppercase tracking-[1px] mb-1">Client</p>
                    <div className="flex items-center gap-2 text-[#0D0D0D]">
                      <User className="w-4 h-4 text-[#C9A84C]" />
                      {project.client_name || 'N/A'}
                    </div>
                  </div>

                  <div>
                    <p className="text-[#4A4A4A] text-xs uppercase tracking-[1px] mb-1">Location</p>
                    <div className="flex items-center gap-2 text-[#0D0D0D]">
                      <MapPin className="w-4 h-4 text-[#C9A84C]" />
                      {project.location}
                    </div>
                  </div>

                  <div>
                    <p className="text-[#4A4A4A] text-xs uppercase tracking-[1px] mb-1">Year</p>
                    <div className="flex items-center gap-2 text-[#0D0D0D]">
                      <Calendar className="w-4 h-4 text-[#C9A84C]" />
                      {project.year}
                    </div>
                  </div>

                  <div>
                    <p className="text-[#4A4A4A] text-xs uppercase tracking-[1px] mb-1">Project Type</p>
                    <p className="text-[#0D0D0D]">{project.project_type}</p>
                  </div>

                  {project.scope && (
                    <div>
                      <p className="text-[#4A4A4A] text-xs uppercase tracking-[1px] mb-1">Scope of Work</p>
                      <p className="text-[#0D0D0D]">{project.scope}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-[#E5E0D5]">
                  <Link to="/contact" className="btn-primary w-full text-center block">
                    Start Your Project
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-padding bg-[#F2EDE4]">
          <div className="container-custom">
            <h2 className="font-display text-2xl text-[#0D0D0D] mb-8">
              Other {project.project_type} Projects
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  to={`/projects/${relatedProject.id}`}
                  className="group relative aspect-video overflow-hidden"
                >
                  <img
                    src={relatedProject.hero_image_url || (relatedProject.images && relatedProject.images[0]) || ''}
                    alt={relatedProject.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl text-white mb-1">{relatedProject.name}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      {relatedProject.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-[#C9A84C] transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <img
            src={allImages[currentImageIndex]}
            alt={`${project.name} - ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80';
            }}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === index ? 'bg-[#C9A84C]' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
