import React from 'react';
import { CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { StatusBadge } from './AdminBadges';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ReimbursementsTab = ({ reimbursements, statusFilter, onFilterChange, actionLoading, onAction }) => (
  <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color overflow-hidden transition-colors duration-300">
    <div className="p-6 border-b border-border-color bg-sec-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-text-main">All Reimbursements ({reimbursements.length})</h2>
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
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Approved By</th>
            <th className="px-6 py-4">Bill</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {reimbursements.map((reimb) => (
            <tr key={reimb._id} className="hover:bg-sec-card-bg transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-text-main">{reimb.employeeId?.name || 'Unknown'}</p>
                <p className="text-xs text-text-muted">{reimb.employeeId?.department || ''}</p>
              </td>
              <td className="px-6 py-4 text-sm text-text-main font-medium">{reimb.title}</td>
              <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{reimb.amount.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium bg-main-bg border border-border-color text-text-sec px-2 py-0.5 rounded-full">
                  {reimb.category}
                </span>
              </td>
              <td className="px-6 py-4"><StatusBadge status={reimb.status} /></td>
              <td className="px-6 py-4 text-sm text-text-sec">{reimb.approvedBy?.name || '—'}</td>
              <td className="px-6 py-4">
                {reimb.billImage ? (
                  <a href={`${API_BASE_URL}/uploads/${reimb.billImage}`} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-brand-hover transition-colors" title="View bill">
                    <FileText className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {reimb.status === 'pending' ? (
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onAction(reimb._id, 'approve')} disabled={actionLoading === reimb._id} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                      {actionLoading === reimb._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    </button>
                    <button onClick={() => onAction(reimb._id, 'reject')} disabled={actionLoading === reimb._id} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                      {actionLoading === reimb._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
          {reimbursements.length === 0 && (
            <tr><td colSpan={8} className="px-6 py-12 text-center text-text-muted">No reimbursements found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ReimbursementsTab;
