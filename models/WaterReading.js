import mongoose from 'mongoose'

const WaterReadingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    facility: { type: String, required: true },
    type: { type: String, required: true },
    volume: { type: Number, required: true },
    unit: { type: String, default: 'm³' },
    cost: { type: String, default: '$0' },
    qualityIndex: { type: String, default: 'Standard' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.WaterReading || mongoose.model('WaterReading', WaterReadingSchema)
