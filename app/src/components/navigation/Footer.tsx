import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchSiteSettings } from '@/services/products';
import type { SiteSettings } from '@/types';

// Sample categories - in production, fetch from Firebase
const categories = [
  { name: 'Chandeliers', slug: 'chandeliers' },
  { name: 'Pendant Lights', slug: 'pendants' },
  { name: 'Wall Lights', slug: 'wall-lights' },
  { name: 'Ceiling Lights', slug: 'ceiling' },
  { name: 'Floor & Table', slug: 'floor-table' },
  { name: 'Outdoor Lighting', slug: 'outdoor' },
];

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Catalogs', href: '/catalogs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[#0D0D0D] text-white">
      {/* Top Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl text-white mb-1">
                Stay Inspired
              </h3>
              <p className="text-white/60 text-sm">
                Get lighting ideas delivered to your inbox
              </p>
            </div>
            <form 
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A84C] transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#C9A84C] text-white hover:bg-[#A07830] transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold text-white">
                {settings?.site_name || 'TEJ LITE'}
              </span>
            </Link>
            <p className="text-[#C9A84C] text-sm uppercase tracking-[2px]">
              Since 1977 · Bespoke Lighting
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Crafting extraordinary lighting solutions for luxury homes, hotels, 
              and commercial spaces. Four decades of illuminating excellence.
            </p>
            
            {/* Social Icons */}
            {!loadingSettings && (
              <div className="flex items-center gap-4">
                {settings?.social_media?.instagram && (
                  <a
                    href={settings.social_media.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/60 hover:bg-[#C9A84C] hover:text-white transition-all duration-300 hover:rotate-[5deg] hover:scale-110"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings?.social_media?.facebook && (
                  <a
                    href={settings.social_media.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/60 hover:bg-[#C9A84C] hover:text-white transition-all duration-300 hover:rotate-[5deg] hover:scale-110"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings?.social_media?.linkedin && (
                  <a
                    href={settings.social_media.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/60 hover:bg-[#C9A84C] hover:text-white transition-all duration-300 hover:rotate-[5deg] hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {settings?.social_media?.youtube && (
                  <a
                    href={settings.social_media.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/60 hover:bg-[#C9A84C] hover:text-white transition-all duration-300 hover:rotate-[5deg] hover:scale-110"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Product Categories */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C] mb-6">
              Product Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-[2px] text-[#C9A84C] mb-6">
              Contact Us
            </h4>
            {loadingSettings ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {settings?.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white/60 text-sm whitespace-pre-line">
                          {settings.address}
                        </p>
                        <a 
                          href="https://maps.app.goo.gl/Dhhraccmjc2TH1yX8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C9A84C] text-xs hover:underline mt-1 inline-block"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  )}
                  {settings?.phone_numbers && settings.phone_numbers.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#C9A84C] mt-0.5 flex-shrink-0" />
                      <div>
                        {settings.phone_numbers.map((phone: string, index: number) => (
                          <a 
                            key={index}
                            href={`tel:${phone.replace(/\s/g, '')}`} 
                            className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm block"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {settings?.contact_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#C9A84C] flex-shrink-0" />
                      <a 
                        href={`mailto:${settings.contact_email}`} 
                        className="text-white/60 hover:text-[#C9A84C] transition-colors text-sm"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Google Maps Embed */}
                {settings?.address && (
                  <a 
                    href="https://maps.app.goo.gl/Dhhraccmjc2TH1yX8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-6 rounded overflow-hidden h-32 bg-white/5 hover:opacity-80 transition-opacity"
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6346.550390374932!2d72.8263348836756!3d18.945489506912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce219c3f0891%3A0xf98458eee260d830!2sTej%20Lite!5e0!3m2!1sen!2sin!4v1772444587956!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'grayscale(100%) invert(92%)', pointerEvents: 'none' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Tej Lite Location"
                    />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {settings?.site_name || 'Tej Lite'}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-white/40 hover:text-[#C9A84C] transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-white/40 hover:text-[#C9A84C] transition-colors text-sm"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
