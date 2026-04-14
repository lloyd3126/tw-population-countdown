export function formatPopulationNumber(value: number) {
  return new Intl.NumberFormat('zh-TW').format(value)
}

export function formatPopulationEstimate(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatSecondsNumber(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatMonthLabel(month: string) {
  const [year, monthPart] = month.split('-')
  const normalizedMonth = monthPart.padStart(2, '0')

  return `${year} 年 ${normalizedMonth} 月`
}

export function formatCompactMonth(month: string) {
  return month
}

export function formatDelta(value: number | null) {
  if (value === null) {
    return '資料不足'
  }

  const prefix = value > 0 ? '+' : ''

  return `${prefix}${new Intl.NumberFormat('zh-TW').format(value)}`
}

export function formatRelativeSourceTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatTaipeiDateTime(value: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(new Date(value))
  const year = parts.find((part) => part.type === 'year')?.value ?? '0000'
  const month = parts.find((part) => part.type === 'month')?.value ?? '00'
  const day = parts.find((part) => part.type === 'day')?.value ?? '00'
  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00'
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00'

  return `${year} 年 ${month} 月 ${day} 日 ${hour}:${minute}`
}
