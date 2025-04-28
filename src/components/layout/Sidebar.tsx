import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileSpreadsheet, Key, 
  LogOut, X, Settings 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'CSV Upload', path: '/admin/csv-upload', icon: <FileSpreadsheet size={20} /> },
    { name: 'API Management', path: '/admin/api-management', icon: <Key size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-800 transition duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">Admin Portal</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="border-b border-slate-700 px-4 py-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <span className="mr-3 text-slate-400">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <LogOut size={20} className="mr-3 text-slate-400" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};