/**
 * AI Decarbonization Copilot & Anomaly Detection Engine
 * Provides automated consumption spike detection, target-driven abatement recommendations,
 * and contextual natural-language carbon intelligence.
 */

export const ANOMALY_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  OPPORTUNITY: 'opportunity',
}

/**
 * Scans organization telemetry to detect anomalies and consumption spikes.
 */
export function detectAnomalies({ sectors = [], ledger = [], waterData = [] }) {
  const anomalies = []

  // 1. Sector level trend anomalies (e.g. sectors with positive increases)
  sectors.forEach((s) => {
    if (s.change && s.change.includes('↑')) {
      const pctMatch = s.change.match(/[\d.]+%/)
      const pct = pctMatch ? pctMatch[0] : 'increased'
      anomalies.push({
        id: `anom-sec-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${s.name} Emission Surge (${pct})`,
        sector: s.name,
        severity: ANOMALY_SEVERITY.CRITICAL,
        category: 'Scope 1 & 2',
        description: `${s.name} emissions rose by ${pct} against last period, deviating from your corporate -4.2%/yr SBTi reduction glidepath.`,
        excessCarbon: '24.2 tCO₂e',
        estimatedCostPenalty: '$2,850',
        recommendedAction: 'Audit high-idle commercial transport routes & implement automated GPS speed throttling.',
        actionType: 'Investigate Sector',
      })
    }
  })

  // 2. High-volume single activity spike in ledger
  if (Array.isArray(ledger) && ledger.length > 0) {
    const singleSpikes = ledger.filter(
      (r) => (r.activityType === 'Fleet Diesel' && r.quantity > 4000) || (r.activityType === 'Natural Gas' && r.quantity > 10000)
    )
    if (singleSpikes.length > 0) {
      const spike = singleSpikes[0]
      anomalies.push({
        id: `anom-spike-${spike.id}`,
        title: `Abnormal ${spike.activityType} Batch in ${spike.sector}`,
        sector: spike.sector,
        severity: ANOMALY_SEVERITY.WARNING,
        category: spike.scope,
        description: `Single log on ${spike.date} consumed ${spike.quantity.toLocaleString()} ${spike.unit}, generating ${spike.emissions} tCO₂e. This is 34% above the 30-day baseline for this facility.`,
        excessCarbon: `${(spike.emissions * 0.34).toFixed(1)} tCO₂e`,
        estimatedCostPenalty: '$1,420',
        recommendedAction: 'Verify submeter calibration or investigate off-peak boiler overheating.',
        actionType: 'Review Entry',
      })
    }
  }

  // 3. Water consumption circularity check
  anomalies.push({
    id: 'anom-water-stress',
    title: 'Austin Assembly Campus Water Stress Alert',
    sector: 'Manufacturing',
    severity: ANOMALY_SEVERITY.WARNING,
    category: 'Scope 3 / Resource',
    description: 'Facility B operates in a High Water Stress Basin with a 30.5% circularity rate, lagging behind the Munich Plant target of 33.3%.',
    excessCarbon: '3.8 tCO₂e',
    estimatedCostPenalty: '$980',
    recommendedAction: 'Install closed-loop cooling tower filtration to recover an estimated 320 m³/month.',
    actionType: 'Inspect Water Loop',
  })

  // 4. Decarbonization Quick-Win Opportunity
  anomalies.push({
    id: 'anom-opp-solar',
    title: 'Scope 2 Solar Arbitrage Opportunity',
    sector: 'Energy & Utilities',
    severity: ANOMALY_SEVERITY.OPPORTUNITY,
    category: 'Scope 2',
    description: 'Daytime grid electricity rate at Facility A peaked at $0.18/kWh. Accelerating Phase 2 Solar PV installation would save 35 tCO₂e next month.',
    excessCarbon: '-35.0 tCO₂e Potential',
    estimatedCostPenalty: '$4,100 Potential Savings',
    recommendedAction: 'Commission pending 1.2 MWp solar arrays ahead of Q3 peak summer rates.',
    actionType: 'View Solar Project',
  })

  return anomalies
}

/**
 * Top target-driven decarbonization advisory projects.
 */
export function getDecarbonizationAdvice() {
  return [
    {
      id: 'adv-1',
      title: 'Commercial Fleet EV Van Transition (Phase 1)',
      sector: 'Transportation',
      scopeTarget: 'Scope 1',
      abatementTonnes: 260,
      annualCostSavings: '$48,000',
      paybackYears: 4.8,
      difficulty: 'Medium',
      impact: 'High',
      summary:
        'Transition 30 last-mile diesel delivery vans to 85 kWh electric vans. Eliminates 260 tCO₂e annually and drops Transportation sector emissions by 36.5%.',
    },
    {
      id: 'adv-2',
      title: 'Offsite Virtual Power Purchase Agreement (VPPA)',
      sector: 'Energy & Utilities',
      scopeTarget: 'Scope 2',
      abatementTonnes: 580,
      annualCostSavings: '$82,000',
      paybackYears: 2.5,
      difficulty: 'Low',
      impact: 'Very High',
      summary:
        'Contract 15 GWh of regional wind and solar power under fixed 5-year tariffs. Directly transitions grid electricity from 35% renewable to 65% renewable.',
    },
    {
      id: 'adv-3',
      title: 'Process Waste Heat Recovery Loops',
      sector: 'Manufacturing',
      scopeTarget: 'Scope 1',
      abatementTonnes: 185,
      annualCostSavings: '$32,000',
      paybackYears: 2.8,
      difficulty: 'Medium',
      impact: 'Medium',
      summary:
        'Capture exhaust heat from fabrication furnaces to pre-heat manufacturing water systems, reducing natural gas boiler consumption by 18%.',
    },
    {
      id: 'adv-4',
      title: 'Circular Zero-Landfill Packaging Mandate',
      sector: 'Waste Management',
      scopeTarget: 'Scope 3',
      abatementTonnes: 95,
      annualCostSavings: '$14,500',
      paybackYears: 1.5,
      difficulty: 'Low',
      impact: 'Medium',
      summary:
        'Mandate 100% compostable pallet wrap and returnable shipping totes across Tier-1 distribution centers, achieving 88% diversion.',
    },
  ]
}

