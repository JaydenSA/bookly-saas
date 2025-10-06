import mongoose from 'mongoose';

const TestDocSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String },
}, { timestamps: true });

export default mongoose.models.TestDoc || mongoose.model('TestDoc', TestDocSchema);
