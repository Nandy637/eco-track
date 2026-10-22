import {
  Activity,
  BarChart3,
  Droplets,
  Factory,
  FileText,
  Gauge,
  KeyRound,
  Leaf,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const groups = [
  {
    label: 'MAIN',
    items: [
      ['Dashboard', Gauge],
      ['Emissions', Activity],
      ['Energy', Zap],
      ['Water', Droplets],
      ['Goals', Target],
      ['Reports', FileText],
      ['Analytics', BarChart3],
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      ['Sectors', Factory],
      ['Team', UserRound],
    ],
  },
  {
    label: 'GENERAL',
    items: [
      ['Settings', Settings],
      ['Logout', LogOut],
    ],
  },
]

export default function Sidebar({ active, setActive, open, setOpen }) {
  const { user, role, logout, isAuthenticated, openLoginModal } = useAuth()

  const handleItemClick = (label) => {
    if (label === 'Logout') {
      logout()
      openLoginModal('signin')
      setOpen(false)
      return
    }
    setActive(label)
    setOpen(false)
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[236px] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <Leaf size={18} fill="currentColor" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-slate-800">
              Eco<span className="text-emerald-600">Track</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.16em] text-slate-400">
                {group.label}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map(([label, Icon]) => {
                  const isActive = active === label
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleItemClick(label)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Stakeholder Identity Footer */}
        {isAuthenticated && user ? (
          <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
                onClick={() => {
                  setActive('Settings')
                  setOpen(false)
                }}
                title="Go to Settings"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
                  {user.avatar || 'MT'}
                </div>
                <div className="truncate">
                  <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>
                  <p className="truncate text-[10px] text-slate-400 capitalize">
                    {user.roleTitle || user.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                title="Sign Out"
                onClick={() => {
                  logout()
                  openLoginModal('signin')
                }}
                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto">
            <button
              type="button"
              onClick={() => openLoginModal('signin')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <KeyRound size={14} />
              Sign In
            </button>
          </div>
        )}
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  )
}
