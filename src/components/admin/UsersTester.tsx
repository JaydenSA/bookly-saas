"use client";

import { useEffect, useState } from 'react';

type User = {
  _id: string;
  kindeUserId: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  businessId?: string;
  phone?: string;
  createdAt: string;
};

export default function UsersTester() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kindeUserId: '',
    name: '',
    email: '',
    role: 'staff' as 'owner' | 'staff',
    businessId: '',
    phone: '',
  });

  const isEditing = Boolean(editId);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `GET failed: ${res.status}`);
      setUsers(json.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `POST failed: ${res.status}`);
      resetForm();
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `PUT failed: ${res.status}`);
      setEditId(null);
      resetForm();
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        let message = `DELETE failed: ${res.status}`;
        try { const j = await res.json(); message = j?.message || message; } catch {}
        throw new Error(message);
      }
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function startEdit(user: User) {
    setEditId(user._id);
    setFormData({
      kindeUserId: user.kindeUserId,
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId || '',
      phone: user.phone || '',
    });
  }

  function cancelEdit() {
    setEditId(null);
    resetForm();
  }

  function resetForm() {
    setFormData({
      kindeUserId: '',
      name: '',
      email: '',
      role: 'staff',
      businessId: '',
      phone: '',
    });
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Users Management</h2>
          <p className="page-subtitle">Manage system users and their permissions</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="btn-action btn-refresh"
        >
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Form */}
      <div className="form-container">
        <h3 className="form-title">
          <svg className="form-title-icon icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isEditing ? 'Edit User' : 'Create New User'}
        </h3>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">
              Kinde User ID *
            </label>
            <input
              type="text"
              value={formData.kindeUserId}
              onChange={(e) => setFormData({ ...formData, kindeUserId: e.target.value })}
              className="form-input"
              placeholder="kinde_user_123"
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="John Doe"
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="john@example.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'owner' | 'staff' })}
              className="form-select"
            >
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">
              Business ID
            </label>
            <input
              type="text"
              value={formData.businessId}
              onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
              className="form-input"
              placeholder="Business ObjectId"
            />
          </div>
          <div className="form-field">
            <label className="form-label">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
              placeholder="+1234567890"
            />
          </div>
        </div>
        <div className="form-actions">
          {!isEditing ? (
            <button
              onClick={createUser}
              disabled={loading || !formData.kindeUserId || !formData.name || !formData.email}
              className="btn btn-success"
            >
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create User</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => editId && updateUser(editId)}
                disabled={loading || !formData.kindeUserId || !formData.name || !formData.email}
                className="btn btn-primary"
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </button>
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="btn btn-secondary"
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-inline">
          <div className="error-inline-content">
            <svg className="error-inline-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="error-inline-text">{error}</div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="admin-card-title">
            <svg className="admin-card-title-icon icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Users ({users.length})
          </h3>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">
                  User
                </th>
                <th className="table-header-cell-sm">
                  Role
                </th>
                <th className="table-header-cell-sm">
                  Business ID
                </th>
                <th className="table-header-cell-sm">
                  Phone
                </th>
                <th className="table-header-cell-sm">
                  Created
                </th>
                <th className="table-header-cell-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {users.map((user) => (
                <tr key={user._id} className="table-row">
                  <td className="table-cell">
                    <div className="table-user-info">
                      <div className="table-avatar">
                        <span className="table-avatar-text">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="table-user-details">{user.name}</div>
                        <div className="table-user-meta">{user.email}</div>
                        <div className="table-user-id">{user.kindeUserId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell-sm">
                    <span className={`role-badge ${
                      user.role === 'owner' ? 'role-badge-owner' : 'role-badge-staff'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="table-cell-sm text-secondary font-medium">
                    {user.businessId || '-'}
                  </td>
                  <td className="table-cell-sm text-secondary font-medium">
                    {user.phone || '-'}
                  </td>
                  <td className="table-cell-sm text-tertiary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell-sm font-medium space-x-3">
                    <button
                      onClick={() => startEdit(user)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-800 disabled:text-blue-300 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 disabled:text-red-300 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="empty-state-title">No users found</p>
              <p className="empty-state-subtitle">Create your first user above to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
