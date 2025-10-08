import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  depositRequired: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
