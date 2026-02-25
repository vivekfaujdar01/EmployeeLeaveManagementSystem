import { CheckCircle, XCircle, Clock } from 'lucide-react';

// Shared stat card used in Employee, Manager, and Admin dashboards
export const StatCard = ({ title, value, icon, trend, color, loading }) => (
  <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-border-color hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-text-sec bg-main-bg px-2.5 py-1 rounded-full">{trend}</span>
    </div>
    <div className="mt-4">
      <h3 className="text-text-sec text-sm font-medium">{title}</h3>
      {loading ? (
        <div className="h-8 w-16 bg-sec-card-bg animate-pulse rounded mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-text-main mt-1">{value}</p>
      )}
    </div>
  </div>
);

// Shared activity feed item used in Employee and Manager dashboards
export const ActivityItem = ({ icon, title, time, desc, isPending, onCancel }) => (
  <div className="flex items-start justify-between gap-4 p-3 hover:bg-sec-card-bg rounded-xl transition-colors">
    <div className="flex gap-4">
      <div className="mt-1 shrink-0 bg-card-bg shadow-sm p-2 rounded-lg border border-border-color">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-text-main">{title}</h4>
        <p className="text-xs text-text-muted mt-0.5 mb-1">{time}</p>
        <p className="text-sm text-text-sec">{desc}</p>
      </div>
    </div>
    {isPending && (
      <button
        onClick={onCancel}
        className="text-xs font-semibold text-status-error bg-status-error-light hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
      >
        Cancel
      </button>
    )}
  </div>
);

// Returns the right icon for a given status string
export const statusIcon = (status) => {
  if (status === 'approved') return <CheckCircle className="h-5 w-5 text-emerald-500" />;
  if (status === 'rejected') return <XCircle className="h-5 w-5 text-red-500" />;
  return <Clock className="h-5 w-5 text-amber-500" />;
};
