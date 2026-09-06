export const EMISSION_ACTIVITIES = {
  'Fleet Diesel': {
    scope: 'Scope 1',
    unit: 'L',
    factorKgCO2e: 2.68,
    category: 'Direct Fuel Combustion',
  },
  'Natural Gas': {
    scope: 'Scope 1',
    unit: 'm³',
    factorKgCO2e: 2.03,
    category: 'Stationary Combustion',
  },
  'Grid Electricity': {
    scope: 'Scope 2',
    unit: 'kWh',
    factorKgCO2e: 0.43,
    category: 'Purchased Electricity',
  },
  'Municipal Water': {
    scope: 'Scope 3',
    unit: 'm³',
    factorKgCO2e: 0.344,
    category: 'Water Supply & Treatment',
  },
  'Landfill Waste': {
    scope: 'Scope 3',
    unit: 'kg',
    factorKgCO2e: 0.52,
    category: 'Waste Disposal',
  },
}

export function calculateEmissions(activityType, quantity) {
  const config = EMISSION_ACTIVITIES[activityType]
  if (!config) return { tCO2e: 0, scope: 'Scope 1', unit: '' }

  const num = parseFloat(quantity) || 0
  const totalKg = num * config.factorKgCO2e
  const tCO2e = Number((totalKg / 1000).toFixed(2))

  return {
    tCO2e,
    scope: config.scope,
    unit: config.unit,
    factor: config.factorKgCO2e,
  }
}
