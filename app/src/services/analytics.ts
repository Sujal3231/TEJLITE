import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { ContactSubmission } from './products';

export interface AnalyticsData {
  totalProducts: number;
  totalCategories: number;
  totalProjects: number;
  totalCatalogs: number;
  totalContacts: number;
  newContactsThisMonth: number;
  contactsByStatus: {
    new: number;
    read: number;
    replied: number;
  };
  recentContacts: ContactSubmission[];
  popularCategories: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
  }>;
  monthlyContactTrend: Array<{
    month: string;
    count: number;
  }>;
}

// Get comprehensive analytics data
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    const [
      productsSnapshot,
      categoriesSnapshot,
      projectsSnapshot,
      catalogsSnapshot,
      contactsSnapshot
    ] = await Promise.all([
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'categories')),
      getDocs(collection(db, 'projects')),
      getDocs(collection(db, 'catalogs')),
      getDocs(collection(db, 'contacts'))
    ]);

    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactSubmission[];

    // Calculate this month's contacts
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newContactsThisMonth = contacts.filter(contact => {
      if (!contact.created_at) return false;
      const contactDate = new Date(contact.created_at);
      return contactDate >= startOfMonth;
    }).length;

    // Contacts by status
    const contactsByStatus = {
      new: contacts.filter(c => c.status === 'new' || !c.status).length,
      read: contacts.filter(c => c.status === 'read').length,
      replied: contacts.filter(c => c.status === 'responded').length,
    };

    // Recent contacts (last 5)
    const recentContacts = contacts
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
        const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);

    // Popular categories (by product count)
    const categoryProductCount = new Map();
    products.forEach((product: any) => {
      const count = categoryProductCount.get(product.categoryId) || 0;
      categoryProductCount.set(product.categoryId, count + 1);
    });

    const popularCategories = Array.from(categoryProductCount.entries())
      .map(([categoryId, productCount]) => {
        const category = categories.find((c: any) => c.id === categoryId);
        return {
          categoryId,
          categoryName: (category as any)?.name || 'Unknown',
          productCount: productCount as number
        };
      })
      .sort((a, b) => b.productCount - a.productCount);

    // Monthly contact trend (last 6 months)
    const monthlyContactTrend = getMonthlyContactTrend(contacts);

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalProjects: projectsSnapshot.size,
      totalCatalogs: catalogsSnapshot.size,
      totalContacts: contacts.length,
      newContactsThisMonth,
      contactsByStatus,
      recentContacts,
      popularCategories,
      monthlyContactTrend
    };
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
    throw new Error('Failed to load analytics data');
  }
};

// Calculate monthly contact trend
const getMonthlyContactTrend = (contacts: ContactSubmission[]) => {
  const now = new Date();
  const months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const count = contacts.filter(contact => {
      if (!contact.created_at) return false;
      const contactDate = new Date(contact.created_at);
      return contactDate >= monthStart && contactDate <= monthEnd;
    }).length;
    
    months.push({ month: monthName, count });
  }
  
  return months;
};

// Get contact statistics
export const getContactStats = async () => {
  try {
    const contactsSnapshot = await getDocs(collection(db, 'contacts'));
    const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactSubmission[];
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      total: contacts.length,
      thisWeek: contacts.filter(contact => {
        if (!contact.created_at) return false;
        const contactDate = new Date(contact.created_at);
        return contactDate >= startOfWeek;
      }).length,
      thisMonth: contacts.filter(contact => {
        if (!contact.created_at) return false;
        const contactDate = new Date(contact.created_at);
        return contactDate >= startOfMonth;
      }).length,
      byStatus: {
        new: contacts.filter(c => c.status === 'new' || !c.status).length,
        read: contacts.filter(c => c.status === 'read').length,
        replied: contacts.filter(c => c.status === 'responded').length,
      }
    };
  } catch (error) {
    console.error('Failed to fetch contact stats:', error);
    throw error;
  }
};
