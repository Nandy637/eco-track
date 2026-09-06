import { useState, useMemo } from 'react'
import { AlertCircle, Calculator, Check, X } from 'lucide-react'
import { EMISSION_ACTIVITIES, calculateEmissions } from '@/lib/emissions'

export default function EmissionForm({ sectors = [], isOpen, onClose, onSubmit }) {
  const activityKeys = Object.keys(EMISSION_ACTIVITIES)

  const [sector, setSector] = useState(sectors[0]?.name || 'Manufacturing')
  const [activityType, setActivityType] = useState(activityKeys[0])
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const calculation = useMemo(() => {
    return calculateEmissions(activityType, quantity)
  }, [activityType, quantity])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(quantity)
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid quantity greater than 0.')
      return
    }

    const newRecord = {
      id: `EM-${Date.now().toString().slice(-4)}`,
      date,
      sector,
      activityType,
      scope: calculation.scope,
      quantity: num,
      unit: calculation.unit,
      emissions: calculation.tCO2e,
      status: 'Verified',
      notes,
    }

    onSubmit(newRecord)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Calculator size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Log Emissions Activity</h3>
              <p className="text-xs text-slate-500">Record operational consumption & compute GHG emissions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Activity Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Operating Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {sectors.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Emission Source
              </label>
              <select
                value={activityType}
                onChange={(e) => {
                  setActivityType(e.target.value)
                  setError('')
                }}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {activityKeys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Consumption ({calculation.unit})
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                placeholder="e.g. 2500"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value)
                  setError('')
                }}
                required
                className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Real-time Calculation Preview Card */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="font-medium text-slate-700">GHG Scope Classification</span>
              <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
                {calculation.scope}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-2 border-t border-emerald-100/60">
              <span className="text-slate-500 text-[11px]">
                Factor: {calculation.factor} kg CO₂e / {calculation.unit}
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-slate-900">
                  {calculation.tCO2e.toLocaleString()}{' '}
                </span>
                <span className="text-xs font-semibold text-emerald-700">tCO₂e</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reference / Operational Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Fleet fuel batch #42 or utility invoice ID"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Check size={14} />
              Record Emission
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
