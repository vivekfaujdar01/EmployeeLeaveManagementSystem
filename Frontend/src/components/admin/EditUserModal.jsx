import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const EditUserModal = ({ user, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    role: user.role || 'employee',
    department: user.department || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user._id, form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-in fade-in transition-colors duration-300 border border-border-color">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-sec-card-bg transition-colors">
          <X className="h-5 w-5 text-text-sec" />
        </button>

        <h3 className="text-lg font-bold text-text-main mb-1">Edit User</h3>
        <p className="text-sm text-text-sec mb-6">{user.email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-border-color bg-main-bg text-text-main rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 border border-border-color bg-main-bg text-text-main rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-colors"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Department</label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full px-3 py-2.5 border border-border-color bg-main-bg text-text-main rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-text-main bg-sec-card-bg hover:bg-border-color rounded-lg transition-colors border border-border-color">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-brand-primary hover:bg-brand-hover rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
