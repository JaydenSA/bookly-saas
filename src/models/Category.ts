import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String, default: '#007bff' }, // Default color
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
