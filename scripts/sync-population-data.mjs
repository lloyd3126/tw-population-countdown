import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const outputDir = path.join(projectRoot, 'public', 'data')

const MONTH_COUNT = 13
const POPULATION_DATASET_SPLIT = 10701
const VITAL_DATASET_SPLIT = 10909

function getLastCompletedRocMonth(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
  })

  const parts = formatter.formatToParts(now)
  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)

  const completedMonth = month === 1
    ? { year: year - 1, month: 12 }
    : { year, month: month - 1 }

  return `${completedMonth.year - 1911}${completedMonth.month.toString().padStart(2, '0')}`
}

function getRecentRocMonths(count, latestRocMonth) {
  const rocYear = Number(latestRocMonth.slice(0, 3))
  const month = Number(latestRocMonth.slice(3))
  const months = []

  let yearCursor = rocYear + 1911
  let monthCursor = month

  for (let index = 0; index < count; index += 1) {
    months.unshift(`${yearCursor - 1911}${monthCursor.toString().padStart(2, '0')}`)

    monthCursor -= 1

    if (monthCursor === 0) {
      yearCursor -= 1
      monthCursor = 12
    }
  }

  return months
}

function toIsoMonth(rocMonth) {
  const year = Number(rocMonth.slice(0, 3)) + 1911
  const month = rocMonth.slice(3)

  return `${year}-${month}`
}

function sumBy(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0)
}

function getPopulationDatasetId(rocMonth) {
  return Number(rocMonth) >= POPULATION_DATASET_SPLIT ? '77145' : '32974'
}

function getVitalDatasetId(rocMonth) {
  return Number(rocMonth) >= VITAL_DATASET_SPLIT ? '131135' : '77139'
}

function getPopulationApiCode(rocMonth) {
  return Number(rocMonth) >= POPULATION_DATASET_SPLIT ? 'ODRP013' : 'ODRP004'
}

function getVitalApiCode(rocMonth) {
  return Number(rocMonth) >= VITAL_DATASET_SPLIT ? 'ODRP061' : 'ODRP003'
}

async function fetchAllPages(apiCode, rocMonth) {
  const baseUrl = `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/${apiCode}/${rocMonth}`
  const firstPage = await fetch(`${baseUrl}?page=1`).then((response) => response.json())

  if (firstPage.responseCode === 'OD-0102-S') {
    return []
  }

  const totalPage = Number(firstPage.totalPage || 1)
  const rows = [...(firstPage.responseData || [])]

  for (let page = 2; page <= totalPage; page += 1) {
    const pagePayload = await fetch(`${baseUrl}?page=${page}`).then((response) => response.json())
    rows.push(...(pagePayload.responseData || []))
  }

  return rows
}

function buildMonthlySummary(rocMonth, populationRows, vitalRows, updatedAt) {
  const populationDataset = getPopulationDatasetId(rocMonth)
  const vitalDataset = getVitalDatasetId(rocMonth)
  const vitalApiCode = getVitalApiCode(rocMonth)

  const populationTotal = sumBy(populationRows, 'people_total')
  const populationMale = sumBy(populationRows, 'people_total_m')
  const populationFemale = sumBy(populationRows, 'people_total_f')
  const births = sumBy(vitalRows, 'birth_total')
  const deaths = sumBy(vitalRows, 'death_m') + sumBy(vitalRows, 'death_f')

  const marriages = vitalApiCode === 'ODRP061'
    ? sumBy(vitalRows, 'marry_pair_OppositeSex') + sumBy(vitalRows, 'marry_pair_SameSex')
    : sumBy(vitalRows, 'marry_pair')

  const divorces = vitalApiCode === 'ODRP061'
    ? sumBy(vitalRows, 'divorce_pair_OppositeSex') + sumBy(vitalRows, 'divorce_pair_SameSex')
    : sumBy(vitalRows, 'divorce_pair')

  return {
    month: toIsoMonth(rocMonth),
    rocMonth,
    populationTotal,
    populationMale,
    populationFemale,
    births,
    deaths,
    naturalChange: births - deaths,
    marriages,
    divorces,
    momChange: null,
    yoyChange: null,
    updatedAt,
    sources: {
      populationDataset,
      vitalDataset,
    },
  }
}

function addComparisons(rows) {
  return rows.map((row, index) => {
    const previousMonth = rows[index - 1]
    const previousYear = rows[index - 12]

    return {
      ...row,
      momChange: previousMonth ? row.populationTotal - previousMonth.populationTotal : null,
      yoyChange: previousYear ? row.populationTotal - previousYear.populationTotal : null,
    }
  })
}

async function main() {
  const latestRocMonth = getLastCompletedRocMonth()
  const months = getRecentRocMonths(MONTH_COUNT, latestRocMonth)
  const updatedAt = new Date().toISOString()
  const summaries = []

  for (const rocMonth of months) {
    const populationRows = await fetchAllPages(getPopulationApiCode(rocMonth), rocMonth)
    const vitalRows = await fetchAllPages(getVitalApiCode(rocMonth), rocMonth)

    summaries.push(buildMonthlySummary(rocMonth, populationRows, vitalRows, updatedAt))
  }

  const withComparisons = addComparisons(summaries)
  const latestSummary = withComparisons.at(-1)

  await mkdir(outputDir, { recursive: true })
  await writeFile(
    path.join(outputDir, 'monthly-summary.json'),
    `${JSON.stringify(withComparisons, null, 2)}\n`,
    'utf8',
  )
  await writeFile(
    path.join(outputDir, 'latest-summary.json'),
    `${JSON.stringify(latestSummary, null, 2)}\n`,
    'utf8',
  )

  console.log(`Synced ${withComparisons.length} months through ${latestSummary.month}.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
