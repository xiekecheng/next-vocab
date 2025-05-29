import { getWords } from './data-access'
import { WordCard } from './word-card'

export async function WordList({ searchParams }: { searchParams: any }) {
  const { items, total } = await getWords(searchParams)
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((word: any) => <WordCard key={word.id} word={word} />)}
      </div>
      {/* TODO: 分页/加载更多 */}
      <div className="mt-4 text-sm text-gray-500">共 {total} 条单词</div>
    </div>
  )
} 