import { useState, useMemo } from 'react'
import {
  Activity,
  Download,
  Factory,
  Filter,
  Flame,
  Plus,
  Search,
  Truck,
  Zap,
} from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import StatusBadge from '@/components/ui-cards/StatusBadge'
import EmissionForm from './EmissionForm'
import { exportToCsv } from '@/lib/exportCsv'

export default function EmissionsView({
  ledger = [],
  onAddRecord = () => {},
  sectors = [],
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [scopeFilter, setScopeFilter] = useState('All')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Calculate scope aggregates dynamically
  const scopeTotals = useMemo(() => {
    let s1 = 0
    let s2 = 0
    let s3 = 0
    ledger.forEach((item) => {
      const val = Number(item.emissions) || 0
      if (item.scope === 'Scope 1') s1 += val
      else if (item.scope === 'Scope 2') s2 += val
      else if (item.scope === 'Scope 3') s3 += val
    })
    return {
      scope1: Number(s1.toFixed(2)),
      scope2: Number(s2.toFixed(2)),
      scope3: Number(s3.toFixed(2)),
      total: Number((s1 + s2 + s3).toFixed(2)),
    }
  }, [ledger])

  // Filter ledger rows
  const filteredLedger = useMemo(() => {
    return ledger.filter((row) => {
      const matchesScope = scopeFilter === 'All' || row.scope === scopeFilter
      const matchesSector = sectorFilter === 'All' || row.sector === sectorFilter
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        row.id.toLowerCase().includes(query) ||
        row.activityType.toLowerCase().includes(query) ||
        row.sector.toLowerCase().includes(query) ||
        (row.notes && row.notes.toLowerCase().includes(query))
      return matchesScope && matchesSector && matchesSearch
    })
  }, [ledger, scopeFilter, sectorFilter, search])

  const handleExportCsv = () => {
    const data = filteredLedger.map((r) => ({
      EntryID: r.id,
      Date: r.date,
      Sector: r.sector,
      Source: r.activityType,
      Scope: r.scope,
      Quantity: `${r.quantity} ${r.unit}`,
      Emissions_tCO2e: r.emissions,
      Status: r.status,
      Notes: r.notes || '',
    }))
    exportToCsv('ecotrack-emissions-ledger', data)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            GHG PROTOCOL COMPLIANT
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Emissions Ledger & Scope Breakdown
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download size={14} />
            Export Ledger
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Plus size={15} />
            Log Activity
          </button>
        </div>
      </div>

      {/* Scope Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Scope 1 · Direct
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Flame size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {scopeTotals.scope1.toLocaleString()} <span className="text-xs font-medium text-slate-500">tCO₂e</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Stationary gas combustion & fleet fuels
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Scope 2 · Market
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Zap size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {scopeTotals.scope2.toLocaleString()} <span className="text-xs font-medium text-slate-500">tCO₂e</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Purchased grid electricity & steam
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Scope 3 · Indirect
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Truck size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {scopeTotals.scope3.toLocaleString()} <span className="text-xs font-medium text-slate-500">tCO₂e</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-500">
            Municipal water supply & landfill waste
          </p>
        </Card>

        <Card className="p-5 bg-slate-900 text-white border-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Gross Footprint
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-800 text-emerald-400">
              <Activity size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {scopeTotals.total.toLocaleString()} <span className="text-xs font-medium text-slate-400">tCO₂e</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Across {ledger.length} verified reporting entries
          </p>
        </Card>
      </div>

      {/* Ledger Table & Controls */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 lg:p-6 border-b border-slate-100 bg-white">
          <SectionTitle
            title="Activity Audit Ledger"
            subtitle={`Showing ${filteredLedger.length} of ${ledger.length} logged records`}
          />

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter entries..."
                className="w-28 sm:w-36 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Scope filter */}
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none hover:border-slate-300"
            >
              <option value="All">All Scopes</option>
              <option value="Scope 1">Scope 1</option>
              <option value="Scope 2">Scope 2</option>
              <option value="Scope 3">Scope 3</option>
            </select>

            {/* Sector filter */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none hover:border-slate-300"
            >
              <option value="All">All Sectors</option>
              {sectors.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3 font-semibold">Entry ID</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Sector</th>
                <th className="px-4 py-3 font-semibold">Activity Source</th>
                <th className="px-4 py-3 font-semibold">GHG Scope</th>
                <th className="px-4 py-3 font-semibold">Consumption</th>
                <th className="px-4 py-3 font-semibold">Emissions</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                    No emissions activity matches your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-700">{row.id}</td>
                    <td className="px-4 py-4 text-slate-500">{row.date}</td>
                    <td className="px-4 py-4 font-medium text-slate-800">{row.sector}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <div>
                        <span>{row.activityType}</span>
                        {row.notes && (
                          <p className="text-[10px] text-slate-400">{row.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${
                          row.scope === 'Scope 1'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : row.scope === 'Scope 2'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                            : 'bg-teal-50 text-teal-700 border border-teal-200/60'
                        }`}
                      >
                        {row.scope}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-600">
                      {row.quantity.toLocaleString()} {row.unit}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {row.emissions.toFixed(2)} tCO₂e
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Emission Intake Modal */}
      <EmissionForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sectors={sectors}
        onSubmit={onAddRecord}
      />
    </div>
  )
}
