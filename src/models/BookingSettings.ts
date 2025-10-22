import mongoose, { Schema } from 'mongoose';

const DayScheduleSchema = new Schema({
  enabled: { type: Boolean, default: true },
  open: { type: String, default: '09:00' },
  close: { type: String, default: '17:00' },
});

const BookingSettingsSchema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true, unique: true, index: true },
  slotIntervalMinutes: { type: Number, default: 30, min: 5 },
  leadTimeMinutes: { type: Number, default: 0, min: 0 },
  days: {
    sunday: { type: DayScheduleSchema, default: () => ({ enabled: false, open: '09:00', close: '17:00' }) },
    monday: { type: DayScheduleSchema, default: () => ({ enabled: true, open: '09:00', close: '17:00' }) },
    tuesday: { type: DayScheduleSchema, default: () => ({ enabled: true, open: '09:00', close: '17:00' }) },
    wednesday: { type: DayScheduleSchema, default: () => ({ enabled: true, open: '09:00', close: '17:00' }) },
    thursday: { type: DayScheduleSchema, default: () => ({ enabled: true, open: '09:00', close: '17:00' }) },
    friday: { type: DayScheduleSchema, default: () => ({ enabled: true, open: '09:00', close: '17:00' }) },
    saturday: { type: DayScheduleSchema, default: () => ({ enabled: false, open: '09:00', close: '17:00' }) },
  },
  blackoutDates: [{ type: String }],
}, { timestamps: true });

let BookingSettingsModel = mongoose.models.BookingSettings as mongoose.Model<any> | undefined;

if (!BookingSettingsModel) {
  BookingSettingsModel = mongoose.model('BookingSettings', BookingSettingsSchema);
}

export default BookingSettingsModel;


