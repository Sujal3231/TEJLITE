import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { fetchSiteSettings, type SiteSettings } from '@/services/products';

const WhatsAppButton = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading WhatsApp settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if loading or no WhatsApp number configured
  if (loading || !settings?.whatsapp_number) {
    return null;
  }

  const phoneNumber = settings.whatsapp_number.replace(/\s/g, '');
  const siteName = settings.site_name || 'Tej Lite';
  const message = encodeURIComponent(`Hi ${siteName}! I am interested in your lighting products. Please share more details.`);
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-white text-[#0D0D0D] text-sm font-medium rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
