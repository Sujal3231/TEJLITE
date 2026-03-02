import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { completeSetup } from '@/services/seed';

const Setup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: 'Admin',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await completeSetup(formData.email, formData.password);
      setIsSuccess(true);
      toast.success('Setup completed successfully!');
      
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Setup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-[#2E7D32] rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-3xl text-[#0D0D0D] mb-4">
            Setup Complete!
          </h2>
          <p className="text-[#4A4A4A] mb-6">
            Your admin account has been created successfully. 
            Redirecting to login...
          </p>
          <div className="w-12 h-12 mx-auto border-4 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-[#0D0D0D] mb-2">
            Tej Lite
          </h1>
          <p className="text-[#4A4A4A]">Initial Setup</p>
        </div>

        {/* Info Box */}
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#4A4A4A]">
            <p className="font-semibold mb-1">First Time Setup</p>
            <p>Create your admin account to access the admin panel and manage your website.</p>
          </div>
        </div>

        {/* Setup Form */}
        <div className="bg-white p-8">
          <h2 className="font-display text-2xl text-[#0D0D0D] mb-6">
            Create Admin Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" />
                <input
                  type="text"
                  name="displayName"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="Admin"
                />
              </div>
            </div>

            <div>
              <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="admin@tejlite.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block font-heading text-sm uppercase tracking-[1px] text-[#4A4A4A] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#E5E0D5] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up...
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[#4A4A4A] text-sm">
            Already have an account?{' '}
            <a href="/admin/login" className="text-[#C9A84C] hover:underline">
              Login here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Setup;
