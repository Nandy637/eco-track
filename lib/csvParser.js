import { EMISSION_ACTIVITIES, calculateEmissions } from './emissions'
import { exportToCsv } from './exportCsv'

/**
 * Parses raw CSV text into an array of objects based on header keys.
 * Handles quoted cells with commas and escaped double quotes.
 */
export function parseCsvText(text) {
  if (!text || typeof text !== 'string') return []

  const lines = text.split(/\r\n|\n|\r/).filter((line) => line.trim().length > 0)
  if (lines.length < 2) return []

  // Helper to tokenize a CSV line
  const tokenizeLine = (line) => {
    const tokens = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++ // skip escaped quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        tokens.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    tokens.push(current.trim())
    return tokens
  }

  const rawHeaders = tokenizeLine(lines[0])
  // Normalize header names: lowercase, strip non-alphanumeric
  const normalizeKey = (h) => h.toLowerCase().replace(/[^a-z0-9]/g, '')
  const normalizedHeaders = rawHeaders.map(normalizeKey)

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const values = tokenizeLine(lines[i])
    if (values.length === 0 || values.every((v) => v === '')) continue

    const rowObj = {}
    normalizedHeaders.forEach((key, index) => {
      rowObj[key] = values[index] ?? ''
    })
    rows.push(rowObj)
  }

  return rows
}

/**
 * Validates and maps raw row objects into normalized emission items.
 */
export function validateAndMapRows(rawRows, availableSectors = []) {
  const validActivityNames = Object.keys(EMISSION_ACTIVITIES)

  return rawRows.map((raw, idx) => {
    const rowNum = idx + 2 // 1-indexed header is row 1

    // Try common header variations
    const date = raw.date || raw.activitydate || new Date().toISOString().split('T')[0]
    const sector =
      raw.sector ||
      raw.operatingsector ||
      (availableSectors.length ? availableSectors[0].name : 'Manufacturing')
    const activityTypeRaw = raw.activitytype || raw.activity || raw.source || raw.emissionsource
    const quantityRaw = raw.quantity || raw.consumption || raw.amount || raw.val
    const notes = raw.notes || raw.reference || raw.comments || ''

    // Fuzzy match activity type
    let matchedActivity = validActivityNames.find(
      (a) => a.toLowerCase() === (activityTypeRaw || '').toLowerCase()
    )

    // Common synonyms
    if (!matchedActivity && activityTypeRaw) {
      const lower = activityTypeRaw.toLowerCase()
      if (lower.includes('diesel') || lower.includes('fuel')) matchedActivity = 'Fleet Diesel'
      else if (lower.includes('gas') || lower.includes('methane')) matchedActivity = 'Natural Gas'
      else if (lower.includes('electr') || lower.includes('power') || lower.includes('kwh'))
        matchedActivity = 'Grid Electricity'
      else if (lower.includes('water')) matchedActivity = 'Municipal Water'
      else if (lower.includes('waste') || lower.includes('landfill')) matchedActivity = 'Landfill Waste'
    }

    const errors = []
    const quantityNum = parseFloat(quantityRaw)

    if (!matchedActivity) {
      errors.push(`Unrecognized source '${activityTypeRaw}'. Allowed: ${validActivityNames.join(', ')}`)
    }

    if (isNaN(quantityNum) || quantityNum <= 0) {
      errors.push('Quantity must be a positive number')
    }

    let calculation = { tCO2e: 0, scope: 'Scope 1', unit: 'units' }
    if (matchedActivity && !isNaN(quantityNum) && quantityNum > 0) {
      calculation = calculateEmissions(matchedActivity, quantityNum)
    }

    return {
      rowNum,
      date,
      sector,
      activityType: matchedActivity || activityTypeRaw || 'Unknown',
      quantity: isNaN(quantityNum) ? 0 : quantityNum,
      unit: calculation.unit,
      scope: calculation.scope,
      emissions: calculation.tCO2e,
      notes,
      isValid: errors.length === 0,
      errors,
    }
  })
}

/**
 * Downloads a ready-to-use CSV template for facility operators.
 */
export function downloadSampleCsvTemplate() {
  const sampleData = [
    {
      Date: '2026-03-01',
      Sector: 'Manufacturing',
      ActivityType: 'Natural Gas',
      Quantity: 15000,
      Notes: 'Main Boiler Unit A - Meter #102',
    },
    {
      Date: '2026-03-02',
      Sector: 'Transportation',
      ActivityType: 'Fleet Diesel',
      Quantity: 3200,
      Notes: 'Long-haul transport fleet refueling',
    },
    {
      Date: '2026-03-03',
      Sector: 'Manufacturing',
      ActivityType: 'Grid Electricity',
      Quantity: 85000,
      Notes: 'Substation B assembly line power',
    },
    {
      Date: '2026-03-04',
      Sector: 'Office & Administration',
      ActivityType: 'Municipal Water',
      Quantity: 620,
      Notes: 'HQ Campus municipal utility meter',
    },
    {
      Date: '2026-03-05',
      Sector: 'Waste Management',
      ActivityType: 'Landfill Waste',
      Quantity: 4500,
      Notes: 'Non-diverted warehouse solid waste',
    },
  ]

  exportToCsv('ecotrack-bulk-emissions-template', sampleData)
}
