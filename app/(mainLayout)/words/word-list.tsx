'use client'
import { useEffect, useState } from 'react'
import { getWords } from './data-access'
import { WordCard } from './word-card'

interface Word {
  id: string
  text: string
  phonetic: string | null
  meaning: string
  examples: string[]
  frequency: number
  createdAt: Date
  updatedAt: Date
}

export function WordList({ items, total }: { items: Word[], total: number }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((word) => <WordCard key={word.id} word={word} />)}
      </div>
      {/* TODO: 分页/加载更多 */}
      <div className="mt-4 text-sm text-gray-500">共 {total} 条单词</div>
    </div>
  )
} 