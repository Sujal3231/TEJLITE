import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Loader2, FileText, Eye, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  fetchCatalogCategories,
  createCatalogCategory,
  updateCatalogCategory,
  deleteCatalogCategory,
  type Catalog,
  type CatalogCategory
} from '@/services/products';
import { uploadImage } from '@/services/upload';

interface CatalogFormData {
  title: string;
  description: string;
  pdf_url: string;
  cover_image_url: string;
  year: number;
  categoryId: string;
  categoryName: string;
}

const AdminCatalogs = () => {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<CatalogFormData>({
    title: '',
    description: '',
    pdf_url: '',
    cover_image_url: '',
    year: new Date().getFullYear(),
    categoryId: '',
    categoryName: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add Category modal (quick-add from the catalog form)
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Manage Categories modal (view / rename / delete)
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [categoryActionLoading, setCategoryActionLoading] = useState(false);

  useEffect(() => {
    loadCatalogs();
    loadCategories();
  }, []);

  const loadCatalogs = async () => {
    try {
      setLoading(true);
      const data = await fetchCatalogs();
      setCatalogs(data);
    } catch (error) {
      console.error('Error loading catalogs:', error);
      toast.error('Failed to load catalogs');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCatalogCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading catalog categories:', error);
      toast.error('Failed to load catalog categories');
    }
  };

  const handleOpenModal = (catalog?: Catalog) => {
    if (catalog) {
      setEditingCatalog(catalog);
      setFormData({
        title: catalog.title,
        description: catalog.description || '',
        pdf_url: catalog.pdf_url,
        cover_image_url: catalog.cover_image_url || '',
        year: catalog.year,
        categoryId: catalog.categoryId || '',
        categoryName: catalog.categoryName || ''
      });
    } else {
      setEditingCatalog(null);
      setFormData({
        title: '',
        description: '',
        pdf_url: '',
        cover_image_url: '',
        year: new Date().getFullYear(),
        categoryId: '',
        categoryName: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCatalog(null);
    setFormData({
      title: '',
      description: '',
      pdf_url: '',
      cover_image_url: '',
      year: new Date().getFullYear(),
      categoryId: '',
      categoryName: ''
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    const selected = categories.find(c => c.id === categoryId);
    setFormData(prev => ({
      ...prev,
      categoryId,
      categoryName: selected?.name || ''
    }));
  };

  const handleAddCategorySave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSavingCategory(true);
    try {
      const created = await createCatalogCategory(newCategoryName);
      setCategories(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ ...prev, categoryId: created.id, categoryName: created.name }));
      setNewCategoryName('');
      setShowAddCategoryModal(false);
      toast.success('Category created successfully');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.message || 'Failed to create category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleStartRenameCategory = (category: CatalogCategory) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleRenameCategory = async (id: string) => {
    if (!editingCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCategoryActionLoading(true);
    try {
      await updateCatalogCategory(id, editingCategoryName);
      await loadCategories();
      // Keep any catalog currently referencing this category name in sync in local state
      const renamed = editingCategoryName.trim();
      setFormData(prev => prev.categoryId === id ? { ...prev, categoryName: renamed } : prev);
      setEditingCategoryId(null);
      setEditingCategoryName('');
      toast.success('Category renamed successfully');
    } catch (error: any) {
      console.error('Error renaming category:', error);
      toast.error(error.message || 'Failed to rename category');
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setCategoryActionLoading(true);
    try {
      await deleteCatalogCategory(id);
      await loadCategories();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'This category is assigned to existing catalogs. Please move those catalogs before deleting it.');
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'catalogs');
      setFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
      toast.success('Cover image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Catalog name is required');
      return;
    }

    if (!formData.pdf_url.trim()) {
      toast.error('PDF URL is required');
      return;
    }

    setSaving(true);
    try {
      if (editingCatalog) {
        await updateCatalog(editingCatalog.id, formData);
        toast.success('Catalog updated successfully');
      } else {
        await createCatalog(formData);
        toast.success('Catalog created successfully');
      }
      
      handleCloseModal();
      loadCatalogs();
    } catch (error: any) {
      console.error('Error saving catalog:', error);
      toast.error(error.message || 'Failed to save catalog');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCatalog(id);
      toast.success('Catalog deleted successfully');
      loadCatalogs();
    } catch (error: any) {
      console.error('Error deleting catalog:', error);
      toast.error(error.message || 'Failed to delete catalog');
    }
  };

  const filteredCatalogs = catalogs.filter(catalog =>
    catalog.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="font-display text-3xl text-white">Catalogs</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowManageCategoriesModal(true)}
            className="px-4 py-2 bg-white/5 text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            Manage Categories
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-[#A07830] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Catalog
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#1C1C1C] border border-white/10 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalogs..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Catalogs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredCatalogs.map((catalog) => (
          <motion.div
            key={catalog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1C1C] border border-white/10 overflow-hidden group"
          >
            {/* Cover Image */}
            <div className="aspect-[3/4] bg-white/5 relative overflow-hidden">
              {catalog.cover_image_url ? (
                <img
                  src={catalog.cover_image_url}
                  alt={catalog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3">
              {catalog.categoryName && (
                <span className="inline-block mb-1.5 px-1.5 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-heading uppercase tracking-[1px]">
                  {catalog.categoryName}
                </span>
              )}
              <h3 className="font-display text-sm text-white mb-1 line-clamp-1">{catalog.title}</h3>
              <p className="text-white/50 text-xs mb-3 line-clamp-2">
                {catalog.description || 'No description'}
              </p>

              {/* Actions */}
              <div className="flex gap-1.5">
                <a
                  href={catalog.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-1.5 bg-white/5 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View PDF
                </a>
                <button
                  onClick={() => handleOpenModal(catalog)}
                  className="px-2 py-1.5 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(catalog.id, catalog.title)}
                  className="px-2 py-1.5 bg-white/5 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCatalogs.length === 0 && (
        <div className="bg-[#1C1C1C] border border-white/10 p-12 text-center">
          <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No catalogs yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded hover:bg-[#A07830] transition-colors"
          >
            Create Your First Catalog
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
              className="bg-[#1C1C1C] border border-white/10 rounded-[6px] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-2xl text-white">
                  {editingCatalog ? 'Edit Catalog' : 'Add Catalog'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Catalog Name *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., 2025 Product Catalog"
                    className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Category
                    </label>
                    {categories.length === 0 ? (
                      <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[6px] bg-white/5 border border-white/10">
                        <span className="text-white/40 text-sm truncate">No Categories Found</span>
                        <button
                          type="button"
                          onClick={() => setShowAddCategoryModal(true)}
                          className="text-[#C9A84C] text-sm font-heading uppercase tracking-[1px] hover:text-[#A07830] transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          value={formData.categoryId}
                          onChange={(e) => handleCategorySelect(e.target.value)}
                          className="flex-1 min-w-0 px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                        >
                          <option value="" className="bg-[#1C1C1C]">Select Category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id} className="bg-[#1C1C1C]">
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowAddCategoryModal(true)}
                          title="Add Category"
                          aria-label="Add Category"
                          className="shrink-0 w-11 h-[46px] flex items-center justify-center rounded-[6px] bg-white/5 text-[#C9A84C] hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    PDF URL *
                  </label>
                  <input
                    type="url"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                    placeholder="https://example.com/catalog.pdf"
                    className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                  <p className="text-white/40 text-xs mt-1.5">Upload your PDF to a hosting service and paste the URL here</p>
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Catalog description..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Cover Image
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-32 aspect-[3/4] rounded-[6px] bg-white/5 border border-white/10 overflow-hidden shrink-0">
                      {formData.cover_image_url ? (
                        <img
                          src={formData.cover_image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white/20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploading}
                        className="w-full px-4 py-3 rounded-[6px] bg-white/5 border border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-[6px] file:border-0 file:bg-[#C9A84C] file:text-white file:cursor-pointer hover:file:bg-[#A07830] transition-colors"
                      />
                      <p className="text-white/40 text-xs mt-1.5">Recommended: portrait cover, JPG or PNG</p>

                      {uploading && (
                        <p className="text-white/50 text-sm mt-2 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading image...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 rounded-[6px] bg-white/5 text-white hover:bg-white/10 transition-colors font-heading text-sm uppercase tracking-[1px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 px-4 py-3 rounded-[6px] bg-[#C9A84C] text-white hover:bg-[#A07830] transition-colors font-heading text-sm uppercase tracking-[1px] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingCatalog ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] border border-white/10 w-full max-w-md rounded-[6px]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl text-white">Add Category</h2>
                <button
                  onClick={() => { setShowAddCategoryModal(false); setNewCategoryName(''); }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCategorySave} className="p-6 space-y-6">
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Indoor"
                    autoFocus
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowAddCategoryModal(false); setNewCategoryName(''); }}
                    className="flex-1 px-4 py-3 bg-white/5 text-white hover:bg-white/10 transition-colors font-heading text-sm uppercase tracking-[1px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingCategory}
                    className="flex-1 px-4 py-3 bg-[#C9A84C] text-white hover:bg-[#A07830] transition-colors font-heading text-sm uppercase tracking-[1px] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Categories Modal */}
      <AnimatePresence>
        {showManageCategoriesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] border border-white/10 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-xl text-white">Catalog Categories</h2>
                <button
                  onClick={() => { setShowManageCategoriesModal(false); setEditingCategoryId(null); }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                {categories.length === 0 ? (
                  <p className="text-white/40 text-sm">No categories yet.</p>
                ) : (
                  categories.map(category => (
                    <div
                      key={category.id}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/10"
                    >
                      {editingCategoryId === category.id ? (
                        <>
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            autoFocus
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                          />
                          <button
                            onClick={() => handleRenameCategory(category.id)}
                            disabled={categoryActionLoading}
                            className="p-2 text-[#C9A84C] hover:text-[#A07830] transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setEditingCategoryId(null); setEditingCategoryName(''); }}
                            className="p-2 text-white/50 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-white">{category.name}</span>
                          <button
                            onClick={() => handleStartRenameCategory(category)}
                            className="p-2 text-white/50 hover:text-[#C9A84C] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                            disabled={categoryActionLoading}
                            className="p-2 text-white/50 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}

                <button
                  onClick={() => { setShowManageCategoriesModal(false); setShowAddCategoryModal(true); }}
                  className="w-full px-4 py-2 bg-white/5 text-[#C9A84C] hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCatalogs;
