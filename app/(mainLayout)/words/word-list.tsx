
import { WordCard } from './word-card'
import { WordWithUserStatus } from '@/lib/actions'

export function WordList({ items, total }: { items: WordWithUserStatus[], total: number }) {
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