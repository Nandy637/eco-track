import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Emission from '@/models/Emission'
import Activity from '@/models/Activity'
import { calculateEmissions } from '@/lib/emissions'
import { initialEmissionsLedger } from '@/data/mockData'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const scope = searchParams.get('scope')
  const sector = searchParams.get('sector')

  try {
    await connectToDatabase()

    // Auto-seed if empty
    const count = await Emission.countDocuments()
    if (count === 0) {
      await Emission.insertMany(initialEmissionsLedger)
    }

    const query = {}
    if (scope && scope !== 'All') query.scope = scope
    if (sector && sector !== 'All') query.sector = sector

    const records = await Emission.find(query).sort({ createdAt: -1, date: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: records,
      source: 'mongodb',
    })
  } catch (error) {
    console.warn('MongoDB connection failed or unavailable in GET /api/emissions. Using mock data.', error.message)

    let fallbackData = [...initialEmissionsLedger]
    if (scope && scope !== 'All') fallbackData = fallbackData.filter((r) => r.scope === scope)
    if (sector && sector !== 'All') fallbackData = fallbackData.filter((r) => r.sector === sector)

    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: 'fallback',
      message: 'MongoDB unavailable, serving fallback ledger.',
    })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { date, sector, activityType, quantity, notes = '' } = body

    const num = parseFloat(quantity)
    if (isNaN(num) || num <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a valid positive number.' },
        { status: 400 }
      )
    }

    // Enforce server-side calculation integrity
    const calculation = calculateEmissions(activityType, num)

    const newRecord = {
      id: `EM-${Date.now().toString().slice(-4)}`,
      date: date || new Date().toISOString().split('T')[0],
      sector: sector || 'Manufacturing',
      activityType: activityType || 'Fleet Diesel',
      scope: calculation.scope,
      quantity: num,
      unit: calculation.unit,
      emissions: calculation.tCO2e,
      status: 'Verified',
      notes,
    }

    try {
      await connectToDatabase()

      const created = await Emission.create(newRecord)

      // Create activity log
      await Activity.create({
        id: `act-${Date.now()}`,
        text: `Logged ${newRecord.emissions} tCO₂e (${newRecord.activityType}) for ${newRecord.sector}`,
        time: 'Just now',
        type: 'good',
      })

      return NextResponse.json(
        { success: true, data: created, source: 'mongodb' },
        { status: 201 }
      )
    } catch (dbError) {
      console.warn('MongoDB save failed, returning verified record to client.', dbError.message)
      return NextResponse.json(
        { success: true, data: newRecord, source: 'memory-fallback' },
        { status: 201 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing emission.' },
      { status: 500 }
    )
  }
}
