'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    router.push(`/words?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <Input
        placeholder="搜索单词/释义..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-64"
      />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">搜索</button>
    </form>
  )
} 