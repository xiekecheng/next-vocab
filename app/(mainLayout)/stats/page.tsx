import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LearningStatsChart } from "./learning-stats-chart"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">学习统计</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>学习进度</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily">每日</TabsTrigger>
              <TabsTrigger value="weekly">每周</TabsTrigger>
              <TabsTrigger value="monthly">每月</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="space-y-4">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <LearningStatsChart period="daily" />
              </Suspense>
            </TabsContent>
            <TabsContent value="weekly" className="space-y-4">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <LearningStatsChart period="weekly" />
              </Suspense>
            </TabsContent>
            <TabsContent value="monthly" className="space-y-4">
              <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                <LearningStatsChart period="monthly" />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 