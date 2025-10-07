"use client";

import { useEffect, useMemo, useState } from 'react';

type TestDoc = {
  _id: string;
  title: string;
  note?: string;
};

export default function TestDocsTester() {
  const [docs, setDocs] = useState<TestDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const isEditing = useMemo(() => Boolean(editId), [editId]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/testdocs', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `GET failed: ${res.status}`);
      setDocs(json.data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createDoc() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/testdocs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `POST failed: ${res.status}`);
      setTitle("");
      setNote("");
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function updateDoc(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/testdocs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `PUT failed: ${res.status}`);
      setEditId(null);
      setTitle("");
      setNote("");
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  async function deleteDoc(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/testdocs/${id}`, { method: 'DELETE' });
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

  function startEdit(doc: TestDoc) {
    setEditId(doc._id);
    setTitle(doc.title);
    setNote(doc.note ?? "");
  }

  function cancelEdit() {
    setEditId(null);
    setTitle("");
    setNote("");
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Test Documents Management</h2>
          <p className="page-subtitle">Test API endpoints and database operations</p>
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
          {isEditing ? 'Edit Test Document' : 'Create New Test Document'}
        </h3>
        <div className="form-grid">
          <div>
            <label className="form-label">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Test Document Title"
            />
          </div>
          <div>
            <label className="form-label">
              Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-input"
              placeholder="Optional note"
            />
          </div>
        </div>
        <div className="form-actions">
          {!isEditing ? (
            <button
              onClick={createDoc}
              disabled={loading || !title}
              className="btn btn-success"
            >
              Create Document
            </button>
          ) : (
            <>
              <button
                onClick={() => editId && updateDoc(editId)}
                disabled={loading || !title}
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

      {/* Documents List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <svg className="admin-card-title-icon icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Test Documents ({docs.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {docs.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{doc.title}</h4>
                  {doc.note && (
                    <p className="text-sm text-gray-500 mt-1">{doc.note}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(doc)}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-900 disabled:text-blue-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDoc(doc._id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-900 disabled:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {docs.length === 0 && (
            <div className="empty-state">
              <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="empty-state-title">No test documents found</p>
              <p className="empty-state-subtitle">Create your first document above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
