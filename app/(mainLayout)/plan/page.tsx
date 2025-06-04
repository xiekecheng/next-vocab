import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import  LearningPlan  from "./learning-plan";
import  PracticeMode  from "./practice-mode";
// import { LearningPlan } from "./learning-plan";

async function ensureNewUserWords(userId: string, targetCount = 100) {
  // 1. 查询当前已有多少个 status = NEW 的词条
  const currentNewWords = await prisma.userWord.findMany({
    where: {
      userId,
      status: 'NEW',
    },
    select: { wordId: true },
  })

  const currentWordIds = currentNewWords.map(w => w.wordId)
  const currentCount = currentWordIds.length

  // 2. 如果已满 100，则不用补充
  if (currentCount >= targetCount) return

  const needToInsert = targetCount - currentCount

  // 3. 查找未学习的词条，排除已有的 UserWord 记录
  const learnedWordIds = await prisma.userWord.findMany({
    where: { userId },
    select: { wordId: true },
    take: 10000, // 限制最多拉取 1w 学过词条
  })

  const learnedSet = new Set(learnedWordIds.map(w => w.wordId))

  const newCandidates = await prisma.word.findMany({
    where: {
      id: {
        notIn: [...learnedSet],
      },
    },
    orderBy: { frequency: 'desc' }, // 也可以 random()
    take: needToInsert,
  })

  // 4. 批量插入新的 UserWord 记录
  if (newCandidates.length > 0) {
    await prisma.userWord.createMany({
      data: newCandidates.map(word => ({
        userId,
        wordId: word.id,
        status: 'NEW',
        tags: [],
      })),
      skipDuplicates: true,
    })
  }
}


export default async function PlanPage() {
  const session = await auth();
  if (!session?.user?.id) {
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

  await ensureNewUserWords(session.user.id,plan?.dailyGoal || 20);

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
  // console.log('todayWords',todayWords)

  return (
    <div className="container py-8">
      <div className="grid gap-6">
        <LearningPlan plan={plan} totalWords={todayWords.length} />
        <PracticeMode words={todayWords} planId={plan?.id || ''} />
      </div>
    </div>
  );
}
