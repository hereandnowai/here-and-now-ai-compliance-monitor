
import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONFIG } from '../constants';

interface ComplianceScoreCardProps {
  score: number;
  target: number;
}

const ComplianceScoreCard: React.FC<ComplianceScoreCardProps> = ({ score, target }) => {
  const percentage = Math.min(Math.max(score, 0), 100); // Clamp score between 0 and 100
  const circumference = 2 * Math.PI * 50; // Assuming radius of 50
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const scoreColor = percentage >= target ? BRAND_CONFIG.colors.accent : (percentage >= target * 0.8 ? BRAND_CONFIG.colors.primary : 'rgb(239 68 68)'); // red-500
  const trackColor = BRAND_CONFIG.colors.backgroundDark; // Darker shade of secondary for track

  const pulseAnimation = percentage >= target ? {
    scale: [1, 1.05, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const } // Applied fix here
  } : {};

  return (
    <div 
      className="p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[200px]" // Ensure a min height for consistency
      style={{ backgroundColor: BRAND_CONFIG.colors.secondary, color: BRAND_CONFIG.colors.textLight }}
    >
      <h3 className="text-lg font-semibold mb-3 text-center" style={{ color: BRAND_CONFIG.colors.primary }}>Overall Compliance Score</h3>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            strokeWidth="10"
            stroke={trackColor} // Use defined track color
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
          />
          <motion.circle
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={scoreColor}
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out' }}
          />
        </svg>
        <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ color: BRAND_CONFIG.colors.textLight}}
        >
          <motion.span 
            className="text-4xl font-bold" 
            style={{ color: scoreColor, transition: 'color 0.5s ease-out' }}
            animate={pulseAnimation}
          >
            {percentage.toFixed(1)}%
          </motion.span>
        </div>
      </div>
      <p className="mt-3 text-sm" style={{color: BRAND_CONFIG.colors.textLight}}>Target: {target}%</p>
      {percentage < target && (
        <p className="mt-1 text-xs" style={{color: BRAND_CONFIG.colors.primary}}>Needs Attention</p>
      )}
    </div>
  );
};

export default ComplianceScoreCard;
