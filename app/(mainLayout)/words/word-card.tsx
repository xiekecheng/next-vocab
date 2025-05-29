'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Word, LearningStatus } from '@prisma/client'
import Link from 'next/link'
import { updateWordStatus } from '@/lib/actions'
import { useRouter } from 'next/navigation'

interface WordCardProps {
  word: Word & {
    status?: LearningStatus
  }
}

export function WordCard({ word }: WordCardProps) {
  const router = useRouter()

  const handleStatusChange = async (status: LearningStatus) => {
    await updateWordStatus(word.id, status)
    router.refresh()
  }

  return (
    <div className="border rounded p-4 flex flex-col gap-2 bg-white shadow-sm relative">
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          variant={word.status === "LEARNED" ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            handleStatusChange("LEARNED")
          }}
        >
          已背
        </Button>
        <Button
          variant={word.status === "FAMILIAR" ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            handleStatusChange("FAMILIAR")
          }}
        >
          熟悉
        </Button>
      </div>
      <Link href={`/words/${word.id}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{word.text}</span>
            {word.phonetic && <span className="text-sm text-gray-500">[{word.phonetic}]</span>}
            <Badge variant="outline">{word.frequency}</Badge>
          </div>
          <div className="text-sm text-gray-700">{word.meaning}</div>
        </div>
      </Link>
    </div>
  )
} 