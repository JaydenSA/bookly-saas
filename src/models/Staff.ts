import mongoose, { Schema } from 'mongoose';

const StaffSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String }, // e.g., "Hairstylist", "Massage Therapist", "Receptionist"
  bio: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  // Service assignments - which services this staff member can perform
  serviceIds: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);

