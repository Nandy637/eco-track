import { useMemo } from 'react'
import { Droplets, Leaf, Target, Zap } from 'lucide-react'
import KpiCard from '@/components/ui-cards/KpiCard'
import CarbonChart from './CarbonChart'
import SectorChart from './SectorChart'
import EnergySources from './EnergySources'
import GoalsCard from './GoalsCard'
import EnergyUsage from './EnergyUsage'
import PerformanceCard from './PerformanceCard'
import ActivityCard from './ActivityCard'
import SectorTable from './SectorTable'

export default function DashboardView({
  dateRange = 'This Year',
  filter = 'All sectors',
  setFilter = () => {},
  sectors = [],
  carbonData = [],
  energyData = [],
  goals = [],
  energySources = [],
  recentActivity = [],
  onNavigateTab = () => {},
}) {
  const sectorOptions = useMemo(
    () => ['All sectors', ...sectors.map((s) => s.name)],
    [sectors]
  )

  // Dynamic calculations based on dateRange
  const kpiModifiers = {
    'This Year': { emissions: '2,847 tCO₂e', energy: '50.09 GWh', water: '12,450 m³' },
    'Last Year': { emissions: '3,112 tCO₂e', energy: '53.40 GWh', water: '13,080 m³' },
    'This Quarter': { emissions: '718 tCO₂e', energy: '12.52 GWh', water: '3,112 m³' },
  }
  const currentMetrics = kpiModifiers[dateRange] || kpiModifiers['This Year']

  return (
    <div className="space-y-6">
      {/* Overview Top Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            {dateRange} overview
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Environmental Performance
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">View by sector:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-emerald-500 transition"
          >
            {sectorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Leaf}
          iconClass="bg-emerald-50 text-emerald-600"
          title="Total Carbon Emissions"
          value={currentMetrics.emissions}
          comparison="8.5% vs last period"
          target="≤ 2,800 tCO₂e"
          detail="47 tCO₂e above target"
        />
        <KpiCard
          icon={Zap}
          iconClass="bg-sky-50 text-sky-600"
          title="Energy Consumption"
          value={currentMetrics.energy}
          comparison="6.2% vs last period"
          target="≤ 52 GWh"
          detail="Within Target"
        />
        <KpiCard
          icon={Droplets}
          iconClass="bg-cyan-50 text-cyan-600"
          title="Water Consumption"
          value={currentMetrics.water}
          comparison="4.8% vs last period"
          target="≤ 14,000 m³"
          detail="Within Target"
        />
        <KpiCard
          icon={Target}
          iconClass="bg-amber-50 text-amber-600"
          title="Sustainability Goal Progress"
          value="76%"
          comparison="12% this quarter"
          target="18 of 24 on track"
          progress={76}
        />
      </div>

      {/* Charts Row 1: Carbon Trend & Sector Footprint */}
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <CarbonChart data={carbonData} />
        <SectorChart
          sectors={sectors}
          filter={filter}
          onSelectSector={(sName) => setFilter(sName)}
        />
      </div>

      {/* Charts Row 2: Energy Mix & Goals */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1.35fr]">
        <EnergySources sources={energySources} />
        <GoalsCard goals={goals} onViewAll={() => onNavigateTab('Goals')} />
      </div>

      {/* Charts Row 3: Monthly Energy, Performance & Activity */}
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <EnergyUsage data={energyData} />
        <PerformanceCard />
        <ActivityCard items={recentActivity} />
      </div>

      {/* Sector Performance Table */}
      <SectorTable sectors={sectors} filter={filter} />
    </div>
  )
}
