type MetricCardProps = {
  label: string
  value: string
  note?: string
  tone?: 'neutral' | 'positive' | 'negative' | 'accent'
}

export function MetricCard({
  label,
  value,
  note,
  tone = 'neutral',
}: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      {note ? <span className="metric-card__note">{note}</span> : null}
    </article>
  )
}
