import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { signInAdmin } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { admin, loading } = useAuth();

  useEffect(() => {
    if (!loading && admin) {
      navigate('/admin');
    }
  }, [admin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signInAdmin(email, password);
      toast.success('Welcome back, Admin!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading || admin) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-[#C9A84C] mb-2">
            TEJ LITE
          </h1>
          <p className="text-white/60 font-heading text-sm uppercase tracking-[2px]">
            Admin Panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1C1C1C] border border-white/10 p-8">
          <h2 className="font-display text-2xl text-white mb-6 text-center">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tejlite.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-heading text-sm uppercase tracking-[1px] text-white/60 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#C9A84C]" />
                <span className="text-white/60 text-sm">Remember me</span>
              </label>
              <button type="button" className="text-[#C9A84C] text-sm hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#C9A84C] text-white font-heading text-sm uppercase tracking-[2px] hover:bg-[#A07830] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Setup Instructions */}
          <div className="mt-6 p-4 bg-white/5 border border-white/10">
            <p className="text-white/40 text-xs text-center">
              First time? Visit <a href="/setup" className="text-[#C9A84C] hover:underline">/setup</a> to create your admin account
            </p>
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <a href="/" className="text-white/40 hover:text-[#C9A84C] text-sm transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
