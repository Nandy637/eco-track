'use client'

import { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'

export default function AnomalyAlertsBanner({
  anomalies = [],
  onOpenCopilotWithQuery,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !anomalies || anomalies.length === 0) return null

  const current = anomalies[currentIndex] || anomalies[0]
  const isCritical = current.severity === 'critical'
  const isOpp = current.severity === 'opportunity'

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
        isCritical
          ? 'border-amber-200 bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-orange-50/40 text-amber-950'
          : isOpp
          ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-emerald-50/50 to-teal-50/40 text-emerald-950'
          : 'border-sky-200 bg-gradient-to-r from-sky-50/90 via-sky-50/50 to-cyan-50/40 text-sky-950'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
              isCritical
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                : isOpp
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
            }`}
          >
            {isCritical ? (
              <AlertTriangle size={18} />
            ) : isOpp ? (
              <Sparkles size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isCritical
                    ? 'bg-amber-200/80 text-amber-900'
                    : isOpp
                    ? 'bg-emerald-200/80 text-emerald-900'
                    : 'bg-sky-200/80 text-sky-900'
                }`}
              >
                AI Anomaly Alert · {current.category}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentIndex + 1} of {anomalies.length}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-slate-900">
              {current.title} — <span className="font-normal text-slate-700">{current.description}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {anomalies.length > 1 && (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % anomalies.length)}
              className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 px-2 py-1"
            >
              Next Alert
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onOpenCopilotWithQuery
                ? onOpenCopilotWithQuery(`How can we resolve the anomaly: "${current.title}"?`)
                : null
            }
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition ${
              isCritical
                ? 'bg-amber-600 hover:bg-amber-700'
                : isOpp
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            <Sparkles size={13} />
            Remediate with Copilot
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert banner"
            className="rounded-lg p-1 text-slate-400 hover:bg-black/5 hover:text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
