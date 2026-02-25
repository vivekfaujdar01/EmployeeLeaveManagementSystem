import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Wallet, Clock, LogOut, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeContext } from '../lib/ThemeContext';
import { StatCard, ActivityItem, statusIcon } from '../components/shared';
import { DashboardWelcome } from '../components/dashboard/DashboardWelcome';
import { DashboardActivityChart } from '../components/dashboard/DashboardActivityChart';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { setRole } = useThemeContext();
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.user?.role === 'manager' || parsedUser.user?.role === 'admin') {
        navigate('/manager-dashboard');
      } else {
        setUser(parsedUser);
        fetchDashboardData();
      }
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const [leavesRes, reimbRes] = await Promise.all([
        api.get('/leaves/my'),
        api.get('/reimbursements/my'),
      ]);
      setLeaves(leavesRes.data || []);
      setReimbursements(reimbRes.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setRole('employee');
    navigate('/login');
  };

  const handleCancel = async (id, type) => {
    if (!window.confirm(`Are you sure you want to cancel this ${type?.toLowerCase()} request?`)) return;
    setLoading(true);
    try {
      await api.delete(type === 'Leave' ? `/leaves/${id}` : `/reimbursements/${id}`);
      toast.success(`${type} cancelled successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to cancel ${type}`);
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Total Leaves Taken', count: leaves.filter(l => l.status === 'approved').length },
    { name: 'Pending Leaves', count: leaves.filter(l => l.status === 'pending').length },
    { name: 'Reimb (Pending)', count: reimbursements.filter(r => r.status === 'pending').length },
    { name: 'Reimb (Approved)', count: reimbursements.filter(r => r.status === 'approved').length },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-main-bg flex flex-col transition-colors duration-300">
      <header className="bg-card-bg border-b border-border-color sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl text-text-main hidden sm:block">EMS Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                {user.user?.name?.charAt(0) || 'U'}
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-text-sec hover:text-status-error transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <DashboardWelcome user={user.user} titlePrefix="Welcome back" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="Total Leaves Taken" value={`${leaves.filter(l => l.status === 'approved').length} Days`} icon={<CalendarDays className="h-6 w-6 text-indigo-600" />} trend="Approved" color="bg-indigo-50" loading={loading} />
          <StatCard title="Pending Leaves" value={leaves.filter(l => l.status === 'pending').length} icon={<Clock className="h-6 w-6 text-amber-600" />} trend="Awaiting Review" color="bg-amber-50" loading={loading} />
          <StatCard title="Reimbursements (Pending)" value={`₹${reimbursements.filter(r => r.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0)}`} icon={<Wallet className="h-6 w-6 text-amber-600" />} trend={`${reimbursements.filter(r => r.status === 'pending').length} Items`} color="bg-amber-50" loading={loading} />
          <StatCard title="Reimbursements (Approved)" value={`₹${reimbursements.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0)}`} icon={<CheckCircle className="h-6 w-6 text-emerald-600" />} trend="Paid" color="bg-emerald-50" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <DashboardActivityChart title="Activity Overview" data={chartData} barColor="#3B82F6" />

          <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 transition-colors duration-300">
            <h2 className="text-lg font-bold text-text-main mb-6">Recent Activity</h2>
            {loading ? (
              <div className="text-center py-6 text-text-muted animate-pulse">Loading activity...</div>
            ) : (
              <div className="space-y-4">
                {[...leaves.map(l => ({ ...l, type: 'Leave' })), ...reimbursements.map(r => ({ ...r, type: 'Reimbursement' }))]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 4)
                  .map((item, index) => (
                    <ActivityItem
                      key={index}
                      icon={statusIcon(item.status)}
                      title={`${item.type} ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`}
                      time={new Date(item.createdAt).toLocaleDateString()}
                      desc={item.type === 'Leave' ? `${item.leaveType} requested.` : `₹${item.amount} for ${item.title}.`}
                      isPending={item.status === 'pending'}
                      onCancel={() => handleCancel(item._id, item.type)}
                    />
                  ))}
                {leaves.length === 0 && reimbursements.length === 0 && (
                  <div className="text-center py-6 text-text-muted">No recent activity.</div>
                )}
              </div>
            )}
            <button className="w-full mt-6 py-2.5 text-sm font-medium text-brand-primary hover:text-brand-hover hover:bg-brand-light rounded-lg transition-colors border border-transparent hover:border-brand-light">
              View All Activity
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
