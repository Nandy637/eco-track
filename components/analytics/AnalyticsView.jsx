'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  DollarSign,
  Gauge,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  TrendingDown,
  Zap,
} from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import StatusBadge from '@/components/ui-cards/StatusBadge'
import ProgressLine from '@/components/ui-cards/ProgressLine'
import {
  sbtiTrajectoryData,
  scopeBreakdownData,
  intensityMetrics,
  decarbonizationProjects,
} from '@/data/mockData'

export default function AnalyticsView() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            SBTI & PARIS AGREEMENT ALIGNMENT
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Climate Analytics & Glidepath Projections
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3.5 py-1.5 text-xs font-medium text-emerald-800">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Validated 1.5°C Linear Reduction Pathway (-4.2%/yr)</span>
        </div>
      </div>

      {/* Carbon Intensity Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {intensityMetrics.map((item) => (
          <Card key={item.title} className="p-5">
            <p className="text-xs font-medium text-slate-500">{item.title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{item.value}</span>
              <span className="text-xs text-slate-500">{item.unit}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="flex items-center text-emerald-600 font-semibold">
                <TrendingDown size={14} className="mr-1" />
                {item.change}
              </span>
              <span className="text-[11px] text-slate-400">Target: {item.target}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* SBTi 1.5°C Trajectory Chart */}
      <Card className="p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle
            title="Science-Based Target (SBTi 1.5°C) Decarbonization Glidepath"
            subtitle="Actual verified emissions vs required 4.2% annual linear run-rate to 2030 (tCO₂e)"
          />
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <i className="size-2.5 rounded-full bg-emerald-600" />
              Verified Performance
            </span>
            <span className="flex items-center gap-1.5 font-medium text-sky-700">
              <i className="size-2.5 rounded-full bg-sky-500" />
              SBTi 1.5°C Glidepath
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <i className="size-2.5 rounded-full bg-slate-300" />
              2021 Base Year
            </span>
          </div>
        </div>

        <div className="mt-6 h-[290px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sbtiTrajectoryData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#EEF2F1" />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                domain={[2200, 3800]}
              />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12 }}
                formatter={(val, name) => [
                  val ? `${val} tCO₂e` : 'Projection',
                  name === 'actual'
                    ? 'Verified Actual'
                    : name === 'sbtiTarget'
                    ? 'SBTi 1.5°C Target'
                    : 'Baseline',
                ]}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#E2E8F0"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sbtiTarget"
                stroke="#0EA5E9"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#0EA5E9' }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#047857"
                strokeWidth={3}
                dot={{ r: 4, fill: '#047857', strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 flex items-center justify-between">
          <p>
            Current 2026 reporting of <strong>2,847 tCO₂e</strong> is currently{' '}
            <span className="text-emerald-700 font-semibold">tracking ahead</span> of the 2,839 tCO₂e interim milestone threshold.
          </p>
          <span className="font-semibold text-emerald-700">On Track for -32% by 2030</span>
        </div>
      </Card>

      {/* Row 2: Scope Allocations & Marginal Abatement */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        {/* Scope Breakdown */}
        <Card className="p-5 lg:p-6">
          <SectionTitle
            title="GHG Protocol Scope Mix"
            subtitle="Operational inventory proportion"
          />
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scopeBreakdownData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {scopeBreakdownData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">2,847</span>
                <span className="text-[10px] text-slate-400">tCO₂e Total</span>
              </div>
            </div>

            <div className="mt-5 w-full space-y-2.5 text-xs">
              {scopeBreakdownData.map((s) => (
                <div key={s.name} className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-slate-700">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">{s.value} t</span>
                    <span className="font-semibold text-slate-800">{s.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Decarbonization Capital Projects Table */}
        <Card className="overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-slate-100">
            <SectionTitle
              title="Decarbonization Abatement Projects"
              subtitle="Capital expenditure initiatives & estimated carbon offset impact"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Initiative</th>
                  <th className="px-3 py-3 font-semibold">Sector</th>
                  <th className="px-3 py-3 font-semibold">Abatement</th>
                  <th className="px-3 py-3 font-semibold">CapEx</th>
                  <th className="px-3 py-3 font-semibold">Payback</th>
                  <th className="px-4 py-3 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {decarbonizationProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-800 max-w-[200px] truncate">
                      {p.title}
                    </td>
                    <td className="px-3 py-3.5 text-slate-500">{p.sector}</td>
                    <td className="px-3 py-3.5 font-semibold text-emerald-700">
                      {p.reductionEst}
                    </td>
                    <td className="px-3 py-3.5 font-mono text-slate-600">{p.cost}</td>
                    <td className="px-3 py-3.5 text-slate-600">{p.roiYears}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-slate-600">
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
