import { useEffect, useState } from 'react'
import type { MonthlyPopulationSummary } from '../types'

type PopulationSummaryState = {
  latestSummary: MonthlyPopulationSummary | null
  history: MonthlyPopulationSummary[]
  isLoading: boolean
  error: string | null
}

const initialState: PopulationSummaryState = {
  latestSummary: null,
  history: [],
  isLoading: true,
  error: null,
}

export function usePopulationSummary() {
  const [state, setState] = useState<PopulationSummaryState>(initialState)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPopulationSummary() {
      try {
        const [latestResponse, historyResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/latest-summary.json`, {
            signal: controller.signal,
          }),
          fetch(`${import.meta.env.BASE_URL}data/monthly-summary.json`, {
            signal: controller.signal,
          }),
        ])

        if (!latestResponse.ok || !historyResponse.ok) {
          throw new Error('Unable to load monthly population summary data.')
        }

        const [latestSummary, history] = await Promise.all([
          latestResponse.json() as Promise<MonthlyPopulationSummary>,
          historyResponse.json() as Promise<MonthlyPopulationSummary[]>,
        ])

        setState({
          latestSummary,
          history,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setState({
          latestSummary: null,
          history: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown loading error.',
        })
      }
    }

    void loadPopulationSummary()

    return () => {
      controller.abort()
    }
  }, [])

  return state
}
