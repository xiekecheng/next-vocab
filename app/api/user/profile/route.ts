import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name, email, image } = body

    // 验证邮箱是否已被其他用户使用
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return new NextResponse('邮箱已被使用', { status: 400 })
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        image,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 