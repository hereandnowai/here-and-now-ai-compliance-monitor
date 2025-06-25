
import React, { useState } from 'react';
import { BRAND_CONFIG, ClockIcon, TrashIcon, ListBulletIcon } from '../constants'; // Added ClockIcon, TrashIcon, ListBulletIcon
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ViolationAlert, DepartmentRisk, ScheduledReport, ReportHistoryEntry } from '../types'; 

// Mock data (can be imported or defined here)
const mockViolationAlertsForReport: ViolationAlert[] = [
  { id: 'alert1', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'Critical', description: 'Unauthorized access attempt detected.', source: 'System Log XYZ123', ruleTriggered: 'Access Control', status: 'New', department: 'IT Operations' },
  { id: 'alert2', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'High', description: 'Large financial transaction flagged.', source: 'TXN_ID_98765', ruleTriggered: 'AML Policy', status: 'Investigating', department: 'Finance' },
  { id: 'alert3', timestamp: new Date(Date.now() - 10800000).toISOString(), severity: 'Medium', description: 'PII data shared internally.', source: 'Chat Log #CH456', ruleTriggered: 'Data Privacy', status: 'New', department: 'Marketing' },
];

const mockDepartmentRisksForReport: DepartmentRisk[] = [
  { id: 'dept1', name: 'Finance', riskScore: 75 },
  { id: 'dept2', name: 'Sales', riskScore: 45 },
  { id: 'dept3', name: 'HR', riskScore: 20 },
];

const mockAuditLogs = [
    { timestamp: new Date(Date.now() - 100000).toISOString(), user: 'admin@example.com', action: 'Logged In', details: 'Successful login from IP 192.168.1.10' },
    { timestamp: new Date(Date.now() - 200000).toISOString(), user: 'user1@example.com', action: 'Policy Update', details: 'Policy "Data Privacy V2" updated' },
    { timestamp: new Date(Date.now() - 300000).toISOString(), user: 'system', action: 'Alert Generated', details: 'Critical Alert ID: alert1 triggered' },
];

const mockSummaryData = {
    overallScore: 96.5,
    totalAlerts: 7,
    criticalAlerts: 2,
    activePolicies: 12,
    lastAuditDate: new Date(Date.now() - 86400000 * 10).toLocaleDateString()
};

interface ReportPreviewData {
    title: string;
    headers: string[];
    rows: any[][];
}

const reportTypeOptions = [
    { value: 'compliance_summary', label: 'Compliance Summary' },
    { value: 'violation_details', label: 'Violation Details' },
    { value: 'audit_trail', label: 'Audit Trail Log' },
    { value: 'risk_assessment', label: 'Risk Assessment Report' },
];

