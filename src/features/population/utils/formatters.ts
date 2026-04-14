export function formatPopulationNumber(value: number) {
  return new Intl.NumberFormat('zh-TW').format(value)
}

export function formatMonthLabel(month: string) {
  const [year, monthPart] = month.split('-')

  return `${year} 年 ${monthPart} 月`
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
