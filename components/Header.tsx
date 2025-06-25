
import React from 'react';
import { BRAND_CONFIG } from '../constants';
import { BellIcon } from '../constants'; // Assuming BellIcon is for notifications

const Header: React.FC = () => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 shadow-md h-16"
      style={{ backgroundColor: BRAND_CONFIG.colors.secondary }}
    >
      <div className="flex items-center">
        <img 
          src={BRAND_CONFIG.logo.title} 
          alt={`${BRAND_CONFIG.shortName} Logo`} 
          className="h-10 mr-3" // Adjusted height
        />
        {/* <span className="text-xl font-semibold" style={{ color: BRAND_CONFIG.colors.primary }}>
          {BRAND_CONFIG.shortName}
        </span> */}
      </div>
      <div className="flex items-center space-x-4">
        <button 
          className="relative p-2 rounded-full hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#004040] focus:ring-[#FFDF00]"
          style={{ color: BRAND_CONFIG.colors.primary, backgroundColor: 'rgba(255, 223, 0, 0.1)'  }}
          aria-label="Notifications"
        >
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#004040]"></span>
        </button>
        <img
            src={BRAND_CONFIG.chatbot.avatar}
            alt="User Avatar"
            className="h-8 w-8 rounded-full border-2"
            style={{ borderColor: BRAND_CONFIG.colors.primary }}
        />
      </div>
    </header>
  );
};

export default Header;
