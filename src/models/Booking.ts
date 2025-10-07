import mongoose, { Schema } from 'mongoose';

const ClientSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
}, { _id: false });

const BookingSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  client: { type: ClientSchema, required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  staffId: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'deposit_paid', 'paid', 'refunded'], default: 'unpaid' },
  totalPrice: { type: Number, required: true, min: 0 },
  depositAmount: { type: Number, default: 0, min: 0 },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
