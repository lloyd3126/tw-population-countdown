export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getNextMonthlyReportDate(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
}

export function getCountdownParts(targetDate: Date, now = new Date()): CountdownParts {
  const remainingMilliseconds = Math.max(targetDate.getTime() - now.getTime(), 0)
  const totalSeconds = Math.floor(remainingMilliseconds / 1000)

  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export function formatReportDate(targetDate: Date) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(targetDate)
}
