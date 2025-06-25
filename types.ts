
export interface ViolationAlert {
  id: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  source: string; // e.g., Transaction ID, Communication Log
  ruleTriggered: string; // e.g., GDPR Article 5, PCI DSS Req 3.4
  status: 'New' | 'Investigating' | 'Resolved' | 'False Positive';
  department?: string; // Optional: To link alert to a department
}

export interface ComplianceDataPoint {
  month: string; // Will store a date string or entry label
  score: number;
}

export interface RegulatoryUpdate {
  id:string;
  title: string;
  date: string;
  summary: string;
  framework: string; // e.g., GDPR, HIPAA
  link?: string;
}

export interface DepartmentRisk {
    id: string; 
    name: string;
    riskScore: number; // 0-100
}

export enum NavigationViews {
    DASHBOARD = "dashboard",
    REPORTING = "reporting",
    POLICY_MANAGEMENT = "policy_management",
    SETTINGS = "settings"
    // DATA_INPUT removed
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., Data Privacy, Financial Crime, Access Control
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Draft' | 'Archived';
  rulesCount: number;
}

// For Scheduled Reports
export interface ScheduledReport {
  id: string;
  name: string;
  reportType: string; 
  reportTypeName: string; 
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  time: string; // e.g., "14:30"
  format: 'pdf' | 'csv' | 'json';
  recipients: string; // comma-separated emails
  createdAt: string; // ISO String
}

// For Report History
export interface ReportHistoryEntry {
  id: string;
  reportName: string; 
  reportType: string; // value from select
  reportTypeName: string; // display name
  generatedAt: string; // ISO String
  format: 'pdf' | 'csv' | 'json';
  filename: string;
}

// Removed InputDataType
// Removed InputFormData
