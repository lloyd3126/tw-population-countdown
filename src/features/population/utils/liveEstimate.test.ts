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
        expect(estimate.secondsPerPerson).toBeCloseTo(1, 10)
        expect(estimate.movement).toBe('decrease')
    })

    it('reports increasing movement when the average trend is positive', () => {
        const anchorTimestamp = '2026-04-14T02:30:00.000Z'
        const oneHourLater = Date.parse(anchorTimestamp) + (60 * 60 * 1000)

        const estimate = getLivePopulationEstimate(
            23_270_568,
            AVERAGE_MONTH_SECONDS / 2,
            anchorTimestamp,
            oneHourLater,
        )

        expect(estimate.estimate).toBeCloseTo(23_272_368, 5)
        expect(estimate.secondsPerPerson).toBeCloseTo(2, 10)
        expect(estimate.movement).toBe('increase')
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
            secondsPerPerson: null,
            movement: 'flat',
        })
    })
})
