import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Download,
  Menu,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react'

export default function Header({
  setOpen,
  date,
  setDate,
  activeTab = 'Dashboard',
  searchTerm = '',
  setSearchTerm = () => {},
  onDownloadReport,
  onOpenCopilot,
}) {
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const descriptions = {
    Dashboard: "Monitor your organization's environmental performance and sustainability progress.",
    Emissions: 'Track and audit GHG Protocol Scope 1, 2, and 3 emissions activity.',
    Energy: 'Analyze renewable vs grid power consumption and efficiency metrics.',
    Water: 'Review municipal water usage, treatment, and conservation initiatives.',
    Goals: 'Track progress toward 2030 net-zero targets and ESG milestones.',
    Reports: 'Generate compliance-ready ESG disclosure reports and audit ledgers.',
    Analytics: 'Deep dive into historical emissions, predictive forecasts, and sector breakdowns.',
  }

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-sm lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar navigation"
          className="rounded p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{activeTab}</h1>
          <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
            {descriptions[activeTab] || 'Environmental sustainability and carbon intelligence.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 md:flex focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition">
          <Search size={15} className="text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search records"
            className="w-32 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:w-44 transition-all"
            placeholder="Search records..."
          />
        </div>

        <select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date range"
          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 focus:border-emerald-500"
        >
          <option>This Year</option>
          <option>Last Year</option>
          <option>This Quarter</option>
        </select>

        {/* AI Copilot Trigger */}
        <button
          type="button"
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 h-9 rounded-lg border border-emerald-200 bg-emerald-50/70 px-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
        >
          <Sparkles size={14} className="text-emerald-600 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setNoticeOpen(!noticeOpen)
              setProfileOpen(false)
            }}
            className="relative flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <Bell size={17} />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {noticeOpen && (
            <div className="absolute right-0 top-11 z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800">Notifications</p>
                <span className="text-[10px] text-emerald-600 font-medium">2 new</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-100">
                  <p className="font-medium">Solar Array Commissioned</p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">Manufacturing site 2 active.</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-100">
                  <p className="font-medium">Water Target Warning</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">Transportation sector +4% above cap.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen)
              setNoticeOpen(false)
            }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              MT
            </div>
            <span className="hidden text-xs font-medium text-slate-700 sm:block">
              Michael Thomas
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
              <div className="px-2.5 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">Michael Thomas</p>
                <p className="text-[11px] text-slate-400">Sustainability Lead</p>
              </div>
              <button
                type="button"
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                <CircleUserRound size={15} />
                Profile & Credentials
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                <Settings size={15} />
                Account Settings
              </button>
            </div>
          )}
        </div>

        {onDownloadReport && (
          <button
            type="button"
            onClick={onDownloadReport}
            className="hidden h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition sm:flex"
          >
            <Download size={15} />
            Download Report
          </button>
        )}
      </div>
    </header>
  )
}
