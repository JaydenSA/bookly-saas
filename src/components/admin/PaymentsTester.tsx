"use client";

import { useEffect, useState } from 'react';

type Payment = {
  _id: string;
  bookingId: string;
  gateway: 'payfast' | 'ozow' | 'eft';
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionRef?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function PaymentsTester() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bookingId: '',
    gateway: 'payfast' as 'payfast' | 'ozow' | 'eft',
    amount: 0,
    status: 'pending' as 'pending' | 'success' | 'failed' | 'refunded',
    transactionRef: '',
    date: '',
  });

  const isEditing = Boolean(editId);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payments', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `GET failed: ${res.status}`);
      setPayments(json.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createPayment() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payments', {
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

  async function updatePayment(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/${id}`, {
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

  async function deletePayment(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
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

  function startEdit(payment: Payment) {
    setEditId(payment._id);
    setFormData({
      bookingId: payment.bookingId,
      gateway: payment.gateway,
      amount: payment.amount,
      status: payment.status,
      transactionRef: payment.transactionRef || '',
      date: new Date(payment.date).toISOString().slice(0, 16),
    });
  }

  function cancelEdit() {
    setEditId(null);
    resetForm();
  }

  function resetForm() {
    setFormData({
      bookingId: '',
      gateway: 'payfast',
      amount: 0,
      status: 'pending',
      transactionRef: '',
      date: '',
    });
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  const gatewayColors = {
    payfast: 'bg-blue-100 text-blue-800',
    ozow: 'bg-purple-100 text-purple-800',
    eft: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Payments Management</h2>
          <p className="page-subtitle">Track and manage payment transactions</p>
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
          <svg className="form-title-icon icon-primary" fill ="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isEditing ? 'Edit Payment' : 'Create New Payment'}
        </h3>
        <div className="form-grid">
          <div>
            <label className="form-label">
              Booking ID *
            </label>
            <input
              type="text"
              value={formData.bookingId}
              onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
              className="form-input"
              placeholder="Booking ObjectId"
            />
          </div>
          <div>
            <label className="form-label">
              Gateway *
            </label>
            <select
              value={formData.gateway}
              onChange={(e) => setFormData({ ...formData, gateway: e.target.value as any })}
              className="form-select"
            >
              <option value="payfast">PayFast</option>
              <option value="ozow">Ozow</option>
              <option value="eft">EFT</option>
            </select>
          </div>
          <div>
            <label className="form-label">
              Amount (ZAR) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="form-input"
              placeholder="150.00"
            />
          </div>
          <div>
            <label className="form-label">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="form-select"
            >
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="form-label">
              Transaction Reference
            </label>
            <input
              type="text"
              value={formData.transactionRef}
              onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
              className="form-input"
              placeholder="TXN123456789"
            />
          </div>
          <div>
            <label className="form-label">
              Payment Date
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-actions">
          {!isEditing ? (
            <button
              onClick={createPayment}
              disabled={loading || !formData.bookingId || formData.amount <= 0}
              className="btn btn-success"
            >
              Create Payment
            </button>
          ) : (
            <>
              <button
                onClick={() => editId && updatePayment(editId)}
                disabled={loading || !formData.bookingId || formData.amount <= 0}
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

      {/* Payments List */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="admin-card-title">
            <svg className="admin-card-title-icon icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Payments ({payments.length})
          </h3>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell-sm">
                  Booking ID
                </th>
                <th className="table-header-cell-sm">
                  Gateway
                </th>
                <th className="table-header-cell-sm">
                  Amount
                </th>
                <th className="table-header-cell-sm">
                  Status
                </th>
                <th className="table-header-cell-sm">
                  Transaction Ref
                </th>
                <th className="table-header-cell-sm">
                  Date
                </th>
                <th className="table-header-cell-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {payments.map((payment) => (
                <tr key={payment._id} className="table-row">
                  <td className="table-cell-sm text-secondary font-medium">
                    {payment.bookingId}
                  </td>
                  <td className="table-cell-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${gatewayColors[payment.gateway]}`}>
                      {payment.gateway.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-cell-sm text-secondary font-medium">
                    R{payment.amount.toFixed(2)}
                  </td>
                  <td className="table-cell-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="table-cell-sm text-secondary font-medium">
                    {payment.transactionRef || '-'}
                  </td>
                  <td className="table-cell-sm">
                    <div className="text-sm text-primary">
                      {new Date(payment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-secondary">
                      {new Date(payment.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="table-cell-sm text-sm font-medium space-x-2">
                    <button
                      onClick={() => startEdit(payment)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-900 disabled:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePayment(payment._id)}
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
          {payments.length === 0 && (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="empty-state-title">No payments found</p>
              <p className="empty-state-subtitle">Create your first payment above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
