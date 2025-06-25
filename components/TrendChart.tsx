
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { ComplianceDataPoint } from '../types';
import { BRAND_CONFIG } from '../constants';

const mockData: ComplianceDataPoint[] = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 88 },
  { month: 'Mar', score: 90 },
  { month: 'Apr', score: 87 },
  { month: 'May', score: 92 },
  { month: 'Jun', score: 95 },
  { month: 'Jul', score: 96.5 },
  { month: 'Aug', score: 94 },
  { month: 'Sep', score: 97 },
  { month: 'Oct', score: 95.5 },
  { month: 'Nov', score: 98 },
  { month: 'Dec', score: 97.2 },
];

const TrendChart: React.FC = () => {
  const complianceScoreHistory = mockData;

  return (
    <div 
      className="p-6 rounded-lg shadow-lg h-96"  // Set fixed height for chart container
      style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_CONFIG.colors.secondary }}>Compliance Score Trend (%)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={complianceScoreHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={BRAND_CONFIG.colors.primary} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={BRAND_CONFIG.colors.primary} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_CONFIG.colors.backgroundLight} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10, fill: BRAND_CONFIG.colors.secondary }} 
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[70, 100]} // Adjust domain for better visual of typical scores
            tick={{ fontSize: 12, fill: BRAND_CONFIG.colors.secondary }} 
            allowDataOverflow={true}
          />
          <Tooltip
            contentStyle={{ backgroundColor: BRAND_CONFIG.colors.secondary, color: BRAND_CONFIG.colors.textLight, borderRadius: '0.5rem', borderColor: BRAND_CONFIG.colors.primary }}
            itemStyle={{ color: BRAND_CONFIG.colors.primary }}
            cursor={{ stroke: BRAND_CONFIG.colors.accent, strokeWidth: 1, strokeDasharray: "3 3" }}
            labelStyle={{ color: BRAND_CONFIG.colors.textLight }}
          />
          <Legend 
            wrapperStyle={{ fontSize: "12px", color: BRAND_CONFIG.colors.secondary, paddingTop: '10px' }} 
            verticalAlign="top" 
            align="right"
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="none" 
            fillOpacity={1} 
            fill="url(#scoreGradient)" 
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke={BRAND_CONFIG.colors.primary} // Brand Primary color for the line
            strokeWidth={3} 
            activeDot={{ r: 8, fill: BRAND_CONFIG.colors.primary, stroke: BRAND_CONFIG.colors.secondary, strokeWidth: 2,  }} 
            dot={{ r: 4, fill: BRAND_CONFIG.colors.primary, strokeWidth: 0 }}
            name="Compliance Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;