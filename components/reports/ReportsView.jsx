'use client'

import { useState } from 'react'
import {
  Building2,
  Check,
  CheckCircle2,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Lock,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import { exportToCsv } from '@/lib/exportCsv'
import { useAuth } from '@/context/AuthContext'
import {
  complianceFrameworks,
  sectors,
  initialEmissionsLedger,
  energyData,
  monthlyWaterData,
} from '@/data/mockData'

export default function ReportsView({ ledger = initialEmissionsLedger, dateRange = 'This Year' }) {
  const { role, isAdmin, isAuditor, user, can } = useAuth()
  const [activeFramework, setActiveFramework] = useState('ghgProtocol')
  const [isApproved, setIsApproved] = useState(true)
  const framework = complianceFrameworks[activeFramework] || complianceFrameworks.ghgProtocol

  const handlePrint = () => {
    window.print()
  }

  const exportExecutiveCsv = () => {
    const rows = sectors.map((s) => ({
      Framework: framework.name,
      ReportingPeriod: dateRange,
      Sector: s.name,
      Emissions: s.emissions,
      Energy: s.energy,
      AnnualDelta: s.change,
      GoalProgress: `${s.progress}%`,
      Status: s.status,
    }))
    exportToCsv(`ecotrack-esg-disclosure-${activeFramework}`, rows)
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Screen-Only Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
            ESG & REGULATORY DISCLOSURE
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Compliance Brief & Audit Exporter
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportExecutiveCsv}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download size={14} />
            Export Data CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Printer size={15} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Framework Selector Tabs (Screen Only) */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 print:hidden">
        {[
          ['ghgProtocol', 'GHG Protocol Corporate'],
          ['csrd', 'CSRD (ESRS E1)'],
          ['iso14064', 'ISO 14064-1:2018'],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFramework(key)}
            className={`border-b-2 px-4 py-3 text-xs font-medium transition ${
              activeFramework === key
                ? 'border-emerald-600 text-emerald-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Official Audit-Grade Executive Disclosure Brief (Printable & Screen) */}
      <Card className="p-8 lg:p-10 border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={24} />
              <span className="text-xl font-bold tracking-tight text-slate-900">EcoTrack</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 font-mono">
              SUSTAINABILITY & CARBON ASSURANCE STATEMENT
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-800 border border-emerald-200">
              {framework.auditStatus}
            </span>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Verification Body: {framework.verificationBody}
            </p>
          </div>
        </div>

        {/* Executive Meta Block */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-slate-50 p-4 text-xs border border-slate-100 print:bg-white print:border-slate-300">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-semibold">Standard</p>
            <p className="font-semibold text-slate-800 mt-0.5">{framework.name}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-semibold">Reporting Period</p>
            <p className="font-semibold text-slate-800 mt-0.5">{dateRange} (Calendar Year)</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-semibold">Boundary</p>
            <p className="font-semibold text-slate-800 mt-0.5">{framework.boundary}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-semibold">Assurance Level</p>
            <p className="font-semibold text-emerald-700 mt-0.5">{framework.assuranceLevel}</p>
          </div>
        </div>

        {/* Emissions Inventory Statement Table */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            1. Greenhouse Gas Inventory Statement
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-[10px] uppercase tracking-wider text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Inventory Category</th>
                  <th className="py-2.5 px-4 font-semibold">Operational Sources</th>
                  <th className="py-2.5 px-4 font-semibold">Emissions (tCO₂e)</th>
                  <th className="py-2.5 px-4 font-semibold">Share (%)</th>
                  <th className="py-2.5 px-4 font-semibold">YoY Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Scope 1 · Direct</td>
                  <td className="py-3 px-4 text-slate-500">
                    Stationary combustion (Natural gas), Fleet diesel
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">1,708.0</td>
                  <td className="py-3 px-4 font-medium">60.0%</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">↓ 7.4%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Scope 2 · Market-Based</td>
                  <td className="py-3 px-4 text-slate-500">
                    Purchased electricity, Heating & cooling loops
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">911.0</td>
                  <td className="py-3 px-4 font-medium">32.0%</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">↓ 11.2%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Scope 3 · Upstream/Downstream</td>
                  <td className="py-3 px-4 text-slate-500">
                    Municipal water supply, Landfill waste disposal
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">228.0</td>
                  <td className="py-3 px-4 font-medium">8.0%</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">↓ 5.8%</td>
                </tr>
                <tr className="bg-emerald-50/50 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-3 px-4">Total Gross Emissions</td>
                  <td className="py-3 px-4 text-slate-500">All Scopes Consolidated</td>
                  <td className="py-3 px-4 font-mono text-emerald-800 text-sm">2,847.0</td>
                  <td className="py-3 px-4">100.0%</td>
                  <td className="py-3 px-4 text-emerald-700">↓ 8.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Environmental Stewardship Performance Summary */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            2. Energy & Resource Stewardship Indicators
          </h3>
          <div className="grid grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 text-xs">
            <div>
              <p className="text-slate-400">Total Energy Consumption</p>
              <p className="text-base font-bold text-slate-900 mt-1">50.09 GWh</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">35.0% Renewable Mix</p>
            </div>
            <div>
              <p className="text-slate-400">Total Water Withdrawal</p>
              <p className="text-base font-bold text-slate-900 mt-1">12,450 m³</p>
              <p className="text-[11px] text-teal-700 font-medium mt-0.5">30.7% Recycled Rate</p>
            </div>
            <div>
              <p className="text-slate-400">Carbon Revenue Intensity</p>
              <p className="text-base font-bold text-slate-900 mt-1">18.4 tCO₂e / $M</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">↓ 11.2% Improvement</p>
            </div>
          </div>
        </div>

        {/* Methodology Notes */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-500 space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Methodology & Conversion Notes
          </h3>
          <p>
            Calculations strictly adhere to the GHG Protocol Corporate Accounting and Reporting Standard. Emission factors reflect IPCC 6th Assessment Report (AR6) 100-year Global Warming Potentials (GWP), with regional electricity grid factors sourced from national emissions databases (DEFRA 2025 and IEA 2025 datasets).
          </p>
        </div>

        {/* Sign-Off Block */}
        <div className="mt-10 border-t-2 border-slate-900 pt-6 grid sm:grid-cols-2 gap-8 text-xs">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Prepared By (CSO / Corporate Admin)</p>
              <p className="font-bold text-slate-800 mt-1">Michael Thomas</p>
              <p className="text-slate-500 text-[11px]">Head of ESG & Corporate Sustainability</p>
              <p className="text-slate-400 text-[10px] mt-1">Sign-off Date: March 6, 2026</p>
            </div>
            {isAdmin && (
              <div className="mt-3 print:hidden">
                <button
                  type="button"
                  onClick={() => setIsApproved(!isApproved)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      Executive Disclosure Approved (CSO Sign-Off)
                    </>
                  ) : (
                    <>
                      <Lock size={13} className="text-slate-500" />
                      Click to Approve & Sign Disclosure
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Verified & Approved (Third-Party)</p>
            <p className="font-bold text-slate-800 mt-1">Dr. Eleanor Vance</p>
            <p className="text-slate-500 text-[11px]">Lead Environmental Auditor, Bureau Veritas Assurance</p>
            <p className="text-slate-400 text-[10px] mt-1">Certificate ID: BV-GHG-2026-9041A</p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                <ShieldCheck size={12} className="text-amber-600" />
                Auditor Assurance Stamped
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Raw Data Export Center (Screen Only) */}
      <div className="print:hidden space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Direct Dataset Downloads</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-800">Sector Performance</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Emissions, energy, and deltas</p>
            <button
              type="button"
              onClick={exportExecutiveCsv}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              <Download size={13} /> Download CSV
            </button>
          </Card>

          <Card className="p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-800">Emissions Ledger</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Scope 1, 2, & 3 entries</p>
            <button
              type="button"
              onClick={() => exportToCsv('ecotrack-all-emissions-ledger', ledger)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition"
            >
              <Download size={13} /> Download CSV
            </button>
          </Card>

          <Card className="p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-800">Water Consumption</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Withdrawal vs recycling</p>
            <button
              type="button"
              onClick={() => exportToCsv('ecotrack-monthly-water-data', monthlyWaterData)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-600 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 transition"
            >
              <Download size={13} /> Download CSV
            </button>
          </Card>

          <Card className="p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 mb-3">
              <FileSpreadsheet size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-800">Energy Profile</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Monthly GWh and fuel mix</p>
            <button
              type="button"
              onClick={() => exportToCsv('ecotrack-monthly-energy-trends', energyData)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
            >
              <Download size={13} /> Download CSV
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}
