import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'

const defaultMetrics = [
  ['Carbon Reduction', '8.5%', 85, 'emerald'],
  ['Energy Efficiency', '92%', 92, 'emerald'],
  ['Water Efficiency', '78%', 78, 'sky'],
  ['Waste Diversion', '84%', 84, 'amber'],
]

export default function PerformanceCard({ metrics = defaultMetrics }) {
  return (
    <Card className="p-5 lg:p-6">
      <SectionTitle
        title="Environmental Performance"
        subtitle="Key efficiency indicators across operations"
      />
      <div className="mt-5 grid grid-cols-2 gap-5">
        {metrics.map(([name, value, percent, tone]) => (
          <div key={name}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-500">{name}</p>
              <span className="text-sm font-bold text-slate-800">{value}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  tone === 'sky'
                    ? 'bg-sky-400'
                    : tone === 'amber'
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
