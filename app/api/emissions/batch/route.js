import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Emission from '@/models/Emission'
import Activity from '@/models/Activity'
import { calculateEmissions, EMISSION_ACTIVITIES } from '@/lib/emissions'

export async function POST(request) {
  try {
    const body = await request.json()
    const { records } = body

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Records array is required and must not be empty.' },
        { status: 400 }
      )
    }

    const validActivityNames = Object.keys(EMISSION_ACTIVITIES)
    const processedRecords = []
    const rejectedRows = []
    let totalBatchEmissions = 0

    records.forEach((rec, index) => {
      const num = parseFloat(rec.quantity)
      const isValidActivity = validActivityNames.includes(rec.activityType)

      if (!isValidActivity || isNaN(num) || num <= 0) {
        rejectedRows.push({
          index: index + 1,
          record: rec,
          reason: !isValidActivity
            ? `Invalid activity '${rec.activityType}'`
            : 'Quantity must be a positive number',
        })
        return
      }

      // Re-execute formula server-side to guarantee audit compliance
      const calculation = calculateEmissions(rec.activityType, num)
      totalBatchEmissions += calculation.tCO2e

      const doc = {
        id: `EM-${Date.now().toString().slice(-4)}${index}`,
        date: rec.date || new Date().toISOString().split('T')[0],
        sector: rec.sector || 'Manufacturing',
        activityType: rec.activityType,
        scope: calculation.scope,
        quantity: num,
        unit: calculation.unit,
        emissions: calculation.tCO2e,
        status: 'Verified',
        notes: rec.notes || 'Batch Ingested',
      }

      processedRecords.push(doc)
    })

    if (processedRecords.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid records found in the uploaded batch.',
          rejected: rejectedRows,
        },
        { status: 422 }
      )
    }

    totalBatchEmissions = Number(totalBatchEmissions.toFixed(2))

    try {
      await connectToDatabase()

      const inserted = await Emission.insertMany(processedRecords)

      // Log batch activity
      await Activity.create({
        id: `act-${Date.now()}`,
        text: `Batch ingested ${processedRecords.length} utility records totaling ${totalBatchEmissions} tCO₂e`,
        time: 'Just now',
        type: 'good',
      })

      return NextResponse.json(
        {
          success: true,
          count: inserted.length,
          totalEmissions: totalBatchEmissions,
          data: inserted,
          rejected: rejectedRows,
          source: 'mongodb',
        },
        { status: 201 }
      )
    } catch (dbError) {
      console.warn('MongoDB batch insert failed, serving memory fallback.', dbError.message)
      return NextResponse.json(
        {
          success: true,
          count: processedRecords.length,
          totalEmissions: totalBatchEmissions,
          data: processedRecords,
          rejected: rejectedRows,
          source: 'memory-fallback',
        },
        { status: 201 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing batch.' },
      { status: 500 }
    )
  }
}
