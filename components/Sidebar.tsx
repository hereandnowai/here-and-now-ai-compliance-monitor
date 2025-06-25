import React from 'react';
import { NavLink } from 'react-router-dom';
import { BRAND_CONFIG, HomeIcon, ChartBarIcon, DocumentTextIcon, CogIcon } from '../constants';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const activeStyle = {
    backgroundColor: BRAND_CONFIG.colors.primary,
    color: BRAND_CONFIG.colors.secondary,
    fontWeight: '600',
  };
  const inactiveStyle = {
    color: BRAND_CONFIG.colors.textLight,
  };

  return (
    <NavLink
      to={to}
      className="flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-150 ease-in-out hover:opacity-80"
      style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const iconClass = "w-5 h-5";

  return (
    <aside 
      className="w-64 p-4 space-y-4 fixed left-0 top-16 bottom-0 overflow-y-auto shadow-lg" // Added shadow
      style={{ backgroundColor: BRAND_CONFIG.colors.secondary }}
    >
      <nav className="space-y-2">
        <NavItem to="/home" icon={<HomeIcon className={iconClass} />} label="Home" />
        <NavItem to="/dashboard" icon={<ChartBarIcon className={iconClass} />} label="Dashboard" />
        <NavItem to="/reporting" icon={<ChartBarIcon className={iconClass} />} label="Reporting" />
        <NavItem to="/policy-management" icon={<DocumentTextIcon className={iconClass} />} label="Policy Management" />
        {/* Placeholder for settings or other items */}
        {/* <NavItem to="/settings" icon={<CogIcon className={iconClass} />} label="Settings" /> */}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 text-center">
         <img 
            src={BRAND_CONFIG.chatbot.face} 
            alt="Chatbot Face" 
            className="w-20 h-20 mx-auto rounded-full mb-2 border-2"
            style={{borderColor: BRAND_CONFIG.colors.primary}}
          />
        <p className="text-xs" style={{color: BRAND_CONFIG.colors.primary}}>
          Powered by {BRAND_CONFIG.shortName}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;