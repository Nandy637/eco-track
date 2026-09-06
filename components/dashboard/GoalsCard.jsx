import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import ProgressLine from '@/components/ui-cards/ProgressLine'

export default function GoalsCard({ goals = [], onViewAll }) {
  return (
    <Card className="p-5 lg:p-6">
      <SectionTitle
        title="Sustainability Goals"
        subtitle="Progress toward your 2030 targets"
        action={
          onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              View all
            </button>
          ) : null
        }
      />
      <div className="mt-5 flex flex-col gap-5">
        {goals.map((goal) => (
          <div key={goal.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">{goal.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Target: {goal.target}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700">{goal.progress}%</span>
                <p
                  className={`mt-0.5 text-[10px] font-medium ${
                    goal.status === 'At Risk'
                      ? 'text-amber-600'
                      : goal.status === 'In Progress'
                      ? 'text-sky-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {goal.status}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <ProgressLine value={goal.progress} tone={goal.tone} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
