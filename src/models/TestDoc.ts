import mongoose, { Schema } from 'mongoose';

const TestDocSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'general' },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.TestDoc || mongoose.model('TestDoc', TestDocSchema);
