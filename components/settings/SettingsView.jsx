'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  Globe,
  Key,
  Laptop,
  Leaf,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  Trash2,
  User,
  UserCheck,
  Zap,
} from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import { useAuth } from '@/context/AuthContext'
import { exportToCsv } from '@/lib/exportCsv'

export default function SettingsView() {
  const { user, role, updateProfile, isAdmin } = useAuth()

  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security' | 'standards' | 'alerts' | 'data'
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Profile State
  const [name, setName] = useState(user?.name || 'Michael Thomas')
  const [email, setEmail] = useState(user?.email || 'admin@ecotrack.corp')
  const [roleTitle, setRoleTitle] = useState(user?.roleTitle || 'Corporate Admin / CSO')
  const [department, setDepartment] = useState(user?.department || 'Corporate Global Sustainability')
  const [sector, setSector] = useState(user?.sector || 'All Sectors')
  const [avatarTone, setAvatarTone] = useState(user?.badgeTone || 'emerald')

  // Organization State
  const [orgName, setOrgName] = useState('EcoTrack Global Enterprises Inc.')
  const [orgHq, setOrgHq] = useState('Zurich, Switzerland')
  const [orgCurrency, setOrgCurrency] = useState('USD ($)')
  const [orgFiscalStart, setOrgFiscalStart] = useState('January')

  // Security State
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false)
  const [sessionTimeout, setSessionTimeout] = useState('7d')

  // Standards State
  const [standard, setStandard] = useState(user?.preferences?.standard || 'IPCC AR6')
  const [gwpMetric, setGwpMetric] = useState(user?.preferences?.gwpMetric || 'GWP-100')
  const [gridFactor, setGridFactor] = useState(user?.preferences?.gridFactor || 0.386)
  const [scope3Categories, setScope3Categories] = useState({
    purchasedGoods: true,
    capitalGoods: true,
    fuelEnergy: true,
    upstreamTransport: true,
    wasteOps: true,
    businessTravel: true,
    employeeCommute: false,
  })

  // Alerts State
  const [baselineYear, setBaselineYear] = useState('2020')
  const [targetYear, setTargetYear] = useState('2030')
  const [targetReduction, setTargetReduction] = useState(50)
  const [anomalyThreshold, setAnomalyThreshold] = useState(15)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXX')

  // API State
  const [apiKey, setApiKey] = useState('eco_live_sec_9f82a17cb42006e89f')

  const handleSaveProfile = async (e) => {
    e?.preventDefault()
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    await updateProfile({
      name,
      email,
      roleTitle,
      department,
      sector,
      badgeTone: avatarTone,
      avatar: initials || user?.avatar || 'US',
      twoFactorEnabled,
      preferences: {
        standard,
        gwpMetric,
        gridFactor: Number(gridFactor),
        anomalyAlerts: emailAlerts,
        weeklyDigest,
      },
    })

    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText(apiKey)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleExportSystemBackup = () => {
    const backupData = [
      {
        ExportDate: new Date().toISOString(),
        User: name,
        Role: role,
        Organization: orgName,
        Standard: standard,
        GWPMetric: gwpMetric,
        GridIntensity: `${gridFactor} kgCO2e/kWh`,
        ReductionTarget: `${targetReduction}% by ${targetYear}`,
      },
    ]
    exportToCsv('ecotrack-system-settings-backup', backupData)
  }

  const toneClasses = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500',
    sky: 'bg-sky-100 text-sky-800 border-sky-300 ring-sky-500',
    amber: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-500',
    purple: 'bg-purple-100 text-purple-800 border-purple-300 ring-purple-500',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300 ring-indigo-500',
  }

  return (
    <div className="space-y-6">
      {/* Title & Save Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            CONFIGURATION & AUDIT PREFERENCES
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Enterprise Settings & Governance
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <CheckCircle2 size={16} /> Saved successfully
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveProfile}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
        {[
          { id: 'profile', label: 'Profile & Organization', icon: UserCheck },
          { id: 'security', label: 'Security & 2FA', icon: Lock },
          { id: 'standards', label: 'Emissions Standards', icon: Leaf },
          { id: 'alerts', label: 'Thresholds & Alerts', icon: Sliders },
          { id: 'data', label: 'Data & API Telemetry', icon: Database },
        ].map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: PROFILE & ORGANIZATION */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User Profile Card */}
          <Card className="p-6 lg:col-span-2">
            <SectionTitle
              title="Stakeholder Profile"
              subtitle="Personal identity, governance role, and facility assignments"
            />

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
              {/* Avatar Selector */}
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl text-lg font-bold shadow-2xs ${
                    toneClasses[avatarTone] || toneClasses.emerald
                  }`}
                >
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'US'}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">Avatar Badge Palette</p>
                  <p className="text-[11px] text-slate-500">
                    Tone identifier across ledger audits and activity feeds
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {['emerald', 'sky', 'amber', 'purple', 'indigo'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAvatarTone(t)}
                        className={`size-6 rounded-full border-2 transition ${
                          avatarTone === t ? 'scale-110 ring-2' : 'opacity-70 hover:opacity-100'
                        } ${toneClasses[t]}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sector / Facility Responsibility
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </form>
          </Card>

          {/* Organization Legal Entity */}
          <div className="space-y-6">
            <Card className="p-6">
              <SectionTitle
                title="Enterprise Entity"
                subtitle="Reporting perimeter and legal jurisdiction"
              />

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Global Headquarters
                  </label>
                  <input
                    type="text"
                    value={orgHq}
                    onChange={(e) => setOrgHq(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={orgCurrency}
                      onChange={(e) => setOrgCurrency(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fiscal Year Start
                    </label>
                    <select
                      value={orgFiscalStart}
                      onChange={(e) => setOrgFiscalStart(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                    >
                      <option>January</option>
                      <option>April</option>
                      <option>October</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-emerald-50/70 border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <ShieldCheck size={16} />
                <span>Active Role: {role.toUpperCase()}</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 leading-relaxed">
                Permissions granted: {isAdmin ? 'Full governance' : 'Operational logging'}. Scope
                1-3 ledger integrity guaranteed by SHA-256 ledger checksums.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & 2FA */}
      {activeTab === 'security' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Change Password Card */}
          <Card className="p-6">
            <SectionTitle
              title="Password & Credentials"
              subtitle="Update your stakeholder access credentials"
            />

            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSaveSuccess(true)
                setCurrentPass('')
                setNewPass('')
                setConfirmPass('')
                setTimeout(() => setSaveSuccess(false), 2000)
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Min. 8 characters with numbers"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </Card>

          {/* Two-Factor Authentication & Sessions */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enforce TOTP authenticator validation for audit disclosures
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {twoFactorEnabled ? (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck size={16} className="text-emerald-700" />
                    2FA Security Active
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700">
                    Backup Recovery Codes: 8492-3109-7712. Hardware YubiKey and Google Authenticator
                    registered.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-500">
                  2FA is currently optional for demo presentations. Enable to simulate multi-party
                  verification for Scope 1-3 audit approval.
                </p>
              )}

              <div className="mt-5 border-t border-slate-100 pt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Inactivity Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                >
                  <option value="15m">15 Minutes (Strict Banking Standard)</option>
                  <option value="1h">1 Hour</option>
                  <option value="8h">8 Hours (Working Shift)</option>
                  <option value="7d">7 Days (Continuous Presentation Demo)</option>
                </select>
              </div>
            </Card>

            {/* Active Connected Sessions */}
            <Card className="p-6">
              <SectionTitle
                title="Active Sessions"
                subtitle="Connected browsers and enterprise devices"
              />

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/40 p-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop size={18} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        Windows Chrome · Antigravity IDE
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Current Session · IP 192.168.1.102
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active Now
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-slate-400" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        EcoTrack Field Scanner · iOS 18
                      </p>
                      <p className="text-[11px] text-slate-500">Munich, Germany · 2 hours ago</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: EMISSIONS STANDARDS */}
      {activeTab === 'standards' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <SectionTitle
              title="Conversion & Factor Standard"
              subtitle="Regulatory methodology for carbon equivalency calculations"
            />

            <div className="mt-5 space-y-3">
              {[
                {
                  id: 'IPCC AR6',
                  title: 'IPCC Sixth Assessment Report (AR6)',
                  desc: 'Global benchmark standard with latest GWP-100 climate values. Recommended for CSRD.',
                },
                {
                  id: 'US EPA 2024',
                  title: 'US EPA GHG Emission Factors Hub (2024)',
                  desc: 'Standard for North American Scope 1 & 2 reporting under SEC guidelines.',
                },
                {
                  id: 'UK DEFRA',
                  title: 'UK DEFRA / BEIS Conversion Standard',
                  desc: 'Mandatory metrics for UK SECR and European supply chain auditing.',
                },
                {
                  id: 'IEA 2025',
                  title: 'IEA World Energy Factors (2025)',
                  desc: 'Comprehensive multi-national electrical grid emission factors.',
                },
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setStandard(s.id)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition ${
                    standard === s.id
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                      standard === s.id
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {standard === s.id && <Check size={10} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{s.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Global Warming Potential (GWP) Metric
                </label>
                <div className="flex gap-3">
                  {['GWP-100', 'GWP-20'].map((metric) => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => setGwpMetric(metric)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold border transition ${
                        gwpMetric === metric
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {metric} {metric === 'GWP-100' ? '(Standard 100yr)' : '(Aggressive 20yr)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  National Grid Electricity Factor (kg CO₂e / kWh)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={gridFactor}
                  onChange={(e) => setGridFactor(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Default: US eGRID average 0.386 kg/kWh. EU Continental average is 0.220 kg/kWh.
                </p>
              </div>
            </div>
          </Card>

          {/* Scope 3 Boundary Inclusions */}
          <Card className="p-6">
            <SectionTitle
              title="Scope 3 Organizational Boundaries"
              subtitle="Value chain emission categories actively audited in EcoTrack"
            />

            <div className="mt-5 space-y-3">
              {[
                { id: 'purchasedGoods', label: 'Cat 1: Purchased Goods & Services' },
                { id: 'capitalGoods', label: 'Cat 2: Capital Goods & Machinery' },
                { id: 'fuelEnergy', label: 'Cat 3: Fuel- and Energy-Related Activities' },
                { id: 'upstreamTransport', label: 'Cat 4: Upstream Freight & Logistics' },
                { id: 'wasteOps', label: 'Cat 5: Waste Generated in Operations' },
                { id: 'businessTravel', label: 'Cat 6: Corporate Business Travel' },
                { id: 'employeeCommute', label: 'Cat 7: Employee Commuting & Telework' },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-3 hover:bg-slate-50 cursor-pointer transition"
                >
                  <span className="text-xs font-medium text-slate-800">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={scope3Categories[item.id] || false}
                    onChange={(e) =>
                      setScope3Categories({
                        ...scope3Categories,
                        [item.id]: e.target.checked,
                      })
                    }
                    className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-slate-100/70 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Categories aligned with GHG Protocol Corporate Value Chain (Scope 3) Standard.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: THRESHOLDS & ALERTS */}
      {activeTab === 'alerts' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <SectionTitle
              title="2030 Decarbonization Glidepath"
              subtitle="Organizational science-based targets and reduction milestones"
            />

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Baseline Audit Year
                  </label>
                  <select
                    value={baselineYear}
                    onChange={(e) => setBaselineYear(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option>2018</option>
                    <option>2019</option>
                    <option>2020</option>
                    <option>2022</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Milestone Year
                  </label>
                  <select
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option>2028</option>
                    <option>2030</option>
                    <option>2035</option>
                    <option>2040</option>
                    <option>2050 (Net Zero)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Target Absolute Emission Reduction
                  </label>
                  <span className="text-xs font-bold text-emerald-700">{targetReduction}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={targetReduction}
                  onChange={(e) => setTargetReduction(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>-20% Minimum</span>
                  <span>-50% 1.5°C SBTi Target</span>
                  <span>-100% Net-Zero</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    AI Copilot Anomaly Alert Sensitivity
                  </label>
                  <span className="text-xs font-bold text-amber-700">+{anomalyThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={anomalyThreshold}
                  onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Automatically flags utility readings that exceed rolling 90-day baseline by{' '}
                  {anomalyThreshold}%.
                </p>
              </div>
            </div>
          </Card>

          {/* Notifications & Webhooks */}
          <Card className="p-6">
            <SectionTitle
              title="Notification Routing"
              subtitle="Alert dispatch channels and stakeholder webhooks"
            />

            <div className="mt-5 space-y-4">
              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Critical Anomaly Emails</p>
                  <p className="text-[11px] text-slate-500">
                    Dispatch instant alert when emissions exceed threshold
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-slate-800">Weekly Executive Digest</p>
                  <p className="text-[11px] text-slate-500">
                    Summary of weekly facility emissions and water metrics
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slack / MS Teams Webhook URL
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Sends automated notifications when Scope 1-3 audit anomalies are detected.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: DATA & API TELEMETRY */}
      {activeTab === 'data' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* API Keys */}
          <Card className="p-6">
            <SectionTitle
              title="IoT Meter & Telemetry API Keys"
              subtitle="Authenticate automated utility meter ingestion"
            />

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Ingestion Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyApiKey}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copySuccess ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copySuccess ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newKey =
                      'eco_live_sec_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36)
                    setApiKey(newKey)
                    setSaveSuccess(true)
                    setTimeout(() => setSaveSuccess(false), 2000)
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                >
                  <RefreshCw size={13} />
                  Roll New API Key
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Telemetry Ingestion Endpoint:</p>
                <code className="mt-1 block text-[11px] text-emerald-700">
                  POST /api/emissions/telemetry (Bearer Token auth)
                </code>
              </div>
            </div>
          </Card>

          {/* Backup & System Reset */}
          <Card className="p-6">
            <SectionTitle
              title="System Backup & Maintenance"
              subtitle="Export organization settings and manage demonstration state"
            />

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold text-slate-800">Export Settings Configuration</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Download JSON/CSV snapshot of organization thresholds and factor mappings.
                </p>
                <button
                  type="button"
                  onClick={handleExportSystemBackup}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Download size={14} />
                  Download Configuration Backup
                </button>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                <p className="text-xs font-bold text-rose-900">Reset Local Demonstration Cache</p>
                <p className="mt-0.5 text-[11px] text-rose-700/80">
                  Clears locally cached session overrides and reloads default ISO audit ledgers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.clear()
                      window.location.reload()
                    } catch {}
                  }}
                  className="mt-3 flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition shadow-2xs"
                >
                  <Trash2 size={14} />
                  Reset Demo State & Reload
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
