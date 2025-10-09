"use client";

import { useEffect, useState } from 'react';
import { Service } from '@/types';

export default function ServicesTester() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessId: '',
    name: '',
    description: '',
    price: 0,
    duration: 0,
    depositRequired: false,
  });

  const isEditing = Boolean(editId);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `GET failed: ${res.status}`);
      setServices(json.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createService() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/services', {
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

  async function updateService(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/services/${id}`, {
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

  async function deleteService(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
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

  function startEdit(service: Service) {
    setEditId(service._id);
    setFormData({
      businessId: service.businessId,
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      depositRequired: service.depositRequired,
    });
  }

  function cancelEdit() {
    setEditId(null);
    resetForm();
  }

  function resetForm() {
    setFormData({
      businessId: '',
      name: '',
      description: '',
      price: 0,
      duration: 0,
      depositRequired: false,
    });
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Services Management</h2>
          <p className="page-subtitle">Manage business services and pricing</p>
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
          <svg className="form-title-icon general-icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isEditing ? 'Edit Service' : 'Create New Service'}
        </h3>
        <div className="form-grid">
          <div>
            <label className="form-label">
              Business ID *
            </label>
            <input
              type="text"
              value={formData.businessId}
              onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
              className="form-input"
              placeholder="Business ObjectId"
            />
          </div>
          <div>
            <label className="form-label">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Haircut"
            />
          </div>
          <div>
            <label className="form-label">
              Price (ZAR) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="form-input"
              placeholder="150.00"
            />
          </div>
          <div>
            <label className="form-label">
              Duration (minutes) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="form-input"
              placeholder="30"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="form-textarea"
              placeholder="Service description..."
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="depositRequired"
              checked={formData.depositRequired}
              onChange={(e) => setFormData({ ...formData, depositRequired: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="depositRequired" className="ml-2 block text-sm text-gray-900">
              Deposit Required
            </label>
          </div>
        </div>
        <div className="form-actions">
          {!isEditing ? (
            <button
              onClick={createService}
              disabled={loading || !formData.businessId || !formData.name || formData.price <= 0 || formData.duration <= 0}
              className="btn btn-success"
            >
              Create Service
            </button>
          ) : (
            <>
              <button
                onClick={() => editId && updateService(editId)}
                disabled={loading || !formData.businessId || !formData.name || formData.price <= 0 || formData.duration <= 0}
                className="btn btn-primary"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="btn btn-secondary"
              >
                Cancel
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

      {/* Services List */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="admin-card-title">
            <svg className="admin-card-title-icon general-icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Services ({services.length})
          </h3>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell-sm">
                  Service
                </th>
                <th className="table-header-cell-sm">
                  Business ID
                </th>
                <th className="table-header-cell-sm">
                  Price
                </th>
                <th className="table-header-cell-sm">
                  Duration
                </th>
                <th className="table-header-cell-sm">
                  Deposit
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
              {services.map((service) => (
                <tr key={service._id} className="table-row">
                  <td className="table-cell-sm">
                    <div>
                      <div className="table-user-details">{service.name}</div>
                      <div className="table-user-meta">{service.description || 'No description'}</div>
                    </div>
                  </td>
                  <td className="table-cell-sm general-text-secondary font-medium">
                    {service.businessId}
                  </td>
                  <td className="table-cell-sm general-text-secondary font-medium">
                    R{service.price.toFixed(2)}
                  </td>
                  <td className="table-cell-sm general-text-secondary font-medium">
                    {service.duration} min
                  </td>
                  <td className="table-cell-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.depositRequired ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.depositRequired ? 'Required' : 'Not Required'}
                    </span>
                  </td>
                  <td className="table-cell-sm text-tertiary">
                    {new Date(service.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell-sm font-medium space-x-2">
                    <button
                      onClick={() => startEdit(service)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-900 disabled:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(service._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 disabled:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="empty-state-title">No services found</p>
              <p className="empty-state-subtitle">Create your first service above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
