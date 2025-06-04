"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { updateLearningPlan } from "./actions";

interface LearningPlanProps {
  plan: {
    id: string;
    dailyGoal: number;
    _count: {
      completedWords: number;
    };
  } | null;
  totalWords: number;
}

export default function LearningPlan({ plan, totalWords }: LearningPlanProps) {
  const [dailyGoal, setDailyGoal] = useState(plan?.dailyGoal || 20);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdatePlan = async () => {
    if (plan) {
      await updateLearningPlan(plan.id, dailyGoal);
    }
    setIsEditing(false);
  };

  const progress = plan ? (plan._count.completedWords / plan.dailyGoal) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">学习计划</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "取消" : "修改计划"}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>每日目标</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-20"
                />
                <Button onClick={handleUpdatePlan}>保存</Button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{plan?.dailyGoal || 20} 个单词</span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>今日进度</span>
              <span>{plan?._count.completedWords || 0} / {plan?.dailyGoal || 20}</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="text-sm text-muted-foreground">
            今日待学习: {totalWords} 个单词
          </div>
        </div>
      </div>
    </Card>
  );
} 