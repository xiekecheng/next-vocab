"use client"

import { useQuery } from "@tanstack/react-query"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WordStatusData {
  status: string
  count: number
}

const COLORS = {
  NEW: "#94a3b8",      // 灰色
  LEARNED: "#2563eb",  // 蓝色
  FAMILIAR: "#16a34a", // 绿色
}

const STATUS_LABELS = {
  NEW: "新学",
  LEARNED: "已背",
  FAMILIAR: "熟悉",
}

async function fetchWordStatus(): Promise<WordStatusData[]> {
  const response = await fetch("/api/stats/status")
  if (!response.ok) {
    throw new Error("Failed to fetch word status")
  }
  return response.json()
}

export function WordStatusChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["wordStatus"],
    queryFn: fetchWordStatus,
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>加载失败</div>
  }

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>单词状态分布</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => 
                  `${STATUS_LABELS[name as keyof typeof STATUS_LABELS]} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry) => (
                  <Cell 
                    key={entry.status} 
                    fill={COLORS[entry.status as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}个`, "单词数"]}
                labelFormatter={(label) => STATUS_LABELS[label as keyof typeof STATUS_LABELS]}
              />
              <Legend 
                formatter={(value) => STATUS_LABELS[value as keyof typeof STATUS_LABELS]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          总计: {total} 个单词
        </div>
      </CardContent>
    </Card>
  )
} 