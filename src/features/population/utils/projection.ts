import type { MonthlyPopulationSummary } from '../types'

export type PopulationProjection = {
  latestPopulation: number
  targetPopulation: number
  averageMonthlyDecline: number
  monthsToTarget: number
  projectedMonth: string
}

function parseMonth(month: string) {
  const [year, monthPart] = month.split('-').map(Number)

  return new Date(year, monthPart - 1, 1)
}

function formatMonth(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

export function getAverageMonthlyPopulationChange(
  history: MonthlyPopulationSummary[],
): number | null {
  if (history.length < 2) {
    return null
  }

  const recentHistory = history.slice(-13)

  if (recentHistory.length < 2) {
    return null
  }

  const monthlyChanges = recentHistory.slice(1).map((row, index) => {
    return row.populationTotal - recentHistory[index].populationTotal
  })

  return monthlyChanges.reduce((sum, value) => sum + value, 0) / monthlyChanges.length
}

export function getPopulationProjection(
  history: MonthlyPopulationSummary[],
  targetLoss: number,
): PopulationProjection | null {
  if (history.length < 2) {
    return null
  }

  const recentHistory = history.slice(-13)
  const latest = recentHistory.at(-1)

  if (!latest) {
    return null
  }

  const averageMonthlyChange = getAverageMonthlyPopulationChange(recentHistory)

  if (averageMonthlyChange === null) {
    return null
  }

  const averageMonthlyDecline = averageMonthlyChange < 0 ? Math.abs(averageMonthlyChange) : 0

  if (averageMonthlyDecline === 0) {
    return null
  }

  const monthsToTarget = targetLoss / averageMonthlyDecline
  const projectedDate = parseMonth(latest.month)
  projectedDate.setMonth(projectedDate.getMonth() + Math.round(monthsToTarget))

  return {
    latestPopulation: latest.populationTotal,
    targetPopulation: latest.populationTotal - targetLoss,
    averageMonthlyDecline,
    monthsToTarget,
    projectedMonth: formatMonth(projectedDate),
  }
}
