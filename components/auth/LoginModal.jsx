'use client'

import { useState, useEffect } from 'react'
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Factory,
  KeyRound,
  Leaf,
  Loader2,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const {
    role,
    switchRole,
    login,
    register,
    loginModalTab,
    setLoginModalTab,
    user,
  } = useAuth()

  const [tab, setTab] = useState(loginModalTab || 'signin')
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

  useEffect(() => {
    if (loginModalTab) {
      setTab(loginModalTab)
    }
  }, [loginModalTab])

  useEffect(() => {
    setErrorMsg('')
    setSuccessMsg('')
  }, [tab, isOpen])

  if (!isOpen) return null

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
        'Full administrative authority',
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
        'Batch upload utility CSV data',
        'Record municipal intake & recycling meters',
        'Export verified sector data ledgers',
        'Restricted: Cannot modify 2030 targets',
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
        'Protected: Cannot log or mutate records',
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
      setSuccessMsg(`Switched to ${key.toUpperCase()}`)
      setTimeout(() => {
        setSuccessMsg('')
        setSubmitting(false)
        onClose()
      }, 350)
    } catch (e) {
      setErrorMsg('Failed to switch role')
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

    setSubmitting(false)
    if (result.success) {
      setSuccessMsg(`Welcome back, ${result.user.name}!`)
      setTimeout(() => {
        onClose()
      }, 500)
    } else {
      setErrorMsg(result.error || 'Invalid credentials')
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

    setSubmitting(false)
    if (result.success) {
      setSuccessMsg(`Account created! Welcome, ${result.user.name}.`)
      setTimeout(() => {
        onClose()
      }, 500)
    } else {
      setErrorMsg(result.error || 'Registration failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
              <Leaf size={18} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                EcoTrack Enterprise Authentication
              </h2>
              <p className="text-xs text-slate-500">
                GHG Protocol Scope 1-3 Compliance & Environmental Governance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-semibold transition ${
              tab === 'signin'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound size={14} />
            Sign In with Password
          </button>
          <button
            type="button"
            onClick={() => setTab('personas')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-semibold transition ${
              tab === 'personas'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={14} />
            Quick Demo Personas
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-semibold transition ${
              tab === 'register'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus size={14} />
            Register Stakeholder
          </button>
        </div>

        {/* Notification alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs font-semibold text-rose-700 animate-in fade-in">
            <AlertCircle size={15} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-semibold text-emerald-800 animate-in fade-in">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <div className="space-y-5">
              {/* Quick-fill demo account pills */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                <p className="text-[11px] font-semibold text-emerald-900 mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-600" />
                  Quick Demo Accounts (Click to auto-fill credentials):
                </p>
                <div className="flex flex-wrap gap-2">
                  {personas.map((p) => (
                    <button
                      key={p.roleKey}
                      type="button"
                      onClick={() => handleQuickFill(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/50 transition shadow-2xs"
                    >
                      <span className="font-semibold">{p.title.split(' ')[0]}:</span>
                      <span className="text-[11px] text-slate-500">{p.email}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail
                      size={15}
                      className="absolute left-3 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="user@ecotrack.corp"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Demo password: admin123
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock
                      size={15}
                      className="absolute left-3 text-slate-400 pointer-events-none"
                    />
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

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-600">Remember session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('personas')}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Switch via Persona Matrix →
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <KeyRound size={15} />
                      Sign In to EcoTrack
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: PERSONAS */}
          {tab === 'personas' && (
            <div>
              <div className="grid gap-4 md:grid-cols-3">
                {personas.map((p) => {
                  const Icon = p.icon
                  const isActive = role === p.roleKey && user?.email === p.email

                  return (
                    <div
                      key={p.roleKey}
                      className={`relative flex flex-col justify-between rounded-xl border-2 p-4 transition cursor-pointer ${
                        isActive
                          ? `${p.borderTone} shadow-md bg-slate-50/40`
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      onClick={() => handleSelectRole(p.roleKey)}
                    >
                      {isActive && (
                        <div className="absolute -top-2.5 right-3 flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          <Check size={11} /> Active
                        </div>
                      )}

                      <div>
                        {/* Persona Identity */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-10 items-center justify-center rounded-xl text-xs font-bold ${p.bgTone}`}
                          >
                            {p.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">
                              {p.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-500">{p.title}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${p.badgeTone}`}
                          >
                            <Icon size={12} />
                            {p.organization}
                          </span>
                        </div>

                        {/* Permissions checklist */}
                        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px]">
                          {p.capabilities.map((cap, i) => {
                            const isRestricted =
                              cap.startsWith('Locked:') ||
                              cap.startsWith('Protected:') ||
                              cap.startsWith('Restricted:')
                            return (
                              <div
                                key={i}
                                className={`flex items-start gap-1.5 ${
                                  isRestricted ? 'text-amber-700 font-medium' : 'text-slate-600'
                                }`}
                              >
                                {isRestricted ? (
                                  <Lock size={12} className="mt-0.5 shrink-0 text-amber-500" />
                                ) : (
                                  <CheckCircle2
                                    size={12}
                                    className="mt-0.5 shrink-0 text-emerald-600"
                                  />
                                )}
                                <span>{cap}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={submitting}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectRole(p.roleKey)
                        }}
                        className={`mt-5 w-full rounded-lg py-2 text-xs font-semibold transition ${
                          isActive
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isActive ? 'Active Persona' : `Select ${p.title.split(' ')[0]}`}
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-semibold text-slate-800">Live Persona Demo:</span> Selecting
                  an account updates server-verified JWT cookies and immediate client role
                  permissions across all GHG Scope 1-3 audit ledgers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <User
                      size={15}
                      className="absolute left-3 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email *
                  </label>
                  <div className="relative flex items-center">
                    <Mail
                      size={15}
                      className="absolute left-3 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="s.jenkins@ecotrack.corp"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Governance Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  >
                    <option value="admin">Corporate Admin / CSO</option>
                    <option value="operator">Facility Operator</option>
                    <option value="auditor">Sustainability Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="Energy & Decarbonization"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Sector
                  </label>
                  <input
                    type="text"
                    value={regSector}
                    onChange={(e) => setRegSector(e.target.value)}
                    placeholder="Manufacturing Site B"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password (min. 6 characters) *
                </label>
                <div className="relative flex items-center">
                  <Lock
                    size={15}
                    className="absolute left-3 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      Complete Stakeholder Registration
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <ShieldCheck size={13} /> ISO 14064-1 Compliant
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline">CSRD Audit Trail Active</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Lock size={11} /> 256-Bit TLS Secured
          </div>
        </div>
      </div>
    </div>
  )
}
