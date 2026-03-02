import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAdminAuthStateChanged, type AdminUser } from '@/services/auth';

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAdminAuthStateChanged((adminUser) => {
      setAdmin(adminUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
