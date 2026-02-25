export interface RawShow {
  id: number
  name: string
  genres: string[]
  status: string
  rating: { average: number | null }
  image: { medium: string; original: string } | null
  summary: string | null
  language: string | null
  runtime: number | null
  premiered: string | null
}

export interface Show {
  id: number
  name: string
  genres: string[]
  status: string
  rating: number | null
  imageUrl: string | null
  summaryHtml: string
  language: string | null
  runtime: number | null
  premiered: string | null
}