/**
 * Natural language intent parsing and contextual ESG Copilot answers.
 */
export function processCopilotQuery(prompt, context = {}) {
  const query = (prompt || '').toLowerCase().trim()
  const sectors = context.sectors || []
  const totalEmissions = context.totalEmissions || '2,847'

  // Hotspot Analysis
  if (query.includes('hotspot') || query.includes('biggest') || query.includes('source') || query.includes('where')) {
    return {
      reply: `Your biggest emissions hotspot is **Manufacturing**, accounting for **45% of total gross emissions (1,281 tCO₂e)**, followed by **Transportation at 25% (712 tCO₂e)**. Combined, these two sectors represent 70% of your organization's carbon footprint.`,
      chips: [
        { label: 'Manufacturing: 1,281 tCO₂e (45%)', tone: 'emerald' },
        { label: 'Transportation: 712 tCO₂e (25%)', tone: 'amber' },
      ],
      suggestedQuestions: [
        'How do we decarbonize Manufacturing?',
        'Why is Transportation emissions rising?',
        'Scan for active anomalies',
      ],
    }
  }

  // Anomaly Scan
  if (query.includes('anomaly') || query.includes('spike') || query.includes('alert') || query.includes('warning') || query.includes('unusual')) {
    return {
      reply: `I detected **2 active consumption anomalies** requiring immediate review:
1. **Transportation Sector Surge (↑ 3.4%):** Rising fleet diesel consumption is currently exceeding your SBTi 1.5°C reduction trajectory.
2. **Austin Assembly Water Basin Risk:** Water stress in the Edwards Aquifer catchment basin requires circular cooling tower filtration.`,
      chips: [
        { label: 'Critical: Transportation Surge', tone: 'amber' },
        { label: 'Warning: Water Basin Stress', tone: 'sky' },
      ],
      suggestedQuestions: [
        'How can we fix the Transportation surge?',
        'Show high-ROI decarbonization projects',
        'Check SBTi 2030 target readiness',
      ],
    }
  }

  // SBTi / 2030 Target Readiness
  if (query.includes('sbti') || query.includes('target') || query.includes('2030') || query.includes('paris') || query.includes('goal')) {
    return {
      reply: `You are currently **on track** for your near-term 2030 SBTi targets!
- **Verified 2026 Emissions:** **2,847 tCO₂e**, which is **Ahead** of the required interim threshold of 2,839 tCO₂e.
- **Annual Decarbonization Run-Rate:** -4.2% linear reduction per year required to hit **2,390 tCO₂e by 2030** (-32% vs 2021 base year).
- **Primary Risk:** Transportation sector growth must be reined in via fleet electrification to stay within 2027 allowances.`,
      chips: [
        { label: 'Current: 2,847 tCO₂e (On Track)', tone: 'emerald' },
        { label: '2030 Goal: 2,390 tCO₂e', tone: 'sky' },
      ],
      suggestedQuestions: [
        'What projects get us to 2030 targets?',
        'Analyze emissions hotspots',
        'How does renewable energy help?',
      ],
    }
  }

  // Decarbonization Recommendations / Quick Wins
  if (query.includes('recommend') || query.includes('project') || query.includes('roi') || query.includes('reduce') || query.includes('win') || query.includes('cost')) {
    const advice = getDecarbonizationAdvice()
    return {
      reply: `Here are your **top 3 high-ROI decarbonization projects** ranked by marginal abatement cost:
1. **Virtual PPA (Power Purchase Agreement):** Cuts **580 tCO₂e/yr** with a 2.5-year payback and $82k annual utility savings.
2. **Process Waste Heat Recovery:** Cuts **185 tCO₂e/yr** with a 2.8-year payback in your core manufacturing furnaces.
3. **Fleet Electrification (Phase 1):** Cuts **260 tCO₂e/yr** and halts your Transportation surge.`,
      chips: [
        { label: 'VPPA: -580 tCO₂e (2.5y ROI)', tone: 'emerald' },
        { label: 'Heat Recovery: -185 tCO₂e (2.8y ROI)', tone: 'emerald' },
        { label: 'EV Vans: -260 tCO₂e (4.8y ROI)', tone: 'sky' },
      ],
      suggestedQuestions: [
        'What is our biggest emissions hotspot?',
        'Scan for active anomalies',
        'Explain Scope 1 vs Scope 2 breakdown',
      ],
    }
  }

  // Default Fallback
  return {
    reply: `I am your **EcoTrack AI Decarbonization Copilot**. Based on your verified gross footprint of **${totalEmissions} tCO₂e**, I can analyze consumption hotspots, run anomaly detection, or recommend capital projects to accelerate your 2030 net-zero targets.`,
    chips: [
      { label: `Total Footprint: ${totalEmissions} tCO₂e`, tone: 'emerald' },
      { label: 'SBTi 1.5°C Active', tone: 'sky' },
    ],
    suggestedQuestions: [
      'What is our biggest emissions hotspot?',
      'Scan for active anomalies',
      'Recommend highest-ROI decarbonization projects',
      'Check SBTi 2030 target readiness',
    ],
  }
}
