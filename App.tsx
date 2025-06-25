import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage'; // Import HomePage
import Dashboard from './components/Dashboard';
import Reporting from './components/Reporting';
import PolicyManagement from './components/PolicyManagement';
// Removed: import { DataProvider } from './contexts/DataContext'; 
import { BRAND_CONFIG } from './constants';

const App: React.FC = () => {
  // Update document title with brand name
  React.useEffect(() => {
    document.title = `${BRAND_CONFIG.shortName} Compliance Monitor`;
  }, []);

  return (
    // <DataProvider> Removed DataProvider wrapper
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/home" replace />} /> {/* Default to home */}
            <Route path="home" element={<HomePage />} /> {/* Add HomePage route */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reporting" element={<Reporting />} />
            <Route path="policy-management" element={<PolicyManagement />} />
            <Route path="*" element={<Navigate to="/home" replace />} /> {/* Fallback route to home */}
          </Route>
        </Routes>
      </HashRouter>
    // </DataProvider> Removed DataProvider wrapper
  );
};

export default App;