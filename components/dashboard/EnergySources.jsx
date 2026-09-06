import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'

export default function EnergySources({ sources = [] }) {
  const renewableItem = sources.find((s) => s.name.toLowerCase().includes('renewable'))
  const renewablePercent = renewableItem ? renewableItem.value : 35

  return (
    <Card className="p-5 lg:p-6">
      <SectionTitle title="Energy Sources" subtitle="Current energy mix & grid dependencies" />
      <div className="mt-4 flex flex-col items-center sm:flex-row sm:items-center gap-6">
        <div className="relative h-[170px] w-[170px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                dataKey="value"
                nameKey="name"
                innerRadius={53}
                outerRadius={78}
                paddingAngle={2}
                strokeWidth={0}
              >
                {sources.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{renewablePercent}%</span>
            <span className="text-[10px] text-slate-500">Renewable</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 text-[11px] text-slate-600">
          {sources.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
              <span className="ml-auto font-semibold text-slate-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
