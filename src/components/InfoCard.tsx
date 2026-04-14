type InfoCardProps = {
  eyebrow: string
  title: string
  description?: string
  items: string[]
}

export function InfoCard({ eyebrow, title, description, items }: InfoCardProps) {
  return (
    <article className="info-card">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p className="info-card__description">{description}</p> : null}
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
