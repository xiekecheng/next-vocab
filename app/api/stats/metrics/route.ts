import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfDay, subDays } from "date-fns"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // 获取用户的学习计划
    const learningPlan = await prisma.learningPlan.findUnique({
      where: { userId: session.user.id },
    })

    // 获取今日完成的单词数
    const today = startOfDay(new Date())
    const todayLearned = await prisma.userWord.count({
      where: {
        userId: session.user.id,
        status: { in: ["LEARNED", "FAMILIAR"] },
        createdAt: {
          gte: today,
        },
      },
    })

    // 计算完成率
    const dailyGoal = learningPlan?.dailyGoal || 20
    const completionRate = Math.min(Math.round((todayLearned / dailyGoal) * 100), 100)

    // 计算连胜天数
    let streakDays = 0
    let currentDate = today
    while (true) {
      const dayLearned = await prisma.userWord.count({
        where: {
          userId: session.user.id,
          status: { in: ["LEARNED", "FAMILIAR"] },
          createdAt: {
            gte: currentDate,
            lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      })

      if (dayLearned === 0) break
      streakDays++
      currentDate = subDays(currentDate, 1)
    }

    // 获取累计学习总数
    const totalLearned = await prisma.userWord.count({
      where: {
        userId: session.user.id,
        status: { in: ["LEARNED", "FAMILIAR"] },
      },
    })

    return NextResponse.json({
      completionRate,
      streakDays,
      totalLearned,
      dailyGoal,
    })
  } catch (error) {
    console.error("[STATS_METRICS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 