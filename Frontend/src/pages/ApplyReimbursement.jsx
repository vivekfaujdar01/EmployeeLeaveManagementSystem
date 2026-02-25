import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, FileText, Loader2, ArrowLeft, Upload, IndianRupee, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';

const ApplyReimbursement = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Travel',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const categories = ['Travel', 'Food', 'Medical', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreviewURL(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Must use FormData because we are uploading a file (billImage)
      const data = new FormData();
      data.append('title', formData.title);
      data.append('amount', formData.amount);
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (file) {
        data.append('billImage', file);
      }

      await api.post('/reimbursements', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Reimbursement request submitted successfully!');
      
      const role = JSON.parse(localStorage.getItem('user'))?.user?.role;
      navigate(role === 'manager' || role === 'admin' ? '/manager-dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit reimbursement request');
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

      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 mb-10">
        
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
            <div className="p-3 bg-status-success-light text-status-success rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Request Reimbursement</h1>
              <p className="text-sm text-text-sec">Submit an expense claim with supporting documents.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="title">
                Expense Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-3 border border-border-color rounded-lg bg-main-bg text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200"
                placeholder="E.g. Client Lunch Meeting"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200 bg-main-bg text-text-main"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="amount">
                  Amount (<IndianRupee className="inline h-3 w-3" />)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-text-muted" />
                  </div>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-3 pl-9 border border-border-color rounded-lg bg-main-bg text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200 placeholder-text-muted"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-text-sec mb-1" htmlFor="description">
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-text-muted" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-border-color rounded-lg bg-main-bg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors duration-200 resize-none"
                  placeholder="Additional details about this expense..."
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-text-sec mb-1">
                Attach Bill / Receipt (Required)
              </label>
              
              {!previewURL ? (
                <div 
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-color border-dashed rounded-lg bg-main-bg hover:border-brand-primary hover:bg-brand-light transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-text-muted" />
                    <div className="flex text-sm text-text-sec justify-center">
                      <span className="relative rounded-md font-medium text-brand-primary hover:text-brand-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-text-muted">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative mt-2 rounded-lg border border-border-color p-2 bg-main-bg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={previewURL} alt="Preview" className="h-12 w-12 object-cover rounded shadow-sm border border-border-color" />
                      <div className="truncate text-sm font-medium text-text-main">
                        {file?.name}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 bg-card-bg text-text-sec hover:text-status-error hover:bg-status-error-light rounded-md transition-colors border border-border-color shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/jpg, image/webp"
              />
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
                disabled={loading || !file}
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

export default ApplyReimbursement;
