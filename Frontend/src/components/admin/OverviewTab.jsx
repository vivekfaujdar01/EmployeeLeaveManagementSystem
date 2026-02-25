import React from 'react';
import { Users, CalendarDays, Wallet, Clock, CheckCircle, XCircle, Loader2, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { StatCard } from '../shared';

const PIE_COLORS = ['#F59E0B', '#10B981', '#EF4444'];

const OverviewTab = ({ allUsers, allLeaves, allReimbursements, loading, actionLoading, onLeaveAction, onReimbAction }) => {
  const pendingLeaves = allLeaves.filter(l => l.status === 'pending');
  const pendingReimbs = allReimbursements.filter(r => r.status === 'pending');

  const leaveBarData = [
    { name: 'Pending',  count: pendingLeaves.length },
    { name: 'Approved', count: allLeaves.filter(l => l.status === 'approved').length },
    { name: 'Rejected', count: allLeaves.filter(l => l.status === 'rejected').length },
  ];

  const reimbPieData = [
    { name: 'Pending',  value: pendingReimbs.length },
    { name: 'Approved', value: allReimbursements.filter(r => r.status === 'approved').length },
    { name: 'Rejected', value: allReimbursements.filter(r => r.status === 'rejected').length },
  ].filter(d => d.value > 0);

  const roleCounts = [
    { name: 'Admins',    count: allUsers.filter(u => u.role === 'admin').length },
    { name: 'Managers',  count: allUsers.filter(u => u.role === 'manager').length },
    { name: 'Employees', count: allUsers.filter(u => u.role === 'employee').length },
  ];

  const chartTooltipStyle = { borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Users" value={allUsers.length} icon={<Users className="h-6 w-6 text-indigo-600" />} trend={`${roleCounts[1].count} Mgrs`} color="bg-indigo-50" loading={loading} />
        <StatCard title="Total Leaves" value={allLeaves.length} icon={<CalendarDays className="h-6 w-6 text-blue-600" />} trend={`${pendingLeaves.length} Pending`} color="bg-blue-50" loading={loading} />
        <StatCard title="Total Reimbursements" value={allReimbursements.length} icon={<Wallet className="h-6 w-6 text-emerald-600" />} trend={`₹${allReimbursements.reduce((a, r) => a + r.amount, 0).toLocaleString()}`} color="bg-emerald-50" loading={loading} />
        <StatCard title="Pending Approvals" value={pendingLeaves.length + pendingReimbs.length} icon={<Clock className="h-6 w-6 text-amber-600" />} trend="Needs Action" color="bg-amber-50" loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-text-main mb-4">Leaves by Status</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 14 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-text-main mb-4">Reimbursements Breakdown</h2>
          <div className="h-[280px]">
            {reimbPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reimbPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                    {reimbPieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">No data</div>
            )}
          </div>
        </div>

        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-text-main mb-4">Users by Role</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleCounts} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 13 }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} width={80} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 6, 6, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Quick-View */}
      {(pendingLeaves.length > 0 || pendingReimbs.length > 0) && (
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 transition-colors duration-300">
          <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            Items Requiring Attention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeaves.slice(0, 3).map(leave => (
              <div key={leave._id} className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                <div>
                  <p className="text-sm font-bold text-text-main">{leave.employeeId?.name || 'Unknown'} — {leave.leaveType}</p>
                  <p className="text-xs text-text-muted">{new Date(leave.startDate).toLocaleDateString()} → {new Date(leave.endDate).toLocaleDateString()}</p>
                </div>
                <QuickActions id={leave._id} actionLoading={actionLoading} onApprove={() => onLeaveAction(leave._id, 'approve')} onReject={() => onLeaveAction(leave._id, 'reject')} />
              </div>
            ))}
            {pendingReimbs.slice(0, 3).map(reimb => (
              <div key={reimb._id} className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                <div>
                  <p className="text-sm font-bold text-text-main">{reimb.employeeId?.name || 'Unknown'} — ₹{reimb.amount}</p>
                  <p className="text-xs text-text-muted">{reimb.title} ({reimb.category})</p>
                </div>
                <QuickActions id={reimb._id} actionLoading={actionLoading} onApprove={() => onReimbAction(reimb._id, 'approve')} onReject={() => onReimbAction(reimb._id, 'reject')} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const QuickActions = ({ id, actionLoading, onApprove, onReject }) => (
  <div className="flex gap-2">
    <button onClick={onApprove} disabled={actionLoading === id} className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors">
      {actionLoading === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 text-emerald-600" />}
    </button>
    <button onClick={onReject} disabled={actionLoading === id} className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
      {actionLoading === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 text-red-600" />}
    </button>
  </div>
);

export default OverviewTab;
