import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project
} from '@/services/products';
import { uploadMultipleImages } from '@/services/upload';

interface ProjectFormData {
  name: string;
  short_description: string;
  long_description?: string;
  hero_image_url: string;
  location: string;
  year: number;
  client_name: string;
  project_type: string;
  scope?: string;
  custom_project_type?: string;
  images: string[];
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    short_description: '',
    hero_image_url: '',
    location: '',
    year: new Date().getFullYear(),
    client_name: '',
    project_type: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showOtherProjectType, setShowOtherProjectType] = useState(false);

  const projectTypeOptions = [
    'Residential',
    'Commercial',
    'Hotel & Hospitality',
    'Restaurant',
    'Office',
    'Landmark',
    'Other'
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      const isOtherType = !projectTypeOptions.slice(0, -1).includes(project.project_type);
      setShowOtherProjectType(isOtherType);
      setFormData({
        name: project.name,
        short_description: project.short_description || '',
        long_description: project.long_description || '',
        hero_image_url: project.hero_image_url || '',
        location: project.location,
        year: project.year,
        client_name: project.client_name || '',
        project_type: isOtherType ? 'Other' : project.project_type,
        scope: project.scope || '',
        custom_project_type: isOtherType ? project.project_type : '',
        images: project.images || []
      });
    } else {
      setEditingProject(null);
      setShowOtherProjectType(false);
      setFormData({ 
        name: '', 
        short_description: '',
        long_description: '',
        hero_image_url: '',
        location: '',
        year: new Date().getFullYear(),
        client_name: '',
        project_type: '',
        scope: '',
        custom_project_type: '',
        images: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({ 
      name: '', 
      short_description: '',
      long_description: '',
      hero_image_url: '',
      location: '',
      year: new Date().getFullYear(),
      client_name: '',
      project_type: '',
      scope: '',
      custom_project_type: '',
      images: []
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const imageUrls = await uploadMultipleImages(files, 'projects', (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      
      toast.success(`${imageUrls.length} image(s) uploaded successfully`);
      
      // Clear the file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    if (formData.project_type === 'Other' && !formData.custom_project_type?.trim()) {
      toast.error('Please specify the project type');
      return;
    }

    setSaving(true);
    try {
      // Use custom project type if "Other" is selected
      const projectData = {
        ...formData,
        project_type: formData.project_type === 'Other' ? formData.custom_project_type! : formData.project_type
      };

      // Debug: Log the data being saved
      console.log('Saving project data:', projectData);

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await createProject(projectData);
        toast.success('Project created successfully');
      }
      
      handleCloseModal();
      loadProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProject(id);
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="font-display text-3xl text-white">Projects</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-[#A07830] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#1C1C1C] border border-white/10 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1C1C] border border-white/10 overflow-hidden group"
          >
            {/* Image */}
            <div className="aspect-video bg-white/5 relative overflow-hidden">
              {(project.images && project.images.length > 0) ? (
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : project.hero_image_url ? (
                <img
                  src={project.hero_image_url}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-display text-xl text-white mb-2">{project.name}</h3>
              <p className="text-white/50 text-sm mb-4 line-clamp-2">
                {project.short_description || 'No description'}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(project)}
                  className="flex-1 px-3 py-2 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id, project.name)}
                  className="px-3 py-2 bg-white/5 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-[#1C1C1C] border border-white/10 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No projects yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded hover:bg-[#A07830] transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-2xl text-white">
                  {editingProject ? 'Edit Project' : 'Add Project'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Luxury Hotel Lobby"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Mumbai, India"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Project Type *
                    </label>
                    <select
                      value={formData.project_type}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData(prev => ({ ...prev, project_type: value }));
                        setShowOtherProjectType(value === 'Other');
                      }}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    >
                      <option value="" className="bg-[#1C1C1C] text-white/50">Select Project Type</option>
                      {projectTypeOptions.map(type => (
                        <option key={type} value={type} className="bg-[#1C1C1C] text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show custom input when "Other" is selected */}
                  {showOtherProjectType && (
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                        Specify Project Type *
                      </label>
                      <input
                        type="text"
                        value={formData.custom_project_type || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, custom_project_type: e.target.value }))}
                        placeholder="Enter custom project type"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="e.g., ABC Corporation"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief project description..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={formData.long_description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                    placeholder="Detailed project description (shown on project detail page)..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Scope of Work
                  </label>
                  <textarea
                    value={formData.scope || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                    placeholder="e.g., Complete lighting design and installation for 150 rooms, lobby, ballroom, and restaurants"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Project Images
                  </label>
                  
                  {/* Image Grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {formData.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="relative aspect-square bg-white/5 group">
                          <img
                            src={image}
                            alt={`Project ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', image);
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#C9A84C] file:text-white file:cursor-pointer hover:file:bg-[#A07830] transition-colors"
                  />
                  
                  {uploading && (
                    <p className="text-white/50 text-sm mt-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading images...
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-white/5 text-white hover:bg-white/10 transition-colors font-heading text-sm uppercase tracking-[1px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 px-4 py-3 bg-[#C9A84C] text-white hover:bg-[#A07830] transition-colors font-heading text-sm uppercase tracking-[1px] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingProject ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;
