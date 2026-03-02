import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, Calendar, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchEnquiries,
  updateEnquiryStatus,
  type Enquiry
} from '@/services/products';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await fetchEnquiries();
      setEnquiries(data);
      if (data.length === 0) {
        console.log('No enquiries found in database');
      }
    } catch (error) {
      console.error('Error loading enquiries:', error);
      toast.error('Failed to load enquiries');
      setEnquiries([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    try {
      await updateEnquiryStatus(id, status);
      toast.success('Status updated successfully');
      loadEnquiries();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         enquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-500/20 text-red-500';
      case 'read': return 'bg-blue-500/20 text-blue-500';
      case 'replied': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
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
        <h1 className="font-display text-3xl text-white">Enquiries</h1>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded">
            {enquiries.filter(e => e.status === 'new').length} New
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded">
            {enquiries.filter(e => e.status === 'read').length} Read
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded">
            {enquiries.filter(e => e.status === 'responded').length} Replied
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1C1C1C] border border-white/10 p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A84C]"
          >
            <option value="" className="bg-[#1C1C1C]">All Status</option>
            <option value="new" className="bg-[#1C1C1C]">New</option>
            <option value="read" className="bg-[#1C1C1C]">Read</option>
            <option value="responded" className="bg-[#1C1C1C]">Replied</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.map((enquiry) => (
          <motion.div
            key={enquiry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1C1C] border border-white/10 p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-xl text-white">{enquiry.name}</h3>
                  <span className={`px-2 py-1 text-xs font-heading uppercase tracking-[1px] rounded ${getStatusColor(enquiry.status || 'new')}`}>
                    {enquiry.status || 'new'}
                  </span>
                </div>
                
                <div className="space-y-1 text-white/50 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${enquiry.email}`} className="hover:text-[#C9A84C] transition-colors">
                      {enquiry.email}
                    </a>
                  </div>
                  {enquiry.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${enquiry.phone}`} className="hover:text-[#C9A84C] transition-colors">
                        {enquiry.phone}
                      </a>
                    </div>
                  )}
                  {enquiry.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(enquiry.id, 'read')}
                  className="px-3 py-2 bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-colors text-xs font-heading uppercase tracking-[1px]"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleStatusChange(enquiry.id, 'responded')}
                  className="px-3 py-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors text-xs font-heading uppercase tracking-[1px]"
                >
                  Mark Replied
                </button>
              </div>
            </div>

            {enquiry.message && (
              <div className="p-4 bg-white/5 border border-white/10">
                <p className="text-white/70 text-sm whitespace-pre-wrap">{enquiry.message}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredEnquiries.length === 0 && (
        <div className="bg-[#1C1C1C] border border-white/10 p-12 text-center">
          <Mail className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No enquiries found</p>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
