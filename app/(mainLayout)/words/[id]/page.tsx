import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import WordDetail from "./word-detail";

interface WordDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WordDetailPage({ params }: WordDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    notFound();
  }

  const word = await prisma.word.findUnique({
    where: { id },
    include: {
      userWords: {
        where: { userId: session.user.id },
        select: {
          status: true,
          note: true,
          tags: true,
          customMeaning: true,
        },
      },
    },
  });

  if (!word) {
    notFound();
  }

  // 获取相邻单词用于导航
  const [prevWord, nextWord] = await Promise.all([
    prisma.word.findFirst({
      where: {
        id: { lt: word.id },
      },
      orderBy: { id: "desc" },
      select: { id: true, text: true },
    }),
    prisma.word.findFirst({
      where: {
        id: { gt: word.id },
      },
      orderBy: { id: "asc" },
      select: { id: true, text: true },
    }),
  ]);

  return (
    <WordDetail
      word={word}
      userWord={word.userWords[0]}
      prevWord={prevWord}
      nextWord={nextWord}
    />
  );
} 