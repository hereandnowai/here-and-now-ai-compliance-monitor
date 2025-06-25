import React from 'react';
import { BRAND_CONFIG, EyeIcon, TrendingUpIcon, ShieldCheckIcon, GlobeAltIcon, ChatBubbleLeftEllipsisIcon, CpuChipIcon } from '../constants';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div
      className="p-6 rounded-lg shadow-xl flex flex-col items-center text-center transition-all duration-300 ease-in-out transform hover:scale-105"
      style={{ backgroundColor: BRAND_CONFIG.colors.secondary }}
    >
      <div className="mb-4" style={{ color: BRAND_CONFIG.colors.primary }}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: BRAND_CONFIG.colors.primary }}>
        {title}
      </h3>
      <p className="text-sm" style={{ color: BRAND_CONFIG.colors.textLight }}>
        {description}
      </p>
    </div>
  );
};

const HomePage: React.FC = () => {
  const iconSize = "w-12 h-12";

  const coreFunctionalities = [
    {
      icon: <EyeIcon className={iconSize} />,
      title: 'Real-Time Transaction Monitoring',
      description: 'Continuously scan activities, applying ML to identify suspicious patterns and ensure regulatory compliance (GDPR, HIPAA, PCI DSS, SOX).',
    },
    {
      icon: <TrendingUpIcon className={iconSize} />,
      title: 'Predictive Compliance Analytics',
      description: 'Analyze historical data to forecast trends, predict potential failures, and provide early warnings for emerging compliance issues.',
    },
    {
      icon: <ShieldCheckIcon className={iconSize} />,
      title: 'Automated Policy Enforcement',
      description: 'Implement no-code policy automation, generate automated checks, and maintain comprehensive audit trails for all compliance activities.',
    },
    {
      icon: <GlobeAltIcon className={iconSize} />,
      title: 'Multi-Regulatory Framework Support',
      description: 'Unified coverage across multiple standards, adaptable to specific industry needs (finance, healthcare) and jurisdictions.',
    },
  ];

  const advancedAICapabilities = [
    {
      icon: <ChatBubbleLeftEllipsisIcon className={iconSize} />,
      title: 'Natural Language Processing',
      description: 'Analyze unstructured text from emails and documents, extract relevant information, and identify sensitive data patterns.',
    },
    {
      icon: <CpuChipIcon className={iconSize} />,
      title: 'Advanced Machine Learning Models',
      description: 'Utilize anomaly detection, classification, clustering, and time series analysis to enhance compliance oversight.',
    },
    {
      icon: <ShieldCheckIcon className={iconSize} />,
      title: 'Intelligent Data Protection',
      description: 'Sophisticated data masking, automatic PII detection, data lineage tracking, and robust access controls for compliance data.',
    },
  ];

  return (
    <div className="space-y-8 ml-64 p-4 sm:p-6 lg:p-8" style={{ backgroundColor: BRAND_CONFIG.colors.backgroundLight, color: BRAND_CONFIG.colors.textDark }}>
      <div className="text-center py-8">
        <img 
            src={BRAND_CONFIG.logo.title} 
            alt={`${BRAND_CONFIG.shortName} Logo`} 
            className="h-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2" style={{ color: BRAND_CONFIG.colors.secondary }}>
          Welcome to {BRAND_CONFIG.shortName} Compliance Monitor
        </h1>
        <p className="text-lg italic" style={{ color: BRAND_CONFIG.colors.accent }}>
          {BRAND_CONFIG.slogan}
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-md" style={{ color: BRAND_CONFIG.colors.textDark }}>
          An expert AI compliance monitoring system designed to continuously monitor transactions and activities for compliance with internal policies and external regulations. Your primary function is to analyze data patterns, detect violations, and provide real-time compliance oversight.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6 text-center" style={{ color: BRAND_CONFIG.colors.secondary }}>
          Core Functionalities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {coreFunctionalities.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6 text-center" style={{ color: BRAND_CONFIG.colors.secondary }}>
          Advanced AI Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedAICapabilities.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      <div className="text-center py-8">
        <Link
            to="/dashboard"
            className="inline-block px-8 py-3 text-lg font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-150 ease-in-out hover:scale-105"
            style={{
                backgroundColor: BRAND_CONFIG.colors.primary,
                color: BRAND_CONFIG.colors.secondary,
                borderColor: BRAND_CONFIG.colors.secondary,
                // borderWidth: '2px'
            }}
        >
            Explore the Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;