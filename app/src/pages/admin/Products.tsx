import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Eye, Trash2, Star, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchProducts,
  fetchCategories,
  fetchSubcategoriesByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type Category,
  type Subcategory
} from '@/services/products';
import { uploadMultipleImages } from '@/services/upload';

interface ProductFormData {
  name: string;
  long_description: string;
  short_description: string;
  category_id: string;
  subcategory_id: string;
  images: string[];
  is_featured: boolean;
  is_customizable: boolean;
  customization_notes: string;
  specifications: { label: string; value: string }[];
  features: string[];
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    long_description: '',
    short_description: '',
    category_id: '',
    subcategory_id: '',
    images: [],
    is_featured: false,
    is_customizable: false,
    customization_notes: '',
    specifications: [],
    features: []
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      const data = await fetchSubcategoriesByCategory(categoryId);
      setSubcategories(data);
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    if (categoryId) {
      await loadSubcategories(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  const handleOpenModal = async (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        long_description: product.long_description || '',
        short_description: product.short_description,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id || '',
        images: product.images || [],
        is_featured: product.is_featured,
        is_customizable: product.is_customizable || false,
        customization_notes: product.customization_notes || '',
        specifications: (product as any).specifications || [],
        features: (product as any).features || []
      });
      // Load subcategories for the product's category
      if (product.category_id) {
        await loadSubcategories(product.category_id);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        long_description: '',
        short_description: '',
        category_id: '',
        subcategory_id: '',
        images: [],
        is_featured: false,
        is_customizable: false,
        customization_notes: '',
        specifications: [],
        features: []
      });
      setSubcategories([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      long_description: '',
      short_description: '',
      category_id: '',
      subcategory_id: '',
      images: [],
      is_featured: false,
      is_customizable: false,
      customization_notes: '',
      specifications: [],
      features: []
    });
    setSubcategories([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const imageUrls = await uploadMultipleImages(files, 'products', (progress) => {
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
      toast.error('Product name is required');
      return;
    }

    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(formData);
        toast.success('Product created successfully');
      }
      
      handleCloseModal();
      loadData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      loadData();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory && product.category_id !== selectedCategory) return false;
    return true;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
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
        <h1 className="font-display text-3xl text-white">Products</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C9A84C] text-white font-heading text-xs uppercase tracking-[1px] rounded flex items-center gap-2 hover:bg-[#A07830] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1C1C1C] border border-white/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C]"
        >
          <option value="" className="bg-[#1C1C1C]">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id} className="bg-[#1C1C1C]">
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#1C1C1C] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-white/50 font-heading text-xs uppercase tracking-[1px]">Product</th>
                <th className="px-6 py-4 text-left text-white/50 font-heading text-xs uppercase tracking-[1px]">Category</th>
                <th className="px-6 py-4 text-left text-white/50 font-heading text-xs uppercase tracking-[1px]">Featured</th>
                <th className="px-6 py-4 text-right text-white/50 font-heading text-xs uppercase tracking-[1px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-white/40 text-sm line-clamp-1">{product.short_description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white/70">{getCategoryName(product.category_id)}</p>
                  </td>
                  <td className="px-6 py-4">
                    {product.is_featured ? (
                      <Star className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C]" />
                    ) : (
                      <Star className="w-5 h-5 text-white/20" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-white/50 hover:text-[#C9A84C] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <Link 
                        to={`/products/${product.id}`}
                        target="_blank"
                        className="p-2 text-white/50 hover:text-[#C9A84C] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-white/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-white/50">No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1C] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1C1C1C] z-10">
                <h2 className="font-display text-2xl text-white">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
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
                {/* Name */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Imperial Crystal Chandelier"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                    required
                  >
                    <option value="" className="bg-[#1C1C1C]">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="bg-[#1C1C1C]">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                {formData.category_id && (
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Subcategory
                    </label>
                    <select
                      value={formData.subcategory_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategory_id: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                    >
                      <option value="" className="bg-[#1C1C1C]">Select a subcategory (optional)</option>
                      {subcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.id} className="bg-[#1C1C1C]">
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                    {subcategories.length === 0 && (
                      <p className="text-white/40 text-xs mt-1">No subcategories available for this category</p>
                    )}
                  </div>
                )}

                {/* Short Description */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief one-line description"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={formData.long_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                    placeholder="Detailed product description..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Product Images
                  </label>
                  
                  {/* Image Grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {formData.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="relative aspect-square bg-white/5 group">
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
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
                    onChange={handleImageUpload}
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

                {/* Specifications */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Specifications (Material, Finish, Dimensions, etc.)
                  </label>
                  <div className="space-y-2">
                    {formData.specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[index].label = e.target.value;
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                          placeholder="Label (e.g., MATERIAL)"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[index].value = e.target.value;
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                          placeholder="Value (e.g., Crystal, Antique Brass)"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSpecs = formData.specifications.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, specifications: newSpecs }));
                          }}
                          className="px-3 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          specifications: [...prev.specifications, { label: '', value: '' }]
                        }));
                      }}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-[#C9A84C] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Specification
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                    Key Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index] = e.target.value;
                            setFormData(prev => ({ ...prev, features: newFeatures }));
                          }}
                          placeholder="e.g., Hand-cut Austrian crystals"
                          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = formData.features.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, features: newFeatures }));
                          }}
                          className="px-3 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          features: [...prev.features, '']
                        }));
                      }}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-[#C9A84C] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </button>
                  </div>
                </div>

                {/* Customizable */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="customizable"
                      checked={formData.is_customizable}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_customizable: e.target.checked }))}
                      className="w-5 h-5 accent-[#C9A84C]"
                    />
                    <label htmlFor="customizable" className="text-white cursor-pointer">
                      Customizable Product
                    </label>
                  </div>
                  {formData.is_customizable && (
                    <input
                      type="text"
                      value={formData.customization_notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, customization_notes: e.target.value }))}
                      placeholder="Customization notes (e.g., Custom sizes available)"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                  )}
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-5 h-5 accent-[#C9A84C]"
                  />
                  <label htmlFor="featured" className="text-white cursor-pointer">
                    Mark as Featured Product
                  </label>
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
                        {editingProduct ? 'Update' : 'Create'}
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

export default AdminProducts;
