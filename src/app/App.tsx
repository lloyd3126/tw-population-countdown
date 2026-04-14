import { useEffect, useState, type CSSProperties, type ReactElement } from 'react'
import { Info } from 'lucide-react'
import { usePopulationSummary } from '../features/population/hooks/usePopulationSummary'
import {
  formatPopulationNumber,
  formatSecondsNumber,
  formatTaipeiDateTime,
} from '../features/population/utils/formatters'
import {
  getLivePopulationEstimate,
  getMonthEndAnchorTimestamp,
} from '../features/population/utils/liveEstimate'
import {
  getAverageMonthlyPopulationChange,
} from '../features/population/utils/projection'

function formatSignedDecimal(value: number): string {
  const prefix = value > 0 ? '+' : ''

  return `${prefix}${new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

export function App(): ReactElement {
  const { latestSummary, history, isLoading, error } = usePopulationSummary()
  const averageMonthlyPopulationChange = getAverageMonthlyPopulationChange(history)
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let animationFrameId = 0

    const tick = () => {
      setCurrentTime(Date.now())
      animationFrameId = window.requestAnimationFrame(tick)
    }

    animationFrameId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useEffect(() => {
    if (!isModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const estimateAnchorTimestamp = latestSummary
    ? getMonthEndAnchorTimestamp(latestSummary.month) ?? latestSummary.updatedAt
    : null

  const liveEstimateSnapshot = latestSummary
    ? getLivePopulationEstimate(
      latestSummary.populationTotal,
      averageMonthlyPopulationChange ?? 0,
      estimateAnchorTimestamp ?? latestSummary.updatedAt,
      currentTime,
    )
    : null
  const displayedPopulation = liveEstimateSnapshot?.displayPopulation ?? null
  const progressPercentage = liveEstimateSnapshot?.progressPercentage ?? 0
  const secondsPerPerson = liveEstimateSnapshot?.secondsPerPerson ?? null
  const transitionPhase = liveEstimateSnapshot?.transitionPhase ?? 'towards-white'
  const movementText = liveEstimateSnapshot?.movement === 'increase'
    ? '增加'
    : liveEstimateSnapshot?.movement === 'decrease'
      ? '減少'
      : null
  const averageMonthlyChangeText = averageMonthlyPopulationChange !== null
    ? formatSignedDecimal(averageMonthlyPopulationChange)
    : '資料不足'
  const speedText = secondsPerPerson && movementText
    ? `每 ${formatSecondsNumber(secondsPerPerson)} 秒${movementText} 1 人`
    : '目前資料不足以換算每秒變化速度'
  const anchorText = estimateAnchorTimestamp
    ? `${formatTaipeiDateTime(estimateAnchorTimestamp)}（台灣時間）`
    : '載入中'
  const populationStageStyle: CSSProperties = {
    '--population-stage-progress': `${progressPercentage / 100}`,
  } as CSSProperties

  return (
    <main className="shell shell--single">
      <section
        className={`population-stage population-stage--${transitionPhase}`}
        aria-label="中華民國人口數"
        style={populationStageStyle}
      >
        <div className="population-stage__progress" aria-hidden="true" />
        <button
          type="button"
          className="population-stage__info-button"
          aria-label="查看計算方式"
          onClick={() => setIsModalOpen(true)}
        >
          <Info aria-hidden="true" size={22} strokeWidth={2.1} />
        </button>

        {error ? (
          <div className="population-stage__status">
            <p className="population-stage__label">中華民國人口數</p>
            <strong className="population-stage__value">資料錯誤</strong>
            <p className="population-stage__meta">{error}</p>
          </div>
        ) : null}

        {isLoading && !latestSummary ? (
          <div className="population-stage__status">
            <p className="population-stage__label">中華民國人口數</p>
            <strong className="population-stage__value">載入中</strong>
            <p className="population-stage__meta">正在整理戶政司月資料</p>
          </div>
        ) : null}

        {!error && latestSummary ? (
          <div className="population-stage__content">
            <p className="population-stage__label">中華民國人口數</p>
            <strong className="population-stage__value">
              {displayedPopulation !== null ? formatPopulationNumber(displayedPopulation) : '載入中'}
            </strong>
          </div>
        ) : null}
      </section>

      {isModalOpen ? (
        <div
          className="population-modal"
          role="presentation"
          onClick={() => setIsModalOpen(false)}
        >
          <section
            className="population-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="population-calculation-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="population-modal__close"
              onClick={() => setIsModalOpen(false)}
            >
              關閉
            </button>
            <p className="population-modal__eyebrow">說明</p>
            <h2 id="population-calculation-title">這個人口數是怎麼估算的？</h2>
            <p className="population-modal__paragraph">
              首頁數字是以官方月資料為基準，依近一年平均變化速度持續推算，方便一般民眾理解並自行驗算。
            </p>
            <div className="population-modal__facts">
              <div className="population-modal__fact">
                <span className="population-modal__fact-label">官方月資料</span>
                <strong className="population-modal__fact-value">
                  {latestSummary ? `${formatPopulationNumber(latestSummary.populationTotal)} 人` : '載入中'}
                </strong>
                <p className="population-modal__fact-note">
                  {latestSummary ? `採用 ${latestSummary.month} 月官方公布的人口摘要作為起算基準。` : '等待資料載入。'}
                </p>
              </div>
              <div className="population-modal__fact">
                <span className="population-modal__fact-label">估算起點</span>
                <strong className="population-modal__fact-value">{anchorText}</strong>
                <p className="population-modal__fact-note">以該資料月份最後一天的台灣時間為起點，持續往現在推算。</p>
              </div>
              <div className="population-modal__fact">
                <span className="population-modal__fact-label">近一年平均月變化</span>
                <strong className="population-modal__fact-value">{averageMonthlyChangeText} 人</strong>
                <p className="population-modal__fact-note">取最近 13 個月資料，比較其中 12 次月增減後，算出平均每月變化人數。</p>
              </div>
              <div className="population-modal__fact">
                <span className="population-modal__fact-label">換算成即時速度</span>
                <strong className="population-modal__fact-value">{speedText}</strong>
                <p className="population-modal__fact-note">把平均每月變化攤平成每秒速度，讓畫面上的數字可以持續變動。</p>
              </div>
            </div>
            <div className="population-modal__formula">
              <span className="population-modal__fact-label">估算公式</span>
              <p className="population-modal__formula-text">
                官方月人口 + （近一年平均每月變化 ÷ 平均每月秒數） × 自起算點累積的經過秒數
              </p>
              <p className="population-modal__paragraph">
                這是兩次官方月資料之間的連續推估，用來呈現人口變化的節奏；首頁顯示的是非官方即時估算值，正式數字仍以戶政司每月公布資料為準。
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}
