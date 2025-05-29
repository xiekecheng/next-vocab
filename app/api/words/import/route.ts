import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function splitExamples(raw: string | undefined): string[] {
  if (!raw) return []
  // 按 1. 2. 3. ... 切割，支持中英文标点
  return raw
    .split(/\s*\d+\s*[\.|。|、|．|﹒|．|·|:：]/)
    .map(s => s.trim())
    .filter(Boolean)
}

export async function POST(req: NextRequest) {
  const { words } = await req.json()
  if (!Array.isArray(words)) {
    return NextResponse.json({ message: '数据格式错误' }, { status: 400 })
  }
  // 字段映射与校验
  const validWords = words.map((w: any) => ({
    text: w['单词'] || w['word'],
    phonetic: w['音标'] || w['phonetic'],
    meaning: w['释义'] || w['meaning'],
    examples: splitExamples(w['例句'] || w['examples'] || ''),
    frequency: Number(w['频次'] || w['frequency'] || 0),
  })).filter(w => w.text && w.meaning)

  try {
    await prisma.word.createMany({
      data: validWords,
      skipDuplicates: true,
    })
    return NextResponse.json({ message: `成功导入 ${validWords.length} 条单词` })
  } catch (e) {
    return NextResponse.json({ message: '导入失败', error: String(e) }, { status: 500 })
  }
} 