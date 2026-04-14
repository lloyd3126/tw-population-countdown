type InfoCardProps = {
  eyebrow: string
  title: string
  items: string[]
}

export function InfoCard({ eyebrow, title, items }: InfoCardProps) {
  return (
    <article className="info-card">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
