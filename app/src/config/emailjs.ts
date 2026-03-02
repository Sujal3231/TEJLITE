import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_2a73gfu',
  contactTemplateId: 'template_k2538rk',
  productTemplateId: 'template_na9zmi2',
  publicKey: 'gi_d_JR4JIPB3s2gb',
};

export interface EmailData {
  to_name: string;
  from_name: string;
  from_email: string;
  phone?: string;
  message: string;
  reply_to: string;
  date?: string;
  website_url?: string;
  [key: string]: string | undefined;
}

export interface ProductInquiryData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_message: string;
  product_name: string;
  product_category: string;
  product_description: string;
  product_image: string;
  inquiry_date: string;
  website_url: string;
  product_url: string;
  reply_to: string;
  to_name: string;
  [key: string]: string;
}

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.publicKey);
};

// Send product inquiry email
export const sendProductInquiry = async (data: ProductInquiryData): Promise<void> => {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.productTemplateId,
      data
    );

    if (response.status !== 200) {
      throw new Error('Failed to send product inquiry email');
    }
  } catch (error: any) {
    console.error('Product Inquiry EmailJS Error:', error);
    throw new Error(error.message || 'Failed to send product inquiry');
  }
};

// Send contact form email
export const sendContactEmail = async (data: EmailData): Promise<void> => {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.contactTemplateId,
      data
    );

    if (response.status !== 200) {
      throw new Error('Failed to send contact email');
    }
  } catch (error: any) {
    console.error('Contact EmailJS Error:', error);
    throw new Error(error.message || 'Failed to send contact email');
  }
};

// Send admin notification email
export const sendAdminNotification = async (contactData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<void> => {
  try {
    await sendContactEmail({
      to_name: 'Tej Lite Team',
      from_name: contactData.name,
      from_email: contactData.email,
      phone: contactData.phone,
      message: contactData.message,
      reply_to: contactData.email,
      website_url: window.location.origin,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
};

/*
 * ============================================
 * EMAILJS SETUP INSTRUCTIONS
 * ============================================
 * 
 * 1. Sign up at https://www.emailjs.com (free tier available)
 * 2. Add an Email Service (Gmail, Outlook, or SMTP)
 * 3. Create Email Templates for each type of email
 * 4. Copy your Public Key, Service ID, and Template IDs
 * 5. Update the environment variables in .env file
 * 
 * ============================================
 * EMAIL TEMPLATE VARIABLES
 * ============================================
 * 
 * Product Enquiry Template:
 * - {{product_name}} - Name of the product
 * - {{product_id}} - Product ID
 * - {{customer_name}} - Customer's name
 * - {{customer_email}} - Customer's email
 * - {{customer_phone}} - Customer's phone
 * - {{customer_city}} - Customer's city
 * - {{quantity}} - Quantity required
 * - {{application}} - Application type
 * - {{special_requirements}} - Special requirements
 * - {{catalog_requested}} - Whether catalog was requested
 * 
 * General Enquiry Template:
 * - {{name}} - Customer's name
 * - {{email}} - Customer's email
 * - {{phone}} - Customer's phone
 * - {{company}} - Company name
 * - {{city}} - Customer's city
 * - {{enquiry_type}} - Type of enquiry
 * - {{message}} - Enquiry message
 * - {{how_heard}} - How they heard about Tej Lite
 * 
 * Admin Notification Template:
 * - {{enquiry_type}} - Type of enquiry received
 * - {{customer_name}} - Customer's name
 * - {{customer_email}} - Customer's email
 * - {{customer_phone}} - Customer's phone
 * - {{product_name}} - Product name (if product enquiry)
 * - {{timestamp}} - Time of enquiry
 * 
 * Auto-Reply Template:
 * - {{customer_name}} - Customer's name
 * - {{enquiry_type}} - Type of enquiry
 * - {{response_time}} - Expected response time (e.g., "24 hours")
 * 
 * ============================================
 * ENVIRONMENT VARIABLES (.env file)
 * ============================================
 * 
 * VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
 * VITE_EMAILJS_SERVICE_ID=your_service_id
 * VITE_EMAILJS_PRODUCT_TEMPLATE_ID=product_template_id
 * VITE_EMAILJS_GENERAL_TEMPLATE_ID=general_template_id
 * VITE_EMAILJS_CATALOG_TEMPLATE_ID=catalog_template_id
 * VITE_EMAILJS_ADMIN_TEMPLATE_ID=admin_template_id
 * VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=autoreply_template_id
 * 
 */
