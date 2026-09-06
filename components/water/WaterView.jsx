'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  AlertTriangle,
  Check,
  Download,
  Droplets,
  Plus,
  Recycle,
  ShieldCheck,
  Waves,
  X,
} from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import StatusBadge from '@/components/ui-cards/StatusBadge'
import { exportToCsv } from '@/lib/exportCsv'
import {
  monthlyWaterData,
  facilityWaterData,
  initialWaterLedger,
} from '@/data/mockData'

export default function WaterView() {
  const [ledger, setLedger] = useState(initialWaterLedger)
  const [facilities, setFacilities] = useState(facilityWaterData)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch persistent records from API
  useEffect(() => {
    fetch('/api/water')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setLedger(json.data)
        }
      })
      .catch((err) => console.warn('Using cached water readings', err))
  }, [])

  // Form State
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]?.name || '')
  const [readingType, setReadingType] = useState('Municipal Intake')
  const [volume, setVolume] = useState('')
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0])
  const [qualityIndex, setQualityIndex] = useState('Potable Grade A')

  // Totals
  const totalWithdrawal = 12450
  const totalRecycled = 3820
  const recyclingRate = ((totalRecycled / totalWithdrawal) * 100).toFixed(1)

  const handleExportWaterCsv = () => {
    const data = ledger.map((r) => ({
      ReadingID: r.id,
      Date: r.date,
      Facility: r.facility,
      Type: r.type,
      Volume_m3: r.volume,
      QualityClassification: r.qualityIndex,
      Cost: r.cost,
    }))
    exportToCsv('ecotrack-water-consumption-audit', data)
  }

  const handleAddReading = async (e) => {
    e.preventDefault()
    const num = parseFloat(volume)
    if (isNaN(num) || num <= 0) return

    const payload = {
      date: readingDate,
      facility: selectedFacility,
      type: readingType,
      volume: num,
      qualityIndex,
    }

    try {
      const res = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (result.success && result.data) {
        setLedger((prev) => [result.data, ...prev])
      } else {
        const fallback = {
          id: `WAT-${Date.now().toString().slice(-4)}`,
          ...payload,
          unit: 'm³',
          cost: `$${Math.round(num * 2.5).toLocaleString()}`,
        }
        setLedger((prev) => [fallback, ...prev])
      }
    } catch (err) {
      console.warn('Water POST failed, saving locally', err)
      const fallback = {
        id: `WAT-${Date.now().toString().slice(-4)}`,
        ...payload,
        unit: 'm³',
        cost: `$${Math.round(num * 2.5).toLocaleString()}`,
      }
      setLedger((prev) => [fallback, ...prev])
    }

    setModalOpen(false)
    setVolume('')
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600">
            NATURAL RESOURCE STEWARDSHIP
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Water Consumption & Circularity
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportWaterCsv}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download size={14} />
            Export Audit
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-cyan-700 transition"
          >
            <Plus size={15} />
            Log Reading
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5 border-l-4 border-l-cyan-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Withdrawal
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
              <Droplets size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalWithdrawal.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-500">m³</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Target: ≤ 14,000 m³</span>
            <span className="font-semibold text-emerald-600">Within Cap</span>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recycled & Reused
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Recycle size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {totalRecycled.toLocaleString()}{' '}
            <span className="text-xs font-medium text-slate-500">m³</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Circularity Index</span>
            <span className="font-semibold text-teal-700">{recyclingRate}% Reused</span>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Discharge Compliance
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            99.2% <span className="text-xs font-medium text-slate-500">Passing</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>EU Water & EPA Cap</span>
            <span className="font-semibold text-emerald-600">100% Monitored</span>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Facility Intensity
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Waves size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            14.2 <span className="text-xs font-medium text-slate-500">m³/FTE</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Annual Improvement</span>
            <span className="font-semibold text-emerald-600">↓ 8.2% YoY</span>
          </div>
        </Card>
      </div>

      {/* Water Chart: Monthly Withdrawal vs Recycled */}
      <Card className="p-5 lg:p-6">
        <SectionTitle
          title="Monthly Water Withdrawal & Recycling Volume"
          subtitle="Direct municipal tap intake vs recycled process cooling loop (m³)"
        />
        <div className="mt-5 h-[270px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyWaterData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="waterWithdrawal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="waterRecycled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EEF2F1" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                domain={[0, 1300]}
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12 }}
                formatter={(val, name) => [
                  `${val} m³`,
                  name === 'withdrawal' ? 'Municipal Withdrawal' : 'Recycled Water',
                ]}
              />
              <Area
                type="monotone"
                dataKey="withdrawal"
                stroke="#06B6D4"
                strokeWidth={2.5}
                fill="url(#waterWithdrawal)"
              />
              <Area
                type="monotone"
                dataKey="recycled"
                stroke="#14B8A6"
                strokeWidth={2}
                fill="url(#waterRecycled)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-cyan-500" />
            Municipal Intake
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-teal-500" />
            Recycled & Reused
          </span>
          <span className="ml-auto hidden text-slate-400 sm:block">Unit: Cubic Meters (m³)</span>
        </div>
      </Card>

      {/* Facility Stress Risk & Ledger Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Facility Breakdown */}
        <Card className="p-5 lg:p-6">
          <SectionTitle
            title="Facility Water Stress Assessment"
            subtitle="Catchment basin risk and localized circularity indices"
          />
          <div className="mt-5 space-y-4">
            {facilities.map((fac) => {
              const isHigh = fac.stressLevel === 'High'
              const isMed = fac.stressLevel === 'Medium'
              return (
                <div
                  key={fac.id}
                  className="rounded-xl border border-slate-100 p-3.5 hover:bg-slate-50/50 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{fac.name}</p>
                      <p className="text-[11px] text-slate-400">{fac.location}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        isHigh
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : isMed
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {fac.stressLevel} Basin Stress
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-400">Withdrawal</span>
                      <p className="font-semibold text-slate-700">{fac.withdrawal}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Recycled</span>
                      <p className="font-semibold text-teal-700">{fac.rate}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Intensity</span>
                      <p className="font-semibold text-slate-700">{fac.intensity}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Meter Readings Ledger */}
        <Card className="overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-slate-100">
            <SectionTitle
              title="Recent Water Audit Readings"
              subtitle="Direct submeter intakes and testing records"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Volume</th>
                  <th className="px-4 py-3 font-semibold">Quality Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 font-mono text-slate-700 font-semibold">{row.id}</td>
                    <td className="px-3 py-3.5 text-slate-500">{row.date}</td>
                    <td className="px-3 py-3.5 font-medium text-slate-800">{row.type}</td>
                    <td className="px-3 py-3.5 font-mono text-slate-700 font-bold">
                      {row.volume} m³
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-emerald-700 font-medium">
                      {row.qualityIndex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal: Log Water Reading */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <Droplets size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Log Water Reading</h3>
                  <p className="text-xs text-slate-500">Record municipal intake or recycled loop</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddReading} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-800 outline-none"
                >
                  {facilities.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={readingType}
                    onChange={(e) => setReadingType(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-slate-800 outline-none"
                  >
                    <option>Municipal Intake</option>
                    <option>Greywater Recycled</option>
                    <option>Treated Discharge</option>
                    <option>Rainwater Harvested</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Volume (m³)</label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    placeholder="e.g. 240"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    required
                    className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  required
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quality / Loop</label>
                <input
                  type="text"
                  value={qualityIndex}
                  onChange={(e) => setQualityIndex(e.target.value)}
                  placeholder="e.g. Process Cooling Loop Grade B"
                  className="w-full h-9 rounded-lg border border-slate-200 px-3 text-slate-800 outline-none"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-9 rounded-lg border border-slate-200 px-3.5 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-cyan-600 px-4 font-semibold text-white hover:bg-cyan-700"
                >
                  <Check size={14} />
                  Record Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
