import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Emission from '@/models/Emission'
import Activity from '@/models/Activity'
import { recentActivity } from '@/data/mockData'

export async function GET() {
  try {
    await connectToDatabase()

    // Aggregate emissions by Scope
    const scopeAggregation = await Emission.aggregate([
      {
        $group: {
          _id: '$scope',
          totalEmissions: { $sum: '$emissions' },
          count: { $sum: 1 },
        },
      },
    ])

    let activities = await Activity.find().sort({ createdAt: -1 }).limit(10).lean()
    if (activities.length === 0) {
      activities = recentActivity
    }

    const scopeMap = { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 }
    let grandTotal = 0

    scopeAggregation.forEach((item) => {
      if (scopeMap[item._id] !== undefined) {
        scopeMap[item._id] = Number(item.totalEmissions.toFixed(2))
        grandTotal += item.totalEmissions
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalEmissions: Number(grandTotal.toFixed(2)) || 2847,
        scopeTotals: scopeMap,
        recentActivities: activities,
      },
      source: 'mongodb',
    })
  } catch (error) {
    console.warn('MongoDB aggregation failed in /api/dashboard/stats.', error.message)
    return NextResponse.json({
      success: true,
      data: {
        totalEmissions: 2847,
        scopeTotals: { 'Scope 1': 1708, 'Scope 2': 911, 'Scope 3': 228 },
        recentActivities: recentActivity,
      },
      source: 'fallback',
    })
  }
}
