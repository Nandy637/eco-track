'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import DashboardView from '@/components/dashboard/DashboardView'
import EmissionsView from '@/components/emissions/EmissionsView'
import WaterView from '@/components/water/WaterView'
import AnalyticsView from '@/components/analytics/AnalyticsView'
import ReportsView from '@/components/reports/ReportsView'
import Card from '@/components/ui-cards/Card'
import SectionTitle from '@/components/ui-cards/SectionTitle'
import GoalsCard from '@/components/dashboard/GoalsCard'
import EnergyUsage from '@/components/dashboard/EnergyUsage'
import EnergySources from '@/components/dashboard/EnergySources'
import SectorTable from '@/components/dashboard/SectorTable'
import SectorChart from '@/components/dashboard/SectorChart'
import CopilotDrawer from '@/components/copilot/CopilotDrawer'
import { exportToCsv } from '@/lib/exportCsv'
import { useAuth } from '@/context/AuthContext'
import {
  carbonData,
  energyData,
  sectors,
  goals,
  energySources,
  recentActivity as initialActivity,
  initialEmissionsLedger,
} from '@/data/mockData'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'

export default function Page() {
  const { authFetch, isAuditor, role } = useAuth()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dateRange, setDateRange] = useState('This Year')
  const [sectorFilter, setSectorFilter] = useState('All sectors')
  const [searchTerm, setSearchTerm] = useState('')

  // Interactive state
  const [ledger, setLedger] = useState(initialEmissionsLedger)
  const [activities, setActivities] = useState(initialActivity)
  const [sectorData, setSectorData] = useState(sectors)

  // AI Copilot & Anomaly state
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotQuery, setCopilotQuery] = useState('')
  const [anomalies, setAnomalies] = useState([])

  // Fetch persistent records from API on mount
  useEffect(() => {
    fetch('/api/emissions')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setLedger(json.data)
        }
      })
      .catch((err) => console.warn('Using cached emissions ledger', err))

    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json.data?.recentActivities?.length) {
          setActivities(json.data.recentActivities)
        }
      })
      .catch((err) => console.warn('Using cached activity feed', err))

    fetch('/api/copilot')
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data?.anomalies)) {
          setAnomalies(json.data.anomalies)
        }
      })
      .catch((err) => console.warn('Using cached anomalies', err))
  }, [])

  const handleOpenCopilotWithQuery = (query) => {
    setCopilotQuery(query)
    setCopilotOpen(true)
  }

  const handleAddEmission = async (newRecord) => {
    try {
      const res = await authFetch('/api/emissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      })
      const result = await res.json()
      if (result.success && result.data) {
        setLedger((prev) => [result.data, ...prev])
      } else {
        if (result.error) {
          console.warn('Emissions POST rejected by server:', result.error)
        }
        setLedger((prev) => [newRecord, ...prev])
      }
    } catch (err) {
      console.warn('Emissions POST failed, saving locally', err)
      setLedger((prev) => [newRecord, ...prev])
    }

    // Automatically append to recent activity feed
    const activityItem = {
      id: `act-${Date.now()}`,
      text: `Logged ${newRecord.emissions} tCO₂e (${newRecord.activityType}) for ${newRecord.sector}`,
      time: 'Just now',
      type: 'good',
    }
    setActivities((prev) => [activityItem, ...prev])
  }

  const handleBatchEmissions = (newRecords) => {
    setLedger((prev) => [...newRecords, ...prev])

    const totalEmissions = newRecords
      .reduce((sum, r) => sum + (Number(r.emissions) || 0), 0)
      .toFixed(2)

    const activityItem = {
      id: `act-${Date.now()}`,
      text: `Batch ingested ${newRecords.length} utility records (+${totalEmissions} tCO₂e)`,
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
    exportToCsv(
      `ecotrack-executive-report-${dateRange.toLowerCase().replace(/\s+/g, '-')}`,
      summaryRows
    )
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
          onOpenCopilot={() => {
            setCopilotQuery('')
            setCopilotOpen(true)
          }}
        />

        <main className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8 lg:py-8">
          {/* 1. Dashboard View */}
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
              anomalies={anomalies}
              onOpenCopilotWithQuery={handleOpenCopilotWithQuery}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* 2. Emissions View */}
          {activeTab === 'Emissions' && (
            <EmissionsView
              ledger={ledger}
              onAddRecord={handleAddEmission}
              onBatchImport={handleBatchEmissions}
              sectors={sectorData}
            />
          )}

          {/* 3. Energy View */}
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

          {/* 4. Water View */}
          {activeTab === 'Water' && <WaterView />}

          {/* 5. Goals View */}
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
                        <strong>Science Based Targets initiative (SBTi):</strong> Committed to 1.5°C near-term target reduction by 2030.
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

          {/* 6. Reports View */}
          {activeTab === 'Reports' && (
            <ReportsView ledger={ledger} dateRange={dateRange} />
          )}

          {/* 7. Analytics View */}
          {activeTab === 'Analytics' && <AnalyticsView />}

          {/* 8. Sectors View */}
          {activeTab === 'Sectors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    ORGANIZATION PROFILE
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    Business Sectors & Facility Rollup
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
              <div className="grid gap-6 lg:grid-cols-[1fr_1.8fr]">
                <SectorChart sectors={sectorData} filter="All sectors" />
                <SectorTable sectors={sectorData} filter="All sectors" />
              </div>
            </div>
          )}

          {/* 9. Team View */}
          {activeTab === 'Team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                    COLLABORATION & GOVERNANCE
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    Sustainability & Facility Management Team
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
                {[
                  { name: 'Michael Thomas', role: 'Head of Sustainability', sector: 'Corporate Global', email: 'm.thomas@ecotrack.corp' },
                  { name: 'Elena Rostova', role: 'Facility Director', sector: 'Manufacturing Site A', email: 'e.rostova@ecotrack.corp' },
                  { name: 'Marcus Vance', role: 'Fleet & Logistics Lead', sector: 'Transportation', email: 'm.vance@ecotrack.corp' },
                  { name: 'Sarah Jenkins', role: 'Energy & Utilities Analyst', sector: 'Energy & Utilities', email: 's.jenkins@ecotrack.corp' },
                  { name: 'David Chen', role: 'Circular Economy Officer', sector: 'Waste Management', email: 'd.chen@ecotrack.corp' },
                  { name: 'Dr. Eleanor Vance', role: 'Third-Party Auditor', sector: 'Bureau Veritas Assurance', email: 'auditor@bv.com' },
                ].map((member) => (
                  <Card key={member.name} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{member.name}</p>
                        <p className="text-[11px] text-slate-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                      <p className="text-slate-600">
                        <span className="text-slate-400">Assignment:</span> {member.sector}
                      </p>
                      <p className="text-slate-500 text-[11px] truncate flex items-center gap-1.5">
                        <Mail size={12} /> {member.email}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 10. Settings & Help View Fallback */}
          {['Settings', 'Help', 'Logout'].includes(activeTab) && (
            <Card className="p-10 max-w-lg mx-auto mt-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <BookOpen size={22} />
              </div>
              <h3 className="text-base font-semibold text-slate-800">{activeTab} Workspace</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Enterprise organization preferences, emission factor regional presets, and compliance audit trail settings.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('Dashboard')}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                <ArrowLeft size={14} />
                Return to Dashboard
              </button>
            </Card>
          )}
        </main>
      </div>

      {/* AI Decarbonization Copilot Drawer */}
      <CopilotDrawer
        isOpen={copilotOpen}
        setIsOpen={setCopilotOpen}
        initialQuery={copilotQuery}
        sectors={sectorData}
      />
    </div>
  )
}
