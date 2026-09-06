import mongoose from 'mongoose'

const EmissionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    sector: { type: String, required: true },
    activityType: { type: String, required: true },
    scope: { type: String, enum: ['Scope 1', 'Scope 2', 'Scope 3'], required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    emissions: { type: Number, required: true },
    status: { type: String, default: 'Verified' },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Emission || mongoose.model('Emission', EmissionSchema)
