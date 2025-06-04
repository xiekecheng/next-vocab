"use client"

import { useQuery } from "@tanstack/react-query"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

type Period = "daily" | "weekly" | "monthly"

interface LearningStatsChartProps {
  period: Period
}

interface StatsData {
  date: string
  learned: number
  familiar: number
}

async function fetchStats(period: Period): Promise<StatsData[]> {
  const response = await fetch(`/api/stats?period=${period}`)
  if (!response.ok) {
    throw new Error("Failed to fetch stats")
  }
  return response.json()
}

export function LearningStatsChart({ period }: LearningStatsChartProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stats", period],
    queryFn: () => fetchStats(period),
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>加载失败</div>
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    switch (period) {
      case "daily":
        return format(d, "MM-dd", { locale: zhCN })
      case "weekly":
        return `第${format(d, "w", { locale: zhCN })}周`
      case "monthly":
        return format(d, "yyyy-MM", { locale: zhCN })
    }
  }

  return (
    <Card className="p-4">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value: number) => [`${value}个`, "单词数"]}
            />
            <Line
              type="monotone"
              dataKey="learned"
              stroke="#2563eb"
              name="已学习"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="familiar"
              stroke="#16a34a"
              name="已熟悉"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 