import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchSiteSettings, submitEnquiry } from '@/services/products';
import type { SiteSettings } from '@/types';
import { initEmailJS, sendContactEmail } from '@/config/emailjs';

const enquiryTypes = [
  'General Enquiry',
  'Product Enquiry',
  'Service Enquiry',
  'Catalog Request',
  'Export Enquiry',
  'Partnership',
];

const howHeardOptions = [
  'Google Search',
  'Referral',
  'Social Media',
  'Exhibition',
  'Other',
];

const Contact = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    enquiryType: '',
    message: '',
    howHeard: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    initEmailJS();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoadingSettings(true);
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save enquiry to Firebase
      await submitEnquiry({
        type: 'general',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        city: formData.city,
        message: `Enquiry Type: ${formData.enquiryType}\nHow Heard: ${formData.howHeard || 'N/A'}\n\n${formData.message}`,
        how_heard: formData.howHeard,
        catalog_requested: false,
      });

      // Send email via EmailJS
      await sendContactEmail({
        to_name: 'Tej Lite Team',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: `
Company: ${formData.company || 'N/A'}
City: ${formData.city}
Enquiry Type: ${formData.enquiryType}
How Heard: ${formData.howHeard || 'N/A'}

Message:
${formData.message}
        `.trim(),
        reply_to: formData.email,
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      });

      setIsSuccess(true);
      toast.success('Thank you! We will contact you within 24 hours.');

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          city: '',
          enquiryType: '',
          message: '',
          howHeard: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error sending enquiry:', error);
      toast.error('Failed to send enquiry. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/contact-hero.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-4"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl lg:text-5xl text-white mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 max-w-2xl"
          >
            We would love to hear from you. Reach out for enquiries, consultations, 
            or just to say hello.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="eyebrow mb-4">Send a Message</p>
              <h2 className="font-display text-3xl text-[#0D0D0D] mb-8">
                Enquiry Form
              </h2>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#2E7D32]/10 border border-[#2E7D32] p-8 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#2E7D32] rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-[#2E7D32] mb-2">
                    Thank You!
                  </h3>
                  <p className="text-[#4A4A4A]">
                    We have received your enquiry and will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                        City / Location *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                        Nature of Enquiry *
                      </label>
                      <select
                        name="enquiryType"
                        required
                        value={formData.enquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
                      >
                        <option value="">Select Type</option>
                        {enquiryTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      name="howHeard"
                      value={formData.howHeard}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors appearance-none"
                    >
                      <option value="">Select Option</option>
                      {howHeardOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="eyebrow mb-4">Contact Information</p>
              <h2 className="font-display text-3xl text-[#0D0D0D] mb-8">
                Get in Touch
              </h2>

              {loadingSettings ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
                </div>
              ) : (
                <>
                  <div className="space-y-6 mb-8">
                    {/* Address */}
                    {settings?.address && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] flex-shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-1">
                            Address
                          </h3>
                          <p className="text-[#0D0D0D] whitespace-pre-line">
                            {settings.address}
                          </p>
                          <a 
                            href="https://maps.app.goo.gl/Dhhraccmjc2TH1yX8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C9A84C] text-sm hover:underline mt-1 inline-block"
                          >
                            Get Directions
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Phone Numbers */}
                    {settings?.phone_numbers && settings.phone_numbers.length > 0 && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] flex-shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-1">
                            Phone
                          </h3>
                          {settings.phone_numbers.map((phone: string, index: number) => (
                            <a 
                              key={index}
                              href={`tel:${phone.replace(/\s/g, '')}`} 
                              className="text-[#0D0D0D] hover:text-[#C9A84C] transition-colors block"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {settings?.contact_email && (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] flex-shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-1">
                            Email
                          </h3>
                          <a 
                            href={`mailto:${settings.contact_email}`} 
                            className="text-[#0D0D0D] hover:text-[#C9A84C] transition-colors block"
                          >
                            {settings.contact_email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Business Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-[#C9A84C]/10 text-[#C9A84C] flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-1">
                          Business Hours
                        </h3>
                        <p className="text-[#0D0D0D]">
                          Monday - Saturday<br />
                          10:00 AM - 7:00 PM IST
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  {settings?.whatsapp_number && (
                    <a
                      href={`https://wa.me/${settings.whatsapp_number.replace(/\s/g, '')}?text=Hi ${settings.site_name}! I am interested in your lighting products.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-6 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors mb-8"
                    >
                      <MessageCircle className="w-8 h-8" />
                      <div>
                        <p className="font-heading text-sm uppercase tracking-[1px]">Chat With Us</p>
                        <p className="text-white/80 text-sm">On WhatsApp</p>
                      </div>
                    </a>
                  )}

                  {/* Google Maps */}
                  {settings?.address && (
                    <div className="aspect-video bg-[#E5E0D5] overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6346.550390374932!2d72.8263348836756!3d18.945489506912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce219c3f0891%3A0xf98458eee260d830!2sTej%20Lite!5e0!3m2!1sen!2sin!4v1772444587956!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(100%)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${settings.site_name} Location`}
                      />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
