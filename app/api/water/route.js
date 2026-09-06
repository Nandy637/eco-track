import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import WaterReading from '@/models/WaterReading'
import { initialWaterLedger } from '@/data/mockData'
import { verifyAuth, hasPermission } from '@/lib/auth'

export async function GET() {
  try {
    await connectToDatabase()

    const count = await WaterReading.countDocuments()
    if (count === 0) {
      await WaterReading.insertMany(initialWaterLedger)
    }

    const readings = await WaterReading.find().sort({ createdAt: -1, date: -1 }).lean()

    return NextResponse.json({
      success: true,
      data: readings,
      source: 'mongodb',
    })
  } catch (error) {
    console.warn('MongoDB connection failed in GET /api/water. Using fallback data.', error.message)
    return NextResponse.json({
      success: true,
      data: initialWaterLedger,
      source: 'fallback',
    })
  }
}

export async function POST(request) {
  try {
    // 1. Verify caller identity & role permissions
    const auth = await verifyAuth(request)
    if (!hasPermission(auth.role, 'log_water')) {
      return NextResponse.json(
        {
          success: false,
          error: `Access Denied: ${auth.user?.roleTitle || 'Your role'} has read-only access and cannot submit water meter readings.`,
          requiredPermission: 'log_water',
          currentRole: auth.role,
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { date, facility, type, volume, qualityIndex = 'Standard' } = body

    const num = parseFloat(volume)
    if (isNaN(num) || num <= 0) {
      return NextResponse.json(
        { success: false, error: 'Volume must be a positive number.' },
        { status: 400 }
      )
    }

    const newReading = {
      id: `WAT-${Date.now().toString().slice(-4)}`,
      date: date || new Date().toISOString().split('T')[0],
      facility: facility || 'Advanced Fabrication Plant A',
      type: type || 'Municipal Intake',
      volume: num,
      unit: 'm³',
      cost: `$${Math.round(num * 2.5).toLocaleString()}`,
      qualityIndex,
    }

    try {
      await connectToDatabase()
      const created = await WaterReading.create(newReading)
      return NextResponse.json(
        { success: true, data: created, source: 'mongodb' },
        { status: 201 }
      )
    } catch (dbError) {
      console.warn('MongoDB save failed for water reading.', dbError.message)
      return NextResponse.json(
        { success: true, data: newReading, source: 'memory-fallback' },
        { status: 201 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing water reading.' },
      { status: 500 }
    )
  }
}
