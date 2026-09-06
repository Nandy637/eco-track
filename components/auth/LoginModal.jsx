'use client'

import { useState } from 'react'
import {
  Check,
  CheckCircle2,
  Eye,
  Factory,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginModal({ isOpen, onClose }) {
  const { role, switchRole, user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('personas') // 'personas' | 'custom'
  const [customEmail, setCustomEmail] = useState('')
  const [customPass, setCustomPass] = useState('')
  const [statusMsg, setStatusMsg] = useState('')

  if (!isOpen) return null

  const personas = [
    {
      roleKey: 'admin',
      name: 'Michael Thomas',
      title: 'Corporate Admin / CSO',
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
        'Locked: Cannot modify 2030 targets',
      ],
    },
    {
      roleKey: 'auditor',
      name: 'Dr. Eleanor Vance',
      title: 'Sustainability Auditor',
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

  const handleSelectRole = (key) => {
    switchRole(key)
    setStatusMsg(`Switched to ${key.toUpperCase()}`)
    setTimeout(() => {
      setStatusMsg('')
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                EcoTrack Stakeholder Access & RBAC
              </h2>
              <p className="text-xs text-slate-500">
                Switch stakeholder personas or test role-governed permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {statusMsg && (
            <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-center text-xs font-semibold text-emerald-800 animate-in fade-in">
              ✓ {statusMsg}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {personas.map((p) => {
              const Icon = p.icon
              const isActive = role === p.roleKey

              return (
                <div
                  key={p.roleKey}
                  className={`relative flex flex-col justify-between rounded-xl border-2 p-4 transition cursor-pointer ${
                    isActive
                      ? `${p.borderTone} shadow-md bg-slate-50/30`
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
                        <p className="text-xs font-bold text-slate-900 leading-tight">{p.name}</p>
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
                        const isRestricted = cap.startsWith('Locked:') || cap.startsWith('Protected:')
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
                              <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-600" />
                            )}
                            <span>{cap}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
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

          {/* Quick Notice */}
          <div className="mt-6 rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold text-slate-800">RBAC Demonstration Guide:</span> Switching
              to <strong className="text-amber-700">Sustainability Auditor</strong> locks all mutation
              buttons across the emissions and water interfaces, enforcing audit compliance. Switching
              to <strong className="text-sky-700">Facility Operator</strong> restores data logging but
              restricts 2030 target overrides.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
