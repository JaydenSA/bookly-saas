import mongoose, { Schema } from 'mongoose';

const WorkingHoursSchema = new Schema({
  mon: { type: [String], default: [] },
  tue: { type: [String], default: [] },
  wed: { type: [String], default: [] },
  thu: { type: [String], default: [] },
  fri: { type: [String], default: [] },
  sat: { type: [String], default: [] },
  sun: { type: [String], default: [] },
}, { _id: false });

const BusinessSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  address: { type: String },
  description: { type: String },
  logoUrl: { type: String },
  workingHours: { type: WorkingHoursSchema, default: () => ({}) },
  timezone: { type: String },
  depositPercentage: { type: Number, default: 0 },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  payfastMerchantId: { type: String },
  ozowApiKey: { type: String },
}, { timestamps: true });

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
