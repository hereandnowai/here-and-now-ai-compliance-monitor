
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { BRAND_CONFIG } from '../constants';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: BRAND_CONFIG.colors.backgroundLight }}>
      <Header />
      <div className="flex flex-1 pt-16"> {/* pt-16 to offset fixed header height */}
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" style={{ backgroundColor: BRAND_CONFIG.colors.backgroundLight }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
