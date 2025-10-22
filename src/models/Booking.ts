import mongoose, { Schema } from 'mongoose';

const ClientSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
}, { _id: false });

const BookingSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, // User who made the booking
  client: { type: ClientSchema, required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  staffId: { type: Schema.Types.ObjectId, ref: 'Staff' }, // Changed from User to Staff
  date: { type: Date, required: true, index: true },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true }, // e.g., "10:00"
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'deposit_paid', 'paid', 'refunded'], default: 'unpaid' },
  totalPrice: { type: Number, required: true, min: 0 },
  depositAmount: { type: Number, default: 0, min: 0 },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
