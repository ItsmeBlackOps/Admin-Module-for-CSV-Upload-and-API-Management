import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Page not found</h2>
        <p className="mt-2 text-base text-slate-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/admin"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Home size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};