import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  kindeUserId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  role: { type: String, enum: ['owner', 'staff'], required: true },
  businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  // 
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  planExpirationDate: { type: Date },
  payfastCustomerId: { type: String },
  payfastSubscriptionId: { type: String },
  payfastSubscriptionStatus: { type: String, enum: ['active', 'inactive', 'past_due', 'canceled', 'unpaid'], default: 'inactive' },
  payfastSubscriptionCancelAtPeriodEnd: { type: Boolean, default: false },
  payfastSubscriptionCancelAt: { type: Date },
  payfastSubscriptionCanceledAt: { type: Date },
  payfastSubscriptionCurrentPeriodStart: { type: Date },
  payfastSubscriptionCurrentPeriodEnd: { type: Date },
  payfastSubscriptionEndedAt: { type: Date },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
