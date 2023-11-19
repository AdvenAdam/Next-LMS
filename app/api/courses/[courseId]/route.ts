import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { UTApi } from 'uploadthing/server'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const data = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        ...data,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('[COURSEID] PATCH ERROR:', error)
    return new NextResponse('Internal Error', {
      status: 500,
    })
  }
}
