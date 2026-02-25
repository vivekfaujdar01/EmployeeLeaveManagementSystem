import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, CalendarDays, Wallet, BarChart3, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeContext } from '../lib/ThemeContext';
import EditUserModal from '../components/admin/EditUserModal';
import OverviewTab from '../components/admin/OverviewTab';
import UsersTab from '../components/admin/UsersTab';
import LeavesTab from '../components/admin/LeavesTab';
import ReimbursementsTab from '../components/admin/ReimbursementsTab';

const TABS = [
  { key: 'overview',label: 'Overview',icon: <BarChart3 className="h-4 w-4" /> },
  { key: 'users',label: 'Users',icon: <Users className="h-4 w-4" /> },
  { key: 'leaves',label: 'All Leaves',icon: <CalendarDays className="h-4 w-4" /> },
  { key: 'reimbursements',label: 'All Reimbursements',icon: <Wallet className="h-4 w-4" /> },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setRole } = useThemeContext();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [allReimbursements, setAllReimbursements] = useState([]);

  const [leaveStatusFilter, setLeaveStatusFilter] = useState('all');
  const [reimbStatusFilter, setReimbStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsed = JSON.parse(userData);
      if (parsed.user?.role !== 'admin') {
        navigate(parsed.user?.role === 'manager' ? '/manager-dashboard' : '/dashboard');
      } else {
        setUser(parsed);
        fetchAll();
      }
    }
  }, [navigate]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, leavesRes, reimbRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/leaves'),
        api.get('/reimbursements'),
      ]);
      setAllUsers(usersRes.data || []);
      setAllLeaves(leavesRes.data || []);
      setAllReimbursements(reimbRes.data || []);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      toast.error('Could not load admin data');
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

  const handleSaveUser = async (id, data) => {
    setSavingUser(true);
    try {
      await api.put(`/auth/users/${id}`, data);
      toast.success('User updated successfully');
      setEditingUser(null);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This removes all their leaves and reimbursements too.`)) return;
    setActionLoading(id);
    try {
      await api.delete(`/auth/users/${id}`);
      toast.success('User deleted successfully');
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveAction = async (id, action) => {
    setActionLoading(id);
    try {
      await api.put(`/leaves/${id}/${action}`);
      toast.success(`Leave ${action}d successfully`);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} leave`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReimbAction = async (id, action) => {
    setActionLoading(id);
    try {
      await api.put(`/reimbursements/${id}/${action}`);
      toast.success(`Reimbursement ${action}d successfully`);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} reimbursement`);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;

  const filteredLeaves = leaveStatusFilter === 'all' ? allLeaves : allLeaves.filter(l => l.status === leaveStatusFilter);
  const filteredReimbs = reimbStatusFilter === 'all' ? allReimbursements : allReimbursements.filter(r => r.status === reimbStatusFilter);
  const filteredUsers = userSearch
    ? allUsers.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearch.toLowerCase())
      )
    : allUsers;

  return (
    <div className="min-h-screen bg-main-bg flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-card-bg border-b border-border-color sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-text-main hidden sm:block">Admin Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-sm">
                {user.user?.name?.charAt(0) || 'A'}
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-text-sec hover:text-status-error transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card-bg p-6 sm:p-8 rounded-2xl shadow-sm border border-border-color transition-colors duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="h-20 w-20 rounded-full bg-linear-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-card-bg border border-border-color">
              {user.user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-main">Welcome, {user.user?.name || 'Admin'}</h1>
              <p className="mt-1 text-text-sec font-medium">ADMIN • System Administrator</p>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 bg-card-bg p-2 rounded-xl shadow-sm border border-border-color transition-colors duration-300">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.key ? 'bg-brand-primary text-white shadow-sm' : 'text-text-sec hover:bg-sec-card-bg hover:text-text-main'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === 'users' && !loading && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-brand-hover text-white' : 'bg-sec-card-bg text-text-sec'}`}>
                  {allUsers.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-text-muted" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab allUsers={allUsers} allLeaves={allLeaves} allReimbursements={allReimbursements} loading={loading} actionLoading={actionLoading} onLeaveAction={handleLeaveAction} onReimbAction={handleReimbAction}/>
            )}
            {activeTab === 'users' && (
              <UsersTab users={filteredUsers} userSearch={userSearch} onSearchChange={setUserSearch} onEdit={setEditingUser} onDelete={handleDeleteUser} actionLoading={actionLoading} currentUserId={user.user?._id}/>
            )}
            {activeTab === 'leaves' && (
              <LeavesTab leaves={filteredLeaves} statusFilter={leaveStatusFilter} onFilterChange={setLeaveStatusFilter} actionLoading={actionLoading} onAction={handleLeaveAction}/>
            )}
            {activeTab === 'reimbursements' && (
              <ReimbursementsTab reimbursements={filteredReimbs} statusFilter={reimbStatusFilter} onFilterChange={setReimbStatusFilter} actionLoading={actionLoading} onAction={handleReimbAction}/>
            )}
          </>
        )}
      </main>

      {editingUser && (<EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} saving={savingUser}/>)}
    </div>
  );
};

export default AdminDashboard;
