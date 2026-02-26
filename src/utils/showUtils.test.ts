import { describe, expect, it } from 'vitest'
import { groupShowsByGenre, searchShowsByName, sortByRatingDesc } from './showUtils'
import type { Show } from '../types/show'

const showsFixture: Show[] = [
  {
    id: 1,
    name: 'Alpha',
    genres: ['Drama', 'Action'],
    status: 'Running',
    rating: 7.1,
    imageUrl: null,
    summaryHtml: '',
    language: 'English',
    runtime: 60,
    premiered: '2020-01-01',
  },
  {
    id: 2,
    name: 'Beta',
    genres: ['Drama'],
    status: 'Ended',
    rating: 8.4,
    imageUrl: null,
    summaryHtml: '',
    language: 'English',
    runtime: 60,
    premiered: '2019-01-01',
  },
  {
    id: 3,
    name: 'Gamma',
    genres: [],
    status: 'Ended',
    rating: null,
    imageUrl: null,
    summaryHtml: '',
    language: 'English',
    runtime: 60,
    premiered: '2018-01-01',
  },
]

describe('sortByRatingDesc', () => {
  it('sorts ratings descending and puts null last', () => {
    const sortedIds = sortByRatingDesc(showsFixture).map((show) => show.id)
    expect(sortedIds).toEqual([2, 1, 3])
  })
})

describe('groupShowsByGenre', () => {
  it('duplicates multi-genre shows across buckets', () => {
    const grouped = groupShowsByGenre(showsFixture)
    expect(grouped.Drama?.map((show) => show.id)).toEqual([1, 2])
    expect(grouped.Action?.map((show) => show.id)).toEqual([1])
  })

  it('puts empty-genre shows in Uncategorized', () => {
    const grouped = groupShowsByGenre(showsFixture)
    expect(grouped.Uncategorized?.map((show) => show.id)).toEqual([3])
  })
})

describe('searchShowsByName', () => {
  it('filters by case-insensitive name match', () => {
    const resultIds = searchShowsByName(showsFixture, 'alp').map((show) => show.id)
    expect(resultIds).toEqual([1])
  })
})
