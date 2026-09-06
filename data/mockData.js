export const carbonData = [
  { month: 'Jan', current: 245, last: 270 },
  { month: 'Feb', current: 238, last: 265 },
  { month: 'Mar', current: 252, last: 272 },
  { month: 'Apr', current: 241, last: 260 },
  { month: 'May', current: 229, last: 255 },
  { month: 'Jun', current: 218, last: 248 },
  { month: 'Jul', current: 225, last: 250 },
  { month: 'Aug', current: 211, last: 242 },
  { month: 'Sep', current: 205, last: 238 },
  { month: 'Oct', current: 198, last: 230 },
  { month: 'Nov', current: 192, last: 225 },
  { month: 'Dec', current: 184, last: 218 },
]

export const energyData = carbonData.map((item, index) => ({
  ...item,
  value: [4.8, 4.6, 4.9, 4.5, 4.3, 4.1, 4.4, 4.0, 3.9, 3.8, 3.7, 3.6][index],
}))

export const sectors = [
  {
    name: 'Manufacturing',
    emissions: '1,281 tCO₂e',
    energy: '24.5 GWh',
    percent: 45,
    change: '↓ 7.2%',
    progress: 72,
    status: 'On Track',
    color: '#047857',
  },
  {
    name: 'Transportation',
    emissions: '712 tCO₂e',
    energy: '12.8 GWh',
    percent: 25,
    change: '↑ 3.4%',
    progress: 48,
    status: 'At Risk',
    color: '#10B981',
  },
  {
    name: 'Energy & Utilities',
    emissions: '427 tCO₂e',
    energy: '7.4 GWh',
    percent: 15,
    change: '↓ 11.8%',
    progress: 81,
    status: 'On Track',
    color: '#34D399',
  },
  {
    name: 'Office & Administration',
    emissions: '228 tCO₂e',
    energy: '3.2 GWh',
    percent: 8,
    change: '↓ 9.5%',
    progress: 86,
    status: 'On Track',
    color: '#6EE7B7',
  },
  {
    name: 'Waste Management',
    emissions: '199 tCO₂e',
    energy: '2.1 GWh',
    percent: 7,
    change: '↓ 14.2%',
    progress: 67,
    status: 'In Progress',
    color: '#A7F3D0',
  },
]

export const goals = [
  {
    name: 'Reduce Carbon Emissions',
    target: '20% reduction by 2030',
    progress: 76,
    status: 'On Track',
    tone: 'green',
  },
  {
    name: 'Renewable Energy Transition',
    target: '50% renewable energy',
    progress: 68,
    status: 'On Track',
    tone: 'green',
  },
  {
    name: 'Water Consumption Reduction',
    target: '15% reduction',
    progress: 61,
    status: 'In Progress',
    tone: 'blue',
  },
  {
    name: 'Zero Waste Initiative',
    target: '90% waste diversion',
    progress: 54,
    status: 'At Risk',
    tone: 'amber',
  },
]

export const energySources = [
  { name: 'Renewable', value: 35, color: '#047857' },
  { name: 'Natural Gas', value: 25, color: '#10B981' },
  { name: 'Grid Electricity', value: 20, color: '#5EEAD4' },
  { name: 'Nuclear', value: 10, color: '#93C5FD' },
  { name: 'Coal', value: 10, color: '#CBD5E1' },
]

export const recentActivity = [
  { id: '1', text: 'Solar panel installation completed', time: '2 hours ago', type: 'good' },
  { id: '2', text: 'Manufacturing emissions report submitted', time: '5 hours ago', type: 'good' },
  { id: '3', text: 'Water consumption exceeded monthly target', time: 'Yesterday', type: 'warn' },
  { id: '4', text: 'Renewable energy target updated', time: '2 days ago', type: 'good' },
]

export const initialEmissionsLedger = [
  {
    id: 'EM-1001',
    date: '2026-03-01',
    sector: 'Manufacturing',
    activityType: 'Natural Gas',
    scope: 'Scope 1',
    quantity: 12500,
    unit: 'm³',
    emissions: 25.38,
    status: 'Verified',
  },
  {
    id: 'EM-1002',
    date: '2026-03-02',
    sector: 'Transportation',
    activityType: 'Fleet Diesel',
    scope: 'Scope 1',
    quantity: 4800,
    unit: 'L',
    emissions: 12.86,
    status: 'Verified',
  },
  {
    id: 'EM-1003',
    date: '2026-03-03',
    sector: 'Energy & Utilities',
    activityType: 'Grid Electricity',
    scope: 'Scope 2',
    quantity: 95000,
    unit: 'kWh',
    emissions: 40.85,
    status: 'Verified',
  },
  {
    id: 'EM-1004',
    date: '2026-03-04',
    sector: 'Office & Administration',
    activityType: 'Municipal Water',
    scope: 'Scope 3',
    quantity: 420,
    unit: 'm³',
    emissions: 0.15,
    status: 'Verified',
  },
  {
    id: 'EM-1005',
    date: '2026-03-05',
    sector: 'Waste Management',
    activityType: 'Landfill Waste',
    scope: 'Scope 3',
    quantity: 6200,
    unit: 'kg',
    emissions: 3.22,
    status: 'Under Review',
  },
  {
    id: 'EM-1006',
    date: '2026-03-06',
    sector: 'Manufacturing',
    activityType: 'Grid Electricity',
    scope: 'Scope 2',
    quantity: 140000,
    unit: 'kWh',
    emissions: 60.20,
    status: 'Verified',
  },
]

