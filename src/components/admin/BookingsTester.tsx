"use client";

import { useEffect, useState } from 'react';

type Client = {
  name: string;
  phone?: string;
  email?: string;
};

type Booking = {
  _id: string;
  businessId: string;
  client: Client;
  serviceId: string;
  staffId?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';
  totalPrice: number;
  depositAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function BookingsTester() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessId: '',
    serviceId: '',
    staffId: '',
    date: '',
    totalPrice: 0,
    depositAmount: 0,
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    paymentStatus: 'unpaid' as 'unpaid' | 'deposit_paid' | 'paid' | 'refunded',
    notes: '',
    client: {
      name: '',
      phone: '',
      email: '',
    },
  });

  const isEditing = Boolean(editId);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `GET failed: ${res.status}`);
      setBookings(json.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createBooking() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
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

  async function updateBooking(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
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

  async function deleteBooking(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
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

  function startEdit(booking: Booking) {
    setEditId(booking._id);
    setFormData({
      businessId: booking.businessId,
      serviceId: booking.serviceId,
      staffId: booking.staffId || '',
      date: new Date(booking.date).toISOString().slice(0, 16),
      totalPrice: booking.totalPrice,
      depositAmount: booking.depositAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes || '',
      client: {
        name: booking.client.name,
        phone: booking.client.phone || '',
        email: booking.client.email || '',
      },
    });
  }

  function cancelEdit() {
    setEditId(null);
    resetForm();
  }

  function resetForm() {
    setFormData({
      businessId: '',
      serviceId: '',
      staffId: '',
      date: '',
      totalPrice: 0,
      depositAmount: 0,
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: '',
      client: {
        name: '',
        phone: '',
        email: '',
      },
    });
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const paymentStatusColors = {
    unpaid: 'bg-red-100 text-red-800',
    deposit_paid: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Bookings Management</h2>
          <p className="page-subtitle">Manage customer bookings and appointments</p>
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
          {isEditing ? 'Edit Booking' : 'Create New Booking'}
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
              Service ID *
            </label>
            <input
              type="text"
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="form-input"
              placeholder="Service ObjectId"
            />
          </div>
          <div>
            <label className="form-label">
              Staff ID
            </label>
            <input
              type="text"
              value={formData.staffId}
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
              className="form-input"
              placeholder="Staff ObjectId"
            />
          </div>
          <div>
            <label className="form-label">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.client.name}
              onChange={(e) => setFormData({ 
                ...formData, 
                client: { ...formData.client, name: e.target.value }
              })}
              className="form-input"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="form-label">
              Client Phone
            </label>
            <input
              type="text"
              value={formData.client.phone}
              onChange={(e) => setFormData({ 
                ...formData, 
                client: { ...formData.client, phone: e.target.value }
              })}
              className="form-input"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="form-label">
              Client Email
            </label>
            <input
              type="email"
              value={formData.client.email}
              onChange={(e) => setFormData({ 
                ...formData, 
                client: { ...formData.client, email: e.target.value }
              })}
              className="form-input"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="form-label">
              Total Price (ZAR) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.totalPrice}
              onChange={(e) => setFormData({ ...formData, totalPrice: Number(e.target.value) })}
              className="form-input"
              placeholder="150.00"
            />
          </div>
          <div>
            <label className="form-label">
              Deposit Amount (ZAR)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.depositAmount}
              onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
              className="form-input"
              placeholder="50.00"
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
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="form-label">
              Payment Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
              className="form-select"
            >
              <option value="unpaid">Unpaid</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="form-label">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="form-textarea"
              placeholder="Booking notes..."
            />
          </div>
        </div>
        <div className="form-actions">
          {!isEditing ? (
            <button
              onClick={createBooking}
              disabled={loading || !formData.businessId || !formData.serviceId || !formData.date || !formData.client.name || formData.totalPrice <= 0}
              className="btn btn-success"
            >
              Create Booking
            </button>
          ) : (
            <>
              <button
                onClick={() => editId && updateBooking(editId)}
                disabled={loading || !formData.businessId || !formData.serviceId || !formData.date || !formData.client.name || formData.totalPrice <= 0}
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

      {/* Bookings List */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="admin-card-title">
            <svg className="admin-card-title-icon icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Bookings ({bookings.length})
          </h3>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell-sm">
                  Client
                </th>
                <th className="table-header-cell-sm">
                  Date
                </th>
                <th className="table-header-cell-sm">
                  Service/Business
                </th>
                <th className="table-header-cell-sm">
                  Price
                </th>
                <th className="table-header-cell-sm">
                  Status
                </th>
                <th className="table-header-cell-sm">
                  Payment
                </th>
                <th className="table-header-cell-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {bookings.map((booking) => (
                <tr key={booking._id} className="table-row">
                  <td className="table-cell-sm">
                    <div>
                      <div className="table-user-details">{booking.client.name}</div>
                      <div className="table-user-meta">{booking.client.email || booking.client.phone || 'No contact'}</div>
                    </div>
                  </td>
                  <td className="table-cell-sm">
                    <div className="text-sm text-primary">
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-secondary">
                      {new Date(booking.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="table-cell-sm">
                    <div className="text-sm text-primary">Service: {booking.serviceId}</div>
                    <div className="text-sm text-secondary">Business: {booking.businessId}</div>
                  </td>
                  <td className="table-cell-sm">
                    <div className="text-sm text-primary">R{booking.totalPrice.toFixed(2)}</div>
                    {booking.depositAmount > 0 && (
                      <div className="text-sm text-secondary">Deposit: R{booking.depositAmount.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="table-cell-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="table-cell-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[booking.paymentStatus]}`}>
                      {booking.paymentStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="table-cell-sm text-sm font-medium space-x-2">
                    <button
                      onClick={() => startEdit(booking)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-900 disabled:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBooking(booking._id)}
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
          {bookings.length === 0 && (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="empty-state-title">No bookings found</p>
              <p className="empty-state-subtitle">Create your first booking above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
