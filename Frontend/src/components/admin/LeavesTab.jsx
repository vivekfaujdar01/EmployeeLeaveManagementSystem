import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { StatusBadge } from './AdminBadges';

const LeavesTab = ({ leaves, statusFilter, onFilterChange, actionLoading, onAction }) => (
  <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color overflow-hidden transition-colors duration-300">
    <div className="p-6 border-b border-border-color bg-sec-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-text-main">All Leave Requests ({leaves.length})</h2>
      <select
        value={statusFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-3 py-2 border border-border-color bg-main-bg text-text-main rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-semibold text-text-sec uppercase tracking-wider border-b border-border-color bg-main-bg">
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">From</th>
            <th className="px-6 py-4">To</th>
            <th className="px-6 py-4">Reason</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Approved By</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {leaves.map((leave) => (
            <tr key={leave._id} className="hover:bg-sec-card-bg transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-text-main">{leave.employeeId?.name || 'Unknown'}</p>
                <p className="text-xs text-text-muted">{leave.employeeId?.department || ''}</p>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  {leave.leaveType}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-text-sec">{new Date(leave.startDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-text-sec">{new Date(leave.endDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-text-sec max-w-[200px] truncate" title={leave.reason}>{leave.reason}</td>
              <td className="px-6 py-4"><StatusBadge status={leave.status} /></td>
              <td className="px-6 py-4 text-sm text-text-sec">{leave.approvedBy?.name || '—'}</td>
              <td className="px-6 py-4 text-right">
                {leave.status === 'pending' ? (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onAction(leave._id, 'approve')} disabled={actionLoading === leave._id} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                      {actionLoading === leave._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button onClick={() => onAction(leave._id, 'reject')} disabled={actionLoading === leave._id} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                      {actionLoading === leave._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
          {leaves.length === 0 && (
            <tr><td colSpan={8} className="px-6 py-12 text-center text-text-muted">No leave requests found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default LeavesTab;
