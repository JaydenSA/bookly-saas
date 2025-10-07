import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  gateway: { type: String, enum: ['payfast', 'ozow', 'eft'], required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  transactionRef: { type: String, index: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
