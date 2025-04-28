import React from 'react';
import { LogOut, Settings, Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/csv-upload')}
            className={`rounded-md p-2 ${
              location.pathname === '/csv-upload'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Upload size={20} />
          </button>
          <button
            onClick={() => navigate('/api-management')}
            className={`rounded-md p-2 ${
              location.pathname === '/api-management'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-600">
            Welcome, {user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};