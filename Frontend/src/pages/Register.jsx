import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeContext } from '../lib/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRole } = useThemeContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Update theme dynamically when user selects role during registration
    if (e.target.name === 'role') {
      setRole(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      const role = response.data.user?.role;
      setRole(role || 'employee');
      toast.success('Registration successful!');
      
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg pt-8 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full gap-6 bg-card-bg p-8 md:p-10 rounded-2xl shadow-md border border-border-color transition-colors duration-300">
        <div className="mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light transition-colors">
            <CheckCircle2 className="h-8 w-8 text-brand-primary transition-colors" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-main tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-text-sec">
            Join the EMS Portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1" htmlFor="name">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-border-color text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1" htmlFor="email">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-border-color text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                  placeholder="employee@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-border-color text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1" htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 bg-main-bg border border-border-color text-text-main rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1" htmlFor="department">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-text-muted" />
                  </div>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-9 bg-main-bg border border-border-color text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                    placeholder="Engineering"
                  />
                </div>
              </div>
            </div>

            {/* Secret key for Admin registration */}
            {formData.role === 'admin' && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium text-status-error mb-1" htmlFor="adminSecret">Admin Secret Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-status-error opacity-70" />
                  </div>
                  <input
                    id="adminSecret"
                    name="adminSecret"
                    type="password"
                    required={formData.role === 'admin'}
                    value={formData.adminSecret || ''}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-status-error text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-status-error focus:border-status-error sm:text-sm transition-colors duration-200"
                    placeholder="Enter the master secret"
                  />
                </div>
                <p className="mt-1 text-xs text-status-error opacity-80">Required to register an administrator account.</p>
              </div>
            )}
            
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-primary hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-text-sec">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-brand-primary hover:text-brand-hover transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

