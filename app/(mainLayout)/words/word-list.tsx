'use client'

import { Word } from '@prisma/client'
import { WordCard } from './word-card'
import { Pagination } from './pagination'
import { useSearchParams } from 'next/navigation'

interface WordListProps {
  items: Word[]
  total: number
}

export function WordList({ items, total }: WordListProps) {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 20

  return (
    <div className="space-y-4">
      <div className="grid  gap-4">
        {items.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </div>
      
      <Pagination
        total={total}
        pageSize={pageSize}
        currentPage={currentPage}
      />
    </div>
  )
} 