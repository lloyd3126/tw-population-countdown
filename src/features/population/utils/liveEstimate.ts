export interface LivePopulationEstimate {
    estimate: number
    displayPopulation: number
    progressPercentage: number
    secondsPerPerson: number | null
    transitionPhase: 'towards-white' | 'towards-black'
    movement: 'increase' | 'decrease' | 'flat'
}

export const AVERAGE_MONTH_SECONDS = (365.2425 / 12) * 24 * 60 * 60
const WHOLE_NUMBER_TOLERANCE = 1e-9

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

function getCompletedPopulationSteps(elapsedSeconds: number, secondsPerPerson: number): number {
    if (!Number.isFinite(secondsPerPerson) || secondsPerPerson <= 0) {
        return 0
    }

    return Math.max(Math.floor(elapsedSeconds / secondsPerPerson), 0)
}

function getProgressPercentage(elapsedSeconds: number, secondsPerPerson: number): number {
    if (!Number.isFinite(secondsPerPerson) || secondsPerPerson <= 0) {
        return 0
    }

    const completedCycles = elapsedSeconds / secondsPerPerson

    if (completedCycles <= 0) {
        return 0
    }

    const nearestWholeCycles = Math.round(completedCycles)

    if (Math.abs(completedCycles - nearestWholeCycles) < WHOLE_NUMBER_TOLERANCE) {
        return nearestWholeCycles % 2 === 0 ? 0 : 100
    }

    const completedPopulationSteps = Math.floor(completedCycles)
    const fractionalCycle = completedCycles - completedPopulationSteps

    if (completedPopulationSteps % 2 === 0) {
        return fractionalCycle * 100
    }

    return (1 - fractionalCycle) * 100
}

function getTransitionPhase(elapsedSeconds: number, secondsPerPerson: number): 'towards-white' | 'towards-black' {
    if (!Number.isFinite(secondsPerPerson) || secondsPerPerson <= 0) {
        return 'towards-white'
    }

    const completedPopulationSteps = Math.floor(elapsedSeconds / secondsPerPerson)

    return completedPopulationSteps % 2 === 0 ? 'towards-white' : 'towards-black'
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
            displayPopulation: latestPopulation,
            progressPercentage: 0,
            secondsPerPerson: null,
            transitionPhase: 'towards-white',
            movement: 'flat',
        }
    }

    const perSecondChange = averageMonthlyChange / AVERAGE_MONTH_SECONDS
    const elapsedSeconds = getSafeElapsedSeconds(anchorTimestamp, nowTimestamp)
    const secondsPerPerson = 1 / Math.abs(perSecondChange)
    const movement = perSecondChange > 0 ? 'increase' : 'decrease'
    const completedPopulationSteps = getCompletedPopulationSteps(elapsedSeconds, secondsPerPerson)
    const displayPopulation = movement === 'increase'
        ? latestPopulation + completedPopulationSteps
        : latestPopulation - completedPopulationSteps

    return {
        estimate: latestPopulation + (perSecondChange * elapsedSeconds),
        displayPopulation,
        progressPercentage: getProgressPercentage(elapsedSeconds, secondsPerPerson),
        secondsPerPerson,
        transitionPhase: getTransitionPhase(elapsedSeconds, secondsPerPerson),
        movement,
    }
}