// ==========================================
// Water Management Dataset
// ==========================================
export const monthlyWaterData = [
  { month: 'Jan', withdrawal: 1080, recycled: 310, net: 770 },
  { month: 'Feb', withdrawal: 1020, recycled: 300, net: 720 },
  { month: 'Mar', withdrawal: 1150, recycled: 340, net: 810 },
  { month: 'Apr', withdrawal: 1060, recycled: 320, net: 740 },
  { month: 'May', withdrawal: 1010, recycled: 330, net: 680 },
  { month: 'Jun', withdrawal: 990, recycled: 315, net: 675 },
  { month: 'Jul', withdrawal: 1040, recycled: 325, net: 715 },
  { month: 'Aug', withdrawal: 980, recycled: 310, net: 670 },
  { month: 'Sep', withdrawal: 960, recycled: 305, net: 655 },
  { month: 'Oct', withdrawal: 1030, recycled: 330, net: 700 },
  { month: 'Nov', withdrawal: 1050, recycled: 325, net: 725 },
  { month: 'Dec', withdrawal: 1080, recycled: 340, net: 740 },
]

export const facilityWaterData = [
  {
    id: 'FAC-01',
    name: 'Advanced Fabrication Plant A',
    location: 'Munich, Germany',
    withdrawal: '6,420 m³',
    recycled: '2,140 m³',
    rate: '33.3%',
    intensity: '18.4 m³/ton',
    stressLevel: 'Low',
    status: 'Optimal',
  },
  {
    id: 'FAC-02',
    name: 'Assembly & Testing Campus B',
    location: 'Austin, Texas, USA',
    withdrawal: '3,210 m³',
    recycled: '980 m³',
    rate: '30.5%',
    intensity: '12.1 m³/ton',
    stressLevel: 'High',
    status: 'At Risk',
  },
  {
    id: 'FAC-03',
    name: 'Logistics & Distribution Hub North',
    location: 'Rotterdam, Netherlands',
    withdrawal: '1,680 m³',
    recycled: '460 m³',
    rate: '27.4%',
    intensity: '5.2 m³/ton',
    stressLevel: 'Medium',
    status: 'On Track',
  },
  {
    id: 'FAC-04',
    name: 'Global HQ & Innovation Center',
    location: 'Zurich, Switzerland',
    withdrawal: '1,140 m³',
    recycled: '240 m³',
    rate: '21.1%',
    intensity: '3.8 m³/FTE',
    stressLevel: 'Low',
    status: 'Optimal',
  },
]

export const initialWaterLedger = [
  {
    id: 'WAT-201',
    date: '2026-03-01',
    facility: 'Advanced Fabrication Plant A',
    type: 'Municipal Intake',
    volume: 540,
    unit: 'm³',
    cost: '$1,350',
    qualityIndex: 'Potable Grade A',
  },
  {
    id: 'WAT-202',
    date: '2026-03-02',
    facility: 'Assembly & Testing Campus B',
    type: 'Greywater Recycled',
    volume: 180,
    unit: 'm³',
    cost: '$210',
    qualityIndex: 'Process Cooling Loop',
  },
  {
    id: 'WAT-203',
    date: '2026-03-03',
    facility: 'Advanced Fabrication Plant A',
    type: 'Treated Discharge',
    volume: 320,
    unit: 'm³',
    cost: '$480',
    qualityIndex: 'EPA Standard Pass',
  },
  {
    id: 'WAT-204',
    date: '2026-03-04',
    facility: 'Logistics & Distribution Hub North',
    type: 'Rainwater Harvested',
    volume: 95,
    unit: 'm³',
    cost: '$45',
    qualityIndex: 'Landscape / Sanitization',
  },
]

