"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { LearningStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateWordStatus(wordId: string, status: LearningStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未授权");
  }

  await prisma.userWord.upsert({
    where: {
      userId_wordId: {
        userId: session.user.id,
        wordId,
      },
    },
    update: {
      status,
    },
    create: {
      userId: session.user.id,
      wordId,
      status,
    },
  });

  revalidatePath(`/words/${wordId}`);
}

export async function updateWordNote(wordId: string, note: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未授权");
  }

  await prisma.userWord.upsert({
    where: {
      userId_wordId: {
        userId: session.user.id,
        wordId,
      },
    },
    update: {
      note,
    },
    create: {
      userId: session.user.id,
      wordId,
      note,
    },
  });

  revalidatePath(`/words/${wordId}`);
}

export async function updateWordTags(wordId: string, tags: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未授权");
  }

  await prisma.userWord.upsert({
    where: {
      userId_wordId: {
        userId: session.user.id,
        wordId,
      },
    },
    update: {
      tags,
    },
    create: {
      userId: session.user.id,
      wordId,
      tags,
    },
  });

  revalidatePath(`/words/${wordId}`);
}

export async function updateCustomMeaning(
  wordId: string,
  customMeaning: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未授权");
  }

  await prisma.userWord.upsert({
    where: {
      userId_wordId: {
        userId: session.user.id,
        wordId,
      },
    },
    update: {
      customMeaning,
    },
    create: {
      userId: session.user.id,
      wordId,
      customMeaning,
    },
  });

  revalidatePath(`/words/${wordId}`);
}

export async function createUserWordAssociations(userId: string) {
  // 获取所有单词
  const words = await prisma.word.findMany();

  // 创建用户-单词关联
  await prisma.userWord.createMany({
    data: words.map((word) => ({
      userId,
      wordId: word.id,
      status: "NEW" as LearningStatus,
    })),
    skipDuplicates: true, // 跳过已存在的关联
  });
}

export type WordWithUserStatus = {
  id: string;
  text: string;
  phonetic?: string | null;
  meaning: string;
  examples: string[];
  frequency: number;
  status: LearningStatus;
  note?: string | null;
  tags: string[];
  customMeaning?: string | null;
};

export async function getPaginatedWordsWithStatus(
  page: number,
  pageSize: number = 100,
  userId: string | undefined,
  searchQuery: string | null,
  freqMin: number,
  freqMax: number
): Promise<{ items: WordWithUserStatus[]; total: number }> {
  // const skip = (page - 1) * pageSize

  const where: Prisma.WordWhereInput = {
    frequency: { gte: Number(freqMin), lte: Number(freqMax) },
    ...(searchQuery && {
      OR: [
        { text: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } },
        {
          meaning: {
            contains: searchQuery,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    }),
  };

  const [words, total] = await Promise.all([
    prisma.word.findMany({
      where,
      orderBy: { frequency: "desc" },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    }),
    prisma.word.count({ where }),
  ]);

  // const words = await prisma.word.findMany({
  //   skip,
  //   take: pageSize,
  //   orderBy: { frequency: 'desc' },
  // })
  let items;

  if (!userId) {
    items = words.map((word) => ({
      ...word,
      status: "NEW" as LearningStatus,
      note: null,
      tags: [],
      customMeaning: null,
    }));
  } else {
    const wordIds = words.map((w) => w.id);

    const userWords = await prisma.userWord.findMany({
      where: {
        userId,
        wordId: { in: wordIds },
      },
    });

    const userWordMap = new Map(userWords.map((uw) => [uw.wordId, uw]));

    items = words.map((word) => {
      const uw = userWordMap.get(word.id);
      return {
        ...word,
        status: uw?.status ?? "NEW" as LearningStatus,
        note: uw?.note ?? null,
        tags: uw?.tags ?? [],
        customMeaning: uw?.customMeaning ?? null,
      };
    });
  }

  return {
    items,
    total,
  };
}
