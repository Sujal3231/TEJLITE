import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Check, Copy, MessageCircle, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  fetchProductById, 
  fetchProducts,
  submitEnquiry,
  type Product 
} from '@/services/products';
import { initEmailJS, sendProductInquiry } from '@/config/emailjs';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    quantity: 1,
    application: '',
    specialRequirements: '',
    sendCatalog: false,
  });

  // Load product data
  useEffect(() => {
    initEmailJS();
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const [productData, allProducts] = await Promise.all([
        fetchProductById(productId),
        fetchProducts()
      ]);

      if (!productData) {
        toast.error('Product not found');
        navigate('/products');
        return;
      }

      setProduct(productData);

      // Get related products from same category
      const related = allProducts
        .filter(p => 
          p.id !== productData.id && 
          p.category_id === productData.category_id &&
          p.status === 'active'
        )
        .slice(0, 4);
      setRelatedProducts(related);

    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = (type: string) => {
    const url = window.location.href;
    switch (type) {
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=Check out this product: ${url}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Check out ${productData.name}&body=I found this amazing product: ${url}`);
        break;
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    try {
      // Save enquiry to Firebase
      await submitEnquiry({
        type: 'product',
        product_id: product.id,
        product_name: product.name,
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        city: enquiryForm.city,
        quantity: enquiryForm.quantity,
        application: enquiryForm.application,
        special_requirements: enquiryForm.specialRequirements,
        catalog_requested: enquiryForm.sendCatalog,
        message: `Product Enquiry for: ${product.name}\n\nQuantity: ${enquiryForm.quantity}\nApplication: ${enquiryForm.application || 'Not specified'}\nSpecial Requirements: ${enquiryForm.specialRequirements || 'None'}\nCatalog Requested: ${enquiryForm.sendCatalog ? 'Yes' : 'No'}`,
      });

      // Prepare product inquiry data for email
      const inquiryData = {
        customer_name: enquiryForm.name,
        customer_email: enquiryForm.email,
        customer_phone: enquiryForm.phone,
        customer_message: `
City: ${enquiryForm.city}
Quantity Required: ${enquiryForm.quantity}
Application: ${enquiryForm.application || 'Not specified'}
Special Requirements: ${enquiryForm.specialRequirements || 'None'}
Catalog Requested: ${enquiryForm.sendCatalog ? 'Yes' : 'No'}
        `.trim(),
        product_name: product.name,
        product_category: product.category?.name || 'Uncategorized',
        product_description: product.short_description || '',
        product_image: product.images?.[0] || '',
        inquiry_date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        website_url: window.location.origin,
        product_url: window.location.href,
        reply_to: enquiryForm.email,
        to_name: 'Tej Lite Team',
      };

      // Send email via EmailJS
      await sendProductInquiry(inquiryData);

      toast.success('Enquiry submitted successfully! We will contact you within 24 hours.');
      setIsEnquiryModalOpen(false);
      
      // Reset form
      setEnquiryForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        quantity: 1,
        application: '',
        specialRequirements: '',
        sendCatalog: false,
      });
    } catch (error) {
      console.error('Error sending product enquiry:', error);
      toast.error('Failed to send enquiry. Please try again or contact us directly.');
    }
  };

  const nextImage = () => {
    if (!product?.images) return;
    setSelectedImage((prev) => (prev + 1) % product.images!.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setSelectedImage((prev) => (prev - 1 + product.images!.length) % product.images!.length);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'installation', label: 'Installation' },
    { id: 'customization', label: 'Customization' },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C9A84C] mx-auto mb-4" />
          <p className="text-[#4A4A4A]">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error if product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#4A4A4A] mb-4">Product not found</p>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images || [];
  const productSpecs = product.specifications || [];
  const productFeatures = product.features || [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20">
      {/* Breadcrumb */}
      <div className="bg-[#F2EDE4] border-b border-[#E5E0D5]">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-[#4A4A4A] text-sm">
            <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-[#C9A84C] transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link to={`/products?category=${product.category.slug}`} className="hover:text-[#C9A84C] transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C9A84C]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="py-8 md:py-16 lg:py-24 px-8">
        <div className="container-custom">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Image Gallery */}
            <div className="-mx-8 sm:mx-0">
              {/* Main Image */}
              <div 
                ref={imageRef}
                className="relative aspect-[4/3] md:aspect-square bg-white mb-2 md:mb-4 overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleImageHover}
                onClick={() => setIsLightboxOpen(true)}
              >
                {productImages.length > 0 ? (
                  <>
                    <img
                      src={productImages[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Zoom Overlay - Hidden on mobile */}
                    {isZoomed && (
                      <div 
                        className="hidden md:block absolute inset-0 bg-no-repeat pointer-events-none"
                        style={{
                          backgroundImage: `url(${productImages[selectedImage]})`,
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          backgroundSize: '200%',
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F2EDE4]">
                    <span className="text-[#C9A84C] text-8xl">✦</span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 flex items-center justify-center hover:bg-[#C9A84C] hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 flex items-center justify-center hover:bg-[#C9A84C] hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-8 sm:px-0">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-[#C9A84C]' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="sm:px-0">
              {/* Tags */}
              <div className="flex gap-2 mb-3 md:mb-4">
                <span className="px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] text-xs font-heading uppercase tracking-[1px]">
                  {product.category?.name}
                </span>
                {product.subcategory && (
                  <span className="px-3 py-1 bg-[#0D0D0D]/10 text-[#0D0D0D] text-xs font-heading uppercase tracking-[1px]">
                    {product.subcategory.name}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-[#0D0D0D] mb-3 md:mb-4">
                {product.name}
              </h1>

              <p className="text-[#4A4A4A] leading-relaxed mb-4 md:mb-6">
                {product.short_description}
              </p>

              {/* Specifications Preview */}
              {productSpecs.length > 0 && (
                <div className="bg-[#F2EDE4] p-4 md:p-6 mb-4 md:mb-6">
                  <h3 className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C] mb-3 md:mb-4">
                    Quick Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {productSpecs.slice(0, 4).map((spec, index) => (
                      <div key={index}>
                        <p className="text-[#4A4A4A] text-xs uppercase tracking-[1px]">{spec.label}</p>
                        <p className="text-[#0D0D0D] font-medium">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {productFeatures.length > 0 && (
                <div className="mb-4 md:mb-6">
                  <h3 className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C] mb-3 md:mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {productFeatures.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-[#4A4A4A] text-sm md:text-base">
                        <Check className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customization Note */}
              {product.is_customizable && product.customization_notes && (
                <div className="bg-[#F5EDD8] border-l-4 border-[#C9A84C] p-3 md:p-4 mb-4 md:mb-6">
                  <p className="text-[#0D0D0D] text-sm">
                    <strong>Customizable:</strong> {product.customization_notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="btn-primary w-full text-center text-xs md:text-sm"
                >
                  Enquire About This Product
                </button>
                <a
                  href={`https://wa.me/919876543210?text=Hi Tej Lite! I am interested in ${product.name}. Please share more details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 md:py-4 bg-[#25D366] text-white font-heading text-xs md:text-sm uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Chat on WhatsApp
                </a>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4">
                <span className="text-[#4A4A4A] text-sm">Share:</span>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-8 h-8 flex items-center justify-center bg-[#F2EDE4] hover:bg-[#C9A84C] hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-8 h-8 flex items-center justify-center bg-[#F2EDE4] hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="w-8 h-8 flex items-center justify-center bg-[#F2EDE4] hover:bg-[#C9A84C] hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white border-t border-[#E5E0D5]">
        <div className="container-custom py-12">
          {/* Tab Navigation */}
          <div className="overflow-x-auto scrollbar-hide border-b border-[#E5E0D5] mb-8">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-heading text-sm uppercase tracking-[1px] transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-[#C9A84C]' 
                      : 'text-[#4A4A4A] hover:text-[#C9A84C]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <p className="text-[#4A4A4A] leading-relaxed mb-6">
                  {product.long_description || product.short_description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                {productSpecs.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {productSpecs.map((spec, index) => (
                        <tr 
                          key={index} 
                          className={index % 2 === 0 ? 'bg-[#F2EDE4]' : 'bg-white'}
                        >
                          <td className="py-3 px-4 font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A]">
                            {spec.label}
                          </td>
                          <td className="py-3 px-4 text-[#0D0D0D]">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-[#4A4A4A]">No specifications available</p>
                )}
              </div>
            )}

            {activeTab === 'installation' && (
              <div className="max-w-3xl">
                <h3 className="font-display text-xl text-[#0D0D0D] mb-4">
                  Installation Guidelines
                </h3>
                <ul className="space-y-3 text-[#4A4A4A]">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    Professional installation is strongly recommended due to the weight and complexity
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    Ensure ceiling can support minimum 50kg weight
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    Requires dedicated electrical circuit
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    Installation height: minimum 2.4m from floor
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                    Includes mounting hardware and installation manual
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'customization' && (
              <div className="max-w-3xl">
                {product.is_customizable ? (
                  <>
                    <h3 className="font-display text-xl text-[#0D0D0D] mb-4">
                      Customization Options
                    </h3>
                    <p className="text-[#4A4A4A] leading-relaxed mb-6">
                      {product.customization_notes || 'This product can be customized to your requirements. Contact us for more details.'}
                    </p>
                  </>
                ) : (
                  <p className="text-[#4A4A4A]">This product is not available for customization.</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section-padding bg-[#FAF7F2]">
        <div className="container-custom">
          <h2 className="font-display text-2xl text-[#0D0D0D] mb-8">
            You May Also Like
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="group bg-white overflow-hidden card-hover"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#F2EDE4]">
                  {relatedProduct.images && relatedProduct.images.length > 0 ? (
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#C9A84C] text-6xl">✦</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg text-[#0D0D0D]">{relatedProduct.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
            src={productImages[selectedImage]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-[#C9A84C]' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setIsEnquiryModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#FAF7F2] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FAF7F2] border-b border-[#E5E0D5] p-4 md:p-6 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-1 md:mb-2 text-xs">Get in Touch</p>
                <h2 className="font-display text-lg md:text-2xl text-[#0D0D0D]">
                  Enquire About This Product
                </h2>
              </div>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[#4A4A4A] hover:text-[#C9A84C] transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6">
              <form onSubmit={handleEnquirySubmit} className="bg-white p-4 md:p-8">
                {/* Product Info (Read-only) */}
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-[#F5EDD8] border-l-4 border-[#C9A84C]">
                  <p className="text-xs uppercase tracking-[1px] text-[#4A4A4A] mb-1">Product</p>
                  <p className="font-display text-base md:text-lg text-[#0D0D0D]">{product.name}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.city}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Quantity Required *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={enquiryForm.quantity}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, quantity: parseInt(e.target.value) })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Application
                    </label>
                    <select
                      value={enquiryForm.application}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, application: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                    >
                      <option value="">Select Application</option>
                      <option value="residential">Residential</option>
                      <option value="hotel">Hotel</option>
                      <option value="commercial">Commercial</option>
                      <option value="office">Office</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block font-heading text-xs md:text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={enquiryForm.specialRequirements}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, specialRequirements: e.target.value })}
                    placeholder="Custom size, finish preference, etc."
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] text-sm md:text-base"
                  />
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enquiryForm.sendCatalog}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, sendCatalog: e.target.checked })}
                      className="w-4 h-4 md:w-5 md:h-5 accent-[#C9A84C]"
                    />
                    <span className="text-[#4A4A4A] text-sm md:text-base">I would like to receive the product catalog</span>
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full text-xs md:text-sm">
                  Submit Enquiry
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
