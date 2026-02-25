import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, FileText, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const leaveTypes = [
    'Sick Leave', 
    'Casual Leave', 
    'Annual Leave', 
    'Maternity Leave', 
    'Paternity Leave', 
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/leaves', formData);
      toast.success('Leave request submitted successfully!');
      
      const role = JSON.parse(localStorage.getItem('user'))?.user?.role;
      navigate(role === 'manager' || role === 'admin' ? '/manager-dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg flex flex-col pt-10 transition-colors duration-300">
      {/* Top right theme toggle for consistency */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-text-sec hover:text-text-main transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Form Card */}
        <div className="bg-card-bg p-8 rounded-2xl shadow-sm border border-border-color transition-colors duration-300">
          <div className="flex items-center gap-4 border-b border-border-color pb-6 mb-6">
            <div className="p-3 bg-brand-light text-brand-primary rounded-xl">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Apply for Leave</h1>
              <p className="text-sm text-text-sec">Submit a new leave request for manager approval.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="leaveType">
                Leave Type
              </label>
              <select
                id="leaveType"
                name="leaveType"
                required
                value={formData.leaveType}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200 bg-main-bg text-text-main"
              >
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  min={today}
                  value={formData.startDate}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-border-color rounded-lg bg-main-bg text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="endDate">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  min={formData.startDate || today}
                  value={formData.endDate}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-border-color rounded-lg bg-main-bg text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                />
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="reason">
                Reason
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-text-muted" />
                </div>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-border-color rounded-lg bg-main-bg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200 resize-none"
                  placeholder="Detail the reason for your leave..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border-color flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border border-border-color rounded-lg text-sm font-medium text-text-main bg-card-bg hover:bg-sec-card-bg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-brand-primary hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Submit Request
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
