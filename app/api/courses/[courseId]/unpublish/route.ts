import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string }
  }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })
    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const unPublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    })
    return NextResponse.json(unPublishedCourse)
  } catch (error) {
    console.log('🚀 ~ file: route.ts:12 ~ COURSE PUBLISH:', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
