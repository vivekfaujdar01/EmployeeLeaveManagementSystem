import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';
import { useThemeContext } from '../lib/ThemeContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', adminSecret: '' });
  const [isAdminEmail, setIsAdminEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const navigate = useNavigate();
  const { setRole } = useThemeContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailBlur = async () => {
    if (!formData.email) {
      setIsAdminEmail(false);
      return;
    }
    
    setCheckingEmail(true);
    try {
      const response = await api.post('/auth/check-email', { email: formData.email });
      setIsAdminEmail(response.data.role === 'admin');
    } catch (error) {
      setIsAdminEmail(false);
      // Ignore errors when user not found or bad request
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      const role = response.data.user?.role;
      setRole(role || 'employee');
      
      toast.success('Logged in successfully!');
      
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'manager') {
        navigate('/manager-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg pt-16 px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full gap-6 bg-card-bg p-8 md:p-10 rounded-2xl shadow-md border border-border-color transition-colors duration-300">
        <div className="mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
            <Lock className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-main tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-sec">
            Welcome back to the EMS Portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                  onBlur={handleEmailBlur}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-border-color text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                  placeholder="Employee Email"
                />
                {checkingEmail && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Loader2 className="h-4 w-4 text-text-muted animate-spin" />
                  </div>
                )}
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
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-border-color text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isAdminEmail && (
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
                    required={isAdminEmail}
                    value={formData.adminSecret}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-10 bg-main-bg border border-status-error text-text-main rounded-xl placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-status-error focus:border-status-error sm:text-sm transition-colors duration-200"
                    placeholder="Enter the master secret"
                  />
                </div>
                <p className="mt-1 text-xs text-status-error opacity-80">Required to login as an administrator.</p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || checkingEmail}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-primary hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-text-sec">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-brand-primary hover:text-brand-hover transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

