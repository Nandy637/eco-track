'use client'

import { useState } from 'react'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Factory,
  Globe2,
  KeyRound,
  Leaf,
  Loader2,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  User,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AuthGate() {
  const { login, register, switchRole } = useAuth()

  const [tab, setTab] = useState('signin') // 'signin' | 'personas' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('admin@ecotrack.corp')
  const [signInPassword, setSignInPassword] = useState('admin123')
  const [rememberMe, setRememberMe] = useState(true)

  // Register Form State
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState('operator')
  const [regDepartment, setRegDepartment] = useState('')
  const [regSector, setRegSector] = useState('')

  const personas = [
    {
      roleKey: 'admin',
      name: 'Michael Thomas',
      title: 'Corporate Admin / CSO',
      email: 'admin@ecotrack.corp',
      password: 'admin123',
      organization: 'Corporate Global ESG',
      avatar: 'MT',
      borderTone: 'border-emerald-500 hover:border-emerald-600',
      bgTone: 'bg-emerald-50 text-emerald-700',
      badgeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
      capabilities: [
        'Full corporate governance authority',
        'Set 2030 ESG targets & glidepaths',
        'Approve CSRD & ISO compliance disclosures',
        'Mutate Scope 1, 2, 3 ledgers & water readings',
        'Manage organizational team & access',
      ],
    },
    {
      roleKey: 'operator',
      name: 'Elena Rostova',
      title: 'Facility Operations Lead',
      email: 'operator@ecotrack.corp',
      password: 'operator123',
      organization: 'Manufacturing Site A',
      avatar: 'ER',
      borderTone: 'border-sky-500 hover:border-sky-600',
      bgTone: 'bg-sky-50 text-sky-700',
      badgeTone: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: Factory,
      capabilities: [
        'Log stationary combustion & fleet fuels',
        'Batch upload utility CSV ledgers',
        'Record municipal intake & recycling meters',
        'Export verified sector data ledgers',
        'Restricted: Cannot alter corporate targets',
      ],
    },
    {
      roleKey: 'auditor',
      name: 'Dr. Eleanor Vance',
      title: 'Sustainability Auditor',
      email: 'auditor@bv.com',
      password: 'auditor123',
      organization: 'Bureau Veritas Assurance',
      avatar: 'EV',
      borderTone: 'border-amber-500 hover:border-amber-600',
      bgTone: 'bg-amber-50 text-amber-700',
      badgeTone: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Eye,
      capabilities: [
        'Read-only ledger & emission factor audit',
        'Review IPCC AR6 conversion formulas',
        'Export compliance disclosure PDFs & CSVs',
        'Issue verification attestations',
        'Protected: Read-only access',
      ],
    },
  ]

  const handleQuickFill = (persona) => {
    setSignInEmail(persona.email)
    setSignInPassword(persona.password)
    setErrorMsg('')
  }

  const handleSelectRole = async (key) => {
    setSubmitting(true)
    setErrorMsg('')
    try {
      await switchRole(key)
      setSuccessMsg(`Authenticated as ${key.toUpperCase()}`)
    } catch (e) {
      setErrorMsg('Failed to authenticate role')
      setSubmitting(false)
    }
  }

  const handleSignInSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSubmitting(true)

    const result = await login({
      email: signInEmail,
      password: signInPassword,
    })

    if (result.success) {
      setSuccessMsg(`Welcome back, ${result.user.name}! Redirecting...`)
    } else {
      setSubmitting(false)
      setErrorMsg(result.error || 'Invalid credentials. Please verify your email and password.')
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Please complete all required fields.')
      return
    }

    setSubmitting(true)
    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      department: regDepartment,
      sector: regSector,
    })

    if (result.success) {
      setSuccessMsg(`Account created! Welcome, ${result.user.name}. Entering dashboard...`)
    } else {
      setSubmitting(false)
      setErrorMsg(result.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Banner */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
              <Leaf size={22} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">EcoTrack</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Enterprise ESG
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Carbon Accounting & Environmental Governance</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> GHG Protocol Scope 1-3
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <Globe2 size={14} className="text-teal-400" /> ISO 14064 Verified
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Overview & Security Highlights */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-6 pr-4">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/20">
              <Sparkles size={14} /> Mandatory Authentication Required
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
                Enterprise Carbon <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Intelligence Portal</span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Sign in with your verified organizational credentials to access decarbonization targets, audit ledgers, and emissions monitoring.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex items-start gap-3 backdrop-blur-xs">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Full Scope 1-3 Tracking</h4>
                  <p className="text-slate-400 mt-0.5">Stationary fuel, fleet logistics, grid electricity, and supplier emissions.</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex items-start gap-3 backdrop-blur-xs">
                <div className="rounded-lg bg-teal-500/10 p-2 text-teal-400 shrink-0">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">SBTi 1.5°C Target Trajectory</h4>
                  <p className="text-slate-400 mt-0.5">Real-time decarbonization pacing aligned with corporate 2030 net-zero goals.</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex items-start gap-3 backdrop-blur-xs">
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Role-Governed Ledger</h4>
                  <p className="text-slate-400 mt-0.5">Segregated CSO authority, operational data entry, and Bureau Veritas audit logs.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <Lock size={12} className="text-emerald-500" />
              <span>Zero-Trust Enterprise Architecture · 256-bit TLS Session Security</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-2xl text-slate-900">
              
              {/* Form Header */}
              <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">EcoTrack Authentication Gate</h2>
                  <p className="text-xs text-slate-500">Select an access method to enter the corporate workspace</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  <span className="size-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  <span>Auth Gateway</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50/40 px-6">
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition ${
                    tab === 'signin'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KeyRound size={14} />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('personas'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition ${
                    tab === 'personas'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users size={14} />
                  Demo Personas
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-semibold transition ${
                    tab === 'register'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserPlus size={14} />
                  Register
                </button>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 animate-in fade-in">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Tab Contents */}
              <div className="p-6">
                
                {/* 1. SIGN IN TAB */}
                {tab === 'signin' && (
                  <div className="space-y-4">
                    {/* Quick Demo Pill Helper */}
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                      <p className="text-[11px] font-semibold text-emerald-900 mb-2 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-emerald-600" />
                        Click to auto-fill verified test credentials:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {personas.map((p) => (
                          <button
                            key={p.roleKey}
                            type="button"
                            onClick={() => handleQuickFill(p)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50 transition shadow-2xs"
                          >
                            <span className="font-semibold text-emerald-700">{p.title.split(' ')[0]}:</span>
                            <span className="text-[11px] text-slate-500">{p.email}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Enterprise Work Email
                        </label>
                        <div className="relative flex items-center">
                          <Mail size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            placeholder="name@ecotrack.corp"
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-slate-700">Password</label>
                          <span className="text-[10px] text-emerald-700 font-medium">Demo: admin123</span>
                        </div>
                        <div className="relative flex items-center">
                          <Lock size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-10 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80 px-3 py-2 text-[11px] font-medium text-emerald-900">
                        <Lock size={13} className="text-emerald-700 shrink-0" />
                        <span>Strict Session Security: Login is required on every reload &amp; visit.</span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Authenticating Session...</span>
                          </>
                        ) : (
                          <>
                            <KeyRound size={15} />
                            <span>Authenticate & Open Workspace</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* 2. DEMO PERSONAS TAB */}
                {tab === 'personas' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600">
                      Select any predefined enterprise stakeholder to instantly sign in with specific role privileges:
                    </p>

                    <div className="space-y-2.5">
                      {personas.map((p) => {
                        const Icon = p.icon
                        return (
                          <div
                            key={p.roleKey}
                            className={`rounded-xl border p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 ${p.borderTone}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex size-10 items-center justify-center rounded-xl font-bold text-xs shrink-0 ${p.bgTone}`}>
                                <Icon size={20} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${p.badgeTone}`}>
                                    {p.title}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">{p.email} · {p.organization}</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {p.capabilities[0]}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleSelectRole(p.roleKey)}
                              className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3.5 text-xs font-semibold shadow-xs transition disabled:opacity-50"
                            >
                              {submitting ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <>
                                  <UserCheck size={14} />
                                  <span>Log In As {p.title.split(' ')[0]}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 3. REGISTER TAB */}
                {tab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Dr. Sarah Connor"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="s.connor@ecotrack.corp"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">System Role</label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        >
                          <option value="operator">Facility Operator (Log Activity & Readings)</option>
                          <option value="admin">Corporate Admin / CSO (Full Authority)</option>
                          <option value="auditor">Sustainability Auditor (Read-Only Attestation)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                        <input
                          type="text"
                          value={regDepartment}
                          onChange={(e) => setRegDepartment(e.target.value)}
                          placeholder="e.g. Environmental Operations"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Facility / Sector</label>
                        <input
                          type="text"
                          value={regSector}
                          onChange={(e) => setRegSector(e.target.value)}
                          placeholder="e.g. Manufacturing Site B"
                          className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Creating Enterprise Profile...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} />
                          <span>Complete Registration & Enter</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  ISO 14064 & CSRD Compliant
                </span>
                <span>EcoTrack Carbon Intelligence v2.6</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 px-6 py-4 text-center text-xs text-slate-500">
        <p>© 2026 EcoTrack Enterprise Solutions. All corporate sustainability data cryptographically secured.</p>
      </footer>
    </div>
  )
}
