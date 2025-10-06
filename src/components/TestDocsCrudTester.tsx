"use client";

import { useEffect, useMemo, useState } from 'react';

type TestDoc = {
  _id: string;
  title: string;
  note?: string;
};

export default function TestDocsCrudTester() {
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
    <div style={{ marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
      <h2>TestDocs CRUD Tester</h2>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
        />
        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}
        />
        {!isEditing ? (
          <button onClick={createDoc} disabled={loading || !title} style={{ padding: '8px 12px' }}>
            Create
          </button>
        ) : (
          <>
            <button onClick={() => editId && updateDoc(editId)} disabled={loading || !title} style={{ padding: '8px 12px' }}>
              Save
            </button>
            <button onClick={cancelEdit} disabled={loading} style={{ padding: '8px 12px' }}>
              Cancel
            </button>
          </>
        )}
        <button onClick={refresh} disabled={loading} style={{ padding: '8px 12px' }}>Refresh</button>
      </div>

      {error && (
        <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div>
      )}

      <ul style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        {docs.map((doc) => (
          <li key={doc._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ minWidth: 200 }}>
              <strong>{doc.title}</strong>{doc.note ? ` — ${doc.note}` : ''}
            </span>
            <button onClick={() => startEdit(doc)} disabled={loading} style={{ padding: '4px 8px' }}>Edit</button>
            <button onClick={() => deleteDoc(doc._id)} disabled={loading} style={{ padding: '4px 8px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
