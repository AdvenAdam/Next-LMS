import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }

    const { list } = await req.json()

    const ownCorse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    })
    if (!ownCorse) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }
    for (let item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: String(item.position),
        },
      })
    }

    return NextResponse.json('success', { status: 200 })
  } catch (error) {
    console.log('🚀 ~ file: route Reorder.ts:8 ~ error:', error)
    return new NextResponse('Internal Error', {
      status: 500,
    })
  }
}
