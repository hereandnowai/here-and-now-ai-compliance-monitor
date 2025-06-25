
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ComplianceScoreCard from './ComplianceScoreCard';
import RiskHeatMap from './RiskHeatMap';
import ViolationAlerts from './ViolationAlerts';
import TrendChart from './TrendChart';
import RegulatoryUpdates from './RegulatoryUpdates';
import { BRAND_CONFIG, BellIcon, ClipboardDocumentCheckIcon, PresentationChartLineIcon, TrendingUpIcon, ListBulletIcon } from '../constants';

// AnimatedNumber component
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  isPercentage?: boolean;
}
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 0.5, isPercentage = false }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCurrentValue(progress * value);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span>
      {isPercentage ? currentValue.toFixed(1) : Math.round(currentValue)}
      {isPercentage ? '%' : ''}
    </motion.span>
  );
};

// Section Title component
interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
}
const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title }) => (
  <div className="flex items-center mb-4">
    <span className="mr-3" style={{ color: BRAND_CONFIG.colors.accent }}>{icon}</span>
    <h2 className="text-xl font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>
      {title}
    </h2>
  </div>
);


const Dashboard: React.FC = () => {
  const mockOverallComplianceScore: number = 96.5;
  const mockActiveAlertsCount: number = 7;
  const mockCriticalAlertsCount: number = 2;
  const mockMediumAlertsCount: number = 3;
  const mockPolicyCoverage: number = 85;
  const mockActivePolicies: number = 12;
  
  const iconClass = "w-6 h-6";

  return (
    <div className="space-y-8 ml-64"> {/* ml-64 to offset fixed sidebar width */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: BRAND_CONFIG.colors.secondary }}>
          Compliance Dashboard
        </h1>
         <span className="text-sm font-medium px-3 py-1 rounded-full" style={{backgroundColor: BRAND_CONFIG.colors.accent, color: BRAND_CONFIG.colors.textLight}}>
            Live Overview
        </span>
      </div>
      
      {/* Section 1: Key Metrics & Score */}
      <section>
        <SectionTitle icon={<PresentationChartLineIcon className={iconClass} />} title="Key Metrics & Score" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
            <ComplianceScoreCard score={mockOverallComplianceScore} target={95} />
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}
            className="p-6 rounded-lg shadow-lg flex flex-col justify-between"
            style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
          >
            <div className="flex items-center mb-2">
              <BellIcon className={`w-5 h-5 mr-2 text-[${BRAND_CONFIG.colors.secondary}]`} />
              <h3 className="text-lg font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>Active Alerts</h3>
            </div>
            <p className="text-4xl font-bold" style={{ color: BRAND_CONFIG.colors.primary }}>
              <AnimatedNumber value={mockActiveAlertsCount} />
            </p>
            <p className="text-sm mt-1" style={{ color: BRAND_CONFIG.colors.accent }}>
              {mockCriticalAlertsCount > 0 ? `${mockCriticalAlertsCount} Critical` : ''}
              {mockCriticalAlertsCount > 0 && mockMediumAlertsCount > 0 ? ', ' : ''}
              {mockMediumAlertsCount > 0 ? `${mockMediumAlertsCount} Medium` : ''}
              {mockActiveAlertsCount === 0 ? 'No active alerts' : ''}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}
            className="p-6 rounded-lg shadow-lg flex flex-col justify-between"
            style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
          >
            <div className="flex items-center mb-2">
               <ClipboardDocumentCheckIcon className={`w-5 h-5 mr-2 text-[${BRAND_CONFIG.colors.secondary}]`} />
              <h3 className="text-lg font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>Policy Coverage</h3>
            </div>
            <p className="text-4xl font-bold" style={{ color: BRAND_CONFIG.colors.primary }}>
                <AnimatedNumber value={mockPolicyCoverage} isPercentage={true} />
            </p>
            <p className="text-sm mt-1" style={{ color: BRAND_CONFIG.colors.accent }}>
                <AnimatedNumber value={mockActivePolicies} /> Active Policies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Compliance Analysis */}
      <section>
        <SectionTitle icon={<TrendingUpIcon className={iconClass} />} title="Compliance Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart />
          <RiskHeatMap />
        </div>
      </section>

      {/* Section 3: Activity & Updates */}
      <section>
        <SectionTitle icon={<ListBulletIcon className={iconClass} />} title="Activity & Updates" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ViolationAlerts />
          <RegulatoryUpdates />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;