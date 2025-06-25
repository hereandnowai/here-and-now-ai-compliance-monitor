
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RegulatoryUpdate } from '../types';
import { BRAND_CONFIG, NewspaperIcon } from '../constants';

const mockUpdates: RegulatoryUpdate[] = [
  { id: '1', title: 'New GDPR Guidance on AI Systems', date: '2024-07-25', summary: 'The European Data Protection Board (EDPB) has released new comprehensive guidelines concerning the application of the General Data Protection Regulation (GDPR) to artificial intelligence systems. These guidelines place a strong emphasis on principles such as data minimization, purpose limitation, fairness, and transparency. They also detail requirements for Data Protection Impact Assessments (DPIAs) for high-risk AI applications and clarify the roles and responsibilities of data controllers and processors when deploying AI technologies.', framework: 'GDPR', link: '#' },
  { id: '2', title: 'PCI DSS v4.0 Deadline Approaching', date: '2024-07-20', summary: 'Organizations handling cardholder data are reminded that the deadline for full compliance with PCI DSS v4.0 requirements is rapidly approaching. Key changes in v4.0 include enhanced multi-factor authentication, more robust risk assessment processes, and customized validation approaches. Businesses should ensure their transition plans are well underway to meet the new standards and avoid potential non-compliance penalties.', framework: 'PCI DSS', link: '#' },
  { id: '3', title: 'HIPAA Update on Telehealth Services', date: '2024-07-15', summary: 'The Department of Health and Human Services (HHS) has issued critical updates clarifying Health Insurance Portability and Accountability Act (HIPAA) rules for telehealth providers. These updates address patient consent requirements, data security measures for remote consultations, and best practices for protecting electronic Protected Health Information (ePHI) when using digital communication platforms for healthcare delivery.', framework: 'HIPAA', link: '#' },
  { id: '4', title: 'SOX Section 302 & 404 Modernization', date: '2024-07-10', summary: 'The SEC is considering proposals for modernizing Sarbanes-Oxley Act (SOX) compliance, particularly concerning Sections 302 and 404 related to internal controls over financial reporting (ICFR). Discussions include leveraging technology for more efficient testing and addressing cybersecurity risks within ICFR frameworks.', framework: 'SOX', link: '#' },
];

const RegulatoryUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);

  useEffect(() => {
    setUpdates(mockUpdates);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedUpdateId(expandedUpdateId === id ? null : id);
  };
  
  const MAX_SUMMARY_LENGTH = 100;

  return (
    <div 
      className="p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
    >
      <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>Regulatory Change Notifications</h3>
          <NewspaperIcon className={`w-5 h-5 text-[${BRAND_CONFIG.colors.accent}]`} />
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1"> {/* Adjusted max-h and added pr for scrollbar space */}
        {updates.length === 0 && <p className="text-gray-500 text-center py-4">No recent updates.</p>}
        {updates.map((update) => {
          const isExpanded = expandedUpdateId === update.id;
          const displaySummary = isExpanded ? update.summary : `${update.summary.substring(0, MAX_SUMMARY_LENGTH)}${update.summary.length > MAX_SUMMARY_LENGTH ? "..." : ""}`;
          
          return (
            <motion.div 
              layout 
              key={update.id} 
              className="pb-3 border-b border-gray-200 last:border-b-0"
            >
              <div 
                className="flex items-start cursor-pointer group"
                onClick={() => toggleExpand(update.id)}
              >
                <NewspaperIcon className={`w-4 h-4 mr-2 mt-1 flex-shrink-0 text-[${BRAND_CONFIG.colors.accent}] group-hover:text-[${BRAND_CONFIG.colors.primary}]`} />
                <div>
                    <h4 className={`font-medium text-md group-hover:text-[${BRAND_CONFIG.colors.primary}]`} style={{ color: BRAND_CONFIG.colors.secondary }}>
                        {update.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">{update.date} | Framework: {update.framework}</p>
                </div>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden pl-6" // Indent expanded content
                  >
                    <p className="text-sm text-gray-700 mt-1">{update.summary}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="pl-6 mt-1">
                {(update.summary.length > MAX_SUMMARY_LENGTH || isExpanded) && (
                    <button
                        onClick={() => toggleExpand(update.id)}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: BRAND_CONFIG.colors.accent }}
                    >
                        {isExpanded ? 'Read less' : 'Read more'}
                    </button>
                )}
                {update.link && isExpanded && (
                  <a 
                    href={update.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-semibold ml-2 hover:underline"
                    style={{ color: BRAND_CONFIG.colors.primary }}
                    onClick={(e) => e.stopPropagation()} // Prevent card collapse when clicking external link
                  >
                    Official Source &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RegulatoryUpdates;