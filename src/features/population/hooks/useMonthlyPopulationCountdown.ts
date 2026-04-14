import { useEffect, useState } from 'react'
import {
  getCountdownParts,
  getNextMonthlyReportDate,
  type CountdownParts,
} from '../utils/countdown'

type CountdownState = {
  targetDate: Date
  parts: CountdownParts
}

function createCountdownState(): CountdownState {
  const targetDate = getNextMonthlyReportDate()

  return {
    targetDate,
    parts: getCountdownParts(targetDate),
  }
}

export function useMonthlyPopulationCountdown() {
  const [countdownState, setCountdownState] = useState<CountdownState>(() =>
    createCountdownState(),
  )

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdownState(createCountdownState())
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  return countdownState
}
