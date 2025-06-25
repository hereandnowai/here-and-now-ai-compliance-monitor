
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViolationAlert } from '../types';
import { BRAND_CONFIG, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, BellIcon } from '../constants';

const mockAlerts: ViolationAlert[] = [
  { id: 'alert1', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'Critical', description: 'Unauthorized access attempt detected on production database.', source: 'System Log XYZ123', ruleTriggered: 'Access Control Policy Violation', status: 'New', department: 'IT Operations' },
  { id: 'alert2', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'High', description: 'Large financial transaction ($75,000) to a high-risk country flagged.', source: 'TXN_ID_98765', ruleTriggered: 'AML Policy - High-Risk Transaction', status: 'Investigating', department: 'Finance' },
  { id: 'alert3', timestamp: new Date(Date.now() - 10800000).toISOString(), severity: 'Medium', description: 'PII data shared in an internal communication channel without encryption.', source: 'Chat Log #CH456', ruleTriggered: 'Data Privacy Policy - PII Handling', status: 'New', department: 'Marketing' },
  { id: 'alert4', timestamp: new Date(Date.now() - 86400000).toISOString(), severity: 'Low', description: 'User login from an unrecognized IP address (outside office hours).', source: 'Auth Log - User JohnDoe', ruleTriggered: 'User Behavior Analytics', status: 'Resolved', department: 'Sales' },
  { id: 'alert5', timestamp: new Date(Date.now() - 172800000).toISOString(), severity: 'Medium', description: 'Policy document "Q3 Financial Projections" accessed by an unauthorized department.', source: 'File Access Log - DocID 789', ruleTriggered: 'Document Access Policy', status: 'Investigating', department: 'HR' },
  { id: 'alert6', timestamp: new Date(Date.now() - 259200000).toISOString(), severity: 'Critical', description: 'Multiple failed login attempts for admin account.', source: 'Auth Log - Admin', ruleTriggered: 'Brute Force Detection', status: 'New', department: 'IT Operations' },
];

type SeverityFilter = ViolationAlert['severity'] | 'All';

const ViolationAlerts: React.FC = () => {
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<SeverityFilter>('All');

  const getSeverityStyles = (severity: ViolationAlert['severity']): { border: string, bg: string, text: string, icon?: React.ReactNode } => {
    const iconClass = "w-4 h-4 mr-1.5";
    switch (severity) {
      case 'Critical': return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', icon: <ExclamationTriangleIcon className={iconClass} /> };
      case 'High': return { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', icon: <ExclamationTriangleIcon className={iconClass} /> };
      case 'Medium': return { border: `border-[${BRAND_CONFIG.colors.primary}]`, bg: 'bg-yellow-50', text: `text-[${BRAND_CONFIG.colors.secondary}]`, icon: <InformationCircleIcon className={iconClass} /> };
      case 'Low': return { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircleIcon className={iconClass} /> };
      default: return { border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };

  const sortedAlerts = [...mockAlerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const filteredAlerts = selectedSeverityFilter === 'All' 
    ? sortedAlerts 
    : sortedAlerts.filter(alert => alert.severity === selectedSeverityFilter);

  const filterButtons: { label: string, filter: SeverityFilter, color: string, textColor: string }[] = [
    { label: 'All', filter: 'All', color: BRAND_CONFIG.colors.secondary, textColor: BRAND_CONFIG.colors.primary },
    { label: 'Critical', filter: 'Critical', color: 'rgb(239 68 68)', textColor: 'white' }, // red-500
    { label: 'High', filter: 'High', color: 'rgb(249 115 22)', textColor: 'white' }, // orange-500
    { label: 'Medium', filter: 'Medium', color: BRAND_CONFIG.colors.primary, textColor: BRAND_CONFIG.colors.secondary },
    { label: 'Low', filter: 'Low', color: 'rgb(34 197 94)', textColor: 'white' }, // green-500
  ];
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>Real-Time Violation Alerts</h3>
        <BellIcon className={`w-5 h-5 text-[${BRAND_CONFIG.colors.accent}]`} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filterButtons.map(btn => (
          <motion.button
            key={btn.filter}
            onClick={() => setSelectedSeverityFilter(btn.filter)}
            className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm focus:outline-none transition-all duration-150
              ${selectedSeverityFilter === btn.filter ? 'ring-2 ring-offset-1' : ''}
            `}
            style={{ 
              backgroundColor: btn.color, 
              color: btn.textColor,
              borderColor: selectedSeverityFilter === btn.filter ? btn.color : 'transparent',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1"> {/* Adjusted max-h and added pr for scrollbar space */}
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 && (
            <motion.p 
              key="no-alerts"
              className="text-gray-500 text-center py-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              No alerts match the current filter.
            </motion.p>
          )}
          {filteredAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <motion.div
                layout
                key={alert.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-md border-l-4 ${styles.border} ${styles.bg} shadow-sm hover:shadow-md transition-shadow`}
                whileHover={{ backgroundColor: styles.bg.replace('-50', '-100') }} // Darken bg slightly on hover
              >
                <div className="flex justify-between items-start">
                  <div className={`flex items-center font-semibold text-sm ${styles.text}`}>
                    {styles.icon}
                    {alert.severity}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-800 mt-1">{alert.description}</p>
                <div className="text-xs text-gray-600 mt-1.5">
                  <span>Source: {alert.source}{alert.department ? ` | Dept: ${alert.department}` : ''} | Rule: {alert.ruleTriggered} | Status: </span>
                  <span className={`font-medium ${alert.status === 'New' ? 'text-blue-600' : alert.status === 'Investigating' ? `text-[${BRAND_CONFIG.colors.accent}]` : 'text-gray-600'}`}>
                    {alert.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViolationAlerts;