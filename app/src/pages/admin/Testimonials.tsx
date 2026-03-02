import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Loader2, Quote } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial
} from '@/services/products';

interface TestimonialFormData {
  client_name: string;
  project_type: string;
  testimonial_text: string;
  sort_order: number;
  status: 'active' | 'hidden';
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<TestimonialFormData>({
    client_name: '',
    project_type: '',
    testimonial_text: '',
    sort_order: 0,
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        client_name: testimonial.client_name,
        project_type: testimonial.project_type || '',
        testimonial_text: testimonial.testimonial_text,
        sort_order: testimonial.sort_order,
        status: testimonial.status
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        client_name: '',
        project_type: '',
        testimonial_text: '',
        sort_order: testimonials.length,
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      project_type: '',
      testimonial_text: '',
      sort_order: 0,
      status: 'active'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_name.trim()) {
      toast.error('Client name is required');
      return;
    }

    if (!formData.testimonial_text.trim()) {
      toast.error('Testimonial text is required');
      return;
    }

    setSaving(true);

    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData);
        toast.success('Testimonial updated successfully');
      } else {
        await createTestimonial(formData);
        toast.success('Testimonial created successfully');
      }
      
      handleCloseModal();
      loadData();
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      toast.error(error.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the testimonial from "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
      loadData();
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      toast.error(error.message || 'Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (searchQuery && !testimonial.client_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
        <h1 className="font-display text-3xl text-white">Testimonials</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-[#A07830] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
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
            placeholder="Search testimonials..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1C1C] border border-white/10 p-6 hover:border-[#C9A84C]/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <Quote className="w-8 h-8 text-[#C9A84C]/30" />
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(testimonial)}
                  className="p-2 text-white/50 hover:text-[#C9A84C] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(testimonial.id, testimonial.client_name)}
                  className="p-2 text-white/50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-white/80 text-sm italic mb-4 line-clamp-4">
              "{testimonial.testimonial_text}"
            </p>

            <div className="border-t border-white/10 pt-4">
              <p className="text-[#C9A84C] font-heading text-xs uppercase tracking-[1px]">
                {testimonial.client_name}
              </p>
              {testimonial.project_type && (
                <p className="text-white/40 text-xs mt-1">
                  {testimonial.project_type}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  testimonial.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-white/10 text-white/40'
                }`}>
                  {testimonial.status}
                </span>
                <span className="text-white/40 text-xs">
                  Order: {testimonial.sort_order}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="bg-[#1C1C1C] border border-white/10 p-8 text-center">
          <p className="text-white/50">No testimonials found</p>
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
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1C1C1C] z-10">
                <h2 className="font-display text-2xl text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Client Name */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                {/* Project Type */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Project Type
                  </label>
                  <input
                    type="text"
                    value={formData.project_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                    placeholder="e.g., Luxury Hotel, Mumbai"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>

                {/* Testimonial Text */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Testimonial Text *
                  </label>
                  <textarea
                    value={formData.testimonial_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, testimonial_text: e.target.value }))}
                    placeholder="Enter the testimonial text..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                    required
                  />
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'hidden' }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                  >
                    <option value="active" className="bg-[#1C1C1C]">Active</option>
                    <option value="hidden" className="bg-[#1C1C1C]">Hidden</option>
                  </select>
                </div>

                {/* Actions */}
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
                        {editingTestimonial ? 'Update' : 'Create'}
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

export default AdminTestimonials;
