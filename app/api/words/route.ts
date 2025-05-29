import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  console.log('req', req)
  const searchParams = req.nextUrl.searchParams
  console.log('searchParams', searchParams)
  const page = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 20)
  const q = searchParams.get('q') || ''
  const freqMin = Number(searchParams.get('freqMin') || 0)
  const freqMax = Number(searchParams.get('freqMax') || 999999)

  const where: any = {
    frequency: { gte: freqMin, lte: freqMax },
    ...(q && { OR: [
      { text: { contains: q, mode: 'insensitive' } },
      { meaning: { contains: q, mode: 'insensitive' } }
    ]}),
  }

  const [items, total] = await Promise.all([
    prisma.word.findMany({
      where,
      orderBy: { frequency: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.word.count({ where }),
  ])

  return NextResponse.json({ items, total })
} 