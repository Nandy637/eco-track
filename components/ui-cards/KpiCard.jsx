import { MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react'
import Card from './Card'
import ProgressLine from './ProgressLine'

export default function KpiCard({
  icon: Icon,
  iconClass,
  title,
  value,
  comparison,
  isPositiveTrend = false,
  target,
  detail,
  progress,
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`flex size-10 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={19} />
        </div>
        <button
          type="button"
          aria-label="More options"
          className="rounded p-1 text-slate-300 hover:text-slate-500"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>

      {comparison && (
        <div
          className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
            isPositiveTrend ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {isPositiveTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {comparison}
        </div>
      )}

      {progress !== undefined ? (
        <>
          <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target {target}</span>
            <span className="font-semibold text-slate-600">{progress}%</span>
          </div>
          <ProgressLine value={progress} />
        </>
      ) : detail ? (
        <div className="mt-5 flex items-center justify-between gap-3 text-[11px]">
          <span className="text-slate-400">Target: {target}</span>
          <span
            className={`font-semibold ${
              detail.includes('above') ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {detail}
          </span>
        </div>
      ) : null}
    </Card>
  )
}
