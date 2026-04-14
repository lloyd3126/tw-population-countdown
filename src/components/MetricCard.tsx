type MetricCardProps = {
  label: string
  value: number
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">
        {value.toString().padStart(2, '0')}
      </strong>
    </article>
  )
}
