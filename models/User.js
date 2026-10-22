import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'operator', 'auditor'], default: 'operator' },
    roleTitle: { type: String, default: 'Sustainability Officer' },
    department: { type: String, default: 'Sustainability Operations' },
    sector: { type: String, default: 'Facility Operations' },
    avatar: { type: String, default: 'US' },
    badgeTone: { type: String, default: 'emerald' },
    twoFactorEnabled: { type: Boolean, default: false },
    preferences: {
      standard: { type: String, default: 'IPCC AR6' },
      gwpMetric: { type: String, default: 'GWP-100' },
      gridFactor: { type: Number, default: 0.386 },
      anomalyAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      theme: { type: String, default: 'light' },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
