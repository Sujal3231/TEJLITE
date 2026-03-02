import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  type Service
} from '@/services/products';

interface ServiceFormData {
  name: string;
  short_description: string;
  icon_url: string;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    short_description: '',
    icon_url: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        short_description: service.short_description,
        icon_url: service.icon_url || ''
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', short_description: '', icon_url: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', short_description: '', icon_url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        toast.success('Service updated successfully');
      } else {
        await createService(formData);
        toast.success('Service created successfully');
      }
      
      handleCloseModal();
      loadServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteService(id);
      toast.success('Service deleted successfully');
      loadServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error(error.message || 'Failed to delete service');
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="font-display text-3xl text-white">Services</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-[#A07830] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
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
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1C1C] border border-white/10 p-6"
          >
            {/* Icon */}
            <div className="w-16 h-16 bg-[#C9A84C]/10 flex items-center justify-center mb-4">
              {service.icon_url ? (
                <span className="text-3xl">{service.icon_url}</span>
              ) : (
                <Sparkles className="w-8 h-8 text-[#C9A84C]" />
              )}
            </div>

            {/* Content */}
            <h3 className="font-display text-xl text-white mb-2">{service.name}</h3>
            <p className="text-white/50 text-sm mb-4 line-clamp-3">
              {service.short_description || 'No description'}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(service)}
                className="flex-1 px-3 py-2 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id, service.name)}
                className="px-3 py-2 bg-white/5 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-[#1C1C1C] border border-white/10 p-12 text-center">
          <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No services yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded hover:bg-[#A07830] transition-colors"
          >
            Create Your First Service
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
                  {editingService ? 'Edit Service' : 'Add Service'}
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
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Custom Design"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_url: e.target.value }))}
                    placeholder="e.g., ✨ 🎨 💡"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                  <p className="text-white/40 text-xs mt-1">Use an emoji or leave empty for default icon</p>
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Service description..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
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
                    disabled={saving}
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
                        {editingService ? 'Update' : 'Create'}
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

export default AdminServices;
