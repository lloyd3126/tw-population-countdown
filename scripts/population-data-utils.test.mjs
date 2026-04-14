import { describe, expect, it } from 'vitest'
import { applyStableUpdatedAt } from './population-data-utils.mjs'

describe('applyStableUpdatedAt', () => {
  it('preserves the existing timestamp when month data is unchanged', () => {
    const previousSummaries = [
      {
        month: '2026-03',
        rocMonth: '11503',
        populationTotal: 23_270_568,
        populationMale: 11_444_400,
        populationFemale: 11_826_168,
        births: 8_798,
        deaths: 18_607,
        naturalChange: -9_809,
        marriages: 9_756,
        divorces: 4_765,
        momChange: -9_705,
        yoyChange: -104_174,
        updatedAt: '2026-04-14T02:30:00.285Z',
        sources: {
          populationDataset: '77145',
          vitalDataset: '131135',
        },
      },
    ]

    const nextSummaries = [
      {
        month: '2026-03',
        rocMonth: '11503',
        populationTotal: 23_270_568,
        populationMale: 11_444_400,
        populationFemale: 11_826_168,
        births: 8_798,
        deaths: 18_607,
        naturalChange: -9_809,
        marriages: 9_756,
        divorces: 4_765,
        momChange: -9_705,
        yoyChange: -104_174,
        sources: {
          populationDataset: '77145',
          vitalDataset: '131135',
        },
      },
    ]

    const result = applyStableUpdatedAt(
      previousSummaries,
      nextSummaries,
      '2026-04-15T02:30:00.000Z',
    )

    expect(result[0]?.updatedAt).toBe('2026-04-14T02:30:00.285Z')
  })

  it('writes a new timestamp when the latest month data changes', () => {
    const previousSummaries = [
      {
        month: '2026-03',
        rocMonth: '11503',
        populationTotal: 23_270_568,
        populationMale: 11_444_400,
        populationFemale: 11_826_168,
        births: 8_798,
        deaths: 18_607,
        naturalChange: -9_809,
        marriages: 9_756,
        divorces: 4_765,
        momChange: -9_705,
        yoyChange: -104_174,
        updatedAt: '2026-04-14T02:30:00.285Z',
        sources: {
          populationDataset: '77145',
          vitalDataset: '131135',
        },
      },
    ]

    const nextSummaries = [
      {
        month: '2026-03',
        rocMonth: '11503',
        populationTotal: 23_270_567,
        populationMale: 11_444_399,
        populationFemale: 11_826_168,
        births: 8_798,
        deaths: 18_607,
        naturalChange: -9_809,
        marriages: 9_756,
        divorces: 4_765,
        momChange: -9_706,
        yoyChange: -104_175,
        sources: {
          populationDataset: '77145',
          vitalDataset: '131135',
        },
      },
    ]

    const result = applyStableUpdatedAt(
      previousSummaries,
      nextSummaries,
      '2026-04-15T02:30:00.000Z',
    )

    expect(result[0]?.updatedAt).toBe('2026-04-15T02:30:00.000Z')
  })
})
