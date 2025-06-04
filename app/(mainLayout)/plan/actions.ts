"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLearningPlan(planId: string, dailyGoal: number) {
  try {
    await prisma.learningPlan.update({
      where: { id: planId },
      data: { dailyGoal },
    });
    
    revalidatePath("/plan");
    return { success: true };
  } catch (error) {
    console.error("Failed to update learning plan:", error);
    return { success: false, error: "更新学习计划失败" };
  }
}

export async function completeWord(wordId: string, userId: string, planId: string) {
  try {
    await prisma.userWord.update({
      where: {
        userId_wordId: {
          userId,
          wordId,
        },
      },
      data: {
        status: "LEARNED",
        completedInId: planId,
      },
    });
    
    revalidatePath("/plan");
    return { success: true };
  } catch (error) {
    console.error("Failed to complete word:", error);
    return { success: false, error: "更新单词状态失败" };
  }
} 