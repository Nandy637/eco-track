import { useState } from 'react'
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Download,
  Eye,
  Factory,
  KeyRound,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import LoginModal from '@/components/auth/LoginModal'

export default function Header({
  setOpen,
  date,
  setDate,
  activeTab = 'Dashboard',
  searchTerm = '',
  setSearchTerm = () => {},
  onDownloadReport,
  onOpenCopilot,
  onNavigateTab = () => {},
}) {
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const {
    user,
    role,
    switchRole,
    logout,
    loginModalOpen,
    setLoginModalOpen,
    openLoginModal,
    isAuthenticated,
  } = useAuth()

  const descriptions = {
    Dashboard: "Monitor your organization's environmental performance and sustainability progress.",
    Emissions: 'Track and audit GHG Protocol Scope 1, 2, and 3 emissions activity.',
    Energy: 'Analyze renewable vs grid power consumption and efficiency metrics.',
    Water: 'Review municipal water usage, treatment, and conservation initiatives.',
    Goals: 'Track progress toward 2030 net-zero targets and ESG milestones.',
    Reports: 'Generate compliance-ready ESG disclosure reports and audit ledgers.',
    Analytics: 'Deep dive into historical emissions, predictive forecasts, and sector breakdowns.',
    Settings: 'Manage stakeholder profile, multi-factor security, emissions factors, and API keys.',
    Sectors: 'Corporate business sectors, facilities, and aggregated decarbonization targets.',
    Team: 'Cross-functional sustainability governance and facility management teams.',
  }

  const roleConfigs = {
    admin: {
      label: 'Corporate Admin / CSO',
      shortLabel: 'CSO / Admin',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      icon: ShieldCheck,
    },
    operator: {
      label: 'Facility Operator',
      shortLabel: 'Facility Operator',
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
      avatarBg: 'bg-sky-100 text-sky-800',
      icon: Factory,
    },
    auditor: {
      label: 'Auditor · Read-Only',
      shortLabel: 'Auditor (Read-Only)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse',
      avatarBg: 'bg-amber-100 text-amber-800',
      icon: Eye,
    },
  }

  const currentRoleCfg = roleConfigs[role] || roleConfigs.admin
  const RoleIcon = currentRoleCfg.icon

  return (
    <>
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
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">{activeTab}</h1>
              {/* Role Indicator Pill */}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => openLoginModal('personas')}
                  className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition hover:opacity-85 ${currentRoleCfg.badgeClass}`}
                  title="Click to switch active role"
                >
                  <RoleIcon size={12} />
                  <span>{currentRoleCfg.label}</span>
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  Guest Mode
                </span>
              )}
            </div>
            <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
              {descriptions[activeTab] || 'Environmental sustainability and carbon intelligence.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
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

          {/* Date Selector */}
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

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  setNoticeOpen(false)
                }}
                className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
              >
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${currentRoleCfg.avatarBg}`}
                >
                  {user?.avatar || 'MT'}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name || 'Michael Thomas'}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {currentRoleCfg.shortLabel}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 z-20 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  {/* Active Profile Summary */}
                  <div className="px-2.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${currentRoleCfg.badgeClass}`}
                      >
                        <RoleIcon size={11} /> {currentRoleCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Role Switcher */}
                  <div className="px-2 pt-2.5 pb-1 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
                      Switch Role (Demo)
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          switchRole('admin')
                          setProfileOpen(false)
                        }}
                        className={`rounded-lg py-1.5 text-[10px] font-bold transition flex flex-col items-center gap-0.5 border ${
                          role === 'admin'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <ShieldCheck size={12} />
                        Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          switchRole('operator')
                          setProfileOpen(false)
                        }}
                        className={`rounded-lg py-1.5 text-[10px] font-bold transition flex flex-col items-center gap-0.5 border ${
                          role === 'operator'
                            ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Factory size={12} />
                        Operator
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          switchRole('auditor')
                          setProfileOpen(false)
                        }}
                        className={`rounded-lg py-1.5 text-[10px] font-bold transition flex flex-col items-center gap-0.5 border ${
                          role === 'auditor'
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Eye size={12} />
                        Auditor
                      </button>
                    </div>
                  </div>

                  {/* Account Navigation Links */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateTab('Settings')
                        setProfileOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Settings size={14} className="text-slate-400" />
                      Settings & Preferences
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openLoginModal('signin')
                        setProfileOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Users size={14} className="text-slate-400" />
                      Switch Account / Matrix
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setProfileOpen(false)
                        openLoginModal('signin')
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut size={14} className="text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openLoginModal('signin')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <KeyRound size={14} />
              <span>Sign In</span>
            </button>
          )}

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

      {/* Multi-Tenant RBAC Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  )
}
