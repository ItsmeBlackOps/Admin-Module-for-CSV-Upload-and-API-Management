import React, { useState } from 'react';
import { Key, Copy, Check } from 'lucide-react';

export const ApiManagement: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }
    localStorage.setItem('graphApiKey', apiKey);
    alert('API key saved successfully');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Microsoft Graph API Configuration</h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter your Graph API key to enable email search functionality
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-slate-700">
              API Key
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Graph API key"
                className="block w-full rounded-l-md border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleCopyKey}
                className="inline-flex items-center rounded-r-md border border-l-0 border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveKey}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Key size={16} className="mr-2" />
              Save API Key
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-slate-50 p-4">
          <h3 className="text-sm font-medium text-slate-800">How to get your API key:</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-slate-600">
            <li>Go to the Azure Portal and sign in</li>
            <li>Navigate to Azure Active Directory</li>
            <li>Register a new application or select an existing one</li>
            <li>Under "Certificates & secrets", create a new client secret</li>
            <li>Copy the generated secret value and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};