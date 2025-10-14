import mongoose, { Schema } from 'mongoose';

const StaffInviteSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true, index: true },
  role: { 
    type: String, 
    enum: ['staff'], 
    default: 'staff' 
  },
  permissions: {
    canManageServices: { type: Boolean, default: false },
    canManageBookings: { type: Boolean, default: true },
    canManageCustomers: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageStaff: { type: Boolean, default: false },
    canManageBusiness: { type: Boolean, default: false },
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'expired'], 
    default: 'pending' 
  },
  token: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  acceptedAt: { type: Date },
  declinedAt: { type: Date },
  acceptedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Index for finding active invites by business and email
StaffInviteSchema.index({ businessId: 1, email: 1, status: 1 });
StaffInviteSchema.index({ token: 1 }, { unique: true });

export default mongoose.models.StaffInvite || mongoose.model('StaffInvite', StaffInviteSchema);
