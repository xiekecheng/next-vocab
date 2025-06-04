import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfDay, startOfWeek, startOfMonth, subDays, subWeeks, subMonths } from "date-fns"

interface StatsData {
  date: string
  learned: number
  familiar: number
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") as "daily" | "weekly" | "monthly"

    if (!period || !["daily", "weekly", "monthly"].includes(period)) {
      return new NextResponse("Invalid period", { status: 400 })
    }

    const now = new Date()
    let startDate: Date

    switch (period) {
      case "daily":
        startDate = subDays(startOfDay(now), 30)
        break
      case "weekly":
        startDate = subWeeks(startOfWeek(now), 12)
        break
      case "monthly":
        startDate = subMonths(startOfMonth(now), 12)
        break
    }

    // 处理数据，按日期分组
    const result = await prisma.userWord.groupBy({
      by: ["status", "createdAt"],
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        _all: true,
      },
    })

    // 转换为前端需要的格式
    const formattedData = result.reduce((acc: StatsData[], curr) => {
      const date = new Date(curr.createdAt)
      const dateStr = date.toISOString().split("T")[0]
      
      const existing = acc.find(item => item.date === dateStr)
      if (existing) {
        existing[curr.status.toLowerCase() as keyof Omit<StatsData, "date">] = curr._count._all
      } else {
        acc.push({
          date: dateStr,
          learned: curr.status === "LEARNED" ? curr._count._all : 0,
          familiar: curr.status === "FAMILIAR" ? curr._count._all : 0,
        })
      }
      return acc
    }, [])

    // 按日期排序
    formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("[STATS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 