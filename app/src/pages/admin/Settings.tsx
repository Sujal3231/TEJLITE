import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, User, Globe, Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Linkedin, Youtube, Image as ImageIcon, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { signOutAdmin } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/types';

const AdminSettings = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social'>('general');
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'Tej Lite',
    site_logo: '',
    footer_logo: '',
    contact_email: 'info@tejlite.com',
    phone_numbers: ['+91 1234567890'],
    address: 'Your Address Here',
    whatsapp_number: '',
    social_media: {
      instagram: '',
      facebook: '',
      pinterest: '',
      linkedin: '',
      youtube: ''
    }
  });
  
  const [siteDescription, setSiteDescription] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data() as any;
        setSiteSettings({
          site_name: data.site_name || 'Tej Lite',
          site_logo: data.site_logo || '',
          footer_logo: data.footer_logo || '',
          contact_email: data.contact_email || '',
          phone_numbers: data.phone_numbers || [''],
          address: data.address || '',
          whatsapp_number: data.whatsapp_number || '',
          social_media: {
            instagram: data.social_media?.instagram || '',
            facebook: data.social_media?.facebook || '',
            pinterest: data.social_media?.pinterest || '',
            linkedin: data.social_media?.linkedin || '',
            youtube: data.social_media?.youtube || ''
          }
        });
        setSiteDescription(data.site_description || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Clean up empty phone numbers
      const cleanedPhoneNumbers = siteSettings.phone_numbers.filter(p => p.trim() !== '');
      
      const settingsToSave = {
        ...siteSettings,
        phone_numbers: cleanedPhoneNumbers.length > 0 ? cleanedPhoneNumbers : [''],
        site_description: siteDescription
      };

      await setDoc(doc(db, 'settings', 'site'), settingsToSave);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addPhoneNumber = () => {
    setSiteSettings(prev => ({
      ...prev,
      phone_numbers: [...prev.phone_numbers, '']
    }));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setSiteSettings(prev => ({
      ...prev,
      phone_numbers: prev.phone_numbers.map((p, i) => i === index ? value : p)
    }));
  };

  const removePhoneNumber = (index: number) => {
    if (siteSettings.phone_numbers.length <= 1) {
      toast.error('At least one phone number is required');
      return;
    }
    setSiteSettings(prev => ({
      ...prev,
      phone_numbers: prev.phone_numbers.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
      await signOutAdmin();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Failed to logout');
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
        <h1 className="font-display text-3xl text-white">Settings</h1>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Admin Profile */}
          <div className="bg-[#1C1C1C] border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#C9A84C]/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="text-white font-medium">{admin?.displayName || 'Admin'}</h3>
                <p className="text-white/50 text-sm">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-heading text-xs uppercase tracking-[1px]"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-[#1C1C1C] border border-white/10">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-white/10 ${
                activeTab === 'general' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-heading text-sm uppercase tracking-[1px]">General</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-white/10 ${
                activeTab === 'contact' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span className="font-heading text-sm uppercase tracking-[1px]">Contact</span>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                activeTab === 'social' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Instagram className="w-5 h-5" />
              <span className="font-heading text-sm uppercase tracking-[1px]">Social Media</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1C1C1C] border border-white/10"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="font-display text-xl text-white flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    General Settings
                  </h2>
                  <p className="text-white/50 text-sm mt-1">Manage your site name and branding</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Site Name */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Site Name *
                    </label>
                    <input
                      type="text"
                      value={siteSettings.site_name}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, site_name: e.target.value }))}
                      placeholder="e.g., Tej Lite"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>

                  {/* Site Description */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={siteDescription}
                      onChange={(e) => setSiteDescription(e.target.value)}
                      placeholder="Brief description of your business..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                    />
                    <p className="text-white/40 text-xs mt-1">This will be used for SEO meta description and about sections</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1C1C1C] border border-white/10"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="font-display text-xl text-white flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h2>
                  <p className="text-white/50 text-sm mt-1">Manage your contact details</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Contact Email */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contact_email}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                      placeholder="info@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                      required
                    />
                  </div>

                  {/* Phone Numbers */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Numbers *
                    </label>
                    <div className="space-y-3">
                      {siteSettings.phone_numbers.map((phone, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => updatePhoneNumber(index, e.target.value)}
                            placeholder="+91 1234567890"
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                          />
                          {siteSettings.phone_numbers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePhoneNumber(index)}
                              className="px-3 py-3 bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addPhoneNumber}
                        className="px-4 py-2 bg-white/5 text-[#C9A84C] hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Phone Number
                      </button>
                    </div>
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={siteSettings.whatsapp_number}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      placeholder="+91 1234567890"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                    <p className="text-white/40 text-xs mt-1">Include country code (e.g., +91 for India)</p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address *
                    </label>
                    <textarea
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Your business address..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1C1C1C] border border-white/10"
              >
                <div className="p-6 border-b border-white/10">
                  <h2 className="font-display text-xl text-white flex items-center gap-2">
                    <Instagram className="w-5 h-5" />
                    Social Media Links
                  </h2>
                  <p className="text-white/50 text-sm mt-1">Add your social media profile URLs</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Instagram */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={siteSettings.social_media.instagram || ''}
                      onChange={(e) => setSiteSettings(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, instagram: e.target.value }
                      }))}
                      placeholder="https://instagram.com/yourprofile"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={siteSettings.social_media.facebook || ''}
                      onChange={(e) => setSiteSettings(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, facebook: e.target.value }
                      }))}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={siteSettings.social_media.linkedin || ''}
                      onChange={(e) => setSiteSettings(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, linkedin: e.target.value }
                      }))}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={siteSettings.social_media.youtube || ''}
                      onChange={(e) => setSiteSettings(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, youtube: e.target.value }
                      }))}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>

                  {/* Pinterest */}
                  <div>
                    <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Pinterest
                    </label>
                    <input
                      type="url"
                      value={siteSettings.social_media.pinterest || ''}
                      onChange={(e) => setSiteSettings(prev => ({
                        ...prev,
                        social_media: { ...prev.social_media, pinterest: e.target.value }
                      }))}
                      placeholder="https://pinterest.com/yourprofile"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#C9A84C] text-white hover:bg-[#A07830] transition-colors font-heading text-sm uppercase tracking-[1px] flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
