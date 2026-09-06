import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { MoreHorizontal } from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'

export default function CarbonChart({ data = [] }) {
  return (
    <Card className="p-5 lg:p-6">
      <SectionTitle
        title="Carbon Emissions Over Time"
        subtitle="Monthly emissions across all company sectors"
        action={
          <button
            type="button"
            aria-label="More chart options"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50"
          >
            <MoreHorizontal size={18} />
          </button>
        }
      />
      <div className="mt-5 h-[245px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="carbonFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
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
              tickFormatter={(value) => `${value}`}
              domain={[160, 290]}
            />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12 }}
              formatter={(value, name) => [
                `${value} tCO₂e`,
                name === 'current' ? 'This year' : 'Last year',
              ]}
            />
            <Area
              type="monotone"
              dataKey="last"
              stroke="#CBD5E1"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#carbonFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-5 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-emerald-500" />
          This year
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2 rounded-full bg-slate-300" />
          Last year
        </span>
        <span className="ml-auto hidden text-slate-400 sm:block">Unit: tCO₂e</span>
      </div>
    </Card>
  )
}
