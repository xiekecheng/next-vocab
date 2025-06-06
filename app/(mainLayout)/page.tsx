import { Suspense } from 'react'
import { WordList } from './words/word-list'
import { SearchBar } from './words/search-bar'
import { FilterPanel } from './words/filter-panel'
import { getPaginatedWordsWithStatus } from '@/lib/actions'
import { auth } from '@/lib/auth'
import { Word } from '@prisma/client'

export default async function WordsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { page = '1', pageSize = '20', q = '', freqMin = '0', freqMax = '999999' } = await searchParams
  const searchQuery = Array.isArray(q) ? q[0] : q

  const session = await auth()
  const userId = session?.user?.id
  const { items, total } = await getPaginatedWordsWithStatus(Number(page), Number(pageSize), userId, searchQuery, Number(freqMin), Number(freqMax))



  // const where: Prisma.WordWhereInput = {
  //   frequency: { gte: Number(freqMin), lte: Number(freqMax) },
  //   ...(searchQuery && { OR: [
  //     { text: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
  //     { meaning: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } }
  //   ]}),
  // }

  // const [items, total] = await Promise.all([
  //   prisma.word.findMany({
  //     where,
  //     orderBy: { frequency: 'desc' },
  //     skip: (Number(page) - 1) * Number(pageSize),
  //     take: Number(pageSize),
  //   }),
  //   prisma.word.count({ where }),
  // ])

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchBar />
        <FilterPanel />
      </div>
      <Suspense fallback={<div>加载中...</div>}>
        <WordList items={items as unknown as Word[]} total={total} />
      </Suspense>
    </div>
  )
}