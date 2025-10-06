import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import TestDoc from '@/models/TestDoc';
import TestDocsCrudTester from '@/components/TestDocsCrudTester';

export default async function TestPage() {
  let connected = false;
  let pingOk = false;
  let count: number | null = null;
  let errorMessage: string | null = null;

  try {
    await dbConnect();
    connected = mongoose.connection.readyState === 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (mongoose.connection as any).db.admin();
    const ping = await admin.command({ ping: 1 });
    pingOk = ping?.ok === 1;
    count = await TestDoc.countDocuments();
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1>MongoDB Test</h1>
      <div style={{ marginTop: 12 }}>
        <p><strong>MONGODB_URI set:</strong> {process.env.MONGODB_URI ? 'Yes' : 'No'}</p>
        <p><strong>Connected:</strong> {connected ? 'Yes' : 'No'}</p>
        <p><strong>Ping OK:</strong> {pingOk ? 'Yes' : 'No'}</p>
        <p><strong>TestDoc count:</strong> {count ?? 'N/A'}</p>
      </div>
      {errorMessage && (
        <pre style={{ marginTop: 16, color: '#b00020', whiteSpace: 'pre-wrap' }}>
{errorMessage}
        </pre>
      )}
      <p style={{ marginTop: 16, opacity: 0.8 }}>
        If using mongodb+srv, do not include a port. URL-encode credential special characters.
      </p>
      <TestDocsCrudTester />
    </div>
  );
}
