import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const ApiManagement: React.FC = () => {
  const { user, updateApiKey } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    const savedKey = localStorage.getItem('graphApiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800">API Configuration</h2>
            {user.apiKey ? (
              <div className="mt-4">
                <p className="text-sm text-slate-600">Your API key is configured and ready to use.</p>
                <div className="mt-4 flex items-center space-x-2">
                  <code className="rounded bg-slate-100 px-2 py-1 text-sm font-mono">
                    {user.apiKey.substring(0, 8)}...{user.apiKey.substring(user.apiKey.length - 4)}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.apiKey || '');
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">No API Key Available</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Please contact your administrator to set up the API key.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }
    updateApiKey(apiKey);
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
            Enter your Graph API key to enable email search functionality for all users
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