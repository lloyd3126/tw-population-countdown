export type PopulationDatasetId = '32974' | '77145'
export type VitalDatasetId = '77139' | '131135'

export type MonthlyPopulationSummary = {
  month: string
  rocMonth: string
  populationTotal: number
  populationMale: number
  populationFemale: number
  births: number
  deaths: number
  naturalChange: number
  marriages: number
  divorces: number
  momChange: number | null
  yoyChange: number | null
  updatedAt: string
  sources: {
    populationDataset: PopulationDatasetId
    vitalDataset: VitalDatasetId
  }
}
