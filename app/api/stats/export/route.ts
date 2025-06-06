import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { PDFDocument } from "pdf-lib"
import { Parser } from "json2csv"
import fs from "fs"
import path from "path"
import fontkit from '@pdf-lib/fontkit'

// 添加 json2csv 类型声明
declare module "json2csv" {
  // export class Parser {
  //   constructor(options?: any)
  //   parse(data: any): string
  // }
}

// 定义类型
interface WordMetric {
  status: string
  _count: {
    _all: number
  }
}

interface WordStat {
  word: {
    text: string
    phonetic: string | null
    meaning: string
  }
  status: string
  createdAt: Date
  note: string | null
}

interface LearningPlan {
  dailyGoal: number
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") as "pdf" | "csv"

    if (!format || !["pdf", "csv"].includes(format)) {
      return new NextResponse("Invalid format", { status: 400 })
    }

    // 获取统计数据
    const [metrics, wordStats, learningStats] = await Promise.all([
      // 关键指标
      prisma.userWord.groupBy({
        by: ["status"],
        where: { userId: session.user.id },
        _count: { _all: true },
      }),
      // 单词学习统计
      prisma.userWord.findMany({
        where: { userId: session.user.id },
        include: { word: true },
        orderBy: { createdAt: "desc" },
      }),
      // 学习计划
      prisma.learningPlan.findUnique({
        where: { userId: session.user.id },
      }),
    ])

    if (format === "pdf") {
      return await generatePDF(metrics, wordStats, learningStats)
    } else {
      return await generateCSV(metrics, wordStats, learningStats)
    }
  } catch (error) {
    console.error("[STATS_EXPORT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

async function generatePDF(
  metrics: WordMetric[],
  wordStats: WordStat[],
  learningPlan: LearningPlan | null
) {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const page = pdfDoc.addPage([595.28, 841.89]) // A4

  // 使用支持中文的字体
  const fontPath = path.join(process.cwd(), "public/fonts/NotoSansSC-Regular.ttf")
  const fontBytes = fs.readFileSync(fontPath) // 保证是 Buffer
  const font = await pdfDoc.embedFont(fontBytes)
  const boldFont = await pdfDoc.embedFont(fontBytes)

  let y = 800
  const lineHeight = 20
  const margin = 50

  // 标题
  page.drawText("学习统计报告", {
    x: margin,
    y,
    size: 24,
    font: boldFont,
  })
  y -= lineHeight * 2

  // 生成时间
  page.drawText(`生成时间：${format(new Date(), "yyyy-MM-dd HH:mm:ss", { locale: zhCN })}`, {
    x: margin,
    y,
    size: 12,
    font,
  })
  y -= lineHeight * 2

  // 关键指标
  page.drawText("关键指标", {
    x: margin,
    y,
    size: 16,
    font: boldFont,
  })
  y -= lineHeight

  const totalWords = metrics.reduce((sum, m) => sum + m._count._all, 0)
  metrics.forEach((metric) => {
    const percentage = ((metric._count._all / totalWords) * 100).toFixed(1)
    page.drawText(`${metric.status}: ${metric._count._all} (${percentage}%)`, {
      x: margin + 20,
      y,
      size: 12,
      font,
    })
    y -= lineHeight
  })
  y -= lineHeight

  // 学习计划
  if (learningPlan) {
    page.drawText("学习计划", {
      x: margin,
      y,
      size: 16,
      font: boldFont,
    })
    y -= lineHeight

    page.drawText(`每日目标：${learningPlan.dailyGoal} 个单词`, {
      x: margin + 20,
      y,
      size: 12,
      font,
    })
    y -= lineHeight
  }

  const pdfBytes = await pdfDoc.save()
  return new NextResponse(new Blob([pdfBytes]), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=stats.pdf",
    },
  })
}

async function generateCSV(
  metrics: WordMetric[],
  wordStats: WordStat[],
  learningPlan: LearningPlan | null
) {
  // 准备 CSV 数据
  const data = wordStats.map((stat) => ({
    单词: stat.word.text,
    音标: stat.word.phonetic || "",
    释义: stat.word.meaning,
    状态: stat.status,
    学习时间: format(new Date(stat.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: zhCN }),
    笔记: stat.note || "",
  }))

  // 添加统计信息
  const stats = {
    总单词数: metrics.reduce((sum, m) => sum + m._count._all, 0),
    每日目标: learningPlan?.dailyGoal || 20,
    生成时间: format(new Date(), "yyyy-MM-dd HH:mm:ss", { locale: zhCN }),
  }

  // 转换为 CSV
  const parser = new Parser()
  const csv = parser.parse(data)

  // 添加统计信息到 CSV 开头
  const statsCsv = Object.entries(stats)
    .map(([key, value]) => `${key},${value}`)
    .join("\n")
  const finalCsv = `${statsCsv}\n\n${csv}`

  return new NextResponse(finalCsv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=stats.csv",
    },
  })
} 