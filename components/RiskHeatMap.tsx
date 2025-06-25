
import React from 'react';
import { motion } from 'framer-motion';
import { DepartmentRisk } from '../types';
import { BRAND_CONFIG } from '../constants';

const mockDepartments: DepartmentRisk[] = [
  { id: 'dept1', name: 'Finance', riskScore: 75 },
  { id: 'dept2', name: 'Sales', riskScore: 45 },
  { id: 'dept3', name: 'HR', riskScore: 20 },
  { id: 'dept4', name: 'IT Operations', riskScore: 85 },
  { id: 'dept5', name: 'Marketing', riskScore: 60 },
  { id: 'dept6', name: 'Legal', riskScore: 30 },
  { id: 'dept7', name: 'Customer Support', riskScore: 50 },
  { id: 'dept8', name: 'R&D', riskScore: 65 },
];

const RiskHeatMap: React.FC = () => {
  const departmentRisks = mockDepartments; 

  const getRiskColorClasses = (score: number): { bg: string; text: string } => {
    if (score > 80) return { bg: 'bg-red-600', text: 'text-white' }; 
    if (score > 60) return { bg: 'bg-orange-500', text: 'text-white' }; 
    if (score > 40) return { bg: `bg-[${BRAND_CONFIG.colors.primary}]`, text: `text-[${BRAND_CONFIG.colors.secondary}]` }; // Dark text on yellow
    if (score > 20) return { bg: `bg-[${BRAND_CONFIG.colors.accent}]`, text: 'text-white' };
    return { bg: `bg-green-500`, text: 'text-white' };
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_CONFIG.colors.secondary }}>Department Risk Heat Map</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {departmentRisks.map((dept) => {
          const colorClasses = getRiskColorClasses(dept.riskScore);
          return (
            <motion.div
              key={dept.id}
              title={`Risk Score: ${dept.riskScore}%`}
              className={`p-4 rounded-md text-center cursor-default ${colorClasses.bg} ${colorClasses.text}`}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium truncate">{dept.name}</p>
              <p className="text-xs">{dept.riskScore}%</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs items-center justify-center" style={{color: BRAND_CONFIG.colors.secondary}}>
        <span className="flex items-center"><span className="w-3 h-3 bg-red-600 mr-1 rounded-sm"></span> High (&gt;80)</span>
        <span className="flex items-center"><span className="w-3 h-3 bg-orange-500 mr-1 rounded-sm"></span> Med-High (61-80)</span>
        <span className="flex items-center"><span className={`w-3 h-3 bg-[${BRAND_CONFIG.colors.primary}] mr-1 rounded-sm`}></span> Medium (41-60)</span>
        <span className="flex items-center"><span className={`w-3 h-3 bg-[${BRAND_CONFIG.colors.accent}] mr-1 rounded-sm`}></span> Low-Med (21-40)</span>
        <span className="flex items-center"><span className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></span> Low (&le;20)</span>
      </div>
    </div>
  );
};

export default RiskHeatMap;
