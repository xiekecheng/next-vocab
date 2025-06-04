import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const stats = await prisma.userWord.groupBy({
      by: ["status"],
      where: {
        userId: session.user.id,
      },
      _count: {
        _all: true,
      },
    })

    const formattedData = stats.map((item) => ({
      status: item.status,
      count: item._count._all,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("[STATS_STATUS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 