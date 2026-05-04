import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CalendarDays, Wallet, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeContext } from '../lib/ThemeContext';
import { StatCard, ActivityItem, statusIcon } from '../components/shared';
import { DashboardWelcome } from '../components/dashboard/DashboardWelcome';
import { DashboardActivityChart } from '../components/dashboard/DashboardActivityChart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { setRole } = useThemeContext();
  const [user, setUser] = useState(null);

  const [myLeaves, setMyLeaves] = useState([]);
  const [myReimbursements, setMyReimbursements] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingReimbursements, setPendingReimbursements] = useState([]);
  const [activeTab, setActiveTab] = useState('leaves');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.user?.role === 'employee') {
        navigate('/dashboard');
      } else if (parsedUser.user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        setUser(parsedUser);
        fetchDashboardData();
      }
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [myLeavesRes, myReimbRes, pLeavesRes, pReimbRes] = await Promise.all([
        api.get('/leaves/my'),
        api.get('/reimbursements/my'),
        api.get('/leaves/pending'),
        api.get('/reimbursements/pending'),
      ]);
      setMyLeaves(myLeavesRes.data || []);
      setMyReimbursements(myReimbRes.data || []);
      setPendingLeaves(pLeavesRes.data || []);
      setPendingReimbursements(pReimbRes.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Could not load dashboard data');
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

  const handleCancelOwnRequest = async (id, type) => {
    if (!window.confirm(`Are you sure you want to cancel your ${type?.toLowerCase()} request?`)) return;
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

  const handleAction = async (id, type, action) => {
    setActionLoading(id);
    try {
      await api.put(`/${type}/${id}/${action}`);
      toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)}d successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;

  const chartData = [
    { name: 'Total Leaves Taken', count: myLeaves.filter(l => l.status === 'approved').length },
    { name: 'My Pending Leaves', count: myLeaves.filter(l => l.status === 'pending').length },
    { name: 'My Reimb (Pending)', count: myReimbursements.filter(r => r.status === 'pending').length },
    { name: 'Team Leaves Pending', count: pendingLeaves.length },
    { name: 'Team Reimb Pending', count: pendingReimbursements.length },
  ];

  const ActionButtons = ({ id, type }) => (
    <div className="flex gap-3 mt-4 pt-4 border-t border-border-color">
      <button onClick={() => handleAction(id, type, 'approve')} disabled={actionLoading === id} className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1.5">
        {actionLoading === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Approve
      </button>
      <button onClick={() => handleAction(id, type, 'reject')} disabled={actionLoading === id} className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1.5">
        {actionLoading === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Reject
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-main-bg flex flex-col transition-colors duration-300">
      <header className="bg-card-bg border-b border-border-color sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-xl text-text-main hidden sm:block">Manager Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                {user.user?.name?.charAt(0) || 'M'}
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
        <DashboardWelcome user={user.user} titlePrefix="Welcome" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard title="My Approved Leaves" value={`${myLeaves.filter(l => l.status === 'approved').length} Days`} icon={<CalendarDays className="h-6 w-6 text-indigo-600" />} trend="Taken" color="bg-indigo-50" loading={loading} />
          <StatCard title="My Pending Leaves" value={myLeaves.filter(l => l.status === 'pending').length} icon={<Clock className="h-6 w-6 text-amber-600" />} trend="Awaiting Review" color="bg-amber-50" loading={loading} />
          <StatCard title="My Reimb. (Pending)" value={`₹${myReimbursements.filter(r => r.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0)}`} icon={<Wallet className="h-6 w-6 text-amber-600" />} trend={`${myReimbursements.filter(r => r.status === 'pending').length} Items`} color="bg-amber-50" loading={loading} />
          <StatCard title="My Reimb. (Approved)" value={`₹${myReimbursements.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0)}`} icon={<CheckCircle className="h-6 w-6 text-emerald-600" />} trend="Paid" color="bg-emerald-50" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <DashboardActivityChart title="Department Activity Overview" data={chartData} barColor="#4F46E5" />

          <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 flex flex-col transition-colors duration-300">
            <h2 className="text-lg font-bold text-text-main mb-6">My Recent Activity</h2>
            {loading ? (
              <div className="text-center py-6 text-text-muted animate-pulse">Loading activity...</div>
            ) : (
              <div className="space-y-4">
                {[...myLeaves.map(l => ({ ...l, type: 'Leave' })), ...myReimbursements.map(r => ({ ...r, type: 'Reimbursement' }))]
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
                      onCancel={() => handleCancelOwnRequest(item._id, item.type)}
                    />
                  ))}
                {myLeaves.length === 0 && myReimbursements.length === 0 && (
                  <div className="text-center py-6 text-text-muted">No recent activity.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Team Pending Approvals */}
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color overflow-hidden transition-colors duration-300">
          <div className="p-6 border-b border-border-color bg-main-bg flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-main">Pending Validations</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('leaves')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'leaves' ? 'bg-brand-primary text-white shadow-sm' : 'bg-card-bg text-text-sec border border-border-color hover:bg-sec-card-bg'}`}
              >
                Leaves ({pendingLeaves.length})
              </button>
              <button
                onClick={() => setActiveTab('reimbursements')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'reimbursements' ? 'bg-status-success text-white shadow-sm' : 'bg-card-bg text-text-sec border border-border-color hover:bg-sec-card-bg'}`}
              >
                Reimbursements ({pendingReimbursements.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'leaves' && (
                  pendingLeaves.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">No team leave requests pending your approval.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingLeaves.map((leave) => (
                        <div key={leave._id} className="bg-card-bg p-6 rounded-2xl shadow-sm border border-border-color flex flex-col justify-between hover:border-brand-primary transition-colors">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-text-main">{leave.employeeId?.name || 'Unknown Employee'}</h3>
                                <p className="text-xs text-text-sec">{leave.employeeId?.email}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-light text-brand-primary">
                                {leave.leaveType}
                              </span>
                            </div>
                            <div className="text-sm text-text-main mb-4 bg-main-bg p-3 rounded-lg border border-border-color">
                              <p><strong>From:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
                              <p><strong>To:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
                              <p className="mt-2 text-text-sec line-clamp-3">"{leave.reason}"</p>
                            </div>
                          </div>
                          <ActionButtons id={leave._id} type="leaves" />
                        </div>
                      ))}
                    </div>
                  )
                )}

                {activeTab === 'reimbursements' && (
                  pendingReimbursements.length === 0 ? (
                    <div className="text-center py-12 text-text-muted">No team reimbursement requests pending your approval.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingReimbursements.map((reimb) => (
                        <div key={reimb._id} className="bg-card-bg p-6 rounded-2xl shadow-sm border border-border-color flex flex-col justify-between hover:border-status-success transition-colors">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-text-main">{reimb.employeeId?.name || 'Unknown Employee'}</h3>
                                <p className="text-xs text-text-sec">{reimb.employeeId?.email}</p>
                              </div>
                              <span className="text-lg font-bold text-status-success">₹{reimb.amount}</span>
                            </div>
                            <div className="text-sm text-text-main mb-4 bg-main-bg p-3 rounded-lg border border-border-color space-y-2">
                              <div className="flex justify-between"><span className="text-text-sec">Category:</span><span className="font-medium">{reimb.category}</span></div>
                              <div className="flex justify-between"><span className="text-text-sec">Title:</span><span className="font-medium text-right">{reimb.title}</span></div>
                              {reimb.description && (
                                <div><span className="text-text-sec block mb-1">Description:</span><p className="text-text-muted italic text-xs">"{reimb.description}"</p></div>
                              )}
                            </div>
                            {reimb.billImage && (
                              <div className="mb-4">
                                <a
                                  href={`${API_BASE_URL}/uploads/${reimb.billImage}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm flex items-center gap-1.5 text-brand-primary hover:text-brand-hover transition-colors"
                                >
                                  <FileText className="h-4 w-4" /> View Attached Bill
                                </a>
                              </div>
                            )}
                          </div>
                          <ActionButtons id={reimb._id} type="reimbursements" />
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
