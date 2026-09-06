export default function StatusBadge({ status }) {
  const styles = {
    'On Track': 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    'At Risk': 'bg-amber-50 text-amber-700 border border-amber-200/60',
    'In Progress': 'bg-slate-100 text-slate-600 border border-slate-200/60',
    'Verified': 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    'Under Review': 'bg-amber-50 text-amber-700 border border-amber-200/60',
  }
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}
