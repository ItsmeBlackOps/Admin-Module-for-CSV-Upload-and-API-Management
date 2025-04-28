import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Database, FileSpreadsheet, 
  ArrowUpCircle, FileCheck, AlertCircle 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock dashboard data
  const stats = [
    { 
      title: 'Uploaded Files', 
      value: '24', 
      change: '+4', 
      icon: <FileSpreadsheet size={24} className="text-indigo-500" /> 
    },
    { 
      title: 'API Requests', 
      value: '1,452', 
      change: '+12%', 
      icon: <Database size={24} className="text-emerald-500" /> 
    },
    { 
      title: 'Active Users', 
      value: '35', 
      change: '+2', 
      icon: <Users size={24} className="text-blue-500" /> 
    },
  ];
  
  // Mock recent activity
  const recentActivity = [
    { 
      type: 'upload', 
      user: 'John Smith', 
      details: 'Uploaded customers.csv', 
      time: '5 minutes ago',
      icon: <ArrowUpCircle size={18} className="text-indigo-500" /> 
    },
    { 
      type: 'api', 
      user: 'API System', 
      details: 'API key generated', 
      time: '1 hour ago',
      icon: <FileCheck size={18} className="text-emerald-500" /> 
    },
    { 
      type: 'error', 
      user: 'Sarah Johnson', 
      details: 'Failed to process marketing.csv', 
      time: '2 hours ago',
      icon: <AlertCircle size={18} className="text-red-500" /> 
    },
    { 
      type: 'upload', 
      user: 'Michael Brown', 
      details: 'Uploaded leads.csv', 
      time: 'Yesterday',
      icon: <ArrowUpCircle size={18} className="text-indigo-500" /> 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-slate-800">
          Welcome back, {user?.username}!
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Here's what's happening with your admin portal today.
        </p>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="rounded-lg bg-white p-6 shadow transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
              {stat.icon}
            </div>
            <div className="mt-4 flex items-baseline">
              <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
              <p className="ml-2 text-xs font-medium text-emerald-600">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent activity */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-slate-800">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div 
              key={index} 
              className="flex items-start rounded-md border-l-4 border-slate-200 bg-slate-50 p-4 hover:border-indigo-500 hover:bg-slate-100"
            >
              <div className="mr-4 mt-0.5">{activity.icon}</div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  <span className="font-semibold">{activity.user}</span> {activity.details}
                </p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
};