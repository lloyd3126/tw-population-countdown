import { InfoCard } from '../components/InfoCard'
import { MetricCard } from '../components/MetricCard'
import { useMonthlyPopulationCountdown } from '../features/population/hooks/useMonthlyPopulationCountdown'
import { usePopulationSummary } from '../features/population/hooks/usePopulationSummary'
import { formatReportDate } from '../features/population/utils/countdown'
import {
  formatDelta,
  formatMonthLabel,
  formatPopulationNumber,
  formatRelativeSourceTime,
} from '../features/population/utils/formatters'

type DashboardMetric = {
  label: string
  value: string
  note: string
  tone: 'neutral' | 'positive' | 'negative' | 'accent'
}

export function App() {
  const { targetDate, parts } = useMonthlyPopulationCountdown()
  const { latestSummary, history, isLoading, error } = usePopulationSummary()

  const metrics = [
    { label: 'Days', value: parts.days.toString().padStart(2, '0') },
    { label: 'Hours', value: parts.hours.toString().padStart(2, '0') },
    { label: 'Minutes', value: parts.minutes.toString().padStart(2, '0') },
    { label: 'Seconds', value: parts.seconds.toString().padStart(2, '0') },
  ]

  const dashboardMetrics: DashboardMetric[] = latestSummary
    ? [
        {
          label: '比上月增減',
          value: formatDelta(latestSummary.momChange),
          note: '全國現住人口',
          tone: latestSummary.momChange !== null && latestSummary.momChange > 0
            ? 'positive'
            : 'negative',
        },
        {
          label: '比去年同月',
          value: formatDelta(latestSummary.yoyChange),
          note: '年對年變化',
          tone: latestSummary.yoyChange !== null && latestSummary.yoyChange > 0
            ? 'positive'
            : 'negative',
        },
        {
          label: '本月出生',
          value: formatPopulationNumber(latestSummary.births),
          note: `${formatMonthLabel(latestSummary.month)}官方統計`,
          tone: 'accent',
        },
        {
          label: '本月死亡',
          value: formatPopulationNumber(latestSummary.deaths),
          note: `${formatMonthLabel(latestSummary.month)}官方統計`,
          tone: 'neutral',
        },
        {
          label: '自然增減',
          value: formatDelta(latestSummary.naturalChange),
          note: '出生減死亡',
          tone: latestSummary.naturalChange > 0 ? 'positive' : 'negative',
        },
        {
          label: '本月結婚 / 離婚',
          value: `${formatPopulationNumber(latestSummary.marriages)} / ${formatPopulationNumber(latestSummary.divorces)}`,
          note: '含同性婚統計',
          tone: 'accent',
        },
      ]
    : []

  const trendHistory = history.slice(-12)
  const maxPopulation = Math.max(...trendHistory.map((item) => item.populationTotal), 1)

  const sourceItems = latestSummary
    ? [
        `人口總量：戶政司資料集 ${latestSummary.sources.populationDataset}`,
        `人口動態：戶政司資料集 ${latestSummary.sources.vitalDataset}`,
        '首頁使用全國月摘要資料，不直接在瀏覽器加總村里級原始資料。',
        '所有數字均來自戶政司 open data API 轉製的專案快照。',
      ]
    : []

  const methodologyItems = latestSummary
    ? [
        `資料月份：${formatMonthLabel(latestSummary.month)} (${latestSummary.rocMonth})`,
        '目前人口使用現住人口數按性別及原住民身分分資料集彙總。',
        '出生、死亡、結婚、離婚使用動態資料統計表彙總。',
        `專案快照更新時間：${formatRelativeSourceTime(latestSummary.updatedAt)}`,
      ]
    : []

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">戶政司月人口儀表板</span>
          <h1>Taiwan Population Countdown</h1>
          <p className="hero__lede">
            聚焦台灣戶政司月資料的首頁儀表板，呈現最新現住人口、月變化、
            年變化與人口動態，並保留下次更新的倒數提醒。
          </p>
          <div className="hero__spotlight">
            <span className="hero__spotlight-label">最新全國現住人口</span>
            <strong className="hero__spotlight-value">
              {latestSummary ? formatPopulationNumber(latestSummary.populationTotal) : '載入中'}
            </strong>
            <span className="hero__spotlight-footnote">
              {latestSummary
                ? `資料月份：${formatMonthLabel(latestSummary.month)}`
                : '正在讀取戶政司月摘要資料'}
            </span>
          </div>
          <div className="hero__meta">
            <div>
              <span className="hero__meta-label">Next update window</span>
              <strong>{formatReportDate(targetDate)}</strong>
            </div>
            <div>
              <span className="hero__meta-label">Data snapshot</span>
              <strong>
                {latestSummary ? formatRelativeSourceTime(latestSummary.updatedAt) : '載入中'}
              </strong>
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
            <h2>Update Countdown</h2>
            <ul>
              {metrics.map((metric) => (
                <li key={metric.label}>
                  {metric.label}: {metric.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="Population summary">
        {error ? (
          <article className="status-panel">
            <span className="eyebrow">Data Error</span>
            <h2>無法載入人口摘要</h2>
            <p>{error}</p>
          </article>
        ) : null}

        {isLoading && !latestSummary ? (
          <article className="status-panel">
            <span className="eyebrow">Loading</span>
            <h2>正在整理戶政司月資料</h2>
            <p>首頁會在資料讀取完成後顯示最新人口、變化指標與最近 12 個月趨勢。</p>
          </article>
        ) : null}

        {latestSummary ? (
          <>
            <div className="metrics-grid metrics-grid--dashboard">
              {dashboardMetrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  note={metric.note}
                  tone={metric.tone}
                />
              ))}
            </div>

            <article className="trend-panel">
              <div className="trend-panel__header">
                <div>
                  <span className="eyebrow">Trend</span>
                  <h2>最近 12 個月人口趨勢</h2>
                </div>
                <p>
                  以戶政司全國月摘要顯示最近一年的人口總數走勢，方便快速觀察長短期變化。
                </p>
              </div>

              <div className="trend-bars" role="list" aria-label="Recent 12-month population trend">
                {trendHistory.map((item) => {
                  const height = Math.max(
                    Math.round((item.populationTotal / maxPopulation) * 100),
                    12,
                  )

                  return (
                    <div key={item.month} className="trend-bar" role="listitem">
                      <span className="trend-bar__value">
                        {formatPopulationNumber(item.populationTotal)}
                      </span>
                      <div className="trend-bar__track">
                        <div
                          className="trend-bar__fill"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="trend-bar__label">{item.month.slice(2)}</span>
                    </div>
                  )
                })}
              </div>
            </article>
          </>
        ) : null}
      </section>

      {latestSummary ? (
        <section className="info-grid" aria-label="Project information">
          <InfoCard
            eyebrow="Source"
            title="戶政司資料來源"
            description="首頁人口與動態指標都來自戶政司公開資料集，再轉成專案自己的月摘要。"
            items={sourceItems}
          />
          <InfoCard
            eyebrow="Method"
            title="頁面如何計算"
            description="目前頁面聚焦在全國摘要，不直接暴露村里級欄位或原始 API 結構給 UI。"
            items={methodologyItems}
          />
        </section>
      ) : null}
    </main>
  )
}
