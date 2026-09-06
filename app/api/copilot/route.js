import { NextResponse } from 'next/server'
import {
  detectAnomalies,
  getDecarbonizationAdvice,
  processCopilotQuery,
} from '@/lib/copilotEngine'
import { sectors, initialEmissionsLedger, monthlyWaterData } from '@/data/mockData'
import { connectToDatabase } from '@/lib/mongodb'
import Emission from '@/models/Emission'
import WaterReading from '@/models/WaterReading'

export async function GET() {
  try {
    let ledger = initialEmissionsLedger
    let water = monthlyWaterData

    try {
      await connectToDatabase()
      const dbEmissions = await Emission.find().sort({ createdAt: -1 }).limit(50).lean()
      if (dbEmissions.length > 0) ledger = dbEmissions

      const dbWater = await WaterReading.find().sort({ createdAt: -1 }).limit(20).lean()
      if (dbWater.length > 0) water = dbWater
    } catch (dbErr) {
      console.warn('MongoDB query in copilot failed, using mock telemetry.', dbErr.message)
    }

    const anomalies = detectAnomalies({ sectors, ledger, waterData: water })
    const advice = getDecarbonizationAdvice()

    return NextResponse.json({
      success: true,
      data: {
        anomalies,
        advice,
        summary: {
          totalAnomalies: anomalies.length,
          criticalCount: anomalies.filter((a) => a.severity === 'critical').length,
          potentialSavingsCO2: '63.0 tCO₂e',
        },
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing copilot analysis.' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { message, context = {} } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query message is required.' },
        { status: 400 }
      )
    }

    const mergedContext = {
      sectors,
      totalEmissions: '2,847',
      ...context,
    }

    const response = processCopilotQuery(message, mergedContext)

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error executing copilot query.' },
      { status: 500 }
    )
  }
}
