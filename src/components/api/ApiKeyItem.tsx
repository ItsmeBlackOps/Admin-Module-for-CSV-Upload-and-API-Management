import React, { useState } from 'react';
import { Copy, Trash2, Eye, EyeOff, Check } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
}

interface ApiKeyItemProps {
  apiKey: ApiKey;
  onCopy: (key: string) => void;
  onRevoke: (id: string) => void;
  isCopied: boolean;
}

export const ApiKeyItem: React.FC<ApiKeyItemProps> = ({ 
  apiKey, 
  onCopy, 
  onRevoke,
  isCopied
}) => {
  const [showKey, setShowKey] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const truncateKey = (key: string) => {
    return `${key.substring(0, 10)}...${key.substring(key.length - 4)}`;
  };

  return (
    <li className="flex flex-col border-b border-slate-200 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-slate-800">{apiKey.name}</h3>
          <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            apiKey.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {apiKey.status}
          </span>
        </div>
        
        <div className="mt-1 flex items-center">
          <code className="text-xs font-mono text-slate-600">
            {showKey ? apiKey.key : truncateKey(apiKey.key)}
          </code>
          <button
            onClick={() => setShowKey(!showKey)}
            className="ml-2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            title={showKey ? 'Hide API key' : 'Show API key'}
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        
        <div className="mt-1 text-xs text-slate-500">
          <span>Created: {formatDate(apiKey.created)}</span>
          {apiKey.lastUsed && (
            <span className="ml-4">Last used: {formatDate(apiKey.lastUsed)}</span>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex sm:mt-0">
        <button
          onClick={() => onCopy(apiKey.key)}
          disabled={apiKey.status === 'revoked'}
          className="mr-2 inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCopied ? (
            <>
              <Check size={14} className="mr-1 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1" />
              Copy
            </>
          )}
        </button>
        
        {apiKey.status === 'active' && (
          <button
            onClick={() => onRevoke(apiKey.id)}
            className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 size={14} className="mr-1" />
            Revoke
          </button>
        )}
      </div>
    </li>
  );
};