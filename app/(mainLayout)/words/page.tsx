import { Suspense } from 'react'
import { WordList } from './word-list'
import { SearchBar } from './search-bar'
import { FilterPanel } from './filter-panel'

export default function WordsPage({ searchParams }: { searchParams: any }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchBar />
        <FilterPanel />
      </div>
      <Suspense fallback={<div>加载中...</div>}>
        <WordList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}