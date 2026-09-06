import mongoose from 'mongoose'

const ActivitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    type: { type: String, enum: ['good', 'warn'], default: 'good' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema)
