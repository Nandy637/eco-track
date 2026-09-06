import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'

export default function SectorChart({ sectors = [], filter = 'All sectors', onSelectSector }) {
  const visible =
    filter === 'All sectors' ? sectors : sectors.filter((s) => s.name === filter)

  return (
    <Card className="p-5 lg:p-6">
      <SectionTitle
        title="Emissions by Sector"
        subtitle="Where your footprint comes from"
        action={
          <span className="text-xs font-semibold text-emerald-600">
            {visible.length} {visible.length === 1 ? 'Sector' : 'Sectors'}
          </span>
        }
      />
      <div className="mt-6 flex flex-col gap-4">
        {visible.map((sector) => (
          <div
            key={sector.name}
            className="group cursor-pointer"
            onClick={() => onSelectSector && onSelectSector(sector.name)}
          >
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-medium text-slate-700 group-hover:text-emerald-700 transition">
                {sector.name}
              </span>
              <span className="shrink-0 text-slate-500">
                {sector.percent}% · {sector.emissions}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${sector.percent * 2.22}%`, background: sector.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
