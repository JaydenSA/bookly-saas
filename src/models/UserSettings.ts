import mongoose, { Schema } from 'mongoose';

const UserSettingsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false },
  },
  appearance: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  },
}, { timestamps: true });

export default mongoose.models.UserSettings || mongoose.model('UserSettings', UserSettingsSchema);
