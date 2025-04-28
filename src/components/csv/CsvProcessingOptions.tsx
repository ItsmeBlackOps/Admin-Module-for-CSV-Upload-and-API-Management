import React, { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

export const CsvProcessingOptions: React.FC = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'Candidate Name', 'Company', 'Email'
  ]);
  const [searchInGraph, setSearchInGraph] = useState(true);
  const [autoProcess, setAutoProcess] = useState(false);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);
  
  // Mock column options
  const availableColumns = [
    'Candidate Name', 
    'Company', 
    'Email', 
    'Phone', 
    'Position', 
    'Date Added',
    'Status',
    'Notes'
  ];
  
  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };
  
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center">
        <Settings size={20} className="mr-2 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-800">Processing Options</h3>
      </div>
      
      <div className="space-y-6">
        {/* Column selection */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700">
            Select Columns to Process
          </h4>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {availableColumns.map((column) => (
              <div key={column} className="flex items-center">
                <input
                  id={`column-${column}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
                <label
                  htmlFor={`column-${column}`}
                  className="ml-2 text-sm text-slate-700"
                >
                  {column}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Processing options */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700">
            Additional Options
          </h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="search-graph"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={searchInGraph}
                onChange={() => setSearchInGraph(!searchInGraph)}
              />
              <label
                htmlFor="search-graph"
                className="ml-2 text-sm text-slate-700"
              >
                Search in Microsoft Graph API
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="auto-process"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={autoProcess}
                onChange={() => setAutoProcess(!autoProcess)}
              />
              <label
                htmlFor="auto-process"
                className="ml-2 text-sm text-slate-700"
              >
                Automatically process future uploads
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="notify"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={notifyOnCompletion}
                onChange={() => setNotifyOnCompletion(!notifyOnCompletion)}
              />
              <label
                htmlFor="notify"
                className="ml-2 text-sm text-slate-700"
              >
                Notify when processing is complete
              </label>
            </div>
          </div>
        </div>
        
        {/* Save button */}
        <div className="pt-2">
          <button 
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <RefreshCw size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};