import { InfoCard } from '../components/InfoCard'
import { MetricCard } from '../components/MetricCard'
import {
  countdownHighlights,
  deploymentChecklist,
  projectStructure,
} from '../features/population/constants'
import { useMonthlyPopulationCountdown } from '../features/population/hooks/useMonthlyPopulationCountdown'
import { formatReportDate } from '../features/population/utils/countdown'

export function App() {
  const { targetDate, parts } = useMonthlyPopulationCountdown()

  const metrics = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ]

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">Vite + React + TypeScript</span>
          <h1>Taiwan Population Countdown</h1>
          <p className="hero__lede">
            A clean frontend starter focused on a single responsibility: showing
            the countdown to the next monthly population update.
          </p>
          <div className="hero__meta">
            <div>
              <span className="hero__meta-label">Next update window</span>
              <strong>{formatReportDate(targetDate)}</strong>
            </div>
            <div>
              <span className="hero__meta-label">Build output</span>
              <strong>dist/</strong>
            </div>
          </div>
        </div>

        <div className="hero__panel">
          <div className="metrics-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>

          <div className="hero__notes">
            <h2>What is included</h2>
            <ul>
              {countdownHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="info-grid" aria-label="Project information">
        <InfoCard
          eyebrow="Structure"
          title="React folder layout"
          items={projectStructure}
        />
        <InfoCard
          eyebrow="Deploy"
          title="GitHub Pages ready"
          items={deploymentChecklist}
        />
      </section>
    </main>
  )
}
