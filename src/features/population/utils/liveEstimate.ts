export interface LivePopulationEstimate {
    estimate: number
    secondsPerPerson: number | null
    movement: 'increase' | 'decrease' | 'flat'
}

export const AVERAGE_MONTH_SECONDS = (365.2425 / 12) * 24 * 60 * 60

export function getMonthEndAnchorTimestamp(month: string): string | null {
    const [yearText, monthText] = month.split('-')
    const year = Number(yearText)
    const monthIndex = Number(monthText) - 1

    if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return null
    }

    const taipeiMonthEnd = new Date(Date.UTC(year, monthIndex + 1, 1, -8, 0, 0, 0) - 1)

    return taipeiMonthEnd.toISOString()
}

function getSafeElapsedSeconds(anchorTimestamp: string, nowTimestamp: number): number {
    const anchorTime = Date.parse(anchorTimestamp)

    if (Number.isNaN(anchorTime)) {
        return 0
    }

    return Math.max((nowTimestamp - anchorTime) / 1000, 0)
}

export function getLivePopulationEstimate(
    latestPopulation: number,
    averageMonthlyChange: number,
    anchorTimestamp: string,
    nowTimestamp = Date.now(),
): LivePopulationEstimate {
    if (averageMonthlyChange === 0) {
        return {
            estimate: latestPopulation,
            secondsPerPerson: null,
            movement: 'flat',
        }
    }

    const perSecondChange = averageMonthlyChange / AVERAGE_MONTH_SECONDS
    const elapsedSeconds = getSafeElapsedSeconds(anchorTimestamp, nowTimestamp)

    return {
        estimate: latestPopulation + (perSecondChange * elapsedSeconds),
        secondsPerPerson: 1 / Math.abs(perSecondChange),
        movement: perSecondChange > 0 ? 'increase' : 'decrease',
    }
}
