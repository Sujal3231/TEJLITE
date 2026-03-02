import { Outlet } from 'react-router-dom';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/navigation/Footer';
import WhatsAppButton from '@/components/ui-custom/WhatsAppButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
