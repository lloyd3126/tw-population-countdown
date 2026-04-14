function stripUpdatedAt(summary) {
  const { updatedAt, ...rest } = summary

  return rest
}

function hasSummaryChanged(previousSummary, nextSummary) {
  if (!previousSummary) {
    return true
  }

  return JSON.stringify(stripUpdatedAt(previousSummary)) !== JSON.stringify(stripUpdatedAt(nextSummary))
}

export function applyStableUpdatedAt(previousSummaries, nextSummaries, nextUpdatedAt) {
  const previousSummaryByMonth = new Map(
    previousSummaries.map((summary) => [summary.month, summary]),
  )

  return nextSummaries.map((summary) => {
    const previousSummary = previousSummaryByMonth.get(summary.month)

    return {
      ...summary,
      updatedAt: hasSummaryChanged(previousSummary, summary)
        ? nextUpdatedAt
        : previousSummary.updatedAt,
    }
  })
}
