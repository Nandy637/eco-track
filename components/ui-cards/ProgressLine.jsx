export default function ProgressLine({ value, tone = 'green' }) {
  const colors = {
    green: 'bg-emerald-500',
    blue: 'bg-sky-400',
    amber: 'bg-amber-400',
  }
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[tone] || 'bg-emerald-500'}`}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}
