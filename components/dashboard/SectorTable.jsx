import { Download } from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import StatusBadge from '@/components/ui-cards/StatusBadge'
import { exportToCsv } from '@/lib/exportCsv'

export default function SectorTable({ sectors = [], filter = 'All sectors' }) {
  const visible =
    filter === 'All sectors' ? sectors : sectors.filter((s) => s.name === filter)

  const handleExport = () => {
    const exportData = visible.map((s) => ({
      Sector: s.name,
      Emissions: s.emissions,
      Energy: s.energy,
      Change: s.change,
      GoalProgress: `${s.progress}%`,
      Status: s.status,
    }))
    exportToCsv(`ecotrack-sectors-${filter.toLowerCase().replace(/\s+/g, '-')}`, exportData)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-5 lg:p-6">
        <SectionTitle
          title="Sector Performance"
          subtitle="Emission and goal progress across business operating units"
        />
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-y border-slate-100 bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3 font-semibold">Sector</th>
              <th className="px-4 py-3 font-semibold">Emissions</th>
              <th className="px-4 py-3 font-semibold">Energy</th>
              <th className="px-4 py-3 font-semibold">Change</th>
              <th className="px-4 py-3 font-semibold">Goal Progress</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((sector) => (
              <tr key={sector.name} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-semibold text-slate-800">{sector.name}</td>
                <td className="px-4 py-4 text-slate-600">{sector.emissions}</td>
                <td className="px-4 py-4 text-slate-600">{sector.energy}</td>
                <td
                  className={`px-4 py-4 font-medium ${
                    sector.change.includes('↑') ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {sector.change}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${sector.progress}%` }}
                      />
                    </div>
                    <span className="text-slate-600 font-medium">{sector.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={sector.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
