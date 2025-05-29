import { Badge } from '@/components/ui/badge'

export function WordCard({ word }: { word: any }) {
  return (
    <div className="border rounded p-4 flex flex-col gap-2 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{word.text}</span>
        {word.phonetic && <span className="text-sm text-gray-500">[{word.phonetic}]</span>}
        <Badge variant="outline">{word.frequency}</Badge>
      </div>
      <div className="text-sm text-gray-700">{word.meaning}</div>
    </div>
  )
} 