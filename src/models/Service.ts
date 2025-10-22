import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  depositRequired: { type: Boolean, default: false },
  // Staff assignments - which staff members can perform this service
  staffIds: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
}, { timestamps: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ServiceModel = mongoose.models.Service as mongoose.Model<any> | undefined;

if (ServiceModel) {
  // In dev with HMR, the model may be cached without the new field. Ensure it's present.
  if (!ServiceModel.schema.path('staffIds')) {
    ServiceModel.schema.add({ staffIds: [{ type: Schema.Types.ObjectId, ref: 'Staff' }] });
  }
} else {
  ServiceModel = mongoose.model('Service', ServiceSchema);
}

export default ServiceModel;
