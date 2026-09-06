import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingDown } from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'

export default function EnergyUsage({ data = [] }) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="flex items-start justify-between">
        <SectionTitle title="Energy Usage by Month" subtitle="Consumption trend · GWh" />
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingDown size={14} />
          6.2%
        </span>
      </div>
      <div className="mt-5 h-[205px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 0, left: -22, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EEF2F1" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94A3B8' }}
              domain={[0, 6]}
            />
            <Tooltip
              cursor={{ fill: '#F0FDF4' }}
              contentStyle={{ borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 12 }}
              formatter={(value) => [`${value} GWh`, 'Energy']}
            />
            <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={15} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
