'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import DashboardView from '@/components/dashboard/DashboardView'
import EmissionsView from '@/components/emissions/EmissionsView'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import GoalsCard from '@/components/dashboard/GoalsCard'
import EnergyUsage from '@/components/dashboard/EnergyUsage'
import EnergySources from '@/components/dashboard/EnergySources'
import { exportToCsv } from '@/lib/exportCsv'
import {
  carbonData,
  energyData,
  sectors,
  goals,
  energySources,
  recentActivity as initialActivity,
  initialEmissionsLedger,
} from '@/data/mockData'
import { ArrowLeft, CheckCircle2, Download, FileSpreadsheet, ShieldAlert } from 'lucide-react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dateRange, setDateRange] = useState('This Year')
  const [sectorFilter, setSectorFilter] = useState('All sectors')
  const [searchTerm, setSearchTerm] = useState('')

  // Interactive state
  const [ledger, setLedger] = useState(initialEmissionsLedger)
  const [activities, setActivities] = useState(initialActivity)
  const [sectorData, setSectorData] = useState(sectors)

  const handleAddEmission = (newRecord) => {
    setLedger((prev) => [newRecord, ...prev])

    // Automatically append to recent activity feed
    const activityItem = {
      id: `act-${Date.now()}`,
      text: `Logged ${newRecord.emissions} tCO₂e (${newRecord.activityType}) for ${newRecord.sector}`,
      time: 'Just now',
      type: 'good',
    }
    setActivities((prev) => [activityItem, ...prev])
  }

  // Master report export
  const handleDownloadSummaryReport = () => {
    const summaryRows = sectorData.map((s) => ({
      ReportPeriod: dateRange,
      Sector: s.name,
      Emissions: s.emissions,
      EnergyConsumption: s.energy,
      AnnualDelta: s.change,
      TargetProgress: `${s.progress}%`,
      AuditStatus: s.status,
    }))
    exportToCsv(`ecotrack-executive-report-${dateRange.toLowerCase().replace(/\s+/g, '-')}`, summaryRows)
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] text-slate-900">
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        open={mobileOpen}
        setOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-[236px]">
        <Header
          setOpen={setMobileOpen}
          date={dateRange}
          setDate={setDateRange}
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDownloadReport={handleDownloadSummaryReport}
        />

        <main className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8 lg:py-8">
          {activeTab === 'Dashboard' && (
            <DashboardView
              dateRange={dateRange}
              filter={sectorFilter}
              setFilter={setSectorFilter}
              sectors={sectorData}
              carbonData={carbonData}
              energyData={energyData}
              goals={goals}
              energySources={energySources}
              recentActivity={activities}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'Emissions' && (
            <EmissionsView
              ledger={ledger}
              onAddRecord={handleAddEmission}
              sectors={sectorData}
            />
          )}

          {activeTab === 'Goals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    2030 SUSTAINABILITY ROADMAP
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    Target Milestones & Decarbonization Plan
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('Dashboard')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <GoalsCard goals={goals} />
                <Card className="p-6">
                  <SectionTitle
                    title="Target Commitment Summary"
                    subtitle="UN Sustainable Development Goals (SDG) Alignment"
                  />
                  <div className="mt-5 space-y-3.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p>
                        <strong>Science Based Targets initiative (SBTi):</strong> Commited to 1.5°C near-term target reduction by 2030.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p>
                        <strong>RE100 Commitment:</strong> Transitioning core manufacturing facilities to 100% contracted solar and wind PPAs.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p>
                        <strong>CDP Disclosure:</strong> On track for A- score in 2026 climate change survey cycle.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'Energy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                    GRID & RENEWABLES INTELLIGENCE
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    Energy Portfolio & Consumption Trends
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('Dashboard')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </button>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <EnergyUsage data={energyData} />
                <EnergySources sources={energySources} />
              </div>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    COMPLIANCE & DISCLOSURE
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    Download & Export Audit Reports
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('Dashboard')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  <ArrowLeft size={14} /> Back to Dashboard
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                    <FileSpreadsheet size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">Executive Summary CSV</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Full sector breakdown, emissions, energy, and progress delta.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadSummaryReport}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    <Download size={14} />
                    Download CSV
                  </button>
                </Card>

                <Card className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-4">
                    <FileSpreadsheet size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">Emissions Ledger CSV</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Itemized Scope 1, 2, and 3 activity logs with GHG emission factors.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      exportToCsv('ecotrack-all-emissions-ledger', ledger)
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition"
                  >
                    <Download size={14} />
                    Download Ledger
                  </button>
                </Card>

                <Card className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4">
                    <FileSpreadsheet size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">Monthly Energy Trend CSV</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Monthly GWh electrical and fuel consumption dataset.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      exportToCsv('ecotrack-monthly-energy-trends', energyData)
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition"
                  >
                    <Download size={14} />
                    Download Trends
                  </button>
                </Card>
              </div>
            </div>
          )}

          {!['Dashboard', 'Emissions', 'Goals', 'Energy', 'Reports'].includes(activeTab) && (
            <Card className="p-12 text-center max-w-lg mx-auto mt-8">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-base font-semibold text-slate-800">{activeTab} Module</h3>
              <p className="mt-1.5 text-xs text-slate-500">
                The {activeTab} workspace is being configured for your enterprise subscription.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('Dashboard')}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                <ArrowLeft size={14} />
                Return to Dashboard
              </button>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
