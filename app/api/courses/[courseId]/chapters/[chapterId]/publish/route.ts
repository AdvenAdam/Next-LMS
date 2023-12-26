import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { courseId: string; chapterId: string }
  }
) {
  console.log('🚀 ~ file: route.ts:13 ~ params:', params)
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    })

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    })

    if (!chapter || !chapter.title || !chapter.description) {
      return new NextResponse('Not Missing Required fields', { status: 400 })
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    })
    return NextResponse.json(publishedChapter)
  } catch (error) {
    console.log('🚀 ~ file: route.ts:12 ~ CHAPTER PUBLISH:', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
