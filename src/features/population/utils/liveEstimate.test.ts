import { describe, expect, it } from 'vitest'
import {
    AVERAGE_MONTH_SECONDS,
    getMonthEndAnchorTimestamp,
    getLivePopulationEstimate,
} from './liveEstimate'

describe('getLivePopulationEstimate', () => {
    it('builds an anchor timestamp at the end of the reported month in Taiwan time', () => {
        expect(getMonthEndAnchorTimestamp('2026-03')).toBe('2026-03-31T15:59:59.999Z')
    })

    it('uses the fixed anchor timestamp instead of visit time', () => {
        const anchorTimestamp = '2026-04-14T02:30:00.000Z'
        const oneHourLater = Date.parse(anchorTimestamp) + (60 * 60 * 1000)

        const estimate = getLivePopulationEstimate(
            23_270_568,
            -AVERAGE_MONTH_SECONDS,
            anchorTimestamp,
            oneHourLater,
        )

        expect(estimate.estimate).toBeCloseTo(23_266_968, 5)
        expect(estimate.displayPopulation).toBe(23_266_968)
        expect(estimate.progressPercentage).toBe(0)
        expect(estimate.secondsPerPerson).toBeCloseTo(1, 10)
        expect(estimate.transitionPhase).toBe('towards-white')
        expect(estimate.movement).toBe('decrease')
    })

    it('starts the next cycle from full white before fading back to black', () => {
        const anchorTimestamp = '2026-04-14T02:30:00.000Z'
        const threeSecondsLater = Date.parse(anchorTimestamp) + 3000

        const estimate = getLivePopulationEstimate(
            23_270_568,
            AVERAGE_MONTH_SECONDS / 2,
            anchorTimestamp,
            threeSecondsLater,
        )

        expect(estimate.displayPopulation).toBe(23_270_569)
        expect(estimate.progressPercentage).toBeCloseTo(50, 10)
        expect(estimate.transitionPhase).toBe('towards-black')
        expect(estimate.movement).toBe('increase')
    })

    it('keeps the displayed population flat until an increase cycle is complete', () => {
        const anchorTimestamp = '2026-04-14T02:30:00.000Z'
        const oneSecondLater = Date.parse(anchorTimestamp) + 1000

        const estimate = getLivePopulationEstimate(
            23_270_568,
            AVERAGE_MONTH_SECONDS / 2,
            anchorTimestamp,
            oneSecondLater,
        )

        expect(estimate.estimate).toBeCloseTo(23_270_568.5, 5)
        expect(estimate.displayPopulation).toBe(23_270_568)
        expect(estimate.progressPercentage).toBeCloseTo(50, 10)
        expect(estimate.secondsPerPerson).toBeCloseTo(2, 10)
        expect(estimate.transitionPhase).toBe('towards-white')
        expect(estimate.movement).toBe('increase')
    })

    it('changes the displayed population only when an increase cycle is complete', () => {
        const anchorTimestamp = '2026-04-14T02:30:00.000Z'
        const twoSecondsLater = Date.parse(anchorTimestamp) + 2000

        const estimate = getLivePopulationEstimate(
            23_270_568,
            AVERAGE_MONTH_SECONDS / 2,
            anchorTimestamp,
            twoSecondsLater,
        )

        expect(estimate.estimate).toBeCloseTo(23_270_569, 5)
        expect(estimate.displayPopulation).toBe(23_270_569)
        expect(estimate.progressPercentage).toBe(100)
        expect(estimate.secondsPerPerson).toBeCloseTo(2, 10)
        expect(estimate.transitionPhase).toBe('towards-black')
        expect(estimate.movement).toBe('increase')
    })

    it('keeps the displayed population flat until a decrease cycle is complete', () => {
        const anchorTimestamp = '2026-04-14T02:30:00.000Z'
        const threeSecondsLater = Date.parse(anchorTimestamp) + 3000

        const estimate = getLivePopulationEstimate(
            23_270_568,
            -(AVERAGE_MONTH_SECONDS / 2),
            anchorTimestamp,
            threeSecondsLater,
        )

        expect(estimate.estimate).toBeCloseTo(23_270_566.5, 5)
        expect(estimate.displayPopulation).toBe(23_270_567)
        expect(estimate.progressPercentage).toBeCloseTo(50, 10)
        expect(estimate.secondsPerPerson).toBeCloseTo(2, 10)
        expect(estimate.transitionPhase).toBe('towards-black')
        expect(estimate.movement).toBe('decrease')
    })

    it('falls back to the latest official value when decline speed is unavailable', () => {
        const estimate = getLivePopulationEstimate(
            23_270_568,
            0,
            '2026-04-14T02:30:00.000Z',
            Date.parse('2026-04-16T02:30:00.000Z'),
        )

        expect(estimate).toEqual({
            estimate: 23_270_568,
            displayPopulation: 23_270_568,
            progressPercentage: 0,
            secondsPerPerson: null,
            transitionPhase: 'towards-white',
            movement: 'flat',
        })
    })
})
