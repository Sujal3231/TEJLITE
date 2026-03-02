import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Loader2, Folder, FolderOpen, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchCategories,
  fetchSubcategoriesByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  type Category,
  type Subcategory
} from '@/services/products';
import { uploadImage } from '@/services/upload';

interface CategoryFormData {
  name: string;
  description: string;
  cover_image_url: string;
}

interface SubcategoryFormData {
  name: string;
  description: string;
  cover_image_url: string;
  category_id: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [loadingSubcategories, setLoadingSubcategories] = useState<Record<string, boolean>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    cover_image_url: ''
  });
  
  // Subcategory modal
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [subcategoryFormData, setSubcategoryFormData] = useState<SubcategoryFormData>({
    name: '',
    description: '',
    cover_image_url: '',
    category_id: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      
      // Load subcategories for all categories upfront
      const subcategoriesPromises = data.map(category => 
        fetchSubcategoriesByCategory(category.id)
          .then(subs => ({ categoryId: category.id, subcategories: subs }))
          .catch(error => {
            console.error(`Error loading subcategories for ${category.name}:`, error);
            return { categoryId: category.id, subcategories: [] };
          })
      );
      
      const subcategoriesResults = await Promise.all(subcategoriesPromises);
      
      // Build subcategories object
      const subcategoriesMap: Record<string, Subcategory[]> = {};
      subcategoriesResults.forEach(result => {
        subcategoriesMap[result.categoryId] = result.subcategories;
      });
      
      setSubcategories(subcategoriesMap);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      setLoadingSubcategories(prev => ({ ...prev, [categoryId]: true }));
      const data = await fetchSubcategoriesByCategory(categoryId);
      setSubcategories(prev => ({ ...prev, [categoryId]: data }));
    } catch (error: any) {
      console.error('Error loading subcategories:', error);
      toast.error(error.message || 'Failed to load subcategories');
      // Set empty array so we don't keep trying to load
      setSubcategories(prev => ({ ...prev, [categoryId]: [] }));
    } finally {
      setLoadingSubcategories(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  const toggleCategory = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      // Subcategories are already loaded, no need to fetch again
    }
  };

  // Category handlers
  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        cover_image_url: category.cover_image_url || ''
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({ name: '', description: '', cover_image_url: '' });
    }
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryFormData({ name: '', description: '', cover_image_url: '' });
  };

  const handleCategoryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'categories');
      setCategoryFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryFormData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
        toast.success('Category updated successfully');
      } else {
        await createCategory(categoryFormData);
        toast.success('Category created successfully');
      }
      
      handleCloseCategoryModal();
      loadCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all subcategories. This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  // Subcategory handlers
  const handleOpenSubcategoryModal = (categoryId: string, subcategory?: Subcategory) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setSubcategoryFormData({
        name: subcategory.name,
        description: subcategory.description || '',
        cover_image_url: subcategory.cover_image_url || '',
        category_id: subcategory.category_id
      });
    } else {
      setEditingSubcategory(null);
      setSubcategoryFormData({
        name: '',
        description: '',
        cover_image_url: '',
        category_id: categoryId
      });
    }
    setShowSubcategoryModal(true);
  };

  const handleCloseSubcategoryModal = () => {
    setShowSubcategoryModal(false);
    setEditingSubcategory(null);
    setSubcategoryFormData({ name: '', description: '', cover_image_url: '', category_id: '' });
  };

  const handleSubcategoryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'subcategories');
      setSubcategoryFormData(prev => ({ ...prev, cover_image_url: imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subcategoryFormData.name.trim()) {
      toast.error('Subcategory name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingSubcategory) {
        await updateSubcategory(editingSubcategory.id, subcategoryFormData);
        toast.success('Subcategory updated successfully');
      } else {
        await createSubcategory(subcategoryFormData);
        toast.success('Subcategory created successfully');
      }
      
      handleCloseSubcategoryModal();
      loadSubcategories(subcategoryFormData.category_id);
    } catch (error: any) {
      console.error('Error saving subcategory:', error);
      toast.error(error.message || 'Failed to save subcategory');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubcategory = async (id: string, name: string, categoryId: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteSubcategory(id);
      toast.success('Subcategory deleted successfully');
      loadSubcategories(categoryId);
    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      toast.error(error.message || 'Failed to delete subcategory');
    }
  };

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
        <h1 className="font-display text-3xl text-white">Categories & Subcategories</h1>
        <button 
          onClick={() => handleOpenCategoryModal()}
          className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-[#A07830] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-[#1C1C1C] border border-white/10">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-b border-white/10 last:border-b-0"
          >
            {/* Category Row */}
            <div className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                {/* Expand Button */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {expandedCategory === category.id ? (
                    <FolderOpen className="w-5 h-5" />
                  ) : (
                    <Folder className="w-5 h-5" />
                  )}
                </button>

                {/* Image */}
                <div className="w-16 h-16 bg-white/5 flex-shrink-0">
                  {category.cover_image_url ? (
                    <img
                      src={category.cover_image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder className="w-6 h-6 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-white font-medium text-lg">{category.name}</h3>
                  <p className="text-white/50 text-sm">
                    {subcategories[category.id]?.length || 0} subcategories
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenCategoryModal(category)}
                    className="p-2 text-white/50 hover:text-[#C9A84C] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="p-2 text-white/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {expandedCategory === category.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white/5 border-t border-white/10"
              >
                <div className="p-4 pl-16">
                  {/* Add Subcategory Button */}
                  <button
                    onClick={() => handleOpenSubcategoryModal(category.id)}
                    className="mb-4 px-3 py-2 bg-white/5 text-[#C9A84C] hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subcategory
                  </button>

                  {/* Loading State */}
                  {loadingSubcategories[category.id] ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
                    </div>
                  ) : (
                    <>
                      {/* Subcategories List */}
                      {subcategories[category.id]?.length > 0 ? (
                        <div className="space-y-2">
                          {subcategories[category.id].map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-white/30" />
                          
                          {/* Image */}
                          {subcategory.cover_image_url && (
                            <div className="w-12 h-12 bg-white/5 flex-shrink-0">
                              <img
                                src={subcategory.cover_image_url}
                                alt={subcategory.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1">
                            <p className="text-white font-medium">{subcategory.name}</p>
                            {subcategory.description && (
                              <p className="text-white/40 text-sm">{subcategory.description}</p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenSubcategoryModal(category.id, subcategory)}
                              className="p-1.5 text-white/40 hover:text-[#C9A84C] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(subcategory.id, subcategory.name, category.id)}
                              className="p-1.5 text-white/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">No subcategories yet</p>
                  )}
                  </>
                )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-[#1C1C1C] border border-white/10 p-12 text-center">
          <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50 mb-4">No categories yet</p>
          <button
            onClick={() => handleOpenCategoryModal()}
            className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded hover:bg-[#A07830] transition-colors"
          >
            Create Your First Category
          </button>
        </div>
      )}

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-2xl text-white">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={handleCloseCategoryModal}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-6">
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Chandeliers"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Category Image
                  </label>
                  
                  {categoryFormData.cover_image_url && (
                    <div className="mb-4 aspect-video bg-white/5 relative">
                      <img
                        src={categoryFormData.cover_image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#C9A84C] file:text-white file:cursor-pointer hover:file:bg-[#A07830] transition-colors"
                  />
                  
                  {uploading && (
                    <p className="text-white/50 text-sm mt-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading image...
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseCategoryModal}
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
                        {editingCategory ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subcategory Modal */}
      <AnimatePresence>
        {showSubcategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-2xl text-white">
                  {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
                </h2>
                <button
                  onClick={handleCloseSubcategoryModal}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubcategorySubmit} className="p-6 space-y-6">
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    value={subcategoryFormData.name}
                    onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Crystal Chandeliers"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Description
                  </label>
                  <textarea
                    value={subcategoryFormData.description}
                    onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Subcategory Image (Optional)
                  </label>
                  
                  {subcategoryFormData.cover_image_url && (
                    <div className="mb-4 aspect-video bg-white/5 relative">
                      <img
                        src={subcategoryFormData.cover_image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSubcategoryImageChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#C9A84C] file:text-white file:cursor-pointer hover:file:bg-[#A07830] transition-colors"
                  />
                  
                  {uploading && (
                    <p className="text-white/50 text-sm mt-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading image...
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseSubcategoryModal}
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
                        {editingSubcategory ? 'Update' : 'Create'}
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

export default AdminCategories;
