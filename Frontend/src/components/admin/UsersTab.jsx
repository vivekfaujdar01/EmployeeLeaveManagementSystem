import React from 'react';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { RoleBadge } from './AdminBadges';

const UsersTab = ({ users, allUsers, userSearch, onSearchChange, onEdit, onDelete, actionLoading, currentUserId }) => (
  <div className="bg-card-bg rounded-2xl shadow-sm border border-border-color overflow-hidden transition-colors duration-300">
    <div className="p-6 border-b border-border-color bg-sec-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-text-main">User Management ({users.length})</h2>
      <input
        type="text"
        placeholder="Search by name, email, or role…"
        value={userSearch}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-72 px-3 py-2 border border-border-color bg-main-bg text-text-main rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-colors"
      />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-semibold text-text-sec uppercase tracking-wider border-b border-border-color bg-main-bg">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4">Joined</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-sec-card-bg transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {u.name?.charAt(0) || '?'}
                  </div>
                  <span className="font-medium text-text-main text-sm">{u.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-text-sec">{u.email}</td>
              <td className="px-6 py-4"><RoleBadge role={u.role} /></td>
              <td className="px-6 py-4 text-sm text-text-sec">{u.department || '—'}</td>
              <td className="px-6 py-4 text-sm text-text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(u)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit user">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(u._id, u.name)}
                    disabled={actionLoading === u._id || u._id === currentUserId}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={u._id === currentUserId ? 'Cannot delete yourself' : 'Delete user'}
                  >
                    {actionLoading === u._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-12 text-center text-text-muted">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersTab;
