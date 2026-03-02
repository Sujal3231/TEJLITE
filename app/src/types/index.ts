// Tej Lite Website - TypeScript Types

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  sort_order: number;
  status: 'active' | 'hidden';
  created_at?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  category?: Category;
  name: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  sort_order: number;
  status: 'active' | 'hidden';
  created_at?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  category_id: string;
  category?: Category;
  subcategory_id: string;
  subcategory?: Subcategory;
  short_description: string;
  long_description?: string;
  images?: string[]; // Array of image URLs (base64 or external)
  specifications?: { label: string; value: string }[]; // Quick specs array
  features?: string[]; // Key features array
  is_featured: boolean;
  is_new: boolean;
  is_customizable: boolean;
  customization_notes?: string;
  status: 'active' | 'hidden';
  sort_order: number;
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_label: string;
  spec_value: string;
  sort_order: number;
}

export interface ProductFeature {
  id: string;
  product_id: string;
  feature_text: string;
  sort_order: number;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  slug: string;
  client_name?: string;
  location: string;
  city?: string;
  year: number;
  project_type: string;
  scope?: string; // Scope of Work
  short_description?: string;
  long_description?: string;
  hero_image_url?: string;
  images?: string[]; // Array of project images (base64 or external)
  is_featured: boolean;
  status: 'active' | 'hidden';
  created_at?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface ProjectProduct {
  id: string;
  project_id: string;
  product_id: string;
  product?: Product;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
  short_description: string;
  long_description?: string;
  hero_image_url?: string;
  is_featured: boolean;
  status: 'active' | 'hidden';
  sort_order: number;
  created_at?: string;
}

export interface ServiceStep {
  id: string;
  service_id: string;
  step_title: string;
  step_description: string;
  sort_order: number;
}

// Catalog Types
export interface Catalog {
  id: string;
  title: string;
  year: number;
  cover_image_url?: string;
  pdf_url: string;
  description?: string;
  download_count: number;
  is_latest: boolean;
  status: 'active' | 'hidden';
  created_at?: string;
}

// Enquiry Types
export interface Enquiry {
  id: string;
  type: 'general' | 'product';
  product_id?: string;
  product_name?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  message?: string;
  quantity?: number;
  application?: string;
  special_requirements?: string;
  catalog_requested: boolean;
  how_heard?: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  admin_notes?: string;
  created_at?: string;
}

// Hero Slide Types
export interface HeroSlide {
  id: string;
  image_url?: string;
  video_url?: string;
  headline: string;
  subheadline?: string;
  cta_text?: string;
  cta_url?: string;
  sort_order: number;
  status: 'active' | 'hidden';
}

// Testimonial Types
export interface Testimonial {
  id: string;
  client_name: string;
  project_type?: string;
  testimonial_text: string;
  sort_order: number;
  status: 'active' | 'hidden';
}

// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'content_editor' | 'viewer';
  is_active: boolean;
  last_login?: string;
  created_at?: string;
}

// Settings Types
export interface SiteSettings {
  site_name: string;
  site_logo?: string;
  footer_logo?: string;
  contact_email: string;
  phone_numbers: string[];
  address: string;
  whatsapp_number?: string;
  social_media: {
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    linkedin?: string;
    youtube?: string;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategories?: string[];
  priceRange?: [number, number];
  materials?: string[];
  finishes?: string[];
  sizes?: string[];
  applications?: string[];
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  enquiryType: string;
  message: string;
  howHeard?: string;
}

export interface ProductEnquiryFormData {
  productName: string;
  productId?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  quantity: number;
  application?: string;
  specialRequirements?: string;
  sendCatalog: boolean;
}

// Stats Types
export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

// Media Types
export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'pdf' | 'svg';
  size: number;
  folder?: string;
  created_at: string;
}