const Reporting: React.FC = () => {
  const [reportType, setReportType] = useState('compliance_summary');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreviewData, setReportPreviewData] = useState<ReportPreviewData | null>(null);

  // State for Scheduled Reports
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleReportType, setScheduleReportType] = useState('compliance_summary');
  const [scheduleFrequency, setScheduleFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleFormat, setScheduleFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [scheduleRecipients, setScheduleRecipients] = useState('');
  const [scheduledReportsList, setScheduledReportsList] = useState<ScheduledReport[]>([]);

  // State for Report History
  const [reportHistoryList, setReportHistoryList] = useState<ReportHistoryEntry[]>([]);
  const iconClass = "w-5 h-5";


  const getFilename = (baseName: string, extension: string): string => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const selectedReportType = reportTypeOptions.find(opt => opt.value === baseName)?.label || baseName;
    return `${selectedReportType.replace(/ /g, '-')}-${dateStr}.${extension}`;
  };

  const downloadFile = (filename: string, dataUri: string) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data: any[], headers: string[]): string => {
    const csvRows = [];
    csvRows.push(headers.join(',')); 
    // Data is expected to be an array of objects, where keys match simplified header keys
    for (const row of data) {
      const values = headers.map(header => {
        const key = header.toLowerCase().replace(/\s+/g, '').replace(/[()%]/g, '');
        const actualKeyInRow = Object.keys(row).find(k => k.toLowerCase().replace(/\s+/g, '').replace(/[()%]/g, '') === key);
        let cellValue = '';
        if (actualKeyInRow) {
            cellValue = row[actualKeyInRow] !== undefined && row[actualKeyInRow] !== null ? String(row[actualKeyInRow]) : '';
        }
        const escaped = cellValue.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportPreviewData(null); 

    let reportDataArray: any[] = []; // Used for CSV/JSON and to derive dataRows for PDF
    let currentReportTitle = reportTypeOptions.find(opt => opt.value === reportType)?.label || reportType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let headers: string[] = [];
    let dataRowsForPdf: any[][] = []; // Specifically for PDF autoTable body

    switch (reportType) {
      case 'compliance_summary':
        headers = ['Metric', 'Value'];
        reportDataArray = Object.entries(mockSummaryData).map(([key, value]) => ({ Metric: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), Value: value }));
        dataRowsForPdf = reportDataArray.map(item => [item.Metric, item.Value]);
        break;
      case 'violation_details':
        headers = ['ID', 'Timestamp', 'Severity', 'Description', 'Source', 'Rule Triggered', 'Status', 'Department'];
        reportDataArray = mockViolationAlertsForReport.map(alert => ({...alert, timestamp: new Date(alert.timestamp).toLocaleString(), department: alert.department || 'N/A' }));
        dataRowsForPdf = reportDataArray.map(alert => [alert.id, alert.timestamp, alert.severity, alert.description, alert.source, alert.ruleTriggered, alert.status, alert.department]);
        break;
      case 'audit_trail':
        headers = ['Timestamp', 'User', 'Action', 'Details'];
        reportDataArray = mockAuditLogs.map(log => ({...log, timestamp: new Date(log.timestamp).toLocaleString()}));
        dataRowsForPdf = reportDataArray.map(log => [log.timestamp, log.user, log.action, log.details]);
        break;
      case 'risk_assessment':
        headers = ['ID', 'Department Name', 'Risk Score (%)'];
        reportDataArray = mockDepartmentRisksForReport;
        dataRowsForPdf = reportDataArray.map(dept => [dept.id, dept.name, dept.riskScore]);
        break;
      default:
        console.error('Unknown report type');
        setIsGenerating(false);
        return;
    }

    setReportPreviewData({ title: currentReportTitle, headers, rows: dataRowsForPdf });
    const generatedFilename = getFilename(reportType, format);

    try {
        if (format === 'pdf') {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15; 
            let logoImg: HTMLImageElement | null = null;
            try {
                logoImg = new Image();
                logoImg.crossOrigin = "Anonymous"; 
                logoImg.src = BRAND_CONFIG.logo.title;
                await new Promise((resolve) => { // Simplified promise
                    logoImg!.onload = resolve;
                    logoImg!.onerror = () => { logoImg = null; resolve(null); };
                    setTimeout(() => { if (!logoImg?.complete || logoImg?.naturalHeight === 0) {logoImg = null; resolve(null);} }, 1500); 
                });
            } catch (e) { logoImg = null; }

            autoTable(doc, {
                head: [headers],
                body: dataRowsForPdf,
                theme: 'striped',
                headStyles: { fillColor: BRAND_CONFIG.colors.secondary, textColor: BRAND_CONFIG.colors.primary, fontStyle: 'bold' },
                styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
                alternateRowStyles: { fillColor: [240, 244, 248] },
                margin: { top: margin + (logoImg ? 25 : 15), right: margin, bottom: margin + 10, left: margin },
                didDrawPage: (data) => {
                    doc.setFontSize(16); doc.setTextColor(BRAND_CONFIG.colors.secondary); doc.setFont('helvetica', 'bold');
                    if (logoImg && logoImg.complete && logoImg.naturalHeight !== 0) {
                        const aspectRatio = logoImg.width / logoImg.height; const logoHeight = 10; const logoWidth = logoHeight * aspectRatio;
                        doc.addImage(logoImg, 'PNG', margin, margin, logoWidth, logoHeight);
                        doc.text(currentReportTitle, margin + logoWidth + 5, margin + 7);
                    } else {
                        doc.text(BRAND_CONFIG.shortName, margin, margin + 7);
                        doc.text(currentReportTitle, margin, margin + 15);
                    }
                    doc.setFontSize(10); doc.setTextColor(100); doc.setFont('helvetica', 'normal');
                    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + (logoImg ? 20 : 23));
                    doc.setFontSize(8); doc.setTextColor(150);
                    doc.text(`Page ${data.pageNumber}`, pageWidth - margin - 10, pageHeight - margin + 5, { align: 'right' });
                },
            });
            doc.save(generatedFilename);

        } else if (format === 'csv') {
            const csvContent = convertToCSV(reportDataArray, headers); // Pass array of objects
            downloadFile(generatedFilename, 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        
        } else if (format === 'json') {
            const jsonContent = JSON.stringify(reportDataArray, null, 2); // Use reportDataArray for consistent output
            downloadFile(generatedFilename, 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonContent));
        }
        
        // Add to Report History
        const newHistoryEntry: ReportHistoryEntry = {
            id: `hist_${Date.now()}`,
            reportName: currentReportTitle,
            reportType: reportType,
            reportTypeName: reportTypeOptions.find(opt => opt.value === reportType)?.label || reportType,
            generatedAt: new Date().toISOString(),
            format: format,
            filename: generatedFilename,
        };
        setReportHistoryList(prev => [newHistoryEntry, ...prev.slice(0, 9)]); // Keep last 10
    } catch (error) {
        console.error("Error generating report:", error);
        alert("Failed to generate report. See console for details.");
    } finally {
        setIsGenerating(false);
    }
  };
  
  const commonSelectClass = "mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm";
  const commonInputClass = "mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white text-black";


  const handleAddNewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleName.trim() || !scheduleRecipients.trim()) {
      alert("Schedule Name and Recipient Emails are required.");
      return;
    }
    const newSchedule: ScheduledReport = {
      id: `sch_${Date.now()}`,
      name: scheduleName,
      reportType: scheduleReportType,
      reportTypeName: reportTypeOptions.find(opt => opt.value === scheduleReportType)?.label || scheduleReportType,
      frequency: scheduleFrequency,
      time: scheduleTime,
      format: scheduleFormat,
      recipients: scheduleRecipients,
      createdAt: new Date().toISOString(),
    };
    setScheduledReportsList(prev => [newSchedule, ...prev]);
    // Reset form
    setScheduleName('');
    setScheduleReportType('compliance_summary');
    setScheduleFrequency('Weekly');
    setScheduleTime('09:00');
    setScheduleFormat('pdf');
    setScheduleRecipients('');
    alert("Report scheduled successfully!");
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scheduled report?")) {
      setScheduledReportsList(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 ml-64 p-4 sm:p-6 lg:p-8" style={{ backgroundColor: BRAND_CONFIG.colors.backgroundLight }}>
      <h1 className="text-3xl font-bold" style={{ color: BRAND_CONFIG.colors.secondary }}>
        Automated Reporting System
      </h1>

      {/* Generate New Report Section */}
      <div 
        className="p-6 rounded-lg shadow-lg"
        style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
      >
        <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND_CONFIG.colors.secondary }}>Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
            <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)} className={commonInputClass} style={{borderColor: BRAND_CONFIG.colors.accent}}>
              {reportTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">Date Range</label>
            <select id="dateRange" value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={commonInputClass} style={{borderColor: BRAND_CONFIG.colors.accent}}>
              <option value="last_24_hours">Last 24 Hours</option>
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_quarter">Last Quarter</option>
            </select>
          </div>
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700">Export Format</label>
            <select id="format" value={format} onChange={(e) => setFormat(e.target.value as 'pdf'|'csv'|'json')} className={commonInputClass} style={{borderColor: BRAND_CONFIG.colors.accent}}>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={handleGenerateReport} disabled={isGenerating} className="w-full md:w-auto px-6 py-2.5 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ backgroundColor: BRAND_CONFIG.colors.primary, color: BRAND_CONFIG.colors.secondary, opacity: isGenerating ? 0.6 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}>
            {isGenerating ? 'Generating...' : 'Generate Report & Download'}
          </button>
        </div>
      </div>

      {/* Report Preview Section */}
      {reportPreviewData && (
        <div className="mt-8 p-6 rounded-lg shadow-lg" style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND_CONFIG.colors.secondary }}>Report Preview: {reportPreviewData.title}</h2>
            {reportPreviewData.rows.length > 0 ? (
                <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">
                    <thead style={{backgroundColor: BRAND_CONFIG.colors.backgroundDark}}><tr>
                        {reportPreviewData.headers.map(header => (<th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: BRAND_CONFIG.colors.primary}}>{header}</th>))}
                    </tr></thead>
                    <tbody className="bg-white divide-y divide-gray-200">{reportPreviewData.rows.map((row, rowIndex) => (<tr key={rowIndex} className="hover:bg-gray-50">{row.map((cell, cellIndex) => (<td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{typeof cell === 'boolean' ? cell.toString() : cell}</td>))}</tr>))}</tbody>
                </table></div>
            ) : (<p className="text-gray-500">No data available for this report type.</p>)}
        </div>
      )}

      {/* Scheduled Reports Section */}
      <div className="p-6 rounded-lg shadow-lg mt-6" style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}>
        <div className="flex items-center mb-4">
            <ClockIcon className={`${iconClass} mr-2 text-[${BRAND_CONFIG.colors.accent}]`} />
            <h2 className="text-xl font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>Scheduled Reports</h2>
        </div>
        <form onSubmit={handleAddNewSchedule} className="space-y-4 mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-md font-medium text-gray-700">Add New Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="scheduleName" className="block text-sm font-medium text-gray-700">Schedule Name*</label><input type="text" id="scheduleName" value={scheduleName} onChange={e => setScheduleName(e.target.value)} className={commonInputClass} required /></div>
                <div><label htmlFor="scheduleRecipients" className="block text-sm font-medium text-gray-700">Recipient Emails* (comma-separated)</label><input type="text" id="scheduleRecipients" value={scheduleRecipients} onChange={e => setScheduleRecipients(e.target.value)} className={commonInputClass} required placeholder="email1@example.com, email2@example.com" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label htmlFor="scheduleReportType" className="block text-sm font-medium text-gray-700">Report Type</label><select id="scheduleReportType" value={scheduleReportType} onChange={e => setScheduleReportType(e.target.value)} className={commonInputClass}>{reportTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div><label htmlFor="scheduleFrequency" className="block text-sm font-medium text-gray-700">Frequency</label><select id="scheduleFrequency" value={scheduleFrequency} onChange={e => setScheduleFrequency(e.target.value as any)} className={commonInputClass}><option value="Daily">Daily</option><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option></select></div>
                <div><label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">Time</label><input type="time" id="scheduleTime" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className={commonInputClass} /></div>
                <div><label htmlFor="scheduleFormat" className="block text-sm font-medium text-gray-700">Format</label><select id="scheduleFormat" value={scheduleFormat} onChange={e => setScheduleFormat(e.target.value as any)} className={commonInputClass}><option value="pdf">PDF</option><option value="csv">CSV</option><option value="json">JSON</option></select></div>
            </div>
            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md shadow-sm" style={{ backgroundColor: BRAND_CONFIG.colors.accent, color: BRAND_CONFIG.colors.textLight }}>Add Schedule</button>
        </form>
        {scheduledReportsList.length === 0 ? <p className="text-gray-600">No reports currently scheduled.</p> : (
            <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">
                <thead style={{backgroundColor: BRAND_CONFIG.colors.backgroundDark}}><tr>
                    {['Name', 'Report Type', 'Frequency', 'Time', 'Format', 'Recipients', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: BRAND_CONFIG.colors.primary}}>{h}</th>)}
                </tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">{scheduledReportsList.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.reportTypeName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.frequency}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.time}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.format.toUpperCase()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{s.recipients}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm"><button onClick={() => handleDeleteSchedule(s.id)} className="p-1 rounded hover:bg-red-100" title="Delete Schedule"><TrashIcon className={`w-4 h-4 text-red-500 hover:text-red-700`} /></button></td>
                    </tr>))}
                </tbody></table>
            </div>
        )}
      </div>

      {/* Report History Section */}
       <div className="p-6 rounded-lg shadow-lg mt-6" style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}>
        <div className="flex items-center mb-4">
            <ListBulletIcon className={`${iconClass} mr-2 text-[${BRAND_CONFIG.colors.accent}]`} />
            <h2 className="text-xl font-semibold" style={{ color: BRAND_CONFIG.colors.secondary }}>Report History</h2>
        </div>
        {reportHistoryList.length === 0 ? <p className="text-gray-600">No report history available.</p> : (
            <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">
                <thead style={{backgroundColor: BRAND_CONFIG.colors.backgroundDark}}><tr>
                    {['Report Name', 'Generated At', 'Format', 'Filename'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: BRAND_CONFIG.colors.primary}}>{h}</th>)}
                </tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">{reportHistoryList.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{h.reportName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(h.generatedAt).toLocaleString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{h.format.toUpperCase()}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-md">{h.filename}</td>
                    </tr>))}
                </tbody></table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Reporting;
