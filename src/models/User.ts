import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  kindeUserId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['owner', 'staff'], required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