// ==========================================
// Compliance Analytics & SBTi Trajectory
// ==========================================
export const sbtiTrajectoryData = [
  { year: '2021', actual: 3520, sbtiTarget: 3520, baseline: 3520 },
  { year: '2022', actual: 3350, sbtiTarget: 3372, baseline: 3520 },
  { year: '2023', actual: 3210, sbtiTarget: 3230, baseline: 3520 },
  { year: '2024', actual: 3060, sbtiTarget: 3094, baseline: 3520 },
  { year: '2025', actual: 2920, sbtiTarget: 2964, baseline: 3520 },
  { year: '2026', actual: 2847, sbtiTarget: 2839, baseline: 3520 },
  { year: '2027', actual: null, sbtiTarget: 2719, baseline: 3520 },
  { year: '2028', actual: null, sbtiTarget: 2605, baseline: 3520 },
  { year: '2029', actual: null, sbtiTarget: 2495, baseline: 3520 },
  { year: '2030', actual: null, sbtiTarget: 2390, baseline: 3520 },
]

export const scopeBreakdownData = [
  { name: 'Scope 1 · Direct', value: 1708, percent: 60, color: '#047857' },
  { name: 'Scope 2 · Purchased Power', value: 911, percent: 32, color: '#0ea5e9' },
  { name: 'Scope 3 · Value Chain', value: 228, percent: 8, color: '#14b8a6' },
]

export const intensityMetrics = [
  {
    title: 'Revenue Carbon Intensity',
    value: '18.4',
    unit: 'tCO₂e / $M Revenue',
    change: '↓ 11.2%',
    status: 'positive',
    target: '≤ 16.0 by 2028',
  },
  {
    title: 'Headcount Intensity',
    value: '3.18',
    unit: 'tCO₂e / FTE Employee',
    change: '↓ 7.8%',
    status: 'positive',
    target: '≤ 3.00 by 2027',
  },
  {
    title: 'Production Volume Intensity',
    value: '0.41',
    unit: 'tCO₂e / Tonne Produced',
    change: '↓ 5.4%',
    status: 'positive',
    target: '≤ 0.38 by 2027',
  },
  {
    title: 'Energy Intensity',
    value: '0.32',
    unit: 'GWh / $M Revenue',
    change: '↓ 6.9%',
    status: 'positive',
    target: '≤ 0.28 by 2030',
  },
]

export const decarbonizationProjects = [
  {
    id: 'PRJ-1',
    title: 'Onsite Rooftop Solar Photovoltaics (4.2 MWp)',
    sector: 'Manufacturing',
    reductionEst: '420 tCO₂e/yr',
    cost: '$1.2M',
    roiYears: '4.2 yrs',
    progress: 85,
    status: 'In Commissioning',
  },
  {
    id: 'PRJ-2',
    title: 'Commercial Fleet Electrification (Phase 1: 45 EV Vans)',
    sector: 'Transportation',
    reductionEst: '260 tCO₂e/yr',
    cost: '$850k',
    roiYears: '5.1 yrs',
    progress: 52,
    status: 'In Progress',
  },
  {
    id: 'PRJ-3',
    title: 'Waste Heat Recovery Loops & High-Efficiency Chillers',
    sector: 'Energy & Utilities',
    reductionEst: '185 tCO₂e/yr',
    cost: '$420k',
    roiYears: '2.8 yrs',
    progress: 92,
    status: 'Operational',
  },
  {
    id: 'PRJ-4',
    title: 'Zero-Landfill Circular Packaging & Composting',
    sector: 'Waste Management',
    reductionEst: '95 tCO₂e/yr',
    cost: '$160k',
    roiYears: '1.9 yrs',
    progress: 68,
    status: 'In Progress',
  },
]

// ==========================================
// ESG & Compliance Frameworks
// ==========================================
export const complianceFrameworks = {
  ghgProtocol: {
    id: 'ghg',
    name: 'GHG Protocol Corporate Standard',
    standard: 'WRI / WBCSD Standard (Revised Edition)',
    boundary: 'Operational Control Boundary (100% Facilities)',
    baseYear: '2021 (3,520 tCO₂e baseline)',
    auditStatus: 'Third-Party Verified (ISO 14064-3)',
    verificationBody: 'Bureau Veritas Quality Assurance',
    assuranceLevel: 'Limited Assurance',
  },
  csrd: {
    id: 'csrd',
    name: 'CSRD / ESRS E1 Climate Change',
    standard: 'European Sustainability Reporting Standards (E1)',
    boundary: 'Consolidated Enterprise Group Boundary',
    baseYear: '2021 Base Year Restated',
    auditStatus: 'Assurance Ready (ESRS Disclosure Points 1-9)',
    verificationBody: 'DNV GL Business Assurance',
    assuranceLevel: 'Reasonable Assurance Target 2027',
  },
  iso14064: {
    id: 'iso',
    name: 'ISO 14064-1:2018 Organization GHG',
    standard: 'International Organization for Standardization 14064-1',
    boundary: 'Direct Category 1 & Indirect Categories 2-4',
    baseYear: '2021 (Verified Baseline)',
    auditStatus: 'Certified Conformity Statement Issued',
    verificationBody: 'TÜV SÜD Sustainability Services',
    assuranceLevel: 'Certified Compliance',
  },
}
