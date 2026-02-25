import React from 'react';
import { CalendarDays, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardWelcome = ({ user, titlePrefix = 'Welcome' }) => {
  const navigate = useNavigate();

  // Pick color and initial based on role
  const role = user?.role || 'employee';
  const initial = user?.name?.charAt(0) || '👋';
  const name = user?.name || titlePrefix.split(' ')[0];

  const colors = {
    employee: 'from-blue-500 to-indigo-600',
    manager: 'from-purple-500 to-indigo-600',
    admin: 'from-red-500 to-orange-600',
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card-bg p-6 sm:p-8 rounded-2xl shadow-sm border border-border-color transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className={`h-24 w-24 rounded-full bg-linear-to-br ${colors[role]} flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-card-bg border border-border-color`}>
          {initial}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-main">
            {titlePrefix === 'Welcome back' ? `${titlePrefix}, ${name}!` : `${titlePrefix}, ${name}`}
          </h1>
          <p className="mt-1 text-text-sec font-medium">
            {role.toUpperCase()} • {user?.department || 'General'} Department
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-0 w-full sm:w-auto flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/apply-leave')}
          className="w-full sm:w-auto bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 shadow-sm border border-brand-light flex items-center justify-center gap-2"
        >
          <CalendarDays className="h-4 w-4" /> Apply Leave
        </button>
        <button
          onClick={() => navigate('/apply-reimbursement')}
          className="w-full sm:w-auto bg-status-success-light text-status-success hover:bg-status-success hover:text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 shadow-sm border border-status-success-light flex items-center justify-center gap-2"
        >
          <Wallet className="h-4 w-4" /> Apply Reimbursement
        </button>
      </div>
    </div>
  );
};
