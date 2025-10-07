import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import TestDoc from '@/models/TestDoc';
import User from '@/models/User';
import Business from '@/models/Business';
import Service from '@/models/Service';
import Booking from '@/models/Booking';
import Payment from '@/models/Payment';
import AdminPanel from '@/components/AdminPanel';

export default async function AdminPage() {
  let connected = false;
  let pingOk = false;
  let count: number | null = null;
  let userCount: number | null = null;
  let businessCount: number | null = null;
  let serviceCount: number | null = null;
  let bookingCount: number | null = null;
  let paymentCount: number | null = null;
  let errorMessage: string | null = null;

  try {
    await dbConnect();
    connected = mongoose.connection.readyState === 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = (mongoose.connection as any).db.admin();
    const ping = await admin.command({ ping: 1 });
    pingOk = ping?.ok === 1;
    count = await TestDoc.countDocuments();
    userCount = await User.countDocuments();
    businessCount = await Business.countDocuments();
    serviceCount = await Service.countDocuments();
    bookingCount = await Booking.countDocuments();
    paymentCount = await Payment.countDocuments();
  } catch (err: unknown) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  return (
    <AdminPanel
      connected={connected}
      pingOk={pingOk}
      testDocCount={count}
      userCount={userCount}
      businessCount={businessCount}
      serviceCount={serviceCount}
      bookingCount={bookingCount}
      paymentCount={paymentCount}
      errorMessage={errorMessage}
    />
  );
}
