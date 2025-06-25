
import React, { useState } from 'react';
import { BRAND_CONFIG } from '../constants';
import { Policy } from '../types';

const mockPolicies: Policy[] = [
  { id: 'pol1', name: 'Data Privacy Policy', description: 'Ensures compliance with GDPR and CCPA.', category: 'Data Privacy', version: '2.1', lastUpdated: '2024-07-15', status: 'Active', rulesCount: 15 },
  { id: 'pol2', name: 'Financial Transaction Monitoring', description: 'Rules for detecting suspicious financial activities.', category: 'Financial Crime', version: '1.5', lastUpdated: '2024-06-20', status: 'Active', rulesCount: 25 },
  { id: 'pol3', name: 'Access Control Policy', description: 'Defines access rights to systems and data.', category: 'Access Control', version: '3.0', lastUpdated: '2024-05-30', status: 'Active', rulesCount: 42 },
  { id: 'pol4', name: 'Communication Monitoring (Draft)', description: 'Policy for monitoring internal and external communications for compliance.', category: 'Communication', version: '0.8', lastUpdated: '2024-07-28', status: 'Draft', rulesCount: 8 },
];

type ActiveTab = 'viewPolicies' | 'createPolicy' | 'ruleEngine' | 'workflowDesigner' | 'versionControl' | 'integrationHub';

const PolicyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('viewPolicies');
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);

  // State for the new policy form
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDescription, setNewPolicyDescription] = useState('');
  const [newPolicyCategory, setNewPolicyCategory] = useState('');
  const [newPolicyVersion, setNewPolicyVersion] = useState('1.0');
  const [newPolicyStatus, setNewPolicyStatus] = useState<'Draft' | 'Active'>('Draft');

  const commonInputClass = "mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white text-black";

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName.trim() || !newPolicyCategory.trim()) {
      alert('Policy Name and Category are required.');
      return;
    }

    const newPolicy: Policy = {
      id: `pol_${Date.now()}`,
      name: newPolicyName,
      description: newPolicyDescription,
      category: newPolicyCategory,
      version: newPolicyVersion,
      lastUpdated: new Date().toISOString().slice(0, 10),
      status: newPolicyStatus,
      rulesCount: 0, // Default for new policies
    };

    setPolicies(prevPolicies => [...prevPolicies, newPolicy]);
    
    // Clear form fields
    setNewPolicyName('');
    setNewPolicyDescription('');
    setNewPolicyCategory('');
    setNewPolicyVersion('1.0');
    setNewPolicyStatus('Draft');

    alert('Policy created successfully!');
    setActiveTab('viewPolicies'); // Switch to view policies tab
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'viewPolicies':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{backgroundColor: BRAND_CONFIG.colors.backgroundDark}}>
                <tr>
                  {['Name', 'Category', 'Version', 'Status', 'Rules', 'Last Updated', 'Actions'].map(header => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{color: BRAND_CONFIG.colors.primary}}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.version}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        policy.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        policy.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : // Updated for better contrast
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.rulesCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => alert(`Editing policy: ${policy.name}`)} className="mr-2" style={{color: BRAND_CONFIG.colors.accent}}>Edit</button>
                      <button onClick={() => alert(`Viewing policy: ${policy.name}`)} style={{color: BRAND_CONFIG.colors.primary}}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'createPolicy':
        return (
            <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_CONFIG.colors.secondary }}>Create New Policy</h3>
                <form onSubmit={handleCreatePolicy} className="space-y-4">
                    <div>
                        <label htmlFor="policyName" className="block text-sm font-medium text-gray-700">Policy Name*</label>
                        <input
                            type="text"
                            id="policyName"
                            value={newPolicyName}
                            onChange={(e) => setNewPolicyName(e.target.value)}
                            className={commonInputClass}
                            style={{borderColor: BRAND_CONFIG.colors.accent}}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="policyDescription" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="policyDescription"
                            value={newPolicyDescription}
                            onChange={(e) => setNewPolicyDescription(e.target.value)}
                            rows={3}
                            className={commonInputClass}
                            style={{borderColor: BRAND_CONFIG.colors.accent}}
                        />
                    </div>
                    <div>
                        <label htmlFor="policyCategory" className="block text-sm font-medium text-gray-700">Category*</label>
                        <input
                            type="text"
                            id="policyCategory"
                            value={newPolicyCategory}
                            onChange={(e) => setNewPolicyCategory(e.target.value)}
                            className={commonInputClass}
                            style={{borderColor: BRAND_CONFIG.colors.accent}}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="policyVersion" className="block text-sm font-medium text-gray-700">Version</label>
                        <input
                            type="text"
                            id="policyVersion"
                            value={newPolicyVersion}
                            onChange={(e) => setNewPolicyVersion(e.target.value)}
                            className={commonInputClass}
                            style={{borderColor: BRAND_CONFIG.colors.accent}}
                        />
                    </div>
                    <div>
                        <label htmlFor="policyStatus" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            id="policyStatus"
                            value={newPolicyStatus}
                            onChange={(e) => setNewPolicyStatus(e.target.value as 'Draft' | 'Active')}
                            className={commonInputClass}
                            style={{borderColor: BRAND_CONFIG.colors.accent}}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Active">Active</option>
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-2.5 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ backgroundColor: BRAND_CONFIG.colors.primary, color: BRAND_CONFIG.colors.secondary }}
                        >
                            Create Policy
                        </button>
                    </div>
                </form>
            </div>
        );
      case 'ruleEngine':
        return <div className="p-4 bg-gray-50 rounded-md">Rule Engine (Configure automated compliance checks and thresholds - Placeholder)</div>;
      case 'workflowDesigner':
        return <div className="p-4 bg-gray-50 rounded-md">Workflow Designer (Create approval processes for policy violations - Placeholder)</div>;
      case 'versionControl':
         return <div className="p-4 bg-gray-50 rounded-md">Version Control (Track policy changes and maintain historical versions - Placeholder)</div>;
      case 'integrationHub':
        return <div className="p-4 bg-gray-50 rounded-md">Integration Hub (Connect with existing compliance and security systems - Placeholder)</div>;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{tabName: ActiveTab; label: string}> = ({tabName, label}) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-150
        ${activeTab === tabName 
          ? `border-b-2 text-[${BRAND_CONFIG.colors.secondary}]` 
          : `text-gray-600 hover:text-[${BRAND_CONFIG.colors.accent}]`}
      `}
      style={activeTab === tabName ? { borderColor: BRAND_CONFIG.colors.primary, color: BRAND_CONFIG.colors.secondary} : {}}
    >
      {label}
    </button>
  );


  return (
    <div className="space-y-6 ml-64 p-4 sm:p-6 lg:p-8" style={{ backgroundColor: BRAND_CONFIG.colors.backgroundLight }}>
      <h1 className="text-3xl font-bold" style={{ color: BRAND_CONFIG.colors.secondary }}>
        Policy Management Interface
      </h1>

      <div 
        className="rounded-lg shadow-lg"
        style={{ backgroundColor: BRAND_CONFIG.colors.textLight, borderColor: BRAND_CONFIG.colors.secondary, borderWidth: '1px' }}
      >
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
            <TabButton tabName="viewPolicies" label="View Policies" />
            <TabButton tabName="createPolicy" label="Create Policy" />
            <TabButton tabName="ruleEngine" label="Rule Engine" />
            <TabButton tabName="workflowDesigner" label="Workflow Designer" />
            <TabButton tabName="versionControl" label="Version Control" />
            <TabButton tabName="integrationHub" label="Integration Hub" />
          </nav>
        </div>
        <div className="p-2 sm:p-4 lg:p-6">
          {renderTabContent()}
        </div>
      </div>
       <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-2.5 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
             style={{ 
              backgroundColor: BRAND_CONFIG.colors.primary, 
              color: BRAND_CONFIG.colors.secondary,
            }}
            onClick={() => {
                if (activeTab !== 'createPolicy') {
                    setActiveTab('createPolicy');
                }
            }}
          >
            + Create New Policy
          </button>
        </div>
    </div>
  );
};

export default PolicyManagement;
