import { AlertTriangle, Check } from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'

export default function ActivityCard({ items = [] }) {
  return (
    <Card className="p-5 lg:p-6">
      <SectionTitle
        title="Recent Activity"
        subtitle="Latest sustainability updates & milestones"
      />
      <div className="mt-4 flex flex-col">
        {items.map((item) => {
          const isWarn = item.type === 'warn'
          return (
            <div
              key={item.id || item.text}
              className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0"
            >
              <div
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  isWarn ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {isWarn ? <AlertTriangle size={12} /> : <Check size={12} />}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{item.text}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
