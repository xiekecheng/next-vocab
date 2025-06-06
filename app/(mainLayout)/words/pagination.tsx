'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
}

export function Pagination({ total, pageSize, currentPage }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return params.toString()
  }

  const handlePageChange = (page: number) => {
    router.push(`/?${createQueryString(page)}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </Button>
      
      <div className="text-sm text-gray-500">
        第 {currentPage} 页，共 {totalPages} 页
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 