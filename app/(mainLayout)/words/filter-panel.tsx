'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function FilterPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [min, setMin] = useState(searchParams.get('freqMin') || '')
  const [max, setMax] = useState(searchParams.get('freqMax') || '')

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (min) params.set('freqMin', min)
    else params.delete('freqMin')
    if (max) params.set('freqMax', max)
    else params.delete('freqMax')
    router.push(`/words?${params.toString()}`)
  }

  return (
    <form onSubmit={handleFilter} className="flex gap-2 items-center">
      <span className="text-sm">频次区间:</span>
      <Input
        type="number"
        placeholder="最小"
        value={min}
        onChange={e => setMin(e.target.value)}
        className="w-20"
      />
      <span>-</span>
      <Input
        type="number"
        placeholder="最大"
        value={max}
        onChange={e => setMax(e.target.value)}
        className="w-20"
      />
      <button type="submit" className="px-3 py-1 bg-primary text-white rounded text-sm">筛选</button>
    </form>
  )
} 