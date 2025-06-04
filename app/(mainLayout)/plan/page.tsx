import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import  LearningPlan  from "./learning-plan";
import  PracticeMode  from "./practice-mode";
// import { LearningPlan } from "./learning-plan";

export default async function PlanPage() {
  const session = await auth();
  if (!session?.user) {
    notFound();
  }

  // 获取用户的学习计划
  const plan = await prisma.learningPlan.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: {
          completedWords: true,
        },
      },
    },
  });

  // 获取今日待学习的单词
  const todayWords = await prisma.userWord.findMany({
    where: {
      userId: session.user.id,
      status: "NEW",
    },
    take: plan?.dailyGoal || 20,
    include: {
      word: true,
    },
    orderBy: {
      word: {
        frequency: "desc",
      },
    },
  });
  console.log('todayWords',todayWords)

  return (
    <div className="container py-8">
      <div className="grid gap-6">
        <LearningPlan plan={plan} totalWords={todayWords.length} />
        <PracticeMode words={todayWords} />
      </div>
    </div>
  );
}
