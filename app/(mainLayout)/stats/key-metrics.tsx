"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Target, Flame } from "lucide-react"

interface KeyMetrics {
  completionRate: number
  streakDays: number
  totalLearned: number
  dailyGoal: number
}

async function fetchKeyMetrics(): Promise<KeyMetrics> {
  const response = await fetch("/api/stats/metrics")
  if (!response.ok) {
    throw new Error("Failed to fetch key metrics")
  }
  return response.json()
}

export function KeyMetrics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["keyMetrics"],
    queryFn: fetchKeyMetrics,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[140px]" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div>加载失败</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">完成率</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            目标: {data.dailyGoal} 个单词/天
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">连胜天数</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.streakDays} 天</div>
          <p className="text-xs text-muted-foreground">
            连续学习天数
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">累计学习</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalLearned} 个</div>
          <p className="text-xs text-muted-foreground">
            已掌握单词总数
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 