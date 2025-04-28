import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/ui/Loader';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/csv-upload';

  if (isAuthenticated) {
    return <Navigate to="/csv-upload" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials. Try using admin/password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white px-8 py-10 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800">CSV Review Portal</h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to access the application
            </p>
          </div>
          
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User size={16} className="text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Hint: Use admin/password for demo
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader size="small" className="text-white" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};