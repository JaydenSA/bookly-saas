import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  gateway: { 
    type: String, 
    enum: ['stripe', 'paypal', 'payfast'], 
    required: true 
  },
  gatewayTransactionId: { type: String },
  gatewayResponse: { type: Schema.Types.Mixed },
  paidAt: { type: Date },
  refundedAt: { type: Date },
  refundAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
